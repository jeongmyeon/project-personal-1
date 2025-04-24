package com.soloProject.config;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter{
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
		throws ServletException, IOException{
		
		final String requestPath = request.getRequestURI();
		
		if(requestPath.startsWith("/user/register") || requestPath.startsWith("/user/login") || 
				requestPath.startsWith("/user/verify-email") || requestPath.startsWith("/user/confirm-email") ||
				requestPath.startsWith("/user/check-email") || requestPath.startsWith("/user/find-id") ||
				requestPath.startsWith("/user/send-verification-code") || requestPath.startsWith("/user/reset-password")) {
			chain.doFilter(request, response);
			return;
		}
		
		final String authorizationHeader = request.getHeader("Authorization");
		
		if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			chain.doFilter(request, response);
			return;
		}
		
		String token = authorizationHeader.substring(7);
		String email = jwtUtil.extractEmail(token);
		String role = jwtUtil.extractRole(token);
		
		if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(email);
			
			if(jwtUtil.validateToken(token, email)) {
				List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
				
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
						userDetails, null, authorities
						);
				
				SecurityContextHolder.getContext().setAuthentication(auth);
			}else {
				System.out.print("토큰 검증 실패");
			}
		}
		chain.doFilter(request, response);
	}
} 
