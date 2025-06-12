package com.soloProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.soloProject.model.Review;

public interface ReviewMapper {

	@Select("SELECT r.*, u.userName FROM review r JOIN users u ON r.userId = u.id  WHERE r.boardId = #{boardId} ORDER BY r.createdAt DESC")
	List<Review> getAllReview(@Param("boardId") int boardId);
	
	@Select("SELECT * FROM review WHERE reviewId = #{reviewId}")
	Review findById(int reviewId);
	
	@Delete("DELETE FROM review WHERE reviewId = #{reviewId}")
	void delete(int reviewId);
	
	@Insert("INSERT INTO review (userId, boardId, reviewText) " +
	        "VALUES (#{userId}, #{boardId}, #{reviewText})")
	void save(Review review);
	
	@Update("UPDATE review SET reviewText = #{reviewText} WHERE reviewId = #{reviewId}")
	void updateReview(@Param("reviewId") int reviewId, @Param("reviewText") String reviewText);
	

}
