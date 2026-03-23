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

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
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

app.post('/api/content', upload.single('image'), async (req, res) => {
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

app.put('/api/content/:id', upload.single('image'), async (req, res) => {
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

app.delete('/api/content/:id', async (req, res) => {
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