// import express from 'express';
// import api from './routes/index.js';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cors from 'cors';

// // Load environment variables
// dotenv.config();

// // Set up MongoDB
// mongoose.connect("mongodb+srv://yazhinidhanapal7:Yazhini24@sprint-board-creation.jwybe.mongodb.net/", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log('Connected to MongoDB'))
//   .catch((error) => console.error('MongoDB connection error:', error));

// // Set up Express
// const app = express();
// app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Use API routes
// app.use('/api', api);

// // Start server
// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
import express from 'express';
import api from './routes/index.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Set up MongoDB connection
mongoose.connect(process.env.MONGODB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Set up Express
const app = express();

// CORS configuration
app.use(cors({ 
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', 
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API routes
app.use('/api', api);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
