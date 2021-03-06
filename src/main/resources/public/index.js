function doGetRequest(url, callback) {
	"use strict";
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.setRequestHeader('Cache-Control', 'no-cache');
	request.setRequestHeader('Pragma', 'no-cache');
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			var articles = JSON.parse(request.responseText);
			callback(articles);
		}
		else if (request.readyState === 4 && request.status !== 200) {
			console.log(request.status);
		}
	};
	request.send();
}

function doRequest(method, url, data, callback) {
	"use strict";
	var request = new XMLHttpRequest();
	request.open(method, url, true);
	request.setRequestHeader("Content-type", "application/json");
	request.send(JSON.stringify(data));
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			if (callback) {
				callback();
			}
		}
		else if (request.readyState === 4 && request.status !== 200) {
			console.log(request.status);
		}
	};
}

function populateArticlesSelects(articles) {
	"use strict";
	var inventoryArticleSelect = document.getElementById("inventory-article-select");
	var shoppingListArticleSelect = document.getElementById("shopping-list-article-select");
	inventoryArticleSelect.innerHTML = "";
	shoppingListArticleSelect.innerHTML = "";
	var datalist = document.createElement("datalist");
	datalist.setAttribute("id", "article-datalist");
	var i, selectOption, datalistOption;
	for (i = 0; i < articles.length; i++) {
		selectOption = document.createElement("option");
		datalistOption = document.createElement("option");
		selectOption.text = articles[i].name;
		selectOption.value = JSON.stringify(articles[i]);
		datalistOption.value = articles[i].name;
		inventoryArticleSelect.appendChild(selectOption);
		datalist.appendChild(datalistOption);
	}
	shoppingListArticleSelect.setAttribute("list", "article-datalist");
	shoppingListArticleSelect.appendChild(datalist);
}

function refreshTables() {
	"use strict";
	doGetRequest("/articles", reloadArticlesTable);
	doGetRequest("/inventory-articles", reloadInventoryArticlesTable);
	doGetRequest("/shopping-list-articles", reloadShoppingListArticlesTable);
}

function addArticle() {
	"use strict";
	var article = {};
	article.name = document.getElementById("article-name").value.trim();
	doRequest("POST", "/articles", article, refreshTables);
	var addButton = document.getElementById("add-article");
	addButton.blur();
	var articleNameTextInput = document.getElementById("article-name");
	articleNameTextInput.value = "";
	articleNameTextInput.focus();
}

function addInventoryArticle() {
	"use strict";
	var inventoryArticle = {};
	inventoryArticle.article = JSON.parse(document.getElementById("inventory-article-select").value);
	inventoryArticle.amount = document.getElementById("inventory-article-amount").value;
	inventoryArticle.useBy = new Date(document.getElementById("inventory-article-use-by").value);
	doRequest("POST", "/inventory-articles", inventoryArticle, refreshTables);
}

function createDeleteButton(onclick) {
	"use strict";
	var button = document.createElement("button");
	var textNode = document.createTextNode("delete");
	button.appendChild(textNode);
	button.onclick = onclick;
	return button;
}

function createArticleDeleteButton(article) {
	"use strict";
	var onclick = function () {
		doRequest("DELETE", "/articles", article, refreshTables);
	};
	return createDeleteButton(onclick);
}

function createInventoryArticleDeleteButton(inventoryArticle) {
	"use strict";
	var onclick = function () {
		doRequest("DELETE", "/inventory-articles", inventoryArticle, refreshTables);
	};
	return createDeleteButton(onclick);
}

function createArticlesTableItem(article, articleTableBody) {
	"use strict";
	var row, cell;
	row = articleTableBody.insertRow(articleTableBody.rows.length);
	cell = row.insertCell(0);
	cell.appendChild(document.createTextNode(article.id));
	cell = row.insertCell(1);
	cell.appendChild(document.createTextNode(article.name));
	cell = row.insertCell(2);
	cell.appendChild(createArticleDeleteButton(article));
}

function reloadArticlesTable(articles) {
	"use strict";
	populateArticlesSelects(articles);
	var articleTableBody = document.getElementById("articles").getElementsByTagName('tbody')[0];
	while (articleTableBody.hasChildNodes()) {
		articleTableBody.deleteRow(0);
	}
	var i;
	for (i = 0; i < articles.length; i++) {
		createArticlesTableItem(articles[i], articleTableBody);
	}
}

function createInventoryTableItem(inventoryArticle, articleTableBody) {
	"use strict";
	var row, cell;
	row = articleTableBody.insertRow(articleTableBody.rows.length);
	cell = row.insertCell(0);
	cell.appendChild(document.createTextNode(inventoryArticle.id));
	cell = row.insertCell(1);
	cell.appendChild(document.createTextNode(inventoryArticle.article.name));
	
	cell = row.insertCell(2);
	var numberInput = document.createElement("input");
	numberInput.setAttribute("type", "number");
	numberInput.setAttribute("min", "1");
	numberInput.setAttribute("max", "99");
	numberInput.value = inventoryArticle.amount;
	numberInput.onchange = function () {
		inventoryArticle.amount = numberInput.value;
		doRequest("PUT", "/inventory-articles", inventoryArticle, refreshTables);
	};
	cell.appendChild(numberInput);
	
	cell = row.insertCell(3);
	var dateInput = document.createElement("input");
	dateInput.setAttribute("type", "date");
	if (inventoryArticle.useBy !== null) {
		var date = new Date(inventoryArticle.useBy);
		dateInput.valueAsDate = date;
		dateInput.setAttribute("value", date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}));
	}
	dateInput.onchange = function () {
		inventoryArticle.useBy = new Date(dateInput.value);
		doRequest("PUT", "/inventory-articles", inventoryArticle, refreshTables);
	};
	cell.appendChild(dateInput);
	
	cell = row.insertCell(4);
	cell.appendChild(createInventoryArticleDeleteButton(inventoryArticle));
}

function reloadInventoryArticlesTable(inventoryArticles) {
	"use strict";
	doGetRequest("/articles", populateArticlesSelects);
	var articleTableBody = document.getElementById("inventory").getElementsByTagName('tbody')[0];
	while (articleTableBody.hasChildNodes()) {
		articleTableBody.deleteRow(0);
	}
	var i;
	for (i = 0; i < inventoryArticles.length; i++) {
		createInventoryTableItem(inventoryArticles[i], articleTableBody);
	}
}

function generateShoppingList() {
	"use strict";
	if (confirm("generation will overwrite existing shopping list")) {
		var shoppingListProperties = {};
		shoppingListProperties.participantCount = document.getElementById("shopping-list-participant-count").value;
		shoppingListProperties.vegetarianCount = document.getElementById("shopping-list-vegetarian-count").value;
		doRequest("PUT", "/shopping-list-generation", shoppingListProperties, refreshTables);
	}
}

function addShoppingListArticle() {
	"use strict";
	var shoppingListArticle = {}, article = {};
	article.name = document.getElementById("shopping-list-article-select").value.trim();
	shoppingListArticle.article = article;
	shoppingListArticle.amount = document.getElementById("shopping-list-article-amount").value;
	doRequest("POST", "/shopping-list-articles", shoppingListArticle, refreshTables);
}

function createShoppingListArticleDeleteButton(shoppingListArticle) {
	"use strict";
	var onclick = function () {
		doRequest("DELETE", "/shopping-list-articles", shoppingListArticle, refreshTables);
	};
	return createDeleteButton(onclick);
}

function createShoppingListTableItem(shoppingListArticle, articleTableBody) {
	"use strict";
	var row, cell;
	row = articleTableBody.insertRow(articleTableBody.rows.length);
	cell = row.insertCell(0);
	cell.appendChild(document.createTextNode(shoppingListArticle.id));
	cell = row.insertCell(1);
	cell.appendChild(document.createTextNode(shoppingListArticle.article.name));
	
	cell = row.insertCell(2);
	var numberInput = document.createElement("input");
	numberInput.setAttribute("type", "number");
	numberInput.setAttribute("min", "1");
	numberInput.setAttribute("max", "99");
	numberInput.value = shoppingListArticle.amount;
	numberInput.onchange = function () {
		shoppingListArticle.amount = numberInput.value;
		doRequest("PUT", "/shopping-list-articles", shoppingListArticle, refreshTables);
	};
	cell.appendChild(numberInput);
	
	cell = row.insertCell(3);
	cell.appendChild(createShoppingListArticleDeleteButton(shoppingListArticle));
}

