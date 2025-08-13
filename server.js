const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/gold", async (req, res) => {
  try {
    const goldRes = await fetch("https://api.metals.live/v1/spot");
    const goldData = await goldRes.json();
    const spotPriceUSD = goldData[0][1];

    const exchangeRes = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=EGP");
    const exchangeData = await exchangeRes.json();
    const usdToEgp = exchangeData.rates.EGP;

    const gramPriceUSD = spotPriceUSD / 31.1035;
    const gramPriceEGP_24 = gramPriceUSD * usdToEgp;
    const gramPriceEGP_21 = gramPriceEGP_24 * 0.875;
    const gramPriceEGP_18 = gramPriceEGP_24 * 0.75;
    const gramPriceEGP_14 = gramPriceEGP_24 * 0.583;
    const goldCoinPrice = gramPriceEGP_21 * 8;

    res.json({
      price: spotPriceUSD,
      exchange: usdToEgp,
      price_gram_24k: gramPriceEGP_24,
      price_gram_21k: gramPriceEGP_21,
      price_gram_18k: gramPriceEGP_18,
      price_gram_14k: gramPriceEGP_14,
      gold_coin: goldCoinPrice
    });
  } catch (err) {
    res.json({ error: "حدث خطأ في جلب البيانات" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
