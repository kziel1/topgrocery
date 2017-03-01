package com.topdesk.topgrocery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.topdesk.topgrocery.repository.ArticleRepository;
import com.topdesk.topgrocery.repository.InventoryArticleRepository;
import com.topdesk.topgrocery.entity.ShoppingListArticle;
import com.topdesk.topgrocery.repository.ShoppingListArticleRepository;

public class TopGroceryShoppingListGenerator {
	@Autowired
	ArticleRepository articleRepository;
	@Autowired
	InventoryArticleRepository inventoryArticleRepository;
	@Autowired
	ShoppingListArticleRepository shoppingListArticleRepository;
	
	public static final List<ShoppingListArticle> generateShoppingList(int breakfastAtendeeCount) {
		return null;
	}
}
