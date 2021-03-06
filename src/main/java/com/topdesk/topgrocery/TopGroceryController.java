package com.topdesk.topgrocery;

import java.util.Collection;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.topdesk.topgrocery.cloudstorage.CloudShitStorage;
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
	ResponseEntity<Void> saveArticle(@RequestBody Article article) {
		if (StringUtils.isBlank(article.getName()) || article.getName().length() > 50) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		boolean nameDuplicated = articleRepository.findAll()
				.stream()
				.anyMatch(a -> a.getName().equals(article.getName()));
		if (!nameDuplicated) {
			articleRepository.save(article);
		}
		CloudShitStorage.syncDatabase();
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/articles", method = RequestMethod.DELETE)
	HttpStatus deleteArticle(@RequestBody Article article) {
		articleRepository.delete(article.getId());
		CloudShitStorage.syncDatabase();
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/inventory-articles", method = RequestMethod.GET)
	ResponseEntity<Collection<InventoryArticle>> getInventoryArticles() {
		Collection<InventoryArticle> response = inventoryArticleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/inventory-articles", method = {RequestMethod.POST, RequestMethod.PUT})
	ResponseEntity<Void> saveInventoryArticle(@RequestBody InventoryArticle inventoryArticle) {
		if (inventoryArticle.getAmount() < 1 || inventoryArticle.getAmount() > 99) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		else {
			inventoryArticleRepository.save(inventoryArticle);
			CloudShitStorage.syncDatabase();
			return new ResponseEntity<>(HttpStatus.OK);
		}
	}
	
	@RequestMapping(value = "/inventory-articles", method = RequestMethod.DELETE)
	HttpStatus deleteInventoryArticle(@RequestBody InventoryArticle inventoryArticle) {
		inventoryArticleRepository.delete(inventoryArticle);
		CloudShitStorage.syncDatabase();
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/shopping-list-articles", method = RequestMethod.GET)
	ResponseEntity<Collection<ShoppingListArticle>> getShoppingListArticles() {
		Collection<ShoppingListArticle> response = shoppingListArticleRepository.findAll();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/shopping-list-articles", method = {RequestMethod.POST, RequestMethod.PUT})
	ResponseEntity<Void> addShoppingListArticle(@RequestBody ShoppingListArticle shoppingListArticle) {
		Article article = shoppingListArticle.getArticle();
		if (!saveArticle(article).getStatusCode().equals(HttpStatus.OK)
				|| shoppingListArticle.getAmount() < 1 || shoppingListArticle.getAmount() > 99) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		else {
			Optional<ShoppingListArticle> repositoryShoppingListArticle = shoppingListArticleRepository.findAll().stream()
					.filter(a -> a.getArticle().getName().equals(article.getName()))
					.findAny();
			if (repositoryShoppingListArticle.isPresent() && shoppingListArticle.getId() == 0) {
				repositoryShoppingListArticle.get().setAmount(repositoryShoppingListArticle.get().getAmount() + shoppingListArticle.getAmount());
				shoppingListArticleRepository.save(repositoryShoppingListArticle.get());
			}
			else {
				Article repositoryArticle = articleRepository.findAll().stream().filter(a -> a.getName().equals(article.getName())).findAny().get();
				shoppingListArticle.setArticle(repositoryArticle);
				shoppingListArticleRepository.save(shoppingListArticle);
			}
			CloudShitStorage.syncDatabase();
			return new ResponseEntity<>(HttpStatus.OK);
		}
	}
	
	@RequestMapping(value = "/shopping-list-articles", method = RequestMethod.DELETE)
	HttpStatus deleteShoppingListArticle(@RequestBody ShoppingListArticle shoppingListArticle) {
		shoppingListArticleRepository.delete(shoppingListArticle);
		CloudShitStorage.syncDatabase();
		return HttpStatus.OK;
	}
	
	@RequestMapping(value = "/shopping-list-generation", method = RequestMethod.PUT)
	HttpStatus generateShoppingList(@RequestBody ShoppingListProperties shoppingListProperties) {
		topGroceryShoppingListGenerator.generateShoppingList(shoppingListProperties);
		CloudShitStorage.syncDatabase();
		return HttpStatus.OK;
	}
}