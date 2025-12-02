USE itelfinals;

CREATE TABLE participant (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  email varchar(50) NOT NULL,
  age TINYINT UNSIGNED NOT NULL,
  program varchar(100) NOT NULL,
  total_score INT DEFAULT 0, -- points earned for this answer, JS will handle incrementing
  PRIMARY KEY (id)
);
