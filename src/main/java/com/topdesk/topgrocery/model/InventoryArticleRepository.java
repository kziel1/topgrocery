package com.topdesk.topgrocery.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topdesk.topgrocery.model.InventoryArticle;

public interface InventoryArticleRepository extends JpaRepository<InventoryArticle, Long> {
}
