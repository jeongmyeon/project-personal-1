package com.soloProject.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soloProject.model.ChatRoomRequest;
import com.soloProject.service.ChatRoomService;

@RestController
@RequestMapping("/chatroom")
public class chatRoomController {

	@Autowired
	private ChatRoomService chatRoomService;
	
	@PostMapping
	public ResponseEntity<?> createChatRoom(@RequestBody ChatRoomRequest request){
		Long chatRoomId = chatRoomService.createGetChatRoom(request.getBuyerId(), request.getSellerId(), request.getMarketId());
		Map<String, Object> response = new HashMap<>();
		response.put("success",true);
		response.put("chatRoomId", chatRoomId);
		return ResponseEntity.ok(response);
	}
}
