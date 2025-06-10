package com.soloProject.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soloProject.model.Location;
import com.soloProject.service.LocationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/location")
@CrossOrigin(origins = "http://local:5173")
@RequiredArgsConstructor
public class LocationController {
	
	private final LocationService locationService;
	
	@GetMapping("/get")
	public List<Location> getLocation(){
		return locationService.getAllLocation();
	}
	
	@GetMapping("/route")
	public ResponseEntity<String> getRoute(@RequestParam String start, @RequestParam String end) {
		String[] startArr = start.split(",");
		String[] endArr = end.split(",");
		double startLat = Double.parseDouble(startArr[0]);
		double startLng = Double.parseDouble(startArr[1]);
		double endLat = Double.parseDouble(endArr[0]);
		double endLng = Double.parseDouble(endArr[1]);
		
		String routeJson = locationService.getRoute(startLat, startLng, endLat, endLng);
		return ResponseEntity.ok(routeJson);
	}
			
}
