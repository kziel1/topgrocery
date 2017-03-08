package com.topdesk.topgrocery;

import java.util.Collection;

import org.apache.commons.lang3.StringUtils;
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
import com.topdesk.topgrocery.entity.ShoppingListProperties;

@RestController
public class TopGroceryController {
	@Autowired
	private JpaRepository<Article, Long> articleRepository;
	@Autowired
	private JpaRepository<ShoppingListArticle, Long> shoppingListArticleRepository;
	@Autowired
	private JpaRepository<InventoryArticle, Long> inventoryArticleRepository;
	@Autowired
	private TopGroceryShoppingListGenerator topGroceryShoppingListGenerator;
	
	@RequestMapping(value = "/articles", method = RequestMethod.GET)
	ResponseEntity<Collection<Article>> getArticles() {
		Collection<Article> response = articleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/articles", method = {RequestMethod.POST, RequestMethod.PUT})
	ResponseEntity saveArticle(@RequestBody Article article) {
		HttpStatus httpStatus;
		if (StringUtils.isBlank(article.getName())) {
			httpStatus = HttpStatus.BAD_REQUEST;
		}
		else {
			articleRepository.save(article);
			httpStatus = HttpStatus.OK;
		}
		return new ResponseEntity(httpStatus);
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
	HttpStatus saveInventoryArticle(@RequestBody InventoryArticle inventoryArticle) {
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
	
	@RequestMapping(value = "/shopping-list-generation", method = RequestMethod.PUT)
	HttpStatus generateShoppingList(@RequestBody ShoppingListProperties shoppingListProperties) {
		topGroceryShoppingListGenerator.generateShoppingList(shoppingListProperties);
		return HttpStatus.OK;
	}
}