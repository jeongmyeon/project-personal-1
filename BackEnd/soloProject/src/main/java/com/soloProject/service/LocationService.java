package com.soloProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.*;

import com.soloProject.mapper.LocationMapper;
import com.soloProject.model.Location;

@Service
public class LocationService {
	@Autowired
	private LocationMapper locationMapper;
	
	private static final String BASE_URL = "https://apis-navi.kakaomobility.com/v1/directions";
	private static final String API_KEY = "be12212556db734b370976d69f389b08";
	
	public String getRoute(double originLat, double originLng, double destLat, double destLng) {
		RestTemplate restTemplate = new RestTemplate();
		
		String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
				.queryParam("origin", originLng + "," + originLat)
				.queryParam("destination", destLng + "," + destLat)
				.queryParam("priority", "RECOMMEND")
				.queryParam("car_fuel", "GASOLINE")
				.queryParam("car_hipass","false")
				.queryParam("alternatives","false")
				.queryParam("road_details","false")
				.toUriString();
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization","KakaoAK " + API_KEY);
		HttpEntity<String> entity = new HttpEntity<>(headers);
		
		try {
	        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
	        System.out.println("카카오 내비 API 응답: " + response.getBody());
	        return response.getBody();
	    } catch (Exception e) {
	        e.printStackTrace();
	        return "실패!";
	    }
	}
	
	public List<Location> getAllLocation(){
		return locationMapper.selectLocation();
	}
}
