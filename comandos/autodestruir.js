module.exports = {
    name: "autodestruir",
    description: "Auto-destruição divertida: conta 3 segundos e sai do grupo",
    execute: async (message, client) => {
        try {
            const chat = await message.getChat();

            if (!chat.isGroup) {
                await message.reply("Esse comando só funciona em grupos.");
                return;
            }

            // CONTAGEM DIVERTIDA
            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            await message.reply("☢️ Auto-destruição ativada...");
            await sleep(1000); await message.reply("3...");
            await sleep(1000); await message.reply("2...");
            await sleep(1000); await message.reply("1...");
            await sleep(500); await message.reply("💥 KABOMMMM");
            await sleep(500);

            // SAI DO GRUPO
            await chat.leave();

        } catch (err) {
            console.error("Erro detalhado no comando autodestruir:", err);
            await message.reply("Ocorreu um erro ao executar o comando.");
        }
    }
};
