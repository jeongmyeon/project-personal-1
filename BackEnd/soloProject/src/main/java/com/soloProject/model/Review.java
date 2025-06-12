package com.soloProject.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
	private int reviewId;
	private int userId;
	private String reviewText;
	private int boardId;
	private String userName; 
	private String createdAt;
}
