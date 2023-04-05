import { question, rl } from "./configs/readline.config"
import { getPortfolioTokensUSD } from "./services/blockchain.service"
import { createTransactionInterval } from "./utils/create-transaction.util"

async function main() {
    // create dummy transaction data
    createTransactionInterval()

    console.info('🚀 >> type /help to see options')
    while (true) {
        const input = await question('command: ')

        if (String(input).charAt(0) !== '/') {
            console.info('invalid command')
        } else {

            // process command
            const command = String(input).substring(1)
            switch (command) {
                case 'help':
                    console.info('/portfolio: return the latest portfolio value per token in USD')
                    break;
                case 'portfolio':
                    const data = await getPortfolioTokensUSD()
                    console.info(data)
                    break;
                case 'exit':
                    rl.close()
                    process.exit();
            }

        }

    }
}

main()
