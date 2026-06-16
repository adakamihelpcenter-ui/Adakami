export default async function handler(req, res) {
    // Memastikan hanya menerima metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { pesan } = req.body;
    
    // Memanggil Environment Variables yang sudah diatur di pengaturan hosting
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
        return res.status(500).json({ error: 'Token atau Chat ID belum diatur di Environment Variables' });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: pesan,
                parse_mode: 'html'
            })
        });

        const data = await response.json();
        
        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: data.description });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Gagal menghubungi Telegram' });
    }
}
