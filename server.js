const express = require('express');
const http = require('http');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static('./StockVision'));

let fullMSFT;
let nowMSFT;
let nowMSFTkey;
let x3MSFT = 0;
let x2MSFT = 0;
let x1MSFT = 0;
let newMSFTprediction;
let oldMSFTprediction = 1;
let finalAdjMSFT = 1;
let intAdjMSFT = 1;
let currentPriceMSFT;
let adjuster = {adjustment: finalAdjMSFT};

let options = {
  host:'www.alphavantage.co',
  port: 80,
  path:'/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=2215',
  method: 'GET'
};
//http://globalquote.morningstar.com/globalcomponent/RealtimeHistoricalStockData.ashx?ticker=F&showVol=false&dtype=his&f=d&curry=USD&range=2014-10-14|2014-10-14&isD=true&isS=true&hasF=true&ProdCode=DIRECT
setInterval(() => {
  http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      fullMSFT = JSON.parse(body);
      fullMSFT = fullMSFT['Time Series (Daily)'];
      nowMSFTkey = Object.keys(fullMSFT)[0];
      nowMSFT = fullMSFT[nowMSFTkey];
      x3MSFT = x2MSFT;
      x2MSFT = x1MSFT;
      currentPriceMSFT = nowMSFT['4. close'];
      currentPriceMSFT = parseFloat(currentPriceMSFT).toFixed(2)
      x1MSFT = currentPriceMSFT;
      newMSFTprediction ? oldMSFTprediction = newMSFTprediction : null;
      newMSFTprediction = x1MSFT + x2MSFT + x3MSFT;
      newMSFTprediction = parseFloat(newMSFTprediction).toFixed(2);
      finalAdjMSFT < 0.5 || finalAdjMSFT > 1.5 ? newMSFTprediction = currentPriceMSFT : newMSFTprediction / 3 * finalAdjMSFT;
      newMSFTprediction = parseFloat(newMSFTprediction).toFixed(2);
      oldMSFTprediction == 1 ? intAdjMSFT = intAdjMSFT : intAdjMSFT = oldMSFTprediction / currentPriceMSFT;
      finalAdjMSFT *= intAdjMSFT;
      adjuster = {adjustment: finalAdjMSFT};
      console.log('nowMSFT: ' + nowMSFT);
      console.log('x1 x2 x3 ' + x1MSFT, x2MSFT, x3MSFT);
      console.log('currentPrice oldPrediction newPrediction ', currentPriceMSFT, oldMSFTprediction, newMSFTprediction);
      console.log('intermediateAdjustment finalAdjustment', intAdjMSFT, finalAdjMSFT);

    })
  }).end();
}, 60000);
/* GET home page. */
app.get('/api', (req, res, next) => {
  res.json(adjuster);
});

app.get('/', (req, res) => {
  res.render('./StockVision/index.html');
})

app.get('/*', (req, res) => {
  res.sendStatus(400);
});

app.listen(port, () => {
  console.log(port);
});