function reloadShoppingListArticlesTable(shoppingArticles) {
	"use strict";
	var articleTableBody = document.getElementById("shopping-list").getElementsByTagName('tbody')[0];
	while (articleTableBody.hasChildNodes()) {
		articleTableBody.deleteRow(0);
	}
	var i;
	for (i = 0; i < shoppingArticles.length; i++) {
		createShoppingListTableItem(shoppingArticles[i], articleTableBody);
	}
}

function isNumberValid(n) {
	"use strict";
	return !isNaN(parseFloat(n)) && isFinite(n) && n >= 0 && n < 100;
}

function isEnterUp(event) {
	return event && event.type === "keyup" && event.keyCode === 13;
}

function validateArticleForm(event) {
	"use strict";
	var button = document.getElementById("add-article");
	button.disabled = !document.getElementById("article-name").value;
	if (isEnterUp(event)) {
		addArticle();
	}
}

function validateInventoryForm(event) {
	"use strict";
	var button = document.getElementById("add-inventory-article");
	var amount = document.getElementById("inventory-article-amount").value;
	var useBy = document.getElementById("inventory-article-use-by").value;
	var dateRegexp = "^(((0[13578]|(10|12))/(0[1-9]|[1-2][0-9]|3[0-1]))|(02/(0[1-9]|[1-2][0-9]))|((0[469]|11)/(0[1-9]|[1-2][0-9]|30)))/[0-9]{4}$";
	button.disabled = !isNumberValid(amount) || (!useBy.match(dateRegexp) && !document.getElementById("inventory-article-use-by").valueAsDate);
	if (isEnterUp(event)) {
		addInventoryArticle();
	}
}

function validateShoppingListAddForm(event) {
	"use strict";
	var button = document.getElementById("add-shopping-list");
	var value = document.getElementById("shopping-list-article-select").value;
	var amount = document.getElementById("shopping-list-article-amount").value;
	button.disabled = !isNumberValid(amount) || !value;
	if (isEnterUp(event)) {
		addShoppingListArticle();
	}
}

function validateShoppingListGenerateForm(event) {
	"use strict";
	var button = document.getElementById("generate-shopping-list");
	var participantCount = document.getElementById("shopping-list-participant-count").value;
	var vegetarianCount = document.getElementById("shopping-list-vegetarian-count").value;
	button.disabled = !isNumberValid(participantCount) || !isNumberValid(vegetarianCount);
	if (isEnterUp(event)) {
		addShoppingListArticle();
	}
}

function registerFormListeners(elements, callback) {
	"use strict";
	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener("mouseup", callback);
		elements[i].addEventListener("keyup", callback);
		elements[i].addEventListener("change", callback);
	}
}

window.onload = function () {
	"use strict";
	refreshTables();
	
	validateArticleForm();
	validateInventoryForm();
	validateShoppingListGenerateForm();
	validateShoppingListAddForm();
	
	registerFormListeners(document.querySelectorAll(".article-form"), validateArticleForm);
	registerFormListeners(document.querySelectorAll(".inventory-form"), validateInventoryForm);
	registerFormListeners(document.querySelectorAll(".shopping-list-generate-form"), validateShoppingListGenerateForm);
	registerFormListeners(document.querySelectorAll(".shopping-list-add-form"), validateShoppingListAddForm);
	
	var navigationLinks = document.querySelectorAll(".navigation-link");
	for (var i = 0; i < navigationLinks.length; i++) {
		navigationLinks[i].addEventListener("click", refreshTables);
	}
	
	document.querySelectorAll("#add-article")[0].addEventListener("click", addArticle);
	document.querySelectorAll("#add-inventory-article")[0].addEventListener("click", addInventoryArticle);
	document.querySelectorAll("#generate-shopping-list")[0].addEventListener("click", generateShoppingList);
	document.querySelectorAll("#add-shopping-list")[0].addEventListener("click", addShoppingListArticle);
};