import express from "express";
import cors from "cors";
import router from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import openapiSpec from "./docs/openapi.js";
import fs from 'fs';
import swaggerUiDist from 'swagger-ui-dist';

const app = express();

const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();

const swaggerHtml = fs.readFileSync(
  new URL('./docs/index.html', import.meta.url),
  "utf-8"
)

app.use(
  cors({
    origin: [
      "http://localhost:5188",
      "https://fluxa.bond",
      "https://www.fluxa.bond",
      "https://docs.fluxa.bond",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());


// Swagger Documentation 
app.get('/', (req, res, next) => {
  if(req.hostname !== 'docs.fluxa.bond'){
    return next();
  }

  res.type('html').send(swaggerHtml);
});


app.get('/openapi.json', (req, res) => {
  if(req.hostname !== 'docs.fluxa.bond'){
    return next();
  }
  res.json(openapiSpec);
})

app.use((req, res, next) => {
  if(req.hostname === "docs.fluxa.bond") {
    return next();
  }

  express.static(swaggerUiPath)(req, res, next);
});

// API
app.get('/', (req, res, next) => {
  if(req.hostname !== "api.fluxa.bond"){
    return next();
  }

  res.send("Your API server is running fine...")
})
app.use("/", router);

export default app;
