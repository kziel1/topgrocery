package com.topdesk.topgrocery;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.topdesk.topgrocery.entity.Article;
import com.topdesk.topgrocery.entity.InventoryArticle;
import com.topdesk.topgrocery.entity.ShoppingListArticle;
import com.topdesk.topgrocery.entity.ShoppingListProperties;
import com.topdesk.topgrocery.repository.ArticleRepository;
import com.topdesk.topgrocery.repository.InventoryArticleRepository;
import com.topdesk.topgrocery.repository.ShoppingListArticleRepository;

@Component
public class TopGroceryShoppingListGenerator {
	private static final int BREAD_ROLLS_DEMAND = 2;
	private static final int EGGS_DEMAND = 1;
	private static final int STH_GREEN_DEMAND = 1;
	@Autowired
	ArticleRepository articleRepository;
	@Autowired
	InventoryArticleRepository inventoryArticleRepository;
	@Autowired
	ShoppingListArticleRepository shoppingListArticleRepository;
	
	public void generateShoppingList(ShoppingListProperties shoppingListProperties) {
		shoppingListArticleRepository.deleteAll();
		processShoppingListArticle("bread roll", BREAD_ROLLS_DEMAND, shoppingListProperties.getParticipantCount());
		processShoppingListArticle("egg", EGGS_DEMAND, shoppingListProperties.getParticipantCount());
		processShoppingListArticle("sth green", STH_GREEN_DEMAND, shoppingListProperties.getVegetarianCount());
	}
	
	private void processShoppingListArticle(String articleName, int demand, int participantsAmount) {
		Optional<InventoryArticle> inventoryArticle = inventoryArticleRepository.findAll().stream().filter(a -> a.getArticle().getName().equals(articleName)).findAny();
		int inventoryAmount = inventoryArticle.isPresent() ? (int) inventoryArticle.get().getAmount() : 0;
		int shoppingAmount = demand * participantsAmount - inventoryAmount + ("bread roll".equals(articleName) ? 1 : 0);
		if (shoppingAmount > 0) {
			ShoppingListArticle shoppingListArticle = new ShoppingListArticle();
			shoppingListArticle.setAmount(shoppingAmount);
			shoppingListArticle.setArticle(retrieveArticle(articleName));
			shoppingListArticleRepository.save(shoppingListArticle);
		}
	}
	
	private Article retrieveArticle(String name) {
		Article article = new Article();
		article.setName(name);
		return articleRepository.findAll()
				.stream()
				.filter(a -> a.getName().equals(article.getName()))
				.findAny()
				.orElseGet(() -> articleRepository.save(article));
	}
}