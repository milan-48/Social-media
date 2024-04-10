import fs from "fs";
import dotenv from "dotenv";

export default function setupEnv() {
  return new Promise((resolve, reject) => {
    try {
      if (process.env.NODE_ENV === "production") {
        const envConfig = dotenv.parse(fs.readFileSync(".env.production"));

        for (let k in envConfig) {
          process.env[k] = envConfig[k];
        }
      } else {
        const envConfig = dotenv.parse(fs.readFileSync(".env.development"));

        for (let k in envConfig) {
          process.env[k] = envConfig[k];
        }
      }
      resolve();
    } catch (error) {
      console.log("Error in setup env variables", error);
      reject();
    }
  });
}
