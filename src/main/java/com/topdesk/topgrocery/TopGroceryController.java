package com.topdesk.topgrocery;

import java.util.Collection;
import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.topdesk.topgrocery.model.Article;
import com.topdesk.topgrocery.model.InventoryArticle;
import com.topdesk.topgrocery.model.ShoppingListArticle;

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
	
	@RequestMapping(value = "/articles", method = RequestMethod.POST)
	HttpStatus addArticle(@RequestBody Article article) {
		articleRepository.save(article);
		addToInventory(article);
		addToShoppingList(article);
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/articles", method = RequestMethod.PUT)
	HttpStatus editArticle(@RequestBody Article article) {
		articleRepository.save(article);
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
	//TODO
	@RequestMapping(value = "/inventory-articles", method = RequestMethod.POST)
	HttpStatus addInventoryArticle(@RequestBody InventoryArticle inventoryArticle) {
		inventoryArticleRepository.save(inventoryArticle);
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/shopping-list-articles", method = RequestMethod.GET)
	ResponseEntity<Collection<ShoppingListArticle>> getShoppingListArticles() {
		Collection<ShoppingListArticle> response = shoppingListArticleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	//TODO
//	@RequestMapping(value = "/shopping-list-articles", method = RequestMethod.POST)
//	HttpStatus addShoppingListArticle(@RequestBody ShoppingListArticle shoppingListArticle) {
//		Article article = articleRepository.findOne(shoppingListArticle.getArticle());
//		shoppingListArticleRepository.save(shoppingListArticle);
//		return HttpStatus.OK;
//	}
	
	//temporarily, only for presentation
	private void addToInventory(Article article) {
		InventoryArticle inventoryArticle = new InventoryArticle();
		inventoryArticle.setArticle(article);
		inventoryArticle.setAmount(new Random().nextInt(10) + 1);
		inventoryArticle.setUseBy(new Date());
		inventoryArticleRepository.save(inventoryArticle);
	}
	
	//temporarily, only for presentation
	private void addToShoppingList(Article article) {
		ShoppingListArticle shoppingListArticle = new ShoppingListArticle();
		shoppingListArticle.setArticle(article);
		shoppingListArticle.setAmount(new Random().nextInt(10) + 1);
		shoppingListArticleRepository.save(shoppingListArticle);
	}
}