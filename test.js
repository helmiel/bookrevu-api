import crypto from "crypto";

const key = crypto.randomBytes(32).toString("hex");
console.log(`ACCESS_TOKEN_KEY=${key}`);
