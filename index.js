process.on("unhandledRejection", err => {
    console.error("ERRO NÃO TRATADO:", err);
});

process.on("uncaughtException", err => {
    console.error("ERRO CRÍTICO:", err);
});

console.log("=== ARQUIVO index.js SENDO EXECUTADO ===");

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot-whatsapp"
    }),
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process"
        ]
    }
});

client.on("loading_screen", (percent, message) => {
    console.log("Carregando:", percent, message);
});

client.on("authenticated", async () => {
    console.log("Autenticado com sucesso!");
    try {
        const page = client.pupPage;
        if (page) {
            await page.waitForFunction(() => window.Store != null, { timeout: 60000 });
        }
    } catch (e) {
        console.log("Erro ao esperar carregamento:", e.message);
    }
});

client.on("auth_failure", msg => {
    console.log("Falha na autenticação:", msg);
});

process.on("SIGINT", async () => {
    console.log("Fechando bot...");
    await client.destroy();
    process.exit();
});

const prefixo = "!";

// ===============================
const mutados = new Map();

function getMutados(chatId) {
    if (!mutados.has(chatId)) mutados.set(chatId, new Set());
    return mutados.get(chatId);
}

// ===============================
client.on("ready", () => {
    console.log("Client is ready!");
});

// DEBUG
client.on("message", async (msg) => {
    console.log("MENSAGEM RECEBIDA:", msg.body);
});

// ===============================
client.on("message", async (msg) => {

    if (!msg.from) return;

    const chat = await msg.getChat();
    if (!chat.isGroup) return;

    const lista = mutados.get(chat.id._serialized);
    if (!lista) return;

    if (lista.has(msg.author)) {
        try {
            await msg.delete(true);
        } catch (e) {}
    }

});

// ===============================
client.on("message", async (message) => {

    // if (message.fromMe) return; // 🔥 comentado pra testar sozinho

    const texto = message.body?.trim();
    if (!texto) return;
    if (!texto.startsWith(prefixo)) return;

    const comando = texto.slice(prefixo.length).split(" ")[0].toLowerCase();
    const chat = await message.getChat();

    if (comando === "menu") {

        const agora = new Date();

        const menu = `
CONTATE _*+55 (84) 98713-4326 PARA AJUDAS OU PARA ENTRAR EM GRUPOS*_
verifique todos os dias para comandos novos!

╭━━⪩ BEM VINDO! ⪨━━
▢ • data: ${agora.toLocaleDateString("pt-BR")}
▢ • hora: ${agora.toLocaleTimeString("pt-BR")}
▢ • prefixo: !
▢ • versão: 2.0
╰━━─「🪐」─━━

╭━━⪩ ADM ⪨━━
▢ • !mute
▢ • !unmute
▢ • !mutelist
▢ • !autodestruir
╰━━─「⭐」─━━

╭━━⪩ PRINCIPAL ⪨━━
▢ • !menu
▢ • !ping
╰━━─「🚀」─━━

╭━━⪩ BRINCADEIRAS ⪨━━
▢ • !abraço
▢ • !socar
╰━━─「🎡」─━━
`;

        await message.reply(menu);
    }

    if (comando === "ping") {

        const inicio = Date.now();
        const uptimeMs = process.uptime() * 1000;

        const h = Math.floor(uptimeMs / 3600000);
        const m = Math.floor((uptimeMs % 3600000) / 60000);
        const s = Math.floor((uptimeMs % 60000) / 1000);

        const msg = await message.reply("🏓 Pong!");
        const lat = Date.now() - inicio;

        await msg.reply(`🏓 Pong!

📶 Velocidade de resposta: ${lat}ms
⏱️ Uptime: ${h}h ${m}m ${s}s`);
    }

    if (comando === "autodestruir") {

        if (!chat.isGroup)
            return message.reply("Esse comando só funciona em grupos.");

        const sleep = ms => new Promise(r => setTimeout(r, ms));

        await message.reply("☢️ Auto-destruição ativada...");
        await sleep(1000); await message.reply("3...");
        await sleep(1000); await message.reply("2...");
        await sleep(1000); await message.reply("1...");
        await sleep(500); await message.reply("💥 KABOMMMM");

        await sleep(500);
        await chat.leave();
    }

    if (comando === "mute") {

        if (!chat.isGroup)
            return message.reply("Esse comando só funciona em grupo.");

        const mentions = await message.getMentions();
        if (!mentions.length)
            return message.reply("Marque alguém para mutar.");

        const lista = getMutados(chat.id._serialized);

        for (const c of mentions) {
            lista.add(c.id._serialized);
        }

        await chat.sendMessage(`🔇 Usuário(s) mutado(s).`, { mentions });
    }

    if (comando === "unmute") {

        if (!chat.isGroup)
            return message.reply("Esse comando só funciona em grupo.");

        const mentions = await message.getMentions();
        if (!mentions.length)
            return message.reply("Marque alguém para desmutar.");

        const lista = getMutados(chat.id._serialized);

        for (const c of mentions) {
            lista.delete(c.id._serialized);
        }

        await chat.sendMessage(`🔊 Usuário(s) desmutado(s).`, { mentions });
    }

    if (comando === "mutelist") {

        if (!chat.isGroup)
            return message.reply("Esse comando só funciona em grupo.");

        const lista = getMutados(chat.id._serialized);

        if (!lista.size) {
            return message.reply("📋 Nenhum usuário mutado.");
        }

        let textoLista = "📋 Lista de mutados:\n\n";
        const mentions = [];

        for (const id of lista) {
            const contato = await client.getContactById(id);
            mentions.push(contato);
            textoLista += `• @${id.split("@")[0]}\n`;
        }

        await chat.sendMessage(textoLista, { mentions });
    }

    if (comando === "abraço" || comando === "abraco") {

        const mentions = await message.getMentions();
        if (!mentions.length)
            return message.reply("Marque alguém.");

        const media = MessageMedia.fromFilePath("./201888.mp4");

        await chat.sendMessage(media, {
            caption: "🤗 Abraço!",
            sendVideoAsGif: true
        });
    }

    if (comando === "socar") {

        const mentions = await message.getMentions();
        if (!mentions.length)
            return message.reply("Marque alguém.");

        const media = MessageMedia.fromFilePath("./000000.mp4");

        await chat.sendMessage(media, {
            caption: "🥊 Soco!",
            sendVideoAsGif: true
        });
    }

});

// ===============================
async function start() {
    try {
        await client.initialize();
    } catch (err) {
        console.log("ERRO REAL:", err);
    }
}

start();