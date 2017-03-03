package com.topdesk.topgrocery;

import java.util.Collection;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.topdesk.topgrocery.entity.Article;
import com.topdesk.topgrocery.entity.InventoryArticle;
import com.topdesk.topgrocery.entity.ShoppingListArticle;

@RestController
public class TopGroceryController {
	@Autowired
	private JpaRepository<Article, Long> articleRepository;
	@Autowired
	private JpaRepository<ShoppingListArticle, Long> shoppingListArticleRepository;
	@Autowired
	private JpaRepository<InventoryArticle, Long> inventoryArticleRepository;
	
	@RequestMapping(value = "/articles", method = RequestMethod.GET)
	ResponseEntity<Collection<Article>> getArticles() {
		Collection<Article> response = articleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/articles", method = {RequestMethod.POST, RequestMethod.PUT})
	HttpStatus addArticle(@RequestBody Article article) {
		articleRepository.save(article);
		addToInventory(article);
		addToShoppingList(article);
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/articles", method = RequestMethod.DELETE)
	HttpStatus deleteArticle(@RequestBody Article article) {
		articleRepository.delete(article.getId());
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/inventory-articles", method = RequestMethod.GET)
	ResponseEntity<Collection<InventoryArticle>> getInventoryArticles() {
		Collection<InventoryArticle> response = inventoryArticleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/inventory-articles", method = {RequestMethod.POST, RequestMethod.PUT})
	HttpStatus addInventoryArticle(@RequestBody InventoryArticle inventoryArticle) {
		inventoryArticleRepository.save(inventoryArticle);
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/inventory-articles", method = RequestMethod.DELETE)
	HttpStatus deleteInventoryArticle(@RequestBody InventoryArticle inventoryArticle) {
		inventoryArticleRepository.delete(inventoryArticle);
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/shopping-list-articles", method = RequestMethod.GET)
	ResponseEntity<Collection<ShoppingListArticle>> getShoppingListArticles() {
		Collection<ShoppingListArticle> response = shoppingListArticleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/shopping-list-articles", method = {RequestMethod.POST, RequestMethod.PUT})
	HttpStatus addShoppingListArticle(@RequestBody ShoppingListArticle shoppingListArticle) {
		shoppingListArticleRepository.save(shoppingListArticle);
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/shopping-list-articles", method = RequestMethod.DELETE)
	HttpStatus deleteShoppingListArticle(@RequestBody ShoppingListArticle shoppingListArticle) {
		shoppingListArticleRepository.delete(shoppingListArticle);
		return HttpStatus.OK;
	}
	
	//temporarily, only for presentation
	private void addToInventory(Article article) {
		InventoryArticle inventoryArticle = new InventoryArticle();
		inventoryArticle.setArticle(article);
		inventoryArticle.setAmount(0);
		inventoryArticle.setUseBy(new Date());
		inventoryArticleRepository.save(inventoryArticle);
	}
	
	//temporarily, only for presentation
	private void addToShoppingList(Article article) {
		ShoppingListArticle shoppingListArticle = new ShoppingListArticle();
		shoppingListArticle.setArticle(article);
		shoppingListArticle.setAmount(0);
		shoppingListArticleRepository.save(shoppingListArticle);
	}
}