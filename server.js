import dotenv from 'dotenv'
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
    res.send("Your API server is running fine...")
})

app.listen(port, () => {
    console.log(`Server is running fine on port: ${port}`);
});