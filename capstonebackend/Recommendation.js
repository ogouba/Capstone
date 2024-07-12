app.get("/getRecommendedVideos", async (req, res) => {
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