package com.soloProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soloProject.mapper.ReviewMapper;
import com.soloProject.model.Review;

@Service
public class ReviewService {
	@Autowired
	private ReviewMapper reviewMapper;
	
	public List<Review> getReviews(int boardId){
		return reviewMapper.getAllReview(boardId);
	}
	
	public boolean addReview(Review review) {
		try {
			reviewMapper.save(review);
			return true;
		}catch(Exception e) {
			return false;
		}
	}
	
	public void deleteReview(int reviewId, int userId) {
		Review review = reviewMapper.findById(reviewId);
		if(review == null) {
			throw new RuntimeException("리뷰를 찾을 수 없습니다.");
		}
		if(review.getUserId() != userId) {
			throw new RuntimeException("삭제 권한이 없습니다.");
		}
		reviewMapper.delete(reviewId);
	}
	
	public boolean updateReview(int reviewId, int userId, String newText) {
		Review existing = reviewMapper.findById(reviewId);
		if(existing == null || existing.getUserId() != userId) return false;
		
		existing.setReviewText(newText);
		reviewMapper.updateReview(reviewId,newText);
		return true;
	}
}
