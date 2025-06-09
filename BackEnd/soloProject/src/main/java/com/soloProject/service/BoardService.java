package com.soloProject.service;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soloProject.mapper.BoardMapper;
import com.soloProject.model.Board;


@Service
public class BoardService {
	@Autowired
	private BoardMapper boardMapper;
	
	public List<Board> getAllBoards(){
		return boardMapper.selectAllBoard();
	}
	
	public boolean writeBoard(Board board) {
		int result = boardMapper.insertBoard(board);
		System.out.println("insert result = " + result);
		return result == 1;
	}
	
	public Board getBoardById(int id) {
		boardMapper.incrementViewCount(id);
		return boardMapper.findById(id);
	}
	
	public boolean deleteBoard(int id) {
	    int result = boardMapper.deleteBoard(id);
	    return result == 1;
	}

	
	public boolean updateBoard(Board board) {
	    int result = boardMapper.updateBoard(board);
	    return result == 1;
	}
}
