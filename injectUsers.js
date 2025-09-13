import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/UserModel.js";
import { readFile } from "fs/promises";
try {
  mongoose.connect(process.env.MONGO_URL);
  const user = await User.findById("662622202339626190000000");
  const jsonUsers = JSON.parse(
    await readFile(new URL("./utils/mockUsers.json", import.meta.url))
  );
  const users = jsonUsers.map((user) => {
    return {
      ...user,
    };
  });
  await User.create(users);
  console.log("users created");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
