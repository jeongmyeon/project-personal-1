package com.soloProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soloProject.mapper.MyPageMapper;
import com.soloProject.model.Board;
import com.soloProject.model.Market;

@Service
public class MyPageService {

	@Autowired
	private MyPageMapper myPageMapper;
	
	public List<Market> getMyMarket(int userId){
		return myPageMapper.selectMyMarket(userId);
	}
	
	public List<Board> getMyBoard(int userId){
		return myPageMapper.selectMyBoard(userId);
	}
}
