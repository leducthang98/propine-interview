import moment from "moment"
import { question, rl } from "./configs/readline.config"
import { getPortfolioTokensUSD } from "./services/blockchain.service"
import { createTransactionInterval } from "./utils/create-transaction.util"
import { COMMON_CONSTANT } from "./constants/common.constant"

async function main() {
    // create dummy transaction data
    createTransactionInterval()

    console.info('🚀 >> type /help to see options')
    while (true) {
        try {
            const input = await question('command: ')

            if (String(input).charAt(0) !== '/') {
                console.info('invalid command')
            } else {

                // process command
                const command = String(input).substring(1)
                if (command === 'help') {
                    console.info('/portfolio                => return the latest portfolio value per token in USD')
                    console.info('/portfolio/token          => return the latest portfolio value for that token in USD')
                    console.info('/portfolio?date=          => return the portfolio value per token in USD on that date')
                    console.info('/portfolio/token?date=    => return the portfolio value of that token in USD on that date')
                } else if (command === 'exit') {
                    rl.close()
                    process.exit();
                }
                else if (/^portfolio\/.*/.test(command)) {
                    let dateQuery = command.split('?')[1]
                    const token = command.split('/')[1].replace(`?${dateQuery}`, '')

                    if (command.includes('?date=')) {
                        let date = moment(dateQuery.replace('date=', ''), COMMON_CONSTANT.DATE_FORMAT, true)
                        if (!date.isValid()) {
                            throw new Error('invalid date')
                        }
                        const data = await getPortfolioTokensUSD([token], date.format(COMMON_CONSTANT.DATE_FORMAT))
                        console.info(data)
                    } else {
                        const data = await getPortfolioTokensUSD([token])
                        console.info(data)
                    }
                }
                else if (/^portfolio.*/.test(command)) {
                    if (command.includes('?date=')) {
                        let dateQuery = command.split('?')[1]
                        let date = moment(dateQuery.replace('date=', ''), COMMON_CONSTANT.DATE_FORMAT, true)
                        if (!date.isValid()) {
                            throw new Error('invalid date')
                        }
                        const data = await getPortfolioTokensUSD(null, date.format(COMMON_CONSTANT.DATE_FORMAT))
                        console.info(data)
                    } else {
                        const data = await getPortfolioTokensUSD()
                        console.info(data)
                    }
                }
            }
        } catch (error) {
            console.error('error command:', error.message)
        }

    }
}

main()
