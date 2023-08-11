import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/error.js";

import authRoute from "./routes/auth.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routing middlewares
app.use("/api/auth", authRoute);

// Error handler Middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
