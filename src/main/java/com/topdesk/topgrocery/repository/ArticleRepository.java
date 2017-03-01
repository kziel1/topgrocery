package com.topdesk.topgrocery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topdesk.topgrocery.entity.Article;

public interface ArticleRepository extends JpaRepository<Article, Long> {
}
