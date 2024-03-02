import { AGE_THRESHOLD, VOLUME_THRESHOLD } from "@/utils/constants";
import { formatToInternational, getRandomInteger } from "@/utils/general";
import { teleBot } from "..";
// import { cleanUpBotMessage, hardCleanUpBotMessage } from "@/utils/bot";
import { CHANNEL_ID } from "@/utils/env";
import { errorHandler, log } from "@/utils/handlers";
import moment from "moment";
import { PairData } from "@/types";
import { cleanUpBotMessage, hardCleanUpBotMessage } from "@/utils/bot";
import { hypeNewPairs } from "@/vars/tokens";

export async function sendAlert(pairs: PairData[]) {
  try {
    if (!CHANNEL_ID) {
      log("CHANNEL_ID is undefined");
      process.exit(1);
    }

    const newIndexedTokens = [];

    for (const pair of pairs) {
      const {
        volume,
        pairCreatedAt,
        baseToken,
        liquidity,
        marketCap,
        priceUsd,
        priceChange,
        buyers,
        volumeBuy,
      } = pair;
      const { address: tokenAddress, name, symbol } = baseToken;

      newIndexedTokens.push(tokenAddress);
      const age = moment(pairCreatedAt).fromNow();
      const ageMinutes =
        Number(age.replace("minutes ago", "")) ||
        Number(age.replace("a minutes ago", "1")) ||
        Number(age.replace("a few seconds ago", "1"));

      if (hypeNewPairs[tokenAddress]) {
        // trackLpBurn(pair);
      } else if (
        volume.h24 >= VOLUME_THRESHOLD &&
        ageMinutes <= AGE_THRESHOLD
      ) {
        const { pairAddress: address } = pair;

        // Links
        const tokenLink = `https://mainnet.blastblockchain.com/token/${tokenAddress}`;
        const dexToolsLink = `https://www.dextools.io/app/en/blast/pair-explorer/${address}`;
        const dexScreenerLink = `https://dexscreener.com/blast/${address}`;
        const magnumLink = `https://t.me/magnum_trade_bot?start=${tokenAddress}`;
        const bananaLink = `https://t.me/BananaGunSolana_bot?start=${tokenAddress}`;
        const unibot = `https://t.me/solana_unibot?start=${tokenAddress}`;

        const now = Math.floor(Date.now() / 1e3);

        // Token Info
        const liquidityText = cleanUpBotMessage(
          formatToInternational(liquidity.quote)
        );
        const liquidityUsd = cleanUpBotMessage(
          formatToInternational(liquidity.usd)
        );
        const hypeScore = getRandomInteger();

        // Text
        const text = `Powered By [AeroX Blast Hype Alerts](https://t.me/AeroXHypePairsBlast) \\| Hype Alert
      
${hardCleanUpBotMessage(name)} \\| [${hardCleanUpBotMessage(
          symbol
        )}](${tokenLink})

*Hype: ${hypeScore}/100*
      
💲 Price: $${cleanUpBotMessage(priceUsd)}
📈 Change: $${cleanUpBotMessage(priceChange.h24)}%
💰 MCap: $${cleanUpBotMessage(formatToInternational(marketCap))}
🏦 Lp ETH: ${liquidityText} ETH *\\($${liquidityUsd}\\)*
👤 Buyers: ${buyers.h24} \\($${cleanUpBotMessage(volumeBuy.h24)}\\)

Token Contract: 
\`${tokenAddress}\`

📊 [DexTools](${dexToolsLink}) \\| 📊 [DexScreener](${dexScreenerLink})

Buy:
[Magnum](${magnumLink}) \\| [BananaGun](${bananaLink})
[Unibot](${unibot})

Powered By [AeroX Blast Hype Alerts](https://t.me/AeroXHypePairsBlast)`;

        try {
          teleBot.api
            .sendMessage(CHANNEL_ID, text, {
              parse_mode: "MarkdownV2",
              // @ts-expect-error Param not found
              disable_web_page_preview: true,
            })
            .catch((e) => errorHandler(e));

          hypeNewPairs[tokenAddress] = {
            startTime: now,
            initialMC: marketCap,
            pastBenchmark: 1,
          };

          log(`Sent message for ${address} ${name}`);
        } catch (error) {
          log(text);
          errorHandler(error);
        }
      }
    }
  } catch (error) {
    errorHandler(error);
  }
}
