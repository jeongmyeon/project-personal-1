package com.soloProject.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.soloProject.config.JwtUtil;
import com.soloProject.mapper.InquiryMapper;
import com.soloProject.mapper.UserMapper;
import com.soloProject.model.User;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

	private final UserMapper userMapper;
	private final JwtUtil jwtUtil;
	private final PasswordEncoder passwordEncoder;
	private final InquiryMapper inquiryMpper;
	
	private final Map<String, String> verificattionCodes = new HashMap<>();
	private final EmailService emailService;
	private final JdbcTemplate jdbcTemplate;
	
	@Autowired
	public UserService (EmailService emailService,
						InquiryMapper inquiryMapper,
						JwtUtil jwtUtil,
						PasswordEncoder passwordEncoder,
						UserMapper userMapper,
						JdbcTemplate jdbcTemplate) {
		this.emailService = emailService;
		this.inquiryMpper = inquiryMapper;
		this.jwtUtil = jwtUtil;
		this.passwordEncoder = passwordEncoder;
		this.userMapper = userMapper;
		this.jdbcTemplate = jdbcTemplate;
	}
	
	public void sendVerificationEmail(String email) {
		String code = generateVerificationCode();
		userMapper.saveVerificationCode(email, code);
		emailService.sendEmail(email, "이메일 인증 코드","인증번호: "+ code);
		
	}
	
	public void verifyEmail(String email, String code) {
		String storedCode = userMapper.getVerificationCode(email);
		
		if(storedCode == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "인증번호가 존재하지 않습니다.");
		}
		
		if(!storedCode.trim().equals(code.trim())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"인증번호가 일치하지 않습니다.");
		}
	}
	
	public String generateVerificationCode() {
		Random random = new Random();
		return String.format("%06d",random.nextInt(1000000));
	}
	
	public void registerUser(User user) {
		if(user.getIsVerified() == null || !user.getIsVerified()) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN,"이메일 인증을 완료한 사용자만 강비할 수 있습니다.");
		}
		
		user.setIsVerified(true);
		
		String encryptedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(encryptedPassword);
		
		userMapper.registerUser(user);
		System.out.println("회원가입 완료");
	}
	
	public boolean checkEmailExists(String email) {
		return userMapper.checkEmailExists(email) >0;
	}
	
	public boolean checkPhonExists(String phoneNumber) {
		int count = userMapper.countByPhoneNumber(phoneNumber);
		return count > 0;
	}
	
	public String findUserIdByNameAndPhone(String userName, String phoneNumber) {
		String userEmail = userMapper.findEmailByNameAndPhone(userName, phoneNumber);
		if(userEmail == null) {
			throw new IllegalArgumentException("입력한 벙보와 일치하는 계정이 없습니다.");
		}
		return userEmail;
	}
	
	public boolean checkPhoneExists(String phoneNumber) {
        
        int count = userMapper.countByPhoneNumber(phoneNumber);
        return count > 0; 
    }
	
	 public Map<String, Object> login(String email, String rawPassword) {
	        System.out.println("🚀 login() 메서드 실행됨! 입력된 이메일: " + email);

	        
	        User user = userMapper.getUserByEmail(email);
	        System.out.println("🔍 [DB 조회 결과] user = " + (user != null ? "존재함" : "존재하지 않음"));

	        if (user == null) {
	            System.out.println("❌ 이메일이 존재하지 않음");
	            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "잘못된 이메일 또는 비밀번호입니다.");
	        }

	        System.out.println("🔍 [DB 저장된 해시 비번] " + user.getPassword());
	        System.out.println("🔍 [입력된 원본 비번] " + rawPassword);

	        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
	            System.out.println("❌ 비밀번호 불일치");
	            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "잘못된 이메일 또는 비밀번호입니다.");
	        }

	        System.out.println("✅ 로그인 성공! 유저 ID: " + user.getId() + ", 역할: " + user.getRole());

	        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

	        System.out.println("✅ JWT 토큰 생성 완료: " + token);

	        Map<String, Object> response = new HashMap<>();
	        response.put("user", user);
	        response.put("token", token);

	        return response;
	    }
	
	public String getHashedPasswordByEmail(String email) {
        return userMapper.getHashedPasswordByEmail(email);
    }
	
	public User getUserByEmail(String email) {
		User user = userMapper.getUserByEmail(email);
		if(user == null) {
			System.out.println("유저를 찾을 수 없습니다.");
			throw new IllegalArgumentException("해당 이메일의 유저를 찾을 수 없습니다.");
		}
		
		return user;
	}
	
	public void resetPassword(String email, String newPassword) {
		System.out.println("비밀번호 변경 요청 : " + email);
		
		String encryptedPassword = passwordEncoder.encode(newPassword);
		userMapper.updatePassword(email, encryptedPassword);
		
		System.out.println("비밀번호 변경 완료!");
	}
	
	public void sendVerificationCode(String email, String phoneNumber) {
		if(userMapper.countUserByEmailAndPhone(email, phoneNumber) == 0) {
			throw new IllegalArgumentException("해당 사용자가 존재하지 않습니다!");
		}
		String verificationCode = emailService.generateVerificationCode();
		System.out.println("인증번호 : " + verificationCode);
		
		String existingCode = userMapper.getVerificationCode(email);
		if(existingCode == null) {
			System.out.println("기존 인증번호 없음, Insert 실행!");
			userMapper.saveVerificationCode(email, verificationCode);
		}else {
			System.out.println("기존 인증번호 존재, Update 실행!");
			int updateRows = userMapper.updateVerificationCode(email, verificationCode);
			
			if(updateRows == 0) {
				System.out.println("Update 실패!, Insert 실행!");
				userMapper.saveVerificationCode(email, verificationCode);
			}
		}
		System.out.println("인증번호 저장! : " + verificationCode);
		emailService.sendVerificationCode(email, verificationCode);
	}
	
}