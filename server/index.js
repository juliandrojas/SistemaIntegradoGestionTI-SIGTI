import cors from "cors";
import express from "express";
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SERVIDOR CORRIENDO EN: http://localhost:${PORT}`);
});