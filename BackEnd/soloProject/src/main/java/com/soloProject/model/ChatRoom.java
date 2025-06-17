package com.soloProject.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatRoom {
	private Long id;
	private long buyerId;
	private long sellerId;
	private long marketId;
	private Long roomId;
	private String opponentName;
	private String lastMessage;
	private LocalDateTime updatedAt;
}
