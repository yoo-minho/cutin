import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: [
    {
      emit: "stdout",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});
prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

export default prisma;
