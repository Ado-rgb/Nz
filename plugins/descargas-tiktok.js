import fetch from 'node-fetch';

var handler = async (m, { conn, args }) => {
    const emoji = '✧';

    if (!args[0]) return conn.reply(m.chat, `${emoji} Pásame un link de TikTok.`, m);

    try {
        await conn.reply(m.chat, `${emoji} Espera un momento, descargando tu video...`, m);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData || !tiktokData.data || !tiktokData.data.play) {
            return conn.reply(m.chat, "⚠️ No se pudo obtener el video.", m);
        }

        const videoURL = tiktokData.data.play;
        const usuario = tiktokData.data.author_name || 'Desconocido';
        const likes = tiktokData.data.like_count || 0;
        const comments = tiktokData.data.comment_count || 0;
        const shares = tiktokData.data.share_count || 0;
        const description = tiktokData.data.desc || 'Sin descripción';
        const date = new Date(tiktokData.data.create_time * 1000).toLocaleString() || 'Desconocida';

        const message = `
${emoji} *TikTok Info* ✧

👤 Usuario: @${usuario}
🕒 Fecha: ${date}
❤️ Likes: ${likes.toLocaleString()}
💬 Comentarios: ${comments.toLocaleString()}
🔗 Compartidos: ${shares.toLocaleString()}
✎ Descripción: ${description}
`;

        await conn.sendMessage(m.chat, { text: message }, { quoted: m });

        if (videoURL) {
            await conn.sendFile(m.chat, videoURL, "tiktok.mp4", ``, m);
        } else {
            return conn.reply(m.chat, "⚠️ No se pudo descargar el video.", m);
        }

    } catch (error) {
        return conn.reply(m.chat, `⚠️ Error: ${error.message}`, m);
    }
};

handler.help = ['tiktok'].map(v => v + ' *<link>*');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
handler.group = true;
handler.register = true;
handler.coin = 2;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
    const tikwm = `https://www.tikwm.com/api/?url=${url}&hd=1`;
    const response = await (await fetch(tikwm)).json();
    return response;
}