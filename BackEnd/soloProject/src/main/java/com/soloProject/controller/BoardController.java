package com.soloProject.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RestController;

import com.soloProject.config.JwtUtil;
import com.soloProject.model.Board;
import com.soloProject.service.BoardService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/board")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class BoardController {

	private final BoardService boardService;
	private final JwtUtil jwtUtil;
	
	@GetMapping("/get")
	public ResponseEntity<Map<String,Object>> getBoards(){
		List<Board> boards = boardService.getAllBoards();
		return ResponseEntity.ok(
			Map.of("success", true, "boards",boards)
				);
	}
	
	@PostMapping("/write")
	public ResponseEntity<?> writeBoard(@RequestBody Board board, HttpServletRequest request){
		String authHeader = request.getHeader("Authorization");

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        return ResponseEntity.status(401).body("토큰이 없습니다.");
	    }

	    String token = authHeader.substring(7);

	    Integer userId;

	    try {
	        userId = jwtUtil.extractUserId(token);
	    } catch (Exception e) {
	        return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
	    }

	    if (userId == null) {
	        return ResponseEntity.status(401).body("토큰에 userId가 없습니다.");
	    }

	    board.setUserId(userId);
		
		
		boolean success = boardService.writeBoard(board);
		if(success) {
			return ResponseEntity.ok(Map.of("success",true,"message","게시글 등록 성공"));
		}else {
			return ResponseEntity.badRequest().body(Map.of("success",false,"message","게시글 등록 실패"));
			}
		}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getBoardDetail(@PathVariable int id, HttpServletRequest request){
		String authHeader = request.getHeader("Authorization");
		Integer userId = null;
		
		if(authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			try {
				userId = jwtUtil.extractUserId(token);
			}catch(Exception e) {
				
			}
		}
		Board board = boardService.getBoardById(id);
		if(board != null) {
			return ResponseEntity.ok().body(Map.of("success",true,"board",board));
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success",false,"message","게시글을 찾을 수 없습니다."));
		}
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteBoard(@PathVariable int id, HttpServletRequest request) {
	    String authHeader = request.getHeader("Authorization");

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        return ResponseEntity.status(401).body("토큰이 없습니다.");
	    }

	    String token = authHeader.substring(7);
	    Integer userId;
	    try {
	        userId = jwtUtil.extractUserId(token);
	    } catch (Exception e) {
	        return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
	    }
	    
	    Board existingBoard = boardService.getBoardById(id);
	    if (existingBoard == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	            .body(Map.of("success", false, "message", "게시글을 찾을 수 없습니다."));
	    }
	    
	    if (userId == null || existingBoard.getUserId() != userId) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN)
	            .body(Map.of("success", false, "message", "권한이 없습니다."));
	    }

	    boolean success = boardService.deleteBoard(id);

	    if (success) {
	        return ResponseEntity.ok(Map.of("success", true, "message", "게시글이 삭제되었습니다."));
	    } else {
	        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "게시글 삭제 실패"));
	    }
	}
	
	@PutMapping("/edit/{id}")
	public ResponseEntity<?> editBoard(@PathVariable int id, @RequestBody Board updatedBoard, HttpServletRequest request) {
	    String authHeader = request.getHeader("Authorization");

	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        return ResponseEntity.status(401).body("토큰이 없습니다.");
	    }

	    String token = authHeader.substring(7);
	    Integer userId;
	    try {
	        // 로그인 인증용으로 userId 추출 (사용하지는 않음)
	        userId = jwtUtil.extractUserId(token);
	    } catch (Exception e) {
	        return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
	    }

	    Board existingBoard = boardService.getBoardById(id);
	    if (existingBoard == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "게시글을 찾을 수 없습니다."));
	    }
	    
	    if (userId == null || existingBoard.getUserId() != (userId)) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success", false, "message", "권한이 없습니다."));
	    }
	    
	    existingBoard.setTitle(updatedBoard.getTitle());
	    existingBoard.setContent(updatedBoard.getContent());

	    boolean success = boardService.updateBoard(existingBoard);

	    if (success) {
	        return ResponseEntity.ok(Map.of("success", true, "message", "게시글이 수정되었습니다."));
	    } else {
	        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "게시글 수정 실패"));
	    }
	}
}

