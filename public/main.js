const applyBtn = document.getElementById("btn");
const entryPrice = document.getElementById("entry");
const percentage = document.getElementById("balancePercentage");
const leverage = document.getElementById("leverage");
const side = document.getElementById("side");
const symbol = document.getElementById("symbol");
const tradeType = document.getElementById("trade-type");
const apiKey = document.getElementById("apiKey");
const apiSecret = document.getElementById("apiSecret");

applyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  axios
    .post("/applyLimitOrder", {
      entryPrice: entryPrice.value,
      percentage: percentage.value,
      leverage: leverage.value,
      side: side.value,
      symbol: symbol.value,
      tradeType: tradeType.value,
      apiKey: apiKey.value,
      apiSecret: apiSecret.value,
    })
    .then((res) => {
      console.log("success response form axios", res);
      alert(res.data.ret_msg);
    })
    .catch((err) => {
      console.error(err);
    });
});
