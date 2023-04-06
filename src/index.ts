import { program } from "commander"
import moment from "moment"
import { COMMON_CONSTANT } from "./constants/common.constant"
import { getPortfolioTokensUSD } from "./services/blockchain.service"

program
    .version('0.1.0')
    .description('propine interview')
    .option('-t, --token <token>', 'Token', null)
    .option('-d, --date <date>', 'Date', null)
    .action(async (option) => {
        const { token, date } = option
        if (date && !moment(date, COMMON_CONSTANT.DATE_FORMAT, true).isValid()) {
            console.error('invalid date')
        }
        const result = await getPortfolioTokensUSD(token, date)
        console.info(result)
    })

program.parse(process.argv)