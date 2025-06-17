create database soloproject;

use soloproject;

select * from chatrooms;
drop table market;
drop table chatRooms;
CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
	userName VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
	phoneNumber VARCHAR(20) DEFAULT NULL,
	is_Verified TINYINT(1) DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE board(
	boardId INT AUTO_INCREMENT PRIMARY KEY,
	userId INT,
	title VARCHAR(255) NOT NULL,
	content TEXT NOT NULL,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	views INT DEFAULT 0,
	likes INT DEFAULT 0,
	FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    description TEXT
);

INSERT INTO locations (name, latitude, longitude, description) VALUES
('더클라임 서울점', 37.574053, 126.970637, '서울 중구 명동 인근'),
('더클라임 강남점', 37.497942, 127.027621, '강남역 인근'),
('더클라임 홍대점', 37.557292, 126.924678, '홍대입구역 인근'),
('서울숲 클라이밍', 37.544944, 127.037418, '서울숲 공원 내 클라이밍 시설'),
('볼더링코리아 강남점', 37.507800, 127.032900, '강남역 인근 볼더링 전문 암장'),
('더클라이밍 이태원점', 37.534100, 126.994900, '이태원 근처 클라이밍장'),
('클라이밍센터 청담점', 37.523100, 127.055400, '청담동 인근 클라이밍센터'),
('더클라임 일산점', 37.657716, 126.772540, '일산 킨텍스 인근'),
('더클라임 부산점', 35.179554, 129.075642, '부산 광복동 인근'),
('더클라임 대구점', 35.871435, 128.601445, '대구 동성로 인근'),
('더클라임 대전점', 36.350412, 127.384548, '대전 둔산동 인근'),
('더클라임 수원점', 37.263573, 127.028601, '수원역 인근'),
('더클라임 광주점', 35.159545, 126.852601, '광주 충장로 인근'),
('더클라임 인천점', 37.456255, 126.705206, '인천 부평역 인근');


CREATE TABLE review(
	reviewId INT AUTO_INCREMENT PRIMARY KEY,
	boardId INT,
	userId INT,
    marketId INT,
	reviewText TEXT,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (boardId) REFERENCES board(boardId) ON DELETE CASCADE,
    FOREIGN KEY (marketId) REFERENCES market(marketId) ON DELETE CASCADE
);

CREATE TABLE market(
		 marketId INT AUTO_INCREMENT PRIMARY KEY,
		 userId INT,
		 title VARCHAR(255) NOT NULL,
		 content TEXT NOT NULL,
		 createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		 updateAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		 views INT DEFAULT 0,
         image VARCHAR(255),
         price VARCHAR(50),
		 favorite INT DEFAULT 0,
		 FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chatRooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    buyerId BIGINT NOT NULL,
    sellerId BIGINT NOT NULL,
    marketId BIGINT NOT NULL,
    lastMessage VARCHAR(255),
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatMessage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roomId VARCHAR(255),
    senderId BIGINT,
    senderName VARCHAR(255),
    message TEXT,
    receiverId BIGINT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
		 