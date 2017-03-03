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
function doRequest(method, url, data, callback) {
	var request = new XMLHttpRequest();
	request.open(method, "http://localhost:8080/" + url, true);
	request.setRequestHeader("Content-type", "application/json");
	request.send(JSON.stringify(data));
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			if (callback) {
				callback();
			}
		} else if (request.readyState == 4 && request.status !== 200) {
			console.log(request.status);
		}
	};
}
function addArticle() {
	var article = {};
	article.name = document.getElementById("article-name").value;
	doRequest("POST", "articles", article, refreshTables);
}
// function createArticleEditButton(article, cell) {
// 	var button = document.createElement("button");
// 	var editText = document.createTextNode("edit");
// 	var saveText = document.createTextNode("save");
// 	var input = document.createElement("input");
// 	button.appendChild(editText);
// 	var editMode = true;
// 	button.onclick = function () {
// 		if (editMode) {
// 			cell.replaceChild(input, cell.firstChild);
// 			button.replaceChild(saveText, button.firstChild);
// 			input.value = article.name;
// 			editMode = false;
// 		} else {
// 			article.name = input.value;
// 			var text = document.createTextNode(article.name);
// 			cell.replaceChild(text, cell.firstChild);
// 			button.replaceChild(editText, button.firstChild);
// 			doRequest("PUT", "articles", article, refreshTables);
// 			editMode = true;
// 		}
// 	};
// 	return button;
// }
function createArticleDeleteButton(article) {
	var button = document.createElement("button");
	var t = document.createTextNode("delete");
	button.appendChild(t);
	button.onclick = function () {
		doRequest("DELETE", "articles", article, refreshTables);
	};
	return button;
}
function refreshTables() {
	doGetRequest("GET", "articles", reloadArticlesTable);
	doGetRequest("GET", "inventory-articles", reloadInventoryArticlesTable);
	doGetRequest("GET", "shopping-list-articles", reloadShoppingListArticlesTable);
}
function reloadArticlesTable(articles) {
	var i, row, cell;
	var articleTableBody = document.getElementById("articles").getElementsByTagName('tbody')[0];
	// is it good way to save the first row?
	articleTableBody.innerHTML = articleTableBody.rows[0].innerHTML;
	for (i = 0; i < articles.length; i++) {
		row = articleTableBody.insertRow(articleTableBody.rows.length);
		cell = row.insertCell(0);
		cell.appendChild(document.createTextNode(articles[i].id));
		cell = row.insertCell(1);
		cell.appendChild(document.createTextNode(articles[i].name));
		var articleNameCell = cell;
		cell = row.insertCell(2);
		var article = articles[i];
		cell.appendChild(createArticleDeleteButton(article));
	}
}
function reloadInventoryArticlesTable(inventoryArticles) {
	var i, row, cell;
	var articleTableBody = document.getElementById("inventory").getElementsByTagName('tbody')[0];
	articleTableBody.innerHTML = "";
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
function reloadShoppingListArticlesTable(shoppingArticles) {
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
	refreshTables();
};