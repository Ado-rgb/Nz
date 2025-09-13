import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return true

    const fkontak = { 
        key: { 
            participants: "0@s.whatsapp.net", 
            remoteJid: "status@broadcast", 
            fromMe: false, 
            id: "Halo" 
        }, 
        message: { 
            contactMessage: { 
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
            }
        }, 
        participant: "0@s.whatsapp.net"
    }

    const userId = m.messageStubParameters?.[0] || m.sender
    const usuario = `@${userId.split('@')[0]}`

    
    let pp = await conn.profilePictureUrl(userId, 'image')
        .catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

    let chat = global.db.data.chats[m.chat]

    let txtWelcome = '> *_☄︎ Nuevo miembro_*'
    let txtBye = '> *_☄︎ Hasta pronto_*'

    let groupSize = participants.length
    if (m.messageStubType == 27) groupSize++
    else if (m.messageStubType == 28 || m.messageStubType == 32) groupSize--

    if (chat.welcome && m.messageStubType == 27) {
        let bienvenida = `> *_Bienvenido a ${groupMetadata.subject}_*  
✩ *Usuario*: ${usuario}  
*${global.welcom1}*  
✩ Ahora somos *${groupSize}* miembros  
•(=^●ω●^=)• Disfruta tu estadía en el grupo  
> ✐ Usa *#help* para ver los comandos`
        
        await conn.sendMessage(
            m.chat, 
            { image: { url: pp }, caption: bienvenida, mentions: [userId] }, 
            { quoted: fkontak }
        )
    }

    if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
        let bye = `> *_Adiós de ${groupMetadata.subject}_*  
✩ *Usuario*: ${usuario}  
*${global.welcom2}*
✩ Ahora somos *${groupSize}* miembros  
•(=^●ω●^=)• Te esperamos pronto  
> ✐ Usa *#help* para ver los comandos`
        
        await conn.sendMessage(
            m.chat, 
            { image: { url: pp }, caption: bye, mentions: [userId] }, 
            { quoted: fkontak }
        )
    }
}