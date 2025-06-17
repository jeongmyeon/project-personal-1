package com.soloProject.model;

import lombok.Data;

@Data
public class ChatRoomRequest {

	private Long buyerId;
	private Long sellerId;
	private Long marketId;
}
