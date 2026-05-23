const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

const JWT_SECRET = "your_jwt_secret";



const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userModel.registerUser(name, email, password);
  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400).json({ error: "User registration failed" });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.login(email, password);

    const token = jwt.sign(
      { email: user.email },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    return res.status(200).json({
      message: "Login successful",
      // user: {
      //   id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   createdAt: user.createdAt,
      //   updatedAt: user.updatedAt,
      // },
      token,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.email) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await userModel.getUser(decoded.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

  

module.exports = { registerUser, loginUser, getUserProfile };
