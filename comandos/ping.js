module.exports = {
    name: "ping",
    description: "Mostra o ping e o tempo ligado do bot",

    execute: async (message, client) => {

        const start = Date.now();

        const sent = await message.reply("🏓 Pong!");

        const ping = Date.now() - start;

        const totalSeconds = Math.floor(process.uptime());

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const uptimeFormatado =
            `${hours}h ${minutes}m ${seconds}s`;

        await sent.reply(
            `📶 Velocidade de resposta: ${ping}ms\n` +
            `⏱️ Uptime: ${uptimeFormatado}`
        );
    }
};