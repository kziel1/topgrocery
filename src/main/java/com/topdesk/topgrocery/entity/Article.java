package com.topdesk.topgrocery.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "article")
public class Article {
	@Id
	@GeneratedValue
	@Column(name = "id")
	private long id;
	@Column(name = "name")
	private String name;
 	
}