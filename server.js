const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ===== Models =====
const Agent = require('./models/Agent');
const Customer = require('./models/Customer');
const Booking = require('./models/Booking');

// ===== Multer setup =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ===== Customer Signup =====
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await Customer.findOne({ email });
    if (existing) return res.json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new Customer({
      email,
      password: hashed
    });

    await newUser.save();

    res.json({ message: "Account created" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error" });
  }
});

// ===== Customer Login =====
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Customer.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.json({ message: "Wrong password" });

    res.json({ message: "Logged in" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error" });
  }
});

// ===== Agent Registration =====
app.post('/registerAgent',
  upload.fields([{ name: 'profilePic' }, { name: 'kitPic' }]),
  async (req, res) => {
    try {
      const { name, email, password, address, service, experience, purpleStar } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      const agent = new Agent({
        name,
        email,
        password: hashed,
        address,
        service,
        experience,
        profilePic: req.files['profilePic'][0].path,
        kitPic: req.files['kitPic'][0].path,
        purpleStar: purpleStar === "true",
        status: 'verified' // for testing
      });

      await agent.save();

      res.json({ message: "Agent submitted" });

    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error" });
    }
  }
);

// ===== GET AGENTS =====
app.get('/agents', async (req, res) => {
  try {
    const service = req.query.service;

    let agents;

    if (service) {
      agents = await Agent.find({ service });
    } else {
      agents = await Agent.find({ status: 'verified' });
    }

    res.json(agents);

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error" });
  }
});

// ===== ADD AGENT (TESTING) =====
app.post('/add-agent', async (req, res) => {
  try {
    console.log(req.body);

    const agent = new Agent({
      name: req.body.name,
      service: req.body.service,
      experience: req.body.experience,
      price: req.body.price,
      status: "verified"
    });

    await agent.save();

    res.json({ message: "Agent added" });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error" });
  }
});

// ===== BOOKING =====
app.post('/book', async (req, res) => {
  try {
    const { agentId, price, location } = req.body;

    const booking = new Booking({
      agent: agentId,
      price,
      location
    });

    await booking.save();

    res.json({ message: "Booking confirmed" });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error" });
  }
});

// ===== ROOT =====
app.get('/', (req, res) => {
  res.send("FixMe backend is running 🚀");
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
