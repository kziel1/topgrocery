function doGetRequest(method, url, callback) {
	"use strict";
	var request = new XMLHttpRequest();
	request.open(method, "http://localhost:8080/" + url, true);
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			var articles = JSON.parse(request.responseText);
			callback(articles);
		} else if (request.readyState === 4 && request.status !== 200) {
			console.log(request.status);
		}
	};
	request.send();
}
function doRequest(method, url, data, callback) {
	"use strict";
	var request = new XMLHttpRequest();
	request.open(method, "http://localhost:8080/" + url, true);
	request.setRequestHeader("Content-type", "application/json");
	request.send(JSON.stringify(data));
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			if (callback) {
				callback();
			}
		} else if (request.readyState === 4 && request.status !== 200) {
			console.log(request.status);
		}
	};
}
function refreshTables() {
	"use strict";
	doGetRequest("GET", "articles", reloadArticlesTable);
	doGetRequest("GET", "inventory-articles", reloadInventoryArticlesTable);
	doGetRequest("GET", "shopping-list-articles", reloadShoppingListArticlesTable);
}
function addArticle() {
	"use strict";
	var article = {};
	article.name = document.getElementById("article-name").value;
	if (article.name !== "") {
		doRequest("POST", "articles", article, refreshTables);
	}
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
function createArticleDeleteButton(article) {
	"use strict";
	var button = document.createElement("button");
	var t = document.createTextNode("delete");
	button.appendChild(t);
	button.onclick = function () {
		doRequest("DELETE", "articles", article, refreshTables);
	};
	return button;
}
function createInventoryArticleDeleteButton(inventoryArticle) {
	"use strict";
	var button = document.createElement("button");
	var t = document.createTextNode("delete");
	button.appendChild(t);
	button.onclick = function () {
		doRequest("DELETE", "inventory-articles", inventoryArticle, refreshTables);
	};
	return button;
}
function createArticlesTableItem(i, articles, articleTableBody) {
	"use strict";
	var row, cell;
	row = articleTableBody.insertRow(articleTableBody.rows.length);
	cell = row.insertCell(0);
	cell.appendChild(document.createTextNode(articles[i].id));
	cell = row.insertCell(1);
	cell.appendChild(document.createTextNode(articles[i].name));
	cell = row.insertCell(2);
	var article = articles[i];
	cell.appendChild(createArticleDeleteButton(article));
}
function reloadArticlesTable(articles) {
	"use strict";
	var i;
	var articleTableBody = document.getElementById("articles").getElementsByTagName('tbody')[0];
	articleTableBody.innerHTML = "";
	for (i = 0; i < articles.length; i++) {
		createArticlesTableItem(i, articles, articleTableBody)
	}
}
function createInventoryTableItem(i, inventoryArticles, articleTableBody) {
	"use strict";
	var row, cell;
	var inventoryArticle = inventoryArticles[i];
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
function populateInventoryArticlesSelect(articles) {
	"use strict";
	var inventoryArticleSelect = document.getElementById("inventory-article-select");
	var i;
	inventoryArticleSelect.innerHTML = "";
	for (i = 0; i < articles.length; i++) {
		var option = document.createElement("option");
		option.text = articles[i].name;
		option.value = JSON.stringify(articles[i]);
		inventoryArticleSelect.appendChild(option);
	}
}
function reloadInventoryArticlesTable(inventoryArticles) {
	"use strict";
	var i;
	doGetRequest("GET", "articles", populateInventoryArticlesSelect);
	var articleTableBody = document.getElementById("inventory").getElementsByTagName('tbody')[0];
	articleTableBody.innerHTML = "";
	for (i = 0; i < inventoryArticles.length; i++) {
		createInventoryTableItem(i, inventoryArticles, articleTableBody);
	}
}
function reloadShoppingListArticlesTable(shoppingArticles) {
	"use strict";
	var i, row, cell;
	var articleTableBody = document.getElementById("shopping-list").getElementsByTagName('tbody')[0];
	articleTableBody.innerHTML = "";
	for (i = 0; i < shoppingArticles.length; i++) {
		row = articleTableBody.insertRow(articleTableBody.rows.length);
		cell = row.insertCell(0);
		cell.appendChild(document.createTextNode(shoppingArticles[i].id));
		cell = row.insertCell(1);
		cell.appendChild(document.createTextNode(shoppingArticles[i].article.name));
		cell = row.insertCell(2);
		cell.appendChild(document.createTextNode(shoppingArticles[i].amount));
	}
}
window.onload = function () {
	"use strict";
	refreshTables();
};