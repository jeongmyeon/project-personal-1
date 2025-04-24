package com.soloProject.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inquiry {
	private Long id;
	private String userEmail;
	private String title;
	private String content;
	private String replay;
	private String createdAt;
	private String userName;
}
