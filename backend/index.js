import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bodyParser from 'body-parser';
import ownerRoutes from './routes/ownerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import db from './db.js';





// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.json()); // to parse JSON bodies


app.use(cors({
  origin: 'http://localhost:5173',
}));


// whitelisting all domains
// app.use(cors());   



// Correctly resolve __dirname with import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Middleware to serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));






//----------------------ROUTES--------------------
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/owner", ownerRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);





app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



















