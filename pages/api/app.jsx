import gplay from "google-play-scraper";

const getData = async (req, res) => {
    const body = JSON.parse(req.body)
    const { packageName, lang } = body

    try {
        const data = await gplay.app({ appId: packageName, lang: lang});
        res.status(200).json(data);
        // console.log(data)
    } catch (error) {
        // console.error('Error fetching app data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default getData;
