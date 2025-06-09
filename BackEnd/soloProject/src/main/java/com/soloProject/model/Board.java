package com.soloProject.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Board {
	private int boardId;
	private int userId;
	private String title;
	private String content;
	private String createdAt;
	private int views;
	private int likes;
	private String userName;
}
