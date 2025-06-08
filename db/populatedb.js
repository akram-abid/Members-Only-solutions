#! /usr/bin/env node
const { Client } = require("pg");

async function createDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL + "?sslmode=require",
  });
  
  try {
    await client.connect();
    
    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'onlymembers'"
    );
    
    if (result.rows.length === 0) {
      console.log("Creating database onlymembers...");
      await client.query("CREATE DATABASE onlymembers");
      console.log("Database created successfully");
    } else {
      console.log("Database onlymembers already exists");
    }
    
    await client.end();
  } catch (error) {
    console.error("Error creating database:", error);
    await client.end();
    throw error;
  }
}

// Your existing seeding function
async function seedDatabase() {
  const SQL = `
CREATE TABLE public.members (
    username  VARCHAR(30) NOT NULL,
    firstname VARCHAR(30),
    lastname  VARCHAR(30),
    password  TEXT
);


CREATE TABLE public.posts (
    post_id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username  VARCHAR(20),
    firstname VARCHAR(20),
    lastname  VARCHAR(20),
    title     TEXT,
    content   TEXT,
    CONSTRAINT posts_username_fkey FOREIGN KEY (username) REFERENCES public.members(username)
);

CREATE TABLE public.sessions (
    sid     VARCHAR NOT NULL,
    sess    JSON NOT NULL,
    expire  TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (sid)
);

CREATE INDEX IDX_sessions_expire ON public.sessions(expire);`

  console.log("Creating tables and seeding data...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL + "?sslmode=require",
  })
  
  try {
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    await client.end();
    throw error;
  }
}

async function main() {
  try {
    await createDatabase();
    await seedDatabase();
    console.log("Setup complete!");
  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
}

main();

