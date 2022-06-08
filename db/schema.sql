DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS platforms;


CREATE TABLE platforms (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    benefits TEXT
);

CREATE TABLE users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    platform_id INTEGER,
    clan_connected BOOLEAN NOT NULL,
    CONSTRAINT fk_platform FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE SET NULL
);