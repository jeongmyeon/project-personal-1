package com.soloProject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soloProject.config.JwtUtil;
import com.soloProject.model.Board;
import com.soloProject.model.Market;
import com.soloProject.service.MyPageService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/mypage")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MyPageController {

	private final MyPageService myPageService;
	private final JwtUtil jwtUtil;
	
	@GetMapping("/getmarket")
	public ResponseEntity<Map<String, Object>> getMyMarket(HttpServletRequest request){
		String authHeader = request.getHeader("Authorization");
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
	        return ResponseEntity.status(401).body(Map.of("success",false,"message","인증 정보가 없습니다."));
	    }
		String token = authHeader.substring(7);
		int userId;
		try {
			userId = jwtUtil.extractUserId(token);
		}catch(Exception e) {
			return ResponseEntity.status(401).body(Map.of("success",false,"message","유효하지 않은 토큰입니다."));
		}
		List<Market> markets = myPageService.getMyMarket(userId);
		return ResponseEntity.ok(Map.of("success",true,"market",markets));
	}
	
	@GetMapping("/getboard")
	public ResponseEntity<Map<String, Object>> getMyBoard(HttpServletRequest request){
		String authHeader = request.getHeader("Authorization");
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(401).body(Map.of("success",false,"message","인증 정보가 없습니다."));
		}
		String token = authHeader.substring(7);
		int userId;
		try {
			userId = jwtUtil.extractUserId(token);
		}catch(Exception e) {
			return ResponseEntity.status(401).body(Map.of("success",false,"message","유효하지 않은 토큰입니다."));
		}
		List<Board> boards = myPageService.getMyBoard(userId);
		return ResponseEntity.ok(Map.of("success",true,"board",boards));
	}
	
}
