package com.soloProject.model;

import lombok.Data;

@Data
public class ChatMessage {
	private String roomId;
	private Long senderId;
	private String senderName;
	private String message;
	private Long receiverId;
	private String createdAt;
}
