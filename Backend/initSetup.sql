CREATE TABLE topic (
	topic_id NOT NULL SERIAL PRIMARY KEY,
	topic_name VARCHAR(20),
	topic_time_posted TIME,
	update_time TIME,
	topic_type VARCHAR(5),
	topic_content VARCHAR(250),
	FOREIGN KEY (user_id_fk) REFERENCES userdata(user_id)
);

CREATE TABLE token (
	token_id INT NOT NULL SERIAL PRIMARY KEY,
	expiration_time DATE
);

CREATE TABLE userdata (
	user_id VARCHAR(255) NOT NULL SERIAL PRIMARY KEY,
	tag_list TEXT [],
	topic_list TEXT [],
	user_email VARCHAR(254),
	password_hash VARCHAR(60),
	FOREIGN KEY (token_id_fk) REFERENCES token(token_id)
);

CREATE TABLE tag (
	tag_id INT NOT NULL SERIAL PRIMARY KEY,
	tag_name VARCHAR(15),
);

CREATE TABLE commentdata (
	comment_id INT NOT NULL SERIAL PRIMARY KEY,
	comment_content VARCHAR(150),
	FOREIGN KEY (user_id_fk) REFERENCES userdata(user_id)
);
