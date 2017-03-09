function doGetRequest(url, callback) {
	"use strict";
	var request = new XMLHttpRequest();
	request.open("GET", "http://localhost:8080/" + url, true);
	// request.open("GET", "http://10.2.0.181:8080/" + url, true);
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
	request.open(method, "http://localhost:8080/" + url, true);
	// request.open(method, "http://10.2.0.181:8080/" + url, true);
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
	var i;
	inventoryArticleSelect.innerHTML = "";
	shoppingListArticleSelect.innerHTML = "";
	for (i = 0; i < articles.length; i++) {
		var option = document.createElement("option");
		option.text = articles[i].name;
		option.value = JSON.stringify(articles[i]);
		inventoryArticleSelect.appendChild(option);
		shoppingListArticleSelect.appendChild(option.cloneNode(true));
	}
}
function refreshTables() {
	"use strict";
	doGetRequest("articles", reloadArticlesTable);
	doGetRequest("inventory-articles", reloadInventoryArticlesTable);
	doGetRequest("shopping-list-articles", reloadShoppingListArticlesTable);
	doGetRequest("articles", populateArticlesSelects);
}

function addArticle() {
	"use strict";
	var article = {};
	article.name = document.getElementById("article-name").value;
	doRequest("POST", "articles", article, refreshTables);
}

function addInventoryArticle() {
	"use strict";
	var inventoryArticle = {};
	var article = JSON.parse(document.getElementById("inventory-article-select").value);
	inventoryArticle.article = article;
	inventoryArticle.amount = document.getElementById("inventory-article-amount").value;
	inventoryArticle.useBy = document.getElementById("inventory-article-use-by").value;
	doRequest("POST", "inventory-articles", inventoryArticle, refreshTables);
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
		doRequest("DELETE", "articles", article, refreshTables);
	};
	return createDeleteButton(onclick);
}

function createInventoryArticleDeleteButton(inventoryArticle) {
	"use strict";
	var onclick = function () {
		doRequest("DELETE", "inventory-articles", inventoryArticle, refreshTables);
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
	var i;
	var articleTableBody = document.getElementById("articles").getElementsByTagName('tbody')[0];
	while (articleTableBody.hasChildNodes()) {
		articleTableBody.deleteRow(0);
	}
	for (i = 0; i < articles.length; i++) {
		createArticlesTableItem(articles[i], articleTableBody)
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
	numberInput.setAttribute("min", "0");
	numberInput.setAttribute("max", "99");
	numberInput.value = inventoryArticle.amount;
	numberInput.onchange = function () {
		inventoryArticle.amount = numberInput.value;
		doRequest("PUT", "inventory-articles", inventoryArticle, refreshTables);
	};
	cell.appendChild(numberInput);
	cell = row.insertCell(3);
	var dateInput = document.createElement("input");
	dateInput.setAttribute("type", "date");
	if (inventoryArticle.useBy !== null) {
		dateInput.valueAsDate = new Date(inventoryArticle.useBy);
	}
	dateInput.onchange = function () {
		inventoryArticle.useBy = dateInput.valueAsDate;
		doRequest("PUT", "inventory-articles", inventoryArticle, refreshTables);
	};
	cell.appendChild(dateInput);
	cell = row.insertCell(4);
	cell.appendChild(createInventoryArticleDeleteButton(inventoryArticle));
}

function reloadInventoryArticlesTable(inventoryArticles) {
	"use strict";
	var i;
	doGetRequest("articles", populateArticlesSelects);
	var articleTableBody = document.getElementById("inventory").getElementsByTagName('tbody')[0];
	while (articleTableBody.hasChildNodes()) {
		articleTableBody.deleteRow(0);
	}
	for (i = 0; i < inventoryArticles.length; i++) {
		createInventoryTableItem(inventoryArticles[i], articleTableBody);
	}
}

function generateShoppingList() {
	"use strict";
	var shoppingListProperties = {};
	shoppingListProperties.participantsAmount = document.getElementById("shopping-list-participant-amount").value;
	shoppingListProperties.vegetariansAmount = document.getElementById("shopping-list-vegetarian-amount").value;
	doRequest("PUT", "shopping-list-generation", shoppingListProperties, refreshTables);
}

function addShoppingListArticle() {
	"use strict";
	var shoppingListArticle = {};
	var article = JSON.parse(document.getElementById("shopping-list-article-select").value);
	shoppingListArticle.article = article;
	shoppingListArticle.amount = document.getElementById("shopping-list-article-amount").value;
	doRequest("POST", "shopping-list-articles", shoppingListArticle, refreshTables);
}

function createShoppingListArticleDeleteButton(shoppingListArticle) {
	"use strict";
	var onclick = function () {
		doRequest("DELETE", "shopping-list-articles", shoppingListArticle, refreshTables);
	};
	return createDeleteButton(onclick);
}

function reloadShoppingListArticlesTable(shoppingArticles) {
	"use strict";
	var i, row, cell;
	doGetRequest("articles", populateArticlesSelects);
	var articleTableBody = document.getElementById("shopping-list").getElementsByTagName('tbody')[0];
	while (articleTableBody.hasChildNodes()) {
		articleTableBody.deleteRow(0);
	}
	for (i = 0; i < shoppingArticles.length; i++) {
		row = articleTableBody.insertRow(articleTableBody.rows.length);
		cell = row.insertCell(0);
		cell.appendChild(document.createTextNode(shoppingArticles[i].id));
		cell = row.insertCell(1);
		cell.appendChild(document.createTextNode(shoppingArticles[i].article.name));
		cell = row.insertCell(2);
		cell.appendChild(document.createTextNode(shoppingArticles[i].amount));
		cell = row.insertCell(3);
		var shoppingListArticle = shoppingArticles[i];
		cell.appendChild(createShoppingListArticleDeleteButton(shoppingListArticle));
	}
}

window.onload = function () {
	"use strict";
	refreshTables();
};