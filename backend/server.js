require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const petsFilePath = path.join(__dirname, 'pets.json');

// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,      // from .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:'us-east-2'
});

const bucketName = 'kuttya1-4cl3-project';

// Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all pets
app.get('/api/pets', (req, res) => {
  fs.readFile(petsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading pets.json' });
    res.json(JSON.parse(data));
  });
});

// POST: Upload image + add pet
app.post('/api/pets/upload', upload.single('image'), (req, res) => {
  try {
    console.log("Incoming request to /api/pets/upload");

    const { name, age, breed } = req.body;
    const file = req.file;

    if (!file) {
      console.error("❌ No file received in request.");
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log("✅ File received:", file.originalname);

    const key = `pets/${Date.now()}-${file.originalname}`;
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read'
    };

    console.log("🚀 Uploading to S3 with params:", uploadParams);

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.error("❌ S3 Upload Failed:", err);
        return res.status(500).json({ error: 'S3 upload failed' });
      }

      console.log("✅ S3 upload successful:", data.Location);

      const newPet = {
        name,
        age,
        breed,
        imageUrl: data.Location
      };

      console.log("📁 Saving pet to local JSON:", newPet);

      fs.readFile(petsFilePath, 'utf8', (err, fileData) => {
        const pets = err ? [] : JSON.parse(fileData);
        pets.push(newPet);

        fs.writeFile(petsFilePath, JSON.stringify(pets, null, 2), (err) => {
          if (err) {
            console.error("❌ Failed to save to pets.json:", err);
            return res.status(500).json({ error: 'Failed to save pet' });
          }

          console.log("✅ Pet saved successfully!");
          res.status(201).json({ message: 'Pet added', pet: newPet });
        });
      });
    });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
