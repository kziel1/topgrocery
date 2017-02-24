function reloadArticles() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === 4 && xhttp.status === 200) {
			console.log(xhttp.responseText);
			var articles = JSON.parse(xhttp.responseText);
			var i;
			var row;
			var cell1;
			var cell2;
			var articleTableBody = document.getElementById("articles").getElementsByTagName('tbody')[0];
			console.log(articleTableBody);
			for (i = 0; i < articles.length; i++) {
				row = articleTableBody.insertRow(articleTableBody.rows.length);
				cell1 = row.insertCell(0);
				cell1.appendChild(document.createTextNode(articles[i].id));
				cell1 = row.insertCell(1);
				cell1.appendChild(document.createTextNode(articles[i].name));
			}
		} else if (xhttp.readyState == 4 && xhttp.status !== 200) {
			console.log("!200 NO-OK!");
		}
	};
	xhttp.open("GET", "http://localhost:8080/articles", true);
	xhttp.send();
}

function reloadInventory() {
	
}

function reloadShoppingList() {
	
}

window.onload = function () {
	reloadArticles();
};

