// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("MongoDB Connected"))
//     .catch(err => console.error(err));

// // Define Produce Schema
// const produceSchema = new mongoose.Schema({
//     category: String,
//     productName: String,
//     quantity: Number,
//     unit: String,
//     pricePerUnit: Number,
//     imageUrl: String,
//     description: String
// });

// const Produce = mongoose.model('Produce', produceSchema);

// // Multer Storage for Image Uploads
// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage });

// // POST /api/produce
// app.post('/api/produce', upload.single('image'), async (req, res) => {
//     try {
//         const { category, productName, quantity, unit, pricePerUnit, description } = req.body;
//         const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//         const newProduce = new Produce({ category, productName, quantity, unit, pricePerUnit, imageUrl, description });
//         await newProduce.save();

//         res.status(201).json({ message: 'Produce added successfully', produce: newProduce });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // GET /api/produce
// app.get('/api/produce', async (req, res) => {
//     try {
//         const produceList = await Produce.find();
//         res.json(produceList);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Start Server
// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define Schema
const productSchema = new mongoose.Schema({
  cropType: String,
  cropName: String,
  quantity: String,
  unit: String,
  price: Number,
  imageUrl: String
});

const Product = mongoose.model('Product', productSchema);

// Storage for Image Upload
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
// coments

const upload = multer({ storage });

// 🔹 Get Price API (Fetch predefined price)
app.get('/api/get-price/:cropName', async (req, res) => {
  const prices = { wheat: 50, rice: 40, maize: 60 };
  const cropName = req.params.cropName.toLowerCase();
  const price = prices[cropName] || 100; // Default price
  res.json({ price });
});

// 🔹 Add Product API (Stores product data)
app.post('/api/add-product', upload.single('image'), async (req, res) => {
  const { cropType, cropName, quantity, unit, price } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  const newProduct = new Product({ cropType, cropName, quantity, unit, price, imageUrl });
  await newProduct.save();

  res.json({ message: 'Product added successfully', product: newProduct });
});

// 🔹 Fetch All Products API (Retrieve stored data)
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// tell me about this