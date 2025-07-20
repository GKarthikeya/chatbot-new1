const express = require('express');
const { Client } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Store the latest QR code
let latestQR = null;

const client = new Client();
const userState = new Map();

client.on('qr', async qr => {
    latestQR = await QRCode.toDataURL(qr); // Store as base64 image
    console.log('🔐 Visit /qr to scan the WhatsApp QR code.');
});

client.on('ready', () => {
    console.log("✅ WhatsApp bot is ready!");
});

client.on('message', async message => {
    const from = message.from;
    const body = message.body.trim();

    console.log(`Message from ${from}: ${body}`);

    if (body.toLowerCase() === '/start') {
        await message.reply("👋 Welcome! Please send your credentials in the format:\n\n`username // password`");
        userState.set(from, 'awaiting_credentials');
        return;
    }

    if (userState.get(from) === 'awaiting_credentials') {
        const parts = body.split('//');
        if (parts.length === 2) {
            const username = parts[0].trim();
            const password = parts[1].trim();

            try {
                const response = await axios.post('https://chatbot-new1.onrender.com/login', {
                    from,
                    username,
                    password
                });

                if (response.status === 200 && response.data.result) {
                    const result = response.data.result;
                    await message.reply(`${result}`);
                    userState.delete(from);
                } else {
                    await message.reply('⚠️ Login successful but no data was returned.');
                }

            } catch (error) {
                console.error("❌ Error sending to server:", error.message);
                await message.reply('🚫 Server error. Please try again.');
            }
        } else {
            await message.reply("⚠️ Use format: `username // password`");
        }
        return;
    }

    await message.reply("❓ Send `/start` to begin the login process.");
});

client.initialize();

// Web route to show QR code
app.get('/qr', (req, res) => {
    if (latestQR) {
        res.send(`
            <h2>Scan the QR code to login</h2>
            <img src="${latestQR}" alt="QR Code" />
        `);
    } else {
        res.send("QR code not generated yet. Please wait...");
    }
});

app.listen(port, () => {
    console.log(`🌐 Web server running at http://localhost:${port}`);
});
