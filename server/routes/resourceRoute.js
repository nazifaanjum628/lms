// routes/resourceRoute.js
import express from "express";
import upload from "../middlewares/upload.js";
import { uploadResources } from "../controller/resourceController.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resourceRouter = express.Router();

resourceRouter.post("/upload", upload.array("files", 10), uploadResources);

// ← Add this download route
resourceRouter.get("/download/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);

    // Check file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Force download for ALL file types including PDF
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.sendFile(filePath);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default resourceRouter;


{/*import express from "express";
import upload from "../middlewares/upload.js";
import { uploadResources } from "../controller/resourceController.js";

const resourceRouter = express.Router();

resourceRouter.post(
  "/upload",
  upload.array("files", 10), // ← multiple files, max 10
  uploadResources
);

export default resourceRouter;*/}