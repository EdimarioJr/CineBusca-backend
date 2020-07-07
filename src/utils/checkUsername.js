import User from "../db/Model/User"
import { response } from "express";

const checkUsername = async (name) => {
  const search = new RegExp(name, "i");
  // Checking if the name already exists on the DB, case insensitive search
  const usernameExists = await User.findOne({ name: search })
  return usernameExists;
};

export default checkUsername;