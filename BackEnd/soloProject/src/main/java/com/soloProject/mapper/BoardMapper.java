package com.soloProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.soloProject.model.Board;


public interface BoardMapper {
	@Select("SELECT b.*, u.userName from board b JOIN users u ON b.userId = u.id")
	List<Board> selectAllBoard();
	
	@Insert("INSERT INTO board (userId,title, content, createdAt)"
			+ "VALUES (#{userId},#{title}, #{content}, NOW())")
	int insertBoard(Board board);
	
	@Select("SELECT b.*, u.userName FROM board b JOIN users u ON b.userId = u.id WHERE b.boardId = #{id}")
	Board findById(int id);
	
	@Delete("DELETE FROM board WHERE boardId = #{id}")
	int deleteBoard(int id);
	
	@Update("UPDATE board SET title = #{title}, content = #{content} WHERE boardId = #{boardId}")
	int updateBoard(Board board);
	
	@Update("UPDATE board SET views = views + 1 WHERE boardId = #{boardId}")
	int incrementViewCount(int id);
	
	

}
