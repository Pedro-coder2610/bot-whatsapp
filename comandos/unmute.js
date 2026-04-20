module.exports = {
    name: "unmute",

    async execute(message, client, usuariosMutados) {

        const chat = await message.getChat();

        if (!chat.isGroup) {
            await message.reply("Esse comando só funciona em grupos.");
            return;
        }

        const mentions = message.mentionedIds;

        if (!mentions || mentions.length === 0) {
            await message.reply("Marque alguém para desmutar.\nExemplo: !unmute @usuario");
            return;
        }

        let contador = 0;

        for (const id of mentions) {
            if (usuariosMutados.has(id)) {
                usuariosMutados.delete(id);
                contador++;
            }
        }

        if (contador === 0) {
            await message.reply("Esse usuário já não está mutado.");
        } else {
            await message.reply("🔊 Usuário desmutado com sucesso.");
        }

    }
};
