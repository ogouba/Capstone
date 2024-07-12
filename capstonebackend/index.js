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
                checkPeriod: 60 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        ),
        cookie: {
            httpOnly: false,
            sameSite: false,
            secure: false,
            expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)),
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
    const { email, password, username, categories } = req.body;
    console.log(password)
    bcrypt.hash(password, saltRounds, async function (err, hashed) {
        try {
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    hashedPassword: hashed,
                    interests: {
                        connect: categories.map(id => ({ id }))
                    }
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
            isLoggedIn: false,
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
app.get("/getUserVideos", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Retrieve the current user from the session
        const currentUser = req.session.user;

        // Create the post with the current user ID

        const UserVideos = await prisma.user.findFirst({
            where: { id: currentUser.id },
            select: {
                videos: true
            }
        });
        res.status(201).json(UserVideos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
app.get("/logout", async (req, res) => {
    try {
        if (!req.session.user) {
            res.status(500).json({ error: 'No User' });
            return
        }
        req.session.user = null
        await req.session.save()

        res.json({ success: true });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})
app.post("/upload-video", handler);
app.delete('/delete-video/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id, req.body)
    try {
        await prisma.video.delete({
            where: { id },
        });
        res.send({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error deleting video' });
    }
});
app.get('/OtherUser', async (req, res) => {
    const query = req.query.q;
    const users = await prisma.user.findMany({
        where: {
            username: {
                contains: query,
                mode: 'insensitive'
            }
        },
    });
    res.json(users);
});
app.get('/OtherUserVideos', async (req, res) => {
    const query = req.query.q;
    const videos = await prisma.video.findMany({
        where: {
            categories: {
                some: {
                    name: {
                        contains: query,
                        mode: 'insensitive'
                    },
                },
            },
        }
    });
    res.json(videos);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

