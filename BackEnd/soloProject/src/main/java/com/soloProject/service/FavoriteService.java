package com.soloProject.service;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soloProject.mapper.MarketMapper;
import com.soloProject.model.Market;

@Service
public class FavoriteService {
	
	@Autowired
	private MarketMapper marketMapper;

	public List<Long> getFavoriteMarketIds(Integer userId) {
	    return marketMapper.getFavoriteMarketIds(userId);
	}
	
	public List<Market> getMarketsById(List<Long> marketId){
		if(marketId == null || marketId.isEmpty()) {
			return Collections.emptyList();
		}
		return marketMapper.getMarketsByIds(marketId);
	}
	
	public void addFavorite(Integer userId, Long marketId) {
		marketMapper.addFavorite(userId,marketId);
	}
	
	public void removeFavorite(Integer userId, Long marketId) {
		marketMapper.removeFavorite(userId, marketId);
	}
}
