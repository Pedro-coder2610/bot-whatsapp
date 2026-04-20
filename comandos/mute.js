module.exports = {
    name: "mute",

    async execute(message, client, usuariosMutados) {

        const chat = await message.getChat();

        if (!chat.isGroup) {
            await message.reply("Esse comando só funciona em grupos.");
            return;
        }

        const senderId = message.author || message.from;

        const participante = chat.participants.find(
            p => p.id._serialized === senderId
        );

        if (!participante || !participante.isAdmin) {
            await message.reply("Apenas administradores podem usar este comando.");
            return;
        }

        if (!message.mentionedIds || message.mentionedIds.length === 0) {
            await message.reply("Marque alguém.\nEx: !mute @usuario");
            return;
        }

        for (const id of message.mentionedIds) {
            usuariosMutados.add(id);
        }

        await message.reply("🔇 Usuário mutado com sucesso.");
    }
};
