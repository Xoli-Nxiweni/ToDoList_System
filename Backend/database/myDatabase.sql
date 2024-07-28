CREATE TABLE credentials(
username TEXT NOT NULL,
password TEXT NOT NULL
);



CREATE TABLE Tasks(
    taskID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    task VARCHAR(50) NOT NULL,
    taskDate DATE
);


SELECT * from Tasks