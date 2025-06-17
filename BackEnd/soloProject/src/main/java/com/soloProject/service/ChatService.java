package com.soloProject.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soloProject.mapper.ChatMapper;
import com.soloProject.mapper.ChatRoomMapper;
import com.soloProject.model.ChatMessage;

@Service
public class ChatService {
	
	@Autowired
	private ChatMapper chatMapper;
	@Autowired
	private ChatRoomMapper chatRoomMapper;
	
	private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	
	public void saveMessage(ChatMessage message) {
		message.setCreatedAt(LocalDateTime.now().format(formatter));
		chatMapper.insertMessage(message);
		chatRoomMapper.updateLastMessage(Long.parseLong(message.getRoomId()), message.getMessage());
	}
	
	public List<ChatMessage> getMessages(String roomId){
		return chatMapper.selectMessagesByRoomId(roomId);
	}
}
