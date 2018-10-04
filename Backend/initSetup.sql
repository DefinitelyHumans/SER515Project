CREATE TABLE topics (
	topic_id SERIAL NOT NULL PRIMARY KEY,
	topic_name VARCHAR(20),
	topic_time_posted TIMESTAMP WITH TIME ZONE,
	update_time TIMESTAMP WITH TIME ZONE,
	topic_type VARCHAR(5),
	topic_content VARCHAR(250),
	user_fk VARCHAR(255),
	FOREIGN KEY (user_fk) REFERENCES users(user_id)
);

CREATE TABLE tokens (
	token_id SERIAL NOT NULL PRIMARY KEY,
	expiration_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users (
	user_id VARCHAR(255) NOT NULL PRIMARY KEY,
	tag_list TEXT [],
	topic_list TEXT [],
	email VARCHAR(254) NOT NULL,
	password_hash VARCHAR(60) NOT NULL,
	token_fk INTEGER,
	FOREIGN KEY (token_fk) REFERENCES tokens(token_id)
);

CREATE TABLE tags (
	tag_id INT NOT NULL SERIAL PRIMARY KEY,
	tag_name VARCHAR(15),
);

CREATE TABLE comments (
	comment_id INT NOT NULL SERIAL PRIMARY KEY,
	comment_body VARCHAR(150),
	user_fk VARCHAR(255),
	FOREIGN KEY (user_id_fk) REFERENCES users(user_id)
);
