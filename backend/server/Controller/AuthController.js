const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists", success: false });
    }

    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email", success: false });
    }

    if (!user.password || typeof user.password !== "string") {
      return res.json({ message: "Incorrect password or email", success: false });
    }

    const isBcryptHash =
      user.password.startsWith("$2a$") ||
      user.password.startsWith("$2b$") ||
      user.password.startsWith("$2y$");

    const auth = isBcryptHash
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!auth) {
      return res.json({ message: "Incorrect password or email", success: false });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
