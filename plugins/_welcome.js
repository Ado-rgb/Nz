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

    let pp = await conn.profilePictureUrl(m.messageStubParameters?.[0] || m.sender, 'image')
        .catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
    let img = await (await fetch(pp)).buffer()

    let chat = global.db.data.chats[m.chat]

    let txtWelcome = '☄︎ New Member ✩'
    let txtBye = '☄︎ Bye Member ✩'

    let groupSize = participants.length
    if (m.messageStubType == 27) groupSize++
    else if (m.messageStubType == 28 || m.messageStubType == 32) groupSize--

    
    const userId = m.messageStubParameters?.[0] || m.sender
    const userMention = `@${userId.split('@')[0]}`

    if (chat.welcome && m.messageStubType == 27) {
        let bienvenida = `❀ *Bienvenido* a *${groupMetadata.subject}*  
✩ ${userMention}  
${global.welcom1}  
☄︎ Ahora somos *${groupSize}* Miembros.  
•(=^●ω●^=)• Disfruta tu estadía en el grupo!  
> ✐ Usa *#help* para ver los comandos.`
        await conn.sendMini(m.chat, txtWelcome, dev, bienvenida, img, img, redes, fkontak)
    }

    if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
        let bye = `❀ *Adiós* de *${groupMetadata.subject}*  
✩ ${userMention}  
${global.welcom2}  
☄︎ Ahora somos *${groupSize}* Miembros.  
•(=^●ω●^=)• Te esperamos pronto!  
> ✐ Usa *#help* para ver los comandos.`
        await conn.sendMini(m.chat, txtBye, dev, bye, img, img, redes, fkontak)
    }
}
