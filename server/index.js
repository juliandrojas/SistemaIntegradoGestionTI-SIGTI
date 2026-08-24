import cors from "cors";
import express from "express";
import indexRoutes from "./routes/index.routes.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/", indexRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SERVIDOR CORRIENDO EN: http://localhost:${PORT}`);
});