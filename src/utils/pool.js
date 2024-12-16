import pkg from "pg";
const { Pool } = pkg;

const testConfig = {
  user: process.env.PGUSER_TEST,
  host: process.env.PGHOST_TEST,
  database: process.env.PGDATABASE_TEST,
  password: process.env.PGPASSWORD_TEST,
  port: process.env.PGPORT_TEST,
};

const pool =
  process.env.NODE_ENV === "test" ? new Pool(testConfig) : new Pool();

export default pool;
