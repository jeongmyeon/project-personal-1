package com.soloProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.soloProject.model.Market;

public interface MarketMapper {

	@Select("SELECT m.*, u.userName from market m JOIN users u ON m.userId = u.id")
	List<Market> selectAllMarket();
	
	@Insert("INSERT INTO market (userId, title, content, price, createdAt,image)"
			+ "VALUES (#{userId}, #{title},#{content},#{price},NOW(), #{image})")
	int insertMarket(Market market);
	
	@Update("UPDATE market SET views = views + 1 WHERE marketId = #{marketId}")
	int incrementViewCount(int id);
	
	@Select("SELECT m.*, u.userName FROM market m JOIN users u ON m.userId = u.id WHERE m.marketId = #{id}")
	Market findById(int id);
	
	@Delete("DELETE FROM market WHERE marketId = #{id}")
	int deleteMarket(int id);
	
	@Update("UPDATE market SET title = #{title}, content = #{content}, price = #{price}, image = #{image} WHERE marketId = #{marketId}")
	int updateMarket(Market market);
	
	@Select("SELECT marketId FROM market_favorites WHERE userId = #{userId}")
	List<Long> getFavoriteMarketIds(@Param("userId") int userId);
	
	@Select({
	    "<script>",
	    "SELECT * FROM market WHERE marketId IN",
	    "<foreach item='id' collection='list' open='(' separator=',' close=')'>",
	    "#{id}",
	    "</foreach>",
	    "</script>"
	})
	List<Market> getMarketsByIds(@Param("list") List<Long> marketIds);

    @Insert("INSERT INTO market_favorites(userId, marketId) VALUES(#{userId}, #{marketId})")
    void addFavorite(@Param("userId") int userId, @Param("marketId") long marketId);

    @Delete("DELETE FROM market_favorites WHERE userId = #{userId} AND marketId = #{marketId}")
    void removeFavorite(@Param("userId") int userId, @Param("marketId") long marketId);
    
    @Select("SELECT m.*, u.userName FROM market m JOIN users u ON m.userId = u.id ORDER BY m.createdAt DESC LIMIT #{limit}")
    List<Market> findLatestMarket(@Param("limit") int limit);
}
