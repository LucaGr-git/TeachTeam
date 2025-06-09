import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;
import petRoutes from "./routes/pet.routes";
import profileRoutes from "./routes/profile.routes";
import courseRoutes from "./routes/course.routes";
import userRoutes from "./routes/user.route";

app.use(cors());
app.use(express.json());
app.use("/api/pet", petRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/user", userRoutes);


AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
