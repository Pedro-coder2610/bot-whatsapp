module.exports = {
    name: "menu",
    description: "Mostra o menu principal do bot",
    execute: async (message, client) => {
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString("pt-BR");
        const horaFormatada = agora.toLocaleTimeString("pt-BR");

        const menu = `
CONTATE _*+55 (84) 98713-4326 PARA AJUDAS OU PARA ENTRAR EM GRUPOS*_
verifique todos os dias para comandos novos!

╭━━⪩ BEM VINDO! ⪨━━
▢ • GABS BOT
▢ • data: ${dataFormatada}
▢ • hora: ${horaFormatada}
▢ • prefixo: !
▢ • versão: 1.0.0
╰━━─「🪐」─━━

╭━━⪩ PRINCIPAL ⪨━━
▢ • !menu
╰━━─「🚀」─━━

╭━━⪩ ADMISTRADOR ⪨━━
▢ • !autodestruir (só admins podem usar)
╰━━─「💥」─━━
`;

        await message.reply(menu);
    }
};
