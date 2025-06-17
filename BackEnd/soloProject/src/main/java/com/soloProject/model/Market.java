package com.soloProject.model;

import lombok.Data;

@Data
public class Market {
	private int marketId;
	private int userId;
	private String userName;
	private String title;
	private String content;
	private String createdAt;
	private int views;
	private int favorite;
	private String image;
	private String price;
}
