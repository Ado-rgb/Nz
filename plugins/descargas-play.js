import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(m.chat, "✦ Por favor, escribe el nombre o el enlace del video que deseas buscar.", m)
    }

    const videoIdMatch = text.match(youtubeRegexID)
    const searchQuery = videoIdMatch ? `https://youtu.be/${videoIdMatch[1]}` : text

    const searchResults = await yts(searchQuery)
    let video = null

    if (videoIdMatch) {
      const id = videoIdMatch[1]
      video = searchResults.all.find(v => v.videoId === id) || searchResults.videos.find(v => v.videoId === id)
    }

    if (!video) video = searchResults.videos?.[0] || null

    if (!video) {
      return m.reply("✧ No se encontraron resultados para tu búsqueda.")
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = video
    const canal = author?.name || "Desconocido"
    const vistas = formatViews(views || 0)

    const infoMessage =`> *_${title}_*
✩ *Duración*: ${timestamp || "no disponible"}
✩ *Visitas*: ${vistas}
✩ *Autor*: ${canal}
✩ *Publicado*: ${ago || "no disponible"}
✩ *Url*: ${url}`

    const thumb = (await conn.getFile(thumbnail))?.data

    const preview = {
      contextInfo: {
        externalAdReply: {
          title: '',
          body: botname,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, m, preview)

    const isAudio = ['play', 'yta', 'ytmp3', 'playaudio'].includes(command)
    const isVideo = ['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)

    if (!isAudio && !isVideo) {
      return conn.reply(m.chat, "✦ Comando no reconocido. Usa un comando válido para descargar audio o video.", m)
    }

    const format = isAudio ? "audio" : "video"
    const apiUrl = `https://myapiadonix.casacam.net/download/yt?apikey=Adofreekey&url=${encodeURIComponent(url)}&format=${format}`

    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.data?.url) {
      throw new Error(json.message || "No se pudo obtener el enlace de descarga.")
    }

    const downloadUrl = json.data.url

    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: true
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: "> *_✦ Descarga completa. Aquí tienes tu video._*"
      }, { quoted: m })
    }

  } catch (error) {
    console.error('[ERROR YOUTUBE]', error)
    return m.reply(`⚠︎ Se produjo un error al procesar tu solicitud:\n\n${error.message || error}`)
  }
}

handler.command = handler.help = [
  'play', 'yta', 'ytmp3',
  'play2', 'ytv', 'ytmp4',
  'playaudio', 'mp4'
]

handler.tags = ['descargas']
//handler.group = true

export default handler

function formatViews(views) {
  if (!views) return "0"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}