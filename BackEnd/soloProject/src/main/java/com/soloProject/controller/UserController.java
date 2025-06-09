package com.soloProject.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.soloProject.config.JwtUtil;
import com.soloProject.model.User;
import com.soloProject.service.EmailService;
import com.soloProject.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService userService;
	private final JwtUtil jwtUtil;
	private final EmailService emailService;
	
	@PostMapping("/verify-email")
	public ResponseEntity<?> sendCerificationEmail(@RequestBody Map<String, String> request){
		String email = request.get("email");
		userService.sendVerificationEmail(email);
		return ResponseEntity.ok(Map.of("success", true, "message", "이메일 인증코드가 전송되었습니다."));
	}
	
	@PostMapping("/confirm-email")
	public ResponseEntity<?> confirmEmail(@RequestBody Map<String, String> request){
		String email = request.get("email");
		String code = request.get("code");
		
		userService.verifyEmail(email, code);
		return ResponseEntity.ok(Map.of("success", true, "message", "이메일 인증 성공"));
	}
	 
	@PostMapping("/find-id")
	public ResponseEntity<?> findUserId(@RequestBody Map<String, String> request){
		try {
			String name = request.get("name");
			String phoneNumber = request.get("phoneNumber");
			String userId = userService.findUserIdByNameAndPhone(name, phoneNumber);
			return ResponseEntity.ok(Map.of("success", true, "userId", userId));
		}catch(IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
		}
	}
	
	@GetMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        boolean exists = userService.checkEmailExists(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(Map.of("success", true, "exists", exists));
    }
	
	@GetMapping("/check-phone")
    public ResponseEntity<?> checkPhoneExists(@RequestParam String phoneNumber) {
        boolean exists = userService.checkPhoneExists(phoneNumber);
        return ResponseEntity.ok(Map.of("success", true, "exists", exists));
    }
	
	@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        System.out.println("🔐 [컨트롤러] 로그인 요청됨 - 이메일: " + user.getEmail());

        Map<String, Object> result = userService.login(user.getEmail(), user.getPassword());

        System.out.println("✅ [컨트롤러] 로그인 완료 후 응답 반환");

        return ResponseEntity.ok(result);
    }
	
	 @GetMapping("/get-hashed-password")
	    public ResponseEntity<?> getHashedPassword(@RequestParam String email) {
	        System.out.println("📡 [백엔드] 로그인 시 비밀번호 조회 요청 - 이메일: " + email);
	        
	        String hashedPassword = userService.getHashedPasswordByEmail(email);
	        if (hashedPassword == null) {
	        	return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "이메일이 존재하지 않습니다."));
	        }

	        System.out.println("🔹 [백엔드] 조회된 해시된 비밀번호: " + hashedPassword);
	        return ResponseEntity.ok(Map.of("success", true, "password", hashedPassword));
	    }
	 
	 @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	    public ResponseEntity<?> registerUser(
	            @RequestPart("user") User user){

	        System.out.println("✅ 회원가입 요청 데이터: " + user);
	        userService.registerUser(user);
	        return ResponseEntity.ok(Map.of("success", true, "message", "회원가입 성공!"));
	    }

	 @GetMapping("/get-user")
	 	public ResponseEntity<?> getUserByEmail(@RequestParam String email){
		 User user = userService.getUserByEmail(email);
		 if(user == null) {
			 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "사용자를 찾을 수 없습니다."));
		 }
		 return ResponseEntity.ok(user);
	 }
	 
	 @PostMapping("/reset-password")
	 public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request){
		 String email = request.get("email");
		 String newPassword = request.get("newPassword");
		 
		 userService.resetPassword(email, newPassword);
		 return ResponseEntity.ok(Map.of("success", true, "message", "비밀번호 재설정 성공!"));
	 }
	 
	 @PostMapping("/send-verification-code")
	 public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> request){
		 String email = request.get("email");
		 String phoneNumber = request.get("phoneNumber");
		 userService.sendVerificationCode(email, phoneNumber); 
		 return ResponseEntity.ok(Map.of("success", true, "message","인증 코드 전송 성공!"));
	 }
}
