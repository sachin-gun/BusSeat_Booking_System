const User = require('..//model//userModel');

// Register a user
const registerUser = async(req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    try {
        await user.save();
        res.status(201).send('User created');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login a user
const loginUser = async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
};

// Get all users
const getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
};