const applyBtn = document.getElementById("btn");
const entryPrice = document.getElementById("entry");
const percentage = document.getElementById("balancePercentage");
const leverage = document.getElementById("leverage");
const side = document.getElementById("side");
const symbol = document.getElementById("symbol");
const tradeType = document.getElementById("trade-type");

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
    })
    .then((res) => {
      console.log("success response form axios", res.data.ret_msg);
      alert(res.data.ret_msg);
    })
    .catch((err) => {
      console.error(err);
    });
});
