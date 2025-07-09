package com.soloProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soloProject.mapper.MarketMapper;
import com.soloProject.model.Market;

@Service
public class MarketService {
	@Autowired
	private MarketMapper marketMapper;
	
	public List<Market> getAllMarket(){
		return marketMapper.selectAllMarket();
	}
	
	@Transactional
	public Market getMarketById(int id) {
		marketMapper.incrementViewCount(id);
		return marketMapper.findById(id);
	}
	
	@Transactional(rollbackFor = Exception.class)
	public boolean addMarket(Market market) {
		int result = marketMapper.insertMarket(market);
		return result == 1;
	}
	
	@Transactional(rollbackFor = Exception.class)
	public boolean deleteMarket(int id) {
		int result = marketMapper.deleteMarket(id);
		return result == 1;
	}
	
	@Transactional(rollbackFor = Exception.class)
	public boolean updatedMarket(Market market) {
		int result = marketMapper.updateMarket(market);
		return result == 1;
	}
	
	public List<Market> getLatestMartkets(int limit){
		return marketMapper.findLatestMarket(limit);
	}
}
