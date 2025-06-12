package com.soloProject.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soloProject.config.JwtUtil;
import com.soloProject.mapper.ReviewMapper;
import com.soloProject.model.Review;
import com.soloProject.service.ReviewService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/board/review")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ReviewController {
	private final ReviewService reviewService;
	private final JwtUtil jwtUtil;
	
	@GetMapping("/{id}")
	public ResponseEntity<Map<String,Object>> getReviews(@PathVariable("id") int boardId){
		List<Review> reviews = reviewService.getReviews(boardId);
		Map<String,Object> result = new HashMap<>();
		result.put("success",true);
		result.put("reviews",reviews);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping("/add/{boardId}")
	public ResponseEntity<?> addReview(@PathVariable int boardId, 
									  @RequestBody Review review,
									  HttpServletRequest request){
		String authHeader = request.getHeader("Authorization");
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(401).body("토큰이 없습니다.");
		}
		String token = authHeader.substring(7);
		Integer userId;
		
		try {
			userId = jwtUtil.extractUserId(token);
		}catch(Exception e) {
			return ResponseEntity.status(401).body("유효하지 않는 토큰입니다.");
		}
		
		if(userId == null) {
			return ResponseEntity.status(401).body("토큰에 userId가 없습니다.");
		}
		review.setUserId(userId);
		review.setBoardId(boardId);
		
		boolean success = reviewService.addReview(review);
		if(success) {
			return ResponseEntity.ok(Map.of("success",true,"message","리뷰 등록 성공"));
		}else {
			return ResponseEntity.badRequest().body(Map.of("success",false,"message","리뷰 등록 실패"));
		}
	}
	
	@DeleteMapping("/{reviewId}")
	public ResponseEntity<?> deleteReview(@PathVariable int reviewId, HttpServletRequest request){
		String authHeader = request.getHeader("Authorization");
	    if(authHeader == null || !authHeader.startsWith("Bearer ")) {
	        return ResponseEntity.status(401).body("인증 정보가 없습니다.");
	    }
	    
	    String token = authHeader.replace("Bearer ", "");
	    int userId;
	    try {
	        userId = jwtUtil.extractUserId(token);
	    } catch (Exception e) {
	        return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
	    }
	    
	    try {
	        reviewService.deleteReview(reviewId, userId);
	        return ResponseEntity.ok("리뷰가 삭제되었습니다.");
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(403).body(e.getMessage());
	    }
	}   
	
	@PutMapping("/{reviewId}")
	public ResponseEntity<?> editReview(@PathVariable int reviewId, @RequestBody Review updateReview, HttpServletRequest request){
		String authHeader = request.getHeader("Authorization");
		
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(401).body("토큰이 없습니다.");
		}
		
		String token = authHeader.substring(7);
		Integer userId;
		try {
			userId = jwtUtil.extractUserId(token);
		}catch(Exception e) {
			return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
		}
		
		boolean result = reviewService.updateReview(reviewId, userId, updateReview.getReviewText());
		if(result) {
			Map<String,Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "리뷰가 수정되었습니다.");
			return ResponseEntity.ok(response);
		}else {
			Map<String,Object> response = new HashMap<>();
			response.put("success", false);
			response.put("message", "본인 리뷰만 수정 가능");
			return ResponseEntity.status(403).body(response);
		}
		
	}
} 
