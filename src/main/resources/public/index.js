"use strict";
function doGetRequest(method, url, callback) {
	var request = new XMLHttpRequest();
	request.open(method, "http://localhost:8080/" + url, true);
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			var articles = JSON.parse(request.responseText);
			callback(articles);
		} else if (request.readyState == 4 && request.status !== 200) {
			console.log(request.status);
		}
	};
	request.send();
}
function doPostRequest(method, url, data) {
	var request = new XMLHttpRequest();
	request.open(method, "http://localhost:8080/" + url, true);
	request.setRequestHeader("Content-type", "application/json");
	request.send(JSON.stringify(data));
}
function addArticle() {
	var article = {};
	article.name = document.getElementById("article-name").value;
	doPostRequest("POST", "articles", article);
}
function editArticle() {
	var article = {};
	article.id = document.getElementById("article-id").value;
	article.name = document.getElementById("article-name").value;
	doPostRequest("PUT", "articles", article);
}
function deleteArticle() {
	var article = {};
	article.id = document.getElementById("article-id").value;
	article.name = document.getElementById("article-name").value;
	doPostRequest("DELETE", "articles", article);
}
function populateArticlesTable(articles) {
	var i, row, cell;
	var articleTableBody = document.getElementById("articles").getElementsByTagName('tbody')[0];
	for (i = 0; i < articles.length; i++) {
		row = articleTableBody.insertRow(articleTableBody.rows.length);
		cell = row.insertCell(0);
		cell.appendChild(document.createTextNode(articles[i].id));
		cell = row.insertCell(1);
		cell.appendChild(document.createTextNode(articles[i].name));
	}
}
function populateInventoryArticlesTable(inventoryArticles) {
	var i, row, cell;
	var articleTableBody = document.getElementById("inventory").getElementsByTagName('tbody')[0];
	for (i = 0; i < inventoryArticles.length; i++) {
		row = articleTableBody.insertRow(articleTableBody.rows.length);
		cell = row.insertCell(0);
		cell.appendChild(document.createTextNode(inventoryArticles[i].id));
		cell = row.insertCell(1);
		cell.appendChild(document.createTextNode(inventoryArticles[i].article.name));
		cell = row.insertCell(2);
		cell.appendChild(document.createTextNode(inventoryArticles[i].amount));
		cell = row.insertCell(3);
		cell.appendChild(document.createTextNode(new Date(inventoryArticles[i].useBy).toLocaleDateString()));
	}
}
function populateShoppingListArticlesTable(shoppingArticles) {
	var i, row, cell;
	var articleTableBody = document.getElementById("shopping-list").getElementsByTagName('tbody')[0];
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
	doGetRequest("GET", "articles", populateArticlesTable);
	doGetRequest("GET", "inventory-articles", populateInventoryArticlesTable);
	doGetRequest("GET", "shopping-list-articles", populateShoppingListArticlesTable);
};