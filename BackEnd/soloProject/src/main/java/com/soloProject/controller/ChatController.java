package com.soloProject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.soloProject.config.JwtUtil;
import com.soloProject.mapper.ChatMapper;
import com.soloProject.model.ChatMessage;
import com.soloProject.model.ChatRoom;
import com.soloProject.service.BoardService;
import com.soloProject.service.ChatRoomService;
import com.soloProject.service.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ChatController {
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	@Autowired
	private ChatService chatService;
	@Autowired
	private ChatRoomService chatRoomService;

	@MessageMapping("/chat.sendMessage")
	public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
		chatService.saveMessage(chatMessage);
		String receiverId = String.valueOf(chatMessage.getReceiverId());
		messagingTemplate.convertAndSendToUser(
				receiverId,
				"/queue/messages",
				chatMessage
			);
		return chatMessage;
	}
	
	@GetMapping("/room/{roomId}/messages")
	public ResponseEntity<List<ChatMessage>> getMessage(@PathVariable String roomId){
		return ResponseEntity.ok(chatService.getMessages(roomId));
	}
	
	@GetMapping("/chatroom")
	public ResponseEntity<List<ChatRoom>> getChatRooms(@RequestParam Long userId){
		return ResponseEntity.ok(chatRoomService.getMyChatRoom(userId));
	}
}
