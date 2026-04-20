const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// cria o cliente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true
    }
});

// QR Code
client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

// pronto
client.on("ready", () => {
    console.log("Client is ready!");
});

// ======== BOAS-VINDAS / DESPEDIDA ========

client.on("groupParticipantsUpdate", async (notification) => {

    console.log("Evento recebido:", notification);

    try {
        const chat = await client.getChatById(notification.id._serialized);

        for (const userId of notification.participants) {

            const contact = await client.getContactById(userId);

            if (notification.action === "add") {
                await chat.sendMessage(
                    `👋 Bem-vindo(a), @${contact.number}!`,
                    { mentions: [contact] }
                );
            }

            if (notification.action === "remove") {
                await chat.sendMessage(
                    `👋 Tchau, @${contact.number}!`,
                    { mentions: [contact] }
                );
            }

        }

    } catch (err) {
        console.log("Erro nas boas-vindas:", err);
    }
});

// inicia
client.initialize();
