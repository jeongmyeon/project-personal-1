package com.soloProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import com.soloProject.model.Board;
import com.soloProject.model.Market;

public interface MyPageMapper {

	
	@Select("SELECT * FROM market WHERE userId = #{userId}")
	List<Market> selectMyMarket(int userId);
	
	@Select("SELECT b.*, u.userName FROM board b JOIN users u ON b.userId = u.id WHERE b.userId = #{userId}")
	List<Board> selectMyBoard(int userId);
}
