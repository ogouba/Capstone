const express = require("express");
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const schedule = require("node-schedule")
const { addMinutes } = require("date-fns");
const SSE = require("./sse");
router.post('/watchLaterPrisma', async (req, res) => {
    const videoId = req.body.videoId;
    const userId = req.session.user.id;
    try {
        const doesWatchLaterExist = await prisma.watchLater.findUnique({
            where: {
                unique_user_video: {
                    videoId: parseInt(videoId),
                    userId: parseInt(userId)
                }
            }
        });
        if (doesWatchLaterExist !== null) {
            res.json({ message: "Video already in watched later" });
        }
        const watchLaterEntry = await prisma.watchLater.create({
            data: {
                videoId: parseInt(videoId),
                userId: parseInt(userId),
            },
        });
        const now = new Date()
        const notificationTimeFrame = addMinutes(now, 1);
        const job = schedule.scheduleJob(notificationTimeFrame, function () {
            SSE.sendNotification(userId, { job: "you saved a video  to Watch Later and you havent yet watched it", video: watchLaterEntry });
            SSE.sendVideo(userId, req.body)
        })
        return res.json({ message: 'Video added to watch later list!', watchLaterEntry });
    }
    catch (error) {
        console.error("Error adding video to watch later list:", error);
        res.status(500).json({ error: 'Failed to add video' });
    }
});
router.post('/watchLaterAPI', async (req, res) => {
    const { videoSnippet, title, thumbnail } = req.body;
    const userId = req.session.user.id;
    try {
        const doesWatchLaterExist = await prisma.watchLaterAPI.findUnique({
            where: {
                unique_user_video: {
                    videoSnippet,
                    userId: parseInt(userId)
                }
            }
        });
        if (doesWatchLaterExist !== null) {
            const job = schedule.scheduleJob(new Date(Date.now() + 5000)
                , function () {
                    SSE.sendNotification(userId, { job: "you saved a video  to Watch Later and you havent yet watched it", video: doesWatchLaterExist })
                })
            return res.json({ message: "Video already in watched later" });
        }
        const watchLaterEntry = await prisma.watchLaterAPI.create({
            data: {
                videoSnippet,
                title,
                thumbnail,
                userId: parseInt(userId),
            },
        });
        const now = new Date()
        const notificationTimeFrame = addMinutes(now, 1);
        const job = schedule.scheduleJob(notificationTimeFrame, function () {
            SSE.sendNotification(userId, { job: "you saved a video  to Watch Later and you havent yet watched it", video: watchLaterEntry });
            SSE.sendVideo(userId, req.body)
        })
        return res.json({ message: 'Video added to watch later list!', watchLaterEntry });
    } catch (error) {
        console.error("Error adding video to watch later list:", error);
        return res.status(500).json({ error: 'Failed to add video' });
    }
});
router.get('/watchLaterPrisma', async (req, res) => {
    const userId = req.session.user.id;
    try {
        const watchLaterVideos = await prisma.watchLater.findMany({
            where: { userId },
            include: { video: true }
        });
        res.json({ watchLaterVideos });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get video' });
    };
});
router.get('/watchLaterAPI', async (req, res) => {
    const userId = req.session.user.id;
    try {
        const watchLaterVideos = await prisma.watchLaterAPI.findMany({
            where: { userId },
        });
        res.json({ watchLaterVideos });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get video' });
    };
});
router.delete('/watchLaterPrisma/:id', async (req, res) => {
    const userId = req.session.user.id;
    try {
        const watchLaterVideos = await prisma.watchLater.delete({
            where: { userId },
            include: { video: true }
        });
        res.json({ watchLaterVideos });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete video' });
    };
});
router.delete('/watchLaterAPI/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const watchLaterVideos = await prisma.watchLaterAPI.delete({
            where: { id },
        });

        res.json({ watchLaterVideos });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete video' });
    };
});
router.post("/", async (req, res) => {
    const { content, userId } = req.body;
    try {
        const notification = await prisma.notification.create({
            data: {
                content,
                userId: parseInt(userId),
                isRead: false,
            },
        });
        res.status(201).json(notification);
    } catch (error) {
        console.error("Error creating notifications:", error);
        res.status(500).json({ error: "Something went wrong while creating this notification" });
    }
});
router.get('/', async (req, res) => {
    const userId = req.user.id;
    const { type } = req.query;
    try {
        const whereClause = { userId: parseInt(userId), isPending: false };
        if (type) {
            whereClause.type = type;
        }
        const notifications = await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Something went wrong while fetching notifications" });
    }
});
router.post("/mark-all-as-read", async (req, res) => {
    const userId = req.user.id;

    try {
        const notifications = await prisma.notification.updateMany({
            where: { userId: parseInt(userId), isRead: false },
            data: { isRead: true },
        });
        res.status(200).json({ message: "Noticfications amrjked as read" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ error: "Something went wrong while updating notifications" });
    }
});
router.post("/:id/mark-as-read", async (req, res) => {
    const userId = req.user.id;

    try {
        const notifications = await prisma.notification.updateMany({
            where: { userId: parseInt(userId), isRead: false },
            data: { isRead: true },
        });

        res.status(200).json({ message: "Noticfications amrjked as read" });

    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ error: "Something went wrong while updating notifications" });
    }
});
module.exports = router