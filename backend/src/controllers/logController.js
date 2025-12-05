import Log from "../models/logModel.js";
import { validateLogInput } from "../validators/logValidator.js";

export const createLog = async (req, res, io) => {
  try {
    const { isValid, errors } = validateLogInput(req.body);
    if (!isValid) return res.status(400).json({ errors });

    const log = await Log.create(req.body);

    // Emit event to all connected clients (OPTION D)
    io.emit("log:new", log);

    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create log" });
  }
};

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};