function reloadArticles() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === 4 && xhttp.status === 200) {
			var articles = JSON.parse(xhttp.responseText);
			populateArticleTable(articles);
		} else if (xhttp.readyStaate == 4 && xhttp.status !== 200) {
			console.log(xhttp.status);
		}
	};
	xhttp.open("GET", "http://localhost:8080/articles", true);
	xhttp.send();
}
function populateArticleTable(articles){
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
function reloadInventoryArticles() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === 4 && xhttp.status === 200) {
			var inventoryArticles = JSON.parse(xhttp.responseText);
			populateInventoryArticles(inventoryArticles);
		} else if (xhttp.readyStaate == 4 && xhttp.status !== 200) {
			console.log(xhttp.status);
		}
	};
	xhttp.open("GET", "http://localhost:8080/inventory-articles", true);
	xhttp.send();
}
function populateInventoryArticles(inventoryArticles){
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
		cell.appendChild(document.createTextNode(new Date(inventoryArticles[i].useBy)));
	}
}
function reloadShoppingListArticles() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === 4 && xhttp.status === 200) {
			var shoppingArticles = JSON.parse(xhttp.responseText);
			populateShoppingListArticles(shoppingArticles);
		} else if (xhttp.readyStaate == 4 && xhttp.status !== 200) {
			console.log(xhttp.status);
		}
	};
	xhttp.open("GET", "http://localhost:8080/shopping-list-articles", true);
	xhttp.send();
}
function populateShoppingListArticles(shoppingArticles){
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
	reloadArticles();
	reloadInventoryArticles();
	reloadShoppingListArticles();
};