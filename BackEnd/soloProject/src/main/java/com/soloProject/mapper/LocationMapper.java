package com.soloProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import com.soloProject.model.Location;

public interface LocationMapper {

	@Select("SELECT * FROM locations")
	List<Location> selectLocation();
}
