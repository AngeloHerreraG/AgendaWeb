import dotenv from "dotenv";
dotenv.config();
import app from "./app";

// Extend Express Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";

app.listen(Number(PORT), HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});