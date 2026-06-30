const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        role: user.role
    };
}

async function register(req, res, next) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash });
        const token = createToken(user._id);

        return res.status(201).json({ token, user: publicUser(user) });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const passwordOk = await bcrypt.compare(password, user.passwordHash);
        if (!passwordOk) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = createToken(user._id);
        return res.json({ token, user: publicUser(user) });
    } catch (error) {
        next(error);
    }
}

async function me(req, res) {
    return res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, me };
