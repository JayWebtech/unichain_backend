// Create a direct-migration.js file in your project root
const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "certiva",
  // Direct reference to your migration file by name
  migrations: ["./src/migrations/1745923899116-CreateVerificationLogs.ts"],
  synchronize: false,
});

// Initialize the data source
AppDataSource.initialize()
  .then(async () => {
    console.log("Running migrations...");
    await AppDataSource.runMigrations();
    console.log("Migrations completed successfully");
    await AppDataSource.destroy();
  })
  .catch((error) => {
    console.error("Error during migrations:", error);
    process.exit(1);
  });