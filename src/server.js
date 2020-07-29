import express from "express";
import cors from "cors";
import routes from "./routes";
import connection from "./db/config/connection";

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

connection();

app.listen(process.env.PORT || 3000);
