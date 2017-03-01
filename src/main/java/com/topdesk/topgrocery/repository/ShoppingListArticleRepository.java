package com.topdesk.topgrocery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topdesk.topgrocery.entity.ShoppingListArticle;

public interface ShoppingListArticleRepository extends JpaRepository<ShoppingListArticle, Long> {
}
