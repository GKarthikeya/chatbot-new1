const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const axios = require('axios');

const client = new Client();
const userState = new Map(); // To track who is expected to send credentials

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log("🔐 Scan the QR Code with your WhatsApp.");
});

client.on('ready', () => {
    console.log("✅ WhatsApp bot is ready!");
});

client.on('message', async message => {
    const from = message.from;
    const body = message.body.trim();

    console.log(`Message from ${from}: ${body}`);

    // 1. Start command
    if (body.toLowerCase() === '/start') {
        await message.reply(
            "👋 Welcome! Please send your credentials in the format:\n\n`username // password`"
        );
        userState.set(from, 'awaiting_credentials');
        return;
    }

    // 2. Awaiting credentials
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
                    await message.reply('⚠️ Login successful but no data was returned. Please try again later.');
                }

            } catch (error) {
                console.error("❌ Error sending to server:", error.message);
                await message.reply('🚫 Failed to contact the server. Please try again.');
            }
        } else {
            await message.reply("⚠️ Please send credentials in the format: `username // password`");
        }
        return;
    }

    // 3. If no context
    await message.reply("❓ Send `/start` to begin the login process.");
});

client.initialize();
