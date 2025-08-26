const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
app.use(express.json()); // để đọc JSON body

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

// endpoint nhận msg từ frontend
app.post('/send-discord', async (req, res) => {
    const { msg } = req.body;

    try {
        const formData = new FormData();
        formData.append('file', Buffer.from(msg), 'message.txt');

        const response = await fetch(DISCORD_WEBHOOK, { method: 'POST', body: formData });

        if (response.ok) res.json({ success: true });
        else res.status(500).json({ success: false });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
