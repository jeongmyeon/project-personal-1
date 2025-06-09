package com.soloProject.config;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.soloProject.model.User;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CustomUserDetails implements UserDetails {
	
	private final User user;
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities(){
		return Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));
	}
	
	@Override
	public String getPassword() {
		return user.getPassword();
	}
	
	@Override
	public String getUsername() {
		return user.getEmail();
	}
	
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	
	@Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getIsVerified(); 
    }

    public Long getId() {
        return user.getId();
    }

    public String getName() {
        return user.getUserName();
    }

    public String getRole() {
        return user.getRole();
    }
    

    public User getUser() {
        return user;
    }
}
