package com.soloProject.mapper;

import org.apache.ibatis.annotations.Insert; 
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.soloProject.model.User;

public interface UserMapper {
	
	@Select("SELECT email FROM users WHERE userName = #{name} AND phoneNumber = #{phoneNumber}")
	String findEmailByNameAndPhone(@Param("name") String userName, @Param("phoneNumber")String phoneNumber);
	
	@Select("SELECT * FROM users WHERE email = #{email}")
    User findByEmail(String email);
	
	@Select("SELECT code FROM verification_codes WHERE email = #{email} ORDER BY created_at DESC LIMIT 1")
    String getVerificationCode(@Param("email") String email);
	
	@Select("SELECT COUNT(*) FROM users WHERE email = #{email}")
    int checkEmailExists(@Param("email") String email);
	
	@Select("SELECT COUNT(*) FROM users WHERE REPLACE(phoneNumber, '-', '') = REPLACE(#{phoneNumber}, '-', '')")
    int countByPhoneNumber(String phoneNumber);
	
	@Insert("INSERT INTO users (email, password, userName, phoneNumber, role, is_verified, created_at) " +
            "VALUES (#{email}, #{password}, #{userName}, #{phoneNumber}, #{role}, #{isVerified}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void registerUser(User user);
	
	@Insert("INSERT INTO verification_codes (email, code, created_at) " +
            "VALUES (#{email}, #{code}, NOW()) " +
            "ON DUPLICATE KEY UPDATE code = VALUES(code), created_at = NOW()")
    void saveVerificationCode(@Param("email") String email, @Param("code") String code);
	
	@Update("UPDATE verification_codes SET code = #{code}, created_at = NOW() WHERE email = #{email}")
	int updateVerificationCode(@Param("email") String email, @Param("code") String code);
	
	 @Select("SELECT password FROM users WHERE email = #{email}")
	    String getHashedPasswordByEmail(@Param("email") String email);
	 
	 @Select("SELECT id, email, password, userName, phoneNumber, role, is_verified, created_at FROM users WHERE email = #{email}")
	    User getUserByEmail(@Param("email") String email);
	 
	 @Update("UPDATE users SET password = #{password} WHERE email = #{email}")
	 void updatePassword(@Param("email") String email, @Param("password") String password);
	 
	 @Select("SELECT COUNT(*) FROM users WHERE email = #{email} AND phoneNumber = #{phoneNumber}")
	 int countUserByEmailAndPhone(@Param("email") String email, @Param("phoneNumber") String phoneNumber);
}
