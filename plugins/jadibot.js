import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path' 
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
    const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command)  
    const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command)  
    const isCommand3 = /^(bots|sockets|socket)$/i.test(command)   

    async function reportError(e) {
        await m.reply(`✩ Ocurrió un error.`)
        console.log(e)
    }

    switch (true) {       

        case isCommand1: {
            let who = m.mentionedJid && m.mentionedJid[0] 
                ? m.mentionedJid[0] 
                : m.fromMe 
                ? conn.user.jid 
                : m.sender
            let uniqid = `${who.split`@`[0]}`
            const path = `./${jadi}/${uniqid}`

            if (!await fs.existsSync(path)) {
                await conn.sendMessage(m.chat, { 
                    text: `✩ Usted no tiene una sesión activa.\n\nUse:\n${usedPrefix + command} para crear una.\n\nSi tiene un *(ID)* puede saltarse este paso con:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\`` 
                }, { quoted: m })
                return
            }
            if (global.conn.user.jid !== conn.user.jid) {
                return conn.sendMessage(m.chat, { 
                    text: `✩ Use este comando en el *Bot principal*.\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`
                }, { quoted: m }) 
            } else {
                await conn.sendMessage(m.chat, { text: `✩ Tu sesión como *Sub-Bot* ha sido eliminada.` }, { quoted: m })
            }
            try {
                fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true })
                await conn.sendMessage(m.chat, { text : `✩ Ha cerrado sesión y borrado todo rastro.` } , { quoted: m })
            } catch (e) {
                reportError(e)
            }  
            break
        }

        case isCommand2: {
            if (global.conn.user.jid == conn.user.jid) {
                conn.reply(m.chat, `✩ Si no es *Sub-Bot*, comuníquese con el número principal para ser registrado.`, m)
            } else {
                await conn.reply(m.chat, `✩ ${botname} desactivada.`, m)
                conn.ws.close()
            }
            break
        }

        case isCommand3: {
            const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];

            function convertirMsADiasHorasMinutosSegundos(ms) {
                var segundos = Math.floor(ms / 1000);
                var minutos = Math.floor(segundos / 60);
                var horas = Math.floor(minutos / 60);
                var días = Math.floor(horas / 24);
                segundos %= 60;
                minutos %= 60;
                horas %= 24;
                var resultado = "";
                if (días !== 0) resultado += días + " días, ";
                if (horas !== 0) resultado += horas + " horas, ";
                if (minutos !== 0) resultado += minutos + " minutos, ";
                if (segundos !== 0) resultado += segundos + " segundos";
                return resultado;
            }

            const message = users.map((v, index) => 
                `> *_Sub-Bot ${index + 1}_*\n✩ *Usuario*: ${v.user.name || 'Desconocido'}\n✩ *Online*: ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}`
            ).join('\n\n──────────────────────\n\n');

            const replyMessage = message.length === 0 
                ? `✩ No hay Sub-Bots disponibles en este momento.` 
                : message;

            const totalUsers = users.length;
            const responseMessage = `> *_LISTA DE SUB-BOTS ACTIVOS_*\n\n✩ Puedes pedir permiso para que uno se una a tu grupo.\n\n\`\`\`Cada usuario Sub-Bot maneja sus funciones como quiera, el número principal no se hace responsable del mal uso.\`\`\`\n\n✩ *Sub-Bots conectados*: ${totalUsers || '0'}\n\n${replyMessage.trim()}`.trim();

            await _envio.sendMessage(m.chat, {text: responseMessage}, {quoted: m})
            break   
        }
    }
}

handler.tags = ['serbot']
handler.help = ['sockets', 'deletesesion', 'pausarai']
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesession', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket']

export default handler