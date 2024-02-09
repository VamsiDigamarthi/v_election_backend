import mysql from "mysql";
import "dotenv/config";
export const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST_NAME,
  user: process.env.MYSQL_USER_NAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
});
