package com.topdesk.topgrocery.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "shopping_list_article")
public class ShoppingListArticle {
	@Id
	@GeneratedValue
	@Column(name = "id")
	private long id;
	@ManyToOne
	@JoinColumn(foreignKey = @ForeignKey(name = "sla_article_id"))
	private Article article;
	@Column(name = "amount")
	private long amount;
}
