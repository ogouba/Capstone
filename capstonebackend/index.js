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
//fetch data for the main feed that displays even when users are not logged in
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
// enable to get posts
app.get("/posts", async (req, res) => {
    try {
        res.status(200)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message });
    }
});
// enaable the user to be able to make Posts
app.post('/posts', async (req, res) => {
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
// enable the user to be able to create an account
app.post("/create", async (req, res) => {
    const { email, password, username, categories } = req.body;
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
            res.status(500).json({ "error": e.message });
        }
    });
})
// enable login functionality
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
        // Return the user data in the response
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})
// get the  user information when the user logs in
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
// fetch vidoes the user had posted on their account
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
// enable user logout functionality
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
// enable user to post videos
app.post("/upload-video", handler);
// handle delete for posts made by the user themselves
app.delete('/delete-video/:id', async (req, res) => {
    const id = parseInt(req.params.id);
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
// get other users for when the suer searches for other users
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
// get Other user videos for when the user searches for others users's videos
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
// save user searches to use for the  recommendations algorithmn
app.post('/saveSearch', async (req, res) => {
    const { query } = req.body;
    const currentUser = req.session.user;
    try {
        const newSearch = await prisma.search.upsert({
            where: {
                query
            },
            create: {
                query: query,
                users: {
                    connect: { id: currentUser.id }
                }
            },
            update: {
                users: {
                    connect: { id: currentUser.id }
                }
            }
        });
        res.status(200).json({ search: newSearch });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while saving the search.' });
    }
});
// get user recommended videos from the backend
app.get("/getRecommendedVideosPrisma", async (req, res) => {
    const userId = req.session.user.id;
    // Fetch the searches for the user
    const userSearches = await prisma.search.findMany({
        where: {
            users: {
                some: {
                   id: userId,
                },
            },
        },
    });
    // Extract the search queries
    const searchQueries = userSearches.map(search => search.query);
    // Use the search queries to find videos
    const videos = await prisma.video.findMany({
        where: {
            OR: searchQueries.map(query => ({
                categories: {
                    some: {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                },
            })),
        },
    });
    res.json(videos);
});
// app.get("/getRecommendedVideosAPI", async (req, res) => {
//     // search thru the searhces model for each user then use whatever is found 
//     //in searches to query the video model and then render it 

//     const videos = await prisma.video.findMany({
//         where: {
//             categories: {
//                 some: {
//                     name: {
//                         contains: query,
//                         mode: 'insensitive'
//                     },
//                 },
//             },
//         }
//     });
//     res.json(videos);
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})


