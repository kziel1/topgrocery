package com.topdesk.topgrocery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topdesk.topgrocery.entity.InventoryArticle;

public interface InventoryArticleRepository extends JpaRepository<InventoryArticle, Long> {
}
