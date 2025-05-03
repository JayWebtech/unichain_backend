// This file should be in your project root
const { DataSource } = require("typeorm");
require("dotenv").config();
const path = require("path");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "certiva",
  entities: [
    path.join(__dirname, "src", "entities", "*.entity.{ts,js}"),
    path.join(__dirname, "dist", "entities", "*.entity.js")
  ],
  migrations: [
    path.join(__dirname, "src", "migrations", "*.ts"),
    path.join(__dirname, "dist", "migrations", "*.js")
  ],
  synchronize: false,
});

module.exports = AppDataSource;