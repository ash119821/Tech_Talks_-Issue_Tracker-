import express from "express";
import { createLog, getLogs } from "../controllers/logController.js";

export default function logRoutes(io) {
  const router = express.Router();

  router.post("/", (req, res) => createLog(req, res, io));
  router.get("/", getLogs);

  return router;
}
