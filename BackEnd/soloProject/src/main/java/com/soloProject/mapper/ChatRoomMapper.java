package com.soloProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.soloProject.model.ChatRoom;

public interface ChatRoomMapper {

	@Select("SELECT * FROM chatRooms WHERE buyerId = #{buyerId} AND sellerId = #{sellerId} AND "
			+ "marketId = #{marketId}")
	ChatRoom findByChat(@Param("buyerId") Long buyerId, @Param("sellerId") Long sellerId,
						@Param("marketId") Long marketId);
	
	@Insert("INSERT INTO chatRooms (buyerId, sellerId, marketId) VALUES "
			+ "(#{buyerId}, #{sellerId}, #{marketId})")
	@Options(useGeneratedKeys = true, keyProperty = "id")
	void insertchatRoom(ChatRoom chatRoom);
	
	@Select("""
	        SELECT
	          cr.id AS roomId,
	          u.userName AS opponentName,
	          cr.lastMessage AS lastMessage,
	          cr.updatedAt AS updatedAt
	        FROM chatRooms cr
	        JOIN users u ON (
	          CASE
	            WHEN cr.buyerId = #{userId} THEN cr.sellerId = u.id
	            WHEN cr.sellerId = #{userId} THEN cr.buyerId = u.id
	          END
	        )
	        WHERE cr.buyerId = #{userId} OR cr.sellerId = #{userId}
	        ORDER BY cr.updatedAt ASC
	        """)
	    List<ChatRoom> getMyChatRoom(@Param("userId") Long userId);
	
	@Update("UPDATE chatRooms SET lastMessage = #{message}, updatedAt = NOW() WHERE id = #{roomId}")
	void updateLastMessage(@Param("roomId") Long roomId, @Param("message") String message);
}
