const axios = require("axios");
const crypto = require("crypto");

exports.post = (req, res) => {
  const apiKey = process.env.apikey;
  const apiPrivate = process.env.apiprivate;
  const {
    entryPrice,
    percentage,
    leverage,
    side,
    symbol,
    tradeType,
  } = req.body;

  let orderEndPoint = "";
  if (tradeType == "InversePerpetual") {
    orderEndPoint = "/v2/private/order/create";
  } else if (tradeType == "USDTPerpetual") {
    orderEndPoint = "/private/linear/order/create";
  }

  const baseUrl = "https://api.bybit.com";
  const balaneEndPoint = "/v2/private/wallet/balance";
  const timestamp = Date.now();
  const balanceQueryString = `api_key=${apiKey}&timestamp=${timestamp}`;
  const balanceSignature = crypto
    .createHmac("sha256", apiPrivate)
    .update(balanceQueryString)
    .digest("hex");

  const balanceUrl =
    baseUrl +
    balaneEndPoint +
    "?" +
    balanceQueryString +
    "&sign=" +
    balanceSignature +
    "&timestamp=" +
    timestamp;

  axios
    .get(balanceUrl)
    .then((result) => {
      console.log(result.data);
      const availableBalance = 0; //result.data.result.USDT.available_balance;
      // const quntity = availableBalance * (percentage / 100);
      const parsedEntry = Number(entryPrice);
      const quntity =
        (availableBalance / parsedEntry) * (percentage / 100) * leverage;
      // in case of usd
      // const quntity =
      // (availableBalance * parsedEntry) * (percentage / 100) * leverage;
      const qty = String(quntity).slice(0, 5);
      const parsedQty = Number(qty);

      let stopLoss, target;
      if (side == "Sell") {
        stopLoss = parsedEntry + parsedEntry * (0.03 / leverage);
        target = parsedEntry - parsedEntry * (0.01 / leverage);
      } else {
        stopLoss = parsedEntry - parsedEntry * (0.03 / leverage);
        target = parsedEntry + parsedEntry * (0.01 / leverage);
      }

      console.log(
        "orderEndPoint",
        orderEndPoint,
        "QTY",
        parsedQty,
        "SL:",
        stopLoss,
        "target:",
        target,
        "Entry:",
        parsedEntry
      );
      const activeOrderQueryString = `api_key=${apiKey}&close_on_trigger=false&order_type=Limit&price=${entryPrice}&qty=${parsedQty}&reduce_only=false&side=${side}&stop_loss=${stopLoss}&symbol=${symbol}&take_profit=${target}&time_in_force=GoodTillCancel&timestamp=${timestamp}`;
      //api_key=AV8RJ4hjD9nxB2LamP&order_type=Limit&price=37939.00&qty=0.002&reduce_only=false&side=buy&stop_loss=1138.1699999999998&symbol=XTZUSDT&take_profit=379.39&time_in_force=GoodTillCancel&timestamp=1612728641577
      const activeOrderSignature = crypto
        .createHmac("sha256", apiPrivate)
        .update(activeOrderQueryString)
        .digest("hex");

      const leverageQuery = `api_key=${apiKey}&buy_leverage=${leverage}&sell_leverage=${leverage}&symbol=${symbol}&timestamp=${timestamp}`;
      const leverageSignature = crypto
        .createHmac("sha256", apiPrivate)
        .update(leverageQuery)
        .digest("hex");
      axios
        .post(baseUrl + "/private/linear/position/set-leverage", {
          api_key: apiKey,
          buy_leverage: leverage,
          sell_leverage: leverage,
          symbol: symbol,
          timestamp: timestamp,
          sign: leverageSignature,
        })
        .then((res1) => {
          console.log(res1.data);
          axios
            .post(baseUrl + orderEndPoint, {
              api_key: apiKey,
              close_on_trigger: false,
              order_type: "Limit",
              price: entryPrice,
              qty: parsedQty,
              reduce_only: false,
              side: side,
              stop_loss: stopLoss,
              symbol: symbol,
              take_profit: target,
              time_in_force: "GoodTillCancel",
              timestamp: timestamp,
              sign: activeOrderSignature,
            })
            .then((result2) => {
              console.log(result2.data);
            })
            .catch((err) => {
              console.error(err);
            });
          res.send("you arrived");
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
};
