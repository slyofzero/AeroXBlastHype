import { Bot } from "grammy";
import { initiateBotCommands, initiateCallbackQueries } from "./bot";
import { log } from "./utils/handlers";
import { BOT_TOKEN, DEX_URL } from "./utils/env";
import { WebSocket } from "ws";
import { PairData } from "./types";
import { sendAlert } from "./bot/sendAlert";

export const teleBot = new Bot(BOT_TOKEN || "");
log("Bot instance ready");

// Check for new transfers at every 20 seconds
const interval = 20;
let fetchedAt: number = 0;
const headers = {
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
  Upgrade: "websocket",
  Origin: "https://dexscreener.com",
  "Sec-WebSocket-Version": "13",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-WebSocket-Key": "oEhi9FPY7B8xeU+7/6jGyw==",
  "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
};

(async function () {
  teleBot.start();
  log("Telegram bot setup");
  initiateBotCommands();
  initiateCallbackQueries();

  if (typeof DEX_URL === "undefined") {
    log("DEX_URL is missing from env");
    return false;
  }

  const ws = new WebSocket(DEX_URL, { headers });

  ws.on("open", function open() {
    log("connected");
  });

  ws.on("close", function close() {
    log("disconnected");
    process.exit(1);
  });

  ws.on("message", async (event) => {
    const str = event.toString();
    const data = JSON.parse(str);
    // eslint-disable-next-line
    const { pairs } = data as { pairs: PairData[] };

    const secondsTillFetched = Math.floor(Date.now() / 1000) - fetchedAt;
    if (pairs) {
      // Runs whenever bot starts otherwise runs every minute
      if (fetchedAt === 0 || secondsTillFetched >= interval) {
        sendAlert(pairs);
        fetchedAt = Math.floor(Date.now() / 1000);
      }
    }
  });
})();
