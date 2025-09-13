import yts from 'yt-search'

var handler = async (m, { text, conn, args, command, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, `✩ Por favor, ingresa una búsqueda de YouTube.`, m)

    conn.reply(m.chat, wait, m)

    let results = await yts(text)
    let tes = results.all

    let teks = results.all.map(v => {
        if (v.type === 'video') {
            return `> *_${v.title}_*
✩ *Duración*: ${v.timestamp}
✩ *Visitas*: ${Intl.NumberFormat('en-US').format(v.views)}
✩ *Autor*: ${v.author.name}
✩ *Publicado*: ${v.ago}
✩ *Url*: ${v.url}`
        }
    }).filter(v => v).join('\n\n──────────────────────\n\n')

    await conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg', teks, m)
}

handler.help = ['ytsearch']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true


export default handler