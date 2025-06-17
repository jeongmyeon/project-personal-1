package com.soloProject.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soloProject.mapper.ChatRoomMapper;
import com.soloProject.model.ChatRoom;

@Service
public class ChatRoomService {
	
	@Autowired
	private ChatRoomMapper chatRoomMapper;
	
	public Long createGetChatRoom(Long buyerId, Long sellerId, Long marketId) {
		ChatRoom existingRoom = chatRoomMapper.findByChat(buyerId, sellerId,marketId);
		if(existingRoom != null) {
			return existingRoom.getId();
		}else {
			ChatRoom newRoom = new ChatRoom();
			newRoom.setBuyerId(buyerId);
			newRoom.setSellerId(sellerId);
			newRoom.setMarketId(marketId);
			chatRoomMapper.insertchatRoom(newRoom);
			return newRoom.getId();
		}
	}
	
	public List<ChatRoom> getMyChatRoom(Long userId){
		return chatRoomMapper.getMyChatRoom(userId);
	}
}
