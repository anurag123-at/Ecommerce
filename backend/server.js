import express from 'express';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import session from 'express-session';

dotenv.config(); // Load environment variables
connectDB();     // Connect to MongoDB

const app = express();

// To get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// CORS (allow frontend access)
app.use(cors({
  origin: 'https://ecommerce-psi-lyart-27.vercel.app',
  credentials: true
}));


// Parse incoming JSON
app.use(express.json());

// ✅ Session middleware must be before route handlers
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'defaultSecretKey',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     // secure: false, // set to true if using HTTPS
//     secure: true, // Use true if your site is served over HTTPS
//     maxAge: 1000 * 60 * 60 * 24 // 1 day
//   }
// }));

app.set('trust proxy', 1); // 🛡️ Trust proxy when behind Render's load balancer

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',     // 👈 required for cross-origin
    secure: true,         // 👈 required for HTTPS (Vercel + Render are HTTPS)
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ✅ Routes (after session is set up)
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});




