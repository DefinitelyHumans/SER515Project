--GENERAL NOTES
--Re-arrange tables in order of dependency
--SERIAL implies NOT NULL and INT
--PRIMARY KEY implies NOT NULL

--LESS GENERAL NOTES
--I don't think we need a separate table for tags
--we can enforce post/comment sizes in code, the TEXT type is the most efficient character storage type anyways
--all time on the server will be in UTC epoch time. Timezone stuff can be done in the client

--TO BE DECIDED:
--should the tag arrays be limited in size(maybe a max of 10 tags per post?)
--will user's be allowed to edit their posts?

CREATE TYPE   C_topic_post_type AS ENUM ('text', 'link', 'image');

CREATE TABLE public.users (
	user_id CHAR(32) PRIMARY KEY,
	tag_list VARCHAR(12) [],
	topic_list CHAR(64) [],
	email VARCHAR(254) UNIQUE NOT NULL,
	password_hash VARCHAR(60) NOT NULL
);

CREATE TABLE public.login_tokens (
	user_id CHAR(32) PRIMARY KEY,
	token_id CHAR(32) UNIQUE NOT NULL,
	expiration_time TIMESTAMP WITH TIME ZONE NOT NULL,
	FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

CREATE TABLE public.topics (
	topic_id CHAR(64) PRIMARY KEY,
	topic_title VARCHAR(64),
	topic_time_posted TIMESTAMP WITH TIME ZONE,
 	update_time TIMESTAMP WITH TIME ZONE,
	-- tag_list VARCHAR(12) [],
	topic_type C_topic_post_type,
	topic_content TEXT,
	user_posted CHAR(32),
	FOREIGN KEY (user_posted) REFERENCES public.users(user_id)
);

CREATE TABLE public.comments (
	comment_id CHAR(64) PRIMARY KEY,
	comment_body TEXT,
	user_id CHAR(32),
	FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
