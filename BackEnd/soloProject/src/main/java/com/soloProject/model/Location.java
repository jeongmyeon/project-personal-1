package com.soloProject.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
	private Long id;
	private String name;
	private Double latitude;
	private Double longitude;
	private String description;
}
