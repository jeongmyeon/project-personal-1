package com.soloProject.service;

import org.springframework.security.core.userdetails.UserDetails; 
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.soloProject.config.CustomUserDetails;
import com.soloProject.mapper.UserMapper;
import com.soloProject.model.User;

@Service
public class CustomUserDetailsService implements UserDetailsService{
	
	private final UserMapper userMapper;
	
	public CustomUserDetailsService(UserMapper userMapper) {
		this.userMapper = userMapper;
	}
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
		User user = userMapper.findByEmail(email);
		
		if(user == null) {
			throw new UsernameNotFoundException("User not found with email : " + email);
		}
		
		return new CustomUserDetails(user);
	}
}
