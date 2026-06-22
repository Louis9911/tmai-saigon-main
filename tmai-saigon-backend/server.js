const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const User = require('./models/User');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');

console.log('URI from process.env:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Auto setup admin account like Portfolio
    const adminExists = await User.findOne({ username: 'louis' });
    if (!adminExists) {
      const admin = new User({ 
        username: 'louis', 
        password: process.env.ADMIN_PASSWORD || 'louisan9911' 
      });
      await admin.save();
      console.log('✅ Đã tự động khởi tạo tài khoản Admin: [louis] thành công!');
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'tmai-saigon', allowed_formats: ['jpg', 'png', 'gif'] },
});
const upload = multer({ storage });

const contentSchema = new mongoose.Schema({
  category: { type: String, required: true },
  url: { type: String },
  alt: { type: String },
  description: { type: String },
  link: { type: String },
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Content = mongoose.model('Content', contentSchema);

app.get('/api/content/:category', async (req, res) => {
  try {
    const content = await Content.find({ category: req.params.category });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth Routes
app.post('/api/auth/setup', async (req, res) => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = new User({ username: 'admin', password: process.env.ADMIN_PASSWORD || 'tmai123' });
    await admin.save();
    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_key', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/content', auth, upload.single('image'), async (req, res) => {
  try {
    const { category, alt, description, link, text } = req.body;
    const content = new Content({
      category,
      url: req.file ? req.file.path : undefined,
      alt,
      description,
      link,
      text,
    });
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload content' });
  }
});

app.put('/api/content/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { category, alt, description, link, text } = req.body;
    const updateData = { category, alt, description, link, text };
    if (req.file) updateData.url = req.file.path;
    const content = await Content.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

app.delete('/api/content/:id', auth, async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ error: 'Content not found' });
    if (content.url) {
      const publicId = content.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tmai-saigon/${publicId}`);
    }
    res.json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));