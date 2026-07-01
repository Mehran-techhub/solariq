-- Run this script in MySQL Workbench (connect as root or admin user)
-- File -> Open SQL Script -> Run (lightning icon)

CREATE DATABASE IF NOT EXISTS solariq_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'solariq'@'localhost' IDENTIFIED BY 'SolarIQ_Local_2026!';
CREATE USER IF NOT EXISTS 'solariq'@'127.0.0.1' IDENTIFIED BY 'SolarIQ_Local_2026!';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES
  ON solariq_db.* TO 'solariq'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES
  ON solariq_db.* TO 'solariq'@'127.0.0.1';

FLUSH PRIVILEGES;

USE solariq_db;
SELECT 'SolarIQ database ready' AS status;
