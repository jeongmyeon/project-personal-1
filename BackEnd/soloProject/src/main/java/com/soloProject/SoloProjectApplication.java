package com.soloProject;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.soloProject.mapper")
public class SoloProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoloProjectApplication.class, args);
	}

}
