import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json()); 

app.use(cors(
  { origin: "*" }
));

const port = process.env.PORT || 5000;

import generate from "./generate.js"

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "main.jsx"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

app.post("/api/generate", async (req, res) => {
  const { queryDescription } = req.body

  try {
    const sqlQuery = await generate(queryDescription);
    res.json({ sqlQuery });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});