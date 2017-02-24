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
	
	//list instead of collection?
	@RequestMapping(value = "/articles", method = RequestMethod.GET)
	ResponseEntity<Collection<Article>> articles() {
		Collection<Article> response = articleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/articles", method = RequestMethod.POST)
	HttpStatus addArticle(Article article) {
		articleRepository.save(article);
		ShoppingListArticle shoppingListArticle = new ShoppingListArticle();
		shoppingListArticle.setArticle(article);
		shoppingListArticle.setAmount(3);
		InventoryArticle inventoryArticle = new InventoryArticle();
		inventoryArticle.setArticle(article);
		inventoryArticle.setAmount(3);
		inventoryArticle.setUseBy(new Date());
		shoppingListArticleRepository.save(shoppingListArticle);
		inventoryArticleRepository.save(inventoryArticle);
		return HttpStatus.OK;
	}
	
	//list instead of collection?
	@RequestMapping(value = "/inventory-articles", method = RequestMethod.GET)
	ResponseEntity<Collection<InventoryArticle>> inventoryArticles() {
		Collection<InventoryArticle> response = inventoryArticleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/inventory-articles", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	HttpStatus addInventoryArticle(@RequestBody InventoryArticle inventoryArticle) {
		inventoryArticleRepository.save(inventoryArticle);
		return HttpStatus.OK;
	}
	
	//list instead of collection?
	@RequestMapping(value = "/shopping-list-articles", method = RequestMethod.GET)
	ResponseEntity<Collection<ShoppingListArticle>> ShoppingListArticles() {
		Collection<ShoppingListArticle> response = shoppingListArticleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/shopping-list-articles", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	HttpStatus addShoppingListArticle(@RequestBody ShoppingListArticle shoppingListArticle) {
//		Article article = articleRepository.findOne(shoppingListArticle.getArticle());
		shoppingListArticleRepository.save(shoppingListArticle);
		return HttpStatus.OK;
	}
}