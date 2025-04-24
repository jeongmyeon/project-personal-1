package com.soloProject.service;

import java.security.SecureRandom;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
	
	private final JavaMailSender mailSender;
	private final SecureRandom random = new SecureRandom();
	
	public String generateVerificationCode() {
		int code = 1000000 + random.nextInt(900000);
		return String.valueOf(code);
	}
	
	public void sendEmail(String to, String subject, String text) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(text, true);
			mailSender.send(message);
		}catch(Exception e) {
			throw new RuntimeException("이메일 전송 실패",e);
		}
	}
	
	public void sendVerificationCode(String email, String verificationCode) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message,false,"UTF-8");
			
			helper.setTo(email);
			helper.setSubject("이메일 인증코드");
			helper.setText("<h3>인증코드: <string>"+ verificationCode + "</strong></h3>",true);
			mailSender.send(message);
		}catch(Exception e) {
			throw new RuntimeException("이메일 전송 실패: "+ e.getMessage());
		}
	}
}
