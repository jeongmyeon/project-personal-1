package com.soloProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.soloProject.model.ChatMessage;
import com.soloProject.model.ChatRoom;

public interface ChatMapper {
	
	@Insert("INSERT INTO chatMessage (roomId, senderId, senderName, message, receiverId, createdAt)"
			+ "VALUES (#{roomId}, #{senderId}, #{senderName},#{message},#{receiverId},#{createdAt})")
	void insertMessage(ChatMessage chatMessage);
	
	
	
	@Select("SELECT * FROM chatMessage WHERE roomId = #{roomId} ORDER BY createdAt ASC")
	List<ChatMessage> selectMessagesByRoomId(String roomId);
	
	
}
