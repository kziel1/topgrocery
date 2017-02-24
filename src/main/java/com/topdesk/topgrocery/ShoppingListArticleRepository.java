package com.topdesk.topgrocery;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topdesk.topgrocery.model.ShoppingListArticle;

public interface ShoppingListArticleRepository extends JpaRepository<ShoppingListArticle, Long> {
}
