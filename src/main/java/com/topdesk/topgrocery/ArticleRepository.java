package com.topdesk.topgrocery;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topdesk.topgrocery.model.Article;

public interface ArticleRepository extends JpaRepository<Article, Long> {
}
