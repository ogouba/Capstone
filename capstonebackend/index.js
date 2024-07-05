const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var cors = require('cors')
const express = require('express')
const bcrypt = require('bcrypt')
const saltRounds = 14;
const app = express()
const session = require('express-session')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const PORT = 3000
require('dotenv').config()

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"], credentials: true }));


app.use(express.json())

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        ),
        cookie: {
            httpOnly: false,
            sameSite: false,
            secure: false,
            maxAge: 3600000,
        },
    })
);

const { handler } = require("./upload")

const { getJson } = require("serpapi");
app.get("/getVideos", async (req, res) => {
    try {
        const result = await getJson({
            engine: "google_videos",
            q: "Dance videos",
            google_domain: "google.com",
            api_key: process.env.API_KEY,
        })
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }

});

app.get("/posts", async (req, res) => {
    try {
        console.log(req.session.user)
        res.status(200)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
});
app.post('/posts', async (req, res) => {
    console.log(req.session.user);
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Retrieve the current user from the session
        const currentUser = req.session.user;

        // Create the post with the current user ID
        const post = await Post.create({
            ...req.body,
            userId: currentUser.id
        });

        const postWithUser = await Post.findOne({
            where: { id: post.id },
            include: [{ model: User, as: 'user' }]
        });

        res.status(201).json(postWithUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/create", async (req, res) => {
    const { email, password, username } = req.body;
    console.log(password)
    bcrypt.hash(password, saltRounds, async function (err, hashed) {
        try {
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    hashedPassword: hashed
                }
            });
            // Set the user in the session
            req.session.user = newUser;
            res.status(200).json({ user: newUser });
        } catch (e) {
            console.log(e);
            res.status(500).json({ "error": e.message });
        }
    });
})
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // console.log(user.password)

        // Compare the password
        const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Set the user in the session
        req.session.user = user;
        await req.session.save();
        console.log(req.session)

        // Return the user data in the response
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})
app.get("/getUser", async (req, res) => {
    if (!req.session.user) {
        return res.json({
            isLoggedIn: true,
            user: null
        });
    }

    return res.json({
        isLoggedIn: true,
        user: {
            id: req.session.id,
            email: req.session.user.email,
            username: req.session.user.username
        }
    });
})


app.post("/upload-video", handler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

//{*able to zoom into the video from a specific point in which they double click while they are viewing the videos. They can make comments while viewing the video in a specific state and other users would be able to see the timestamp of the part they were viewing as that when they make the comments, and what state they are in }