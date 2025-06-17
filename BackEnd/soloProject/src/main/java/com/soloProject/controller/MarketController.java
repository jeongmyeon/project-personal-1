package com.soloProject.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.soloProject.config.JwtUtil;
import com.soloProject.model.Market;
import com.soloProject.service.MarketService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/market")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MarketController {
	
	private final JwtUtil jwtUtil;
	private final MarketService marketService;
	
	@GetMapping("/get")
	public ResponseEntity<Map<String,Object>> getMarket(){
		List<Market> markets = marketService.getAllMarket();
		return ResponseEntity.ok(Map.of("success",true,"market",markets)); 
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getMarketDetail(@PathVariable int id){
		Market market = marketService.getMarketById(id);
		if(market != null) {
			return ResponseEntity.ok().body(Map.of("success",true,"market",market));
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success",false,"message","마켓을 찾을 수 없습니다."));
		}
	}
	
	
	@PostMapping("/add")
	public ResponseEntity<?> addMarket(@RequestParam("title") String title,
									   @RequestParam("content") String content,
									   @RequestParam("price") String price,
									   @RequestPart(value = "image", required= false) MultipartFile imageFile,HttpServletRequest request){
		String authHeader = request.getHeader("Authorization");
		
		if((authHeader == null) || !authHeader.startsWith("Bearer ")){
			return ResponseEntity.status(401).body("토큰이 없습니다.");
		}
		
		String token = authHeader.substring(7);
		Integer userId;
		
		try {
			userId = jwtUtil.extractUserId(token);
		}catch(Exception e) {
			return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
		}
		
		if(userId ==null) {
			return ResponseEntity.status(401).body("토큰에 userId가 없습니다.");
		}
		
		String imagePath = null;
		if(imageFile != null && !imageFile.isEmpty()) {
			try {
				String uploadDir = "C:\\Users\\user\\Desktop\\personal-project\\uploads";
				File uploadPath = new File(uploadDir);
				if(!uploadPath.exists()) {
					uploadPath.mkdirs();
				}
				String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + ".jpg";
				File dest = new File(uploadDir, fileName);
				imageFile.transferTo(dest);
				imagePath = "/uploads/" + fileName;
			}catch(IOException e) {
				return ResponseEntity.status(500).body("이미지 저장 중 오류 발생");
			}
		}
		
		Market market = new Market();
		market.setUserId(userId);
		market.setTitle(title);
		market.setContent(content);
		market.setPrice(price);
		market.setImage(imagePath);

		
		boolean success = marketService.addMarket(market);
		if(success) {
			return ResponseEntity.ok(Map.of("success",true,"message","마켓 등록 성공"));
		}else {
			return ResponseEntity.badRequest().body(Map.of("success",false,"message","마켓 등록 실패"));
		}
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteMarket(@PathVariable int id, HttpServletRequest request){
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
		Market existingMarket = marketService.getMarketById(id);
		if(existingMarket == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("success",false,"message","게시글을 찾을 수 없습니다."));
		}
		
		if(userId == null || existingMarket.getUserId() != userId) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("success",false,"message","권한이 없습니다."));
		}
		
		boolean success = marketService.deleteMarket(id);
		
		if(success) {
			return ResponseEntity.ok(Map.of("success",true,"message","거래글 삭제 완료"));
		}else {
			return ResponseEntity.badRequest().body(Map.of("success",false,"message","거래글 삭제 실패"));
		}
	}
	
	@PutMapping("/edit/{id}")
	public ResponseEntity<?> editMarket(@PathVariable int id, @RequestParam("title") String title,
										@RequestParam("content") String content,@RequestParam("price") String price,
										@RequestPart(value = "image", required = false) MultipartFile imageFile,
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
			return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
		}
		Market existingMarket = marketService.getMarketById(id);
		if(existingMarket == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success",false,"message","글을 찾을 수 없습니다."));
		}
		if(userId == null || existingMarket.getUserId() != (userId)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success",false,"message","권한이 없습니다."));
		}
		existingMarket.setTitle(title);
	    existingMarket.setContent(content);
	    existingMarket.setPrice(price);
		if(imageFile != null && !imageFile.isEmpty()) {
			try {
				String uploadDir = "C:\\Users\\user\\Desktop\\personal-project\\uploads";
				File uploadPath = new File(uploadDir);
				if(!uploadPath.exists()) uploadPath.mkdirs();
				
				String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + ".jpg";
				File dest = new File(uploadDir, fileName);
				imageFile.transferTo(dest);
				existingMarket.setImage("/uploads/" + fileName);
			}catch(IOException e) {
				return ResponseEntity.status(500).body("이미지 오류");
			}
		}
		
		boolean success = marketService.updatedMarket(existingMarket);
		
		if(success) {
			return ResponseEntity.ok(Map.of("success",true, "message","수정 완료"));
		}else {
			return ResponseEntity.badRequest().body(Map.of("success",false,"message","수정 실패"));
		}
	}
}
