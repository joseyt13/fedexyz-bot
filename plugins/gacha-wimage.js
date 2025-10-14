import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters[1].json'
const haremFilePath = './src/database/harem.json'

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('No se pudo cargar el archivo characters.json.')
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const ctxErr = global.rcanalx || {}
    const ctxWarn = global.rcanalw || {}
    const ctxOk = global.rcanalr || {}

    if (args.length === 0) {
        await conn.reply(m.chat, 
            `🍙📚 *ITSUKI - Imagen de Personaje* 🖼️\n\n` +
            `❌ Debes proporcionar el nombre del personaje\n\n` +
            `📝 *Uso:*\n${usedPrefix}${command} <nombre del personaje>\n\n` +
            `💡 *Ejemplo:*\n${usedPrefix}${command} Itsuki Nakano\n\n` +
            `📖 "Escribe el nombre del personaje para ver su imagen"`,
            m, ctxWarn
        )
        return
    }

    const characterName = args.join(' ').toLowerCase().trim()

    try {
        const characters = await loadCharacters()
        const character = characters.find(c => c.name.toLowerCase() === characterName)

        if (!character) {
            await conn.reply(m.chat, 
                `🍙❌ *ITSUKI - Personaje No Encontrado*\n\n` +
                `⚠️ No se encontró: *${characterName}*\n\n` +
                `💡 *Sugerencias:*\n` +
                `• Verifica la ortografía\n` +
                `• Usa el nombre completo\n` +
                `• Usa ${usedPrefix}topwaifus para ver personajes\n\n` +
                `📚 "Asegúrate de escribir el nombre correctamente"`,
                m, ctxErr
            )
            return
        }

        const randomImage = character.img[Math.floor(Math.random() * character.img.length)]

        const message = 
            `🍙🖼️ *ITSUKI - Imagen de Personaje* 📚✨\n\n` +
            `📖 *Nombre:* ${character.name}\n` +
            `⚥ *Género:* ${character.gender}\n` +
            `🎬 *Fuente:* ${character.source}\n` +
            `💎 *Valor:* ${character.value}\n\n` +
            `🍱 "Aquí está la imagen del personaje" ✨`

        await conn.sendFile(m.chat, randomImage, `${character.name}.jpg`, message, m, ctxOk)
    } catch (error) {
        await conn.reply(m.chat, 
            `🍙❌ *ITSUKI - Error al Cargar Imagen*\n\n` +
            `⚠️ No se pudo cargar la imagen del personaje\n\n` +
            `📝 *Error:* ${error.message}\n\n` +
            `💡 La imagen puede estar caída o el enlace inválido\n\n` +
            `📚 "Intenta con otro personaje"`,
            m, ctxErr
        )
    }
}

handler.help = ['wimage <nombre del personaje>']
handler.tags = ['gacha']
handler.command = ['charimage', 'wimage', 'waifuimage', 'imagen']
handler.group = true

export default handler