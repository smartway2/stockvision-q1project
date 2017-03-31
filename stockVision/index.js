$(document).ready(() => {
  let sellDate;
  let price1;
  let price2;
  let price3;
  let todayPrice;
  let predictPrice;
  let adjustment;
  let ticker;
  $('button[name=submit]').click(() => {
    ticker = $('input[name=symbol]').val();
    sellDate = $('input[name=sellDate]').val();
    sellDate = sellDate.dateParse();
    console.log(sellDate);
    let dayCalc = daysCalc(sellDate.month, sellDate.day, sellDate.year);
    console.log(dayCalc);
    $.getJSON(prefix + `http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=2215`, function(today){
      console.log(today);
      console.log(today['Time Series (Daily)'][Object.keys(today['Time Series (Daily)'])[0]]['4. close']);
      todayPrice = parseFloat(today['Time Series (Daily)'][Object.keys(today['Time Series (Daily)'])[0]]['4. close']);
      console.log(today['Time Series (Daily)'][dayCalc.pastDate1Plain]);
      price1 = today['Time Series (Daily)'][dayCalc.pastDate1Plain]['4. close'] ? parseFloat(today['Time Series (Daily)'][dayCalc.pastDate1Plain]['4. close']) : today['Time Series (Daily)'][dayCalc.pastDate1alt1plain]['4. close'] ? parseFloat(today['Time Series (Daily)'][dayCalc.pastDate1alt1plain]['4. close']) : parseFloat(today['Time Series (Daily)'][dayCalc.pastDate1alt2plain]['4. close']);
      console.log(price1);
      price2 = today['Time Series (Daily)'][dayCalc.pastDate2Plain]['4. close'] ? parseFloat(today['Time Series (Daily)'][dayCalc.pastDate2Plain]['4. close']) : today['Time Series (Daily)'][dayCalc.pastDate2alt1plain]['4. close'] ? parseFloat(today['Time Series (Daily)'][dayCalc.pastDate2alt1plain]['4. close']) : parseFloat(today['Time Series (Daily)'][dayCalc.pastDate2alt2plain]['4. close']);
      console.log(price2);
      price3 = today['Time Series (Daily)'][dayCalc.pastDate3Plain]['4. close'] ? parseFloat(today['Time Series (Daily)'][dayCalc.pastDate3Plain]['4. close']) : today['Time Series (Daily)'][dayCalc.pastDate3alt1plain]['4. close'] ? parseFloat(today['Time Series (Daily)'][dayCalc.pastDate3alt1plain]['4. close']) : parseFloat(today['Time Series (Daily)'][dayCalc.pastDate3alt2plain]['4. close']);
      console.log(price3);
    }).done(() => {
            $.getJSON("http://localhost:8000/api", (adj) => {
              adjustment = adj.adjustment;
            }).done(() => {
              $('#b3').html(predictPage);
              $('button[name=another]').click(() => {
                $('#b3').html(homePage);
              })
              predictPrice = (price1 + price2 + price3)/3 * adjustment;
              todayPrice > price1 ? predictPrice *= 1.05 : predictPrice *= .95;
              let myData = new Array([`${dayCalc.pastDate3Plain}`, price3], [`${dayCalc.pastDate2Plain}`, price2], [`${dayCalc.pastDate1Plain}`, price1], [`today`, todayPrice], [`prediction date`, predictPrice]);
              let myChart = new JSChart('chartcontainer', 'line');
              myChart.setDataArray(myData);
              myChart.draw();
              $('h4').html(`Current price: $${todayPrice}. Based on historical data points and industry trends the predicted price is $${predictPrice.toFixed(2)}`)
              predictPrice >= todayPrice ? $('h3').html('StockVision Recommendation: KEEP or BUY MORE') : $('h3').html('StockVision Recommendation: SELL or SHORT');

            }).error((e) => {
              console.log("error adjuster!!",e.responseText);
            });
    }).error((e) => {
      console.log("error today !!",e.responseText);
    });

    /*$.post('https://www.googleapis.com/prediction/v1.6/projects/mineral-effect-161717/trainedmodels/mineral-effect-161717/predict?key=AIzaSyBi1fmb2K4T6EIgRyUEthnYXLh4IulMoB8',
    {
      "input": {
        "csvInstance": [
          "12"
        ]
      }
    }, function(data) {
          console.log('post response: ', data)
      });*/
  });



let predictPage = `<div class="container-fluid">
          <div id="chartcontainer" style="margin-left: 13vw;">Prediction Graph</div>
              <h4></h4>
              <h3></h3>
              <div class="row">
                <button type="button" name="another" class="btn btn-success">Make Another Prediction</button>
              </div>
        </div>
</div>`
let homePage = `        <div class="container-fluid">
          <div class="row">
            <h1>StockVision&copy;</h1>
            <h3>Your one stop solution for stock forecasting</h3>
          </div>
          <div class="row">
            <h4>Enter in the details of your stock instantly get a suggestion of whether hold onto your stock or sell now</h4>
          </div>
          <div class="row">
            <img id="goog" src="https://www.freebsdnews.com/wp-content/uploads/google-cloud-platform.png" alt="google_cloud">
            <h5>POWERED BY GOOGLE&copy; PREDICTION CLOUD</h5>
          </div>
          <div class="row">
            <form class="" action="index.html" method="post">
              <div class="row">
                <input type="text" name="symbol" placeholder="Stock Symbol">
                <input type="date" name="sellDate">
              </div>
              <div class="row">
                <button type="button" name="submit" class="btn btn-success">Get Prediction</button>
              </div>
            </form>
          </div>
        </div>`









console.log("loading .... ");
const prefix = "https://cors-anywhere.herokuapp.com/";
$.getJSON(prefix + "http://globalquote.morningstar.com/globalcomponent/RealtimeHistoricalStockData.ashx?ticker=F&showVol=false&dtype=his&f=d&curry=USD&range=2014-10-14|2014-10-14&isD=true&isS=true&hasF=true&ProdCode=DIRECT", (data) => {
  console.log(data['PriceDataList'][0]['Datapoints']);
}).done(() => {
  console.log("it's done");
}).error((e) => {
  console.log("error !!",e.responseText);
});
$.getJSON(prefix + "http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=2215", (yay) => {
  console.log(yay);
}).done(() => {
  console.log("it's done2");
}).error((um) => {
  console.log("error2 !!",um.responseText);
});
  String.prototype.dateParse = function(){
    let stringDater = this;
    let year = this.match(/\d\d\d\d/)[0];
    year = +year;
    let month = this.match(/-\d\d-/)[0].replace(/-/ig, '');
    month = +month;
    let day = this.match(/-\d\d-\d\d/)[0].replace(/-\d\d-/ig, '');
    day = +day;
    return {
      "year": year,
      "month": month,
      "day" : day,
      "stringDate": stringDater
    }
  }
  let daysCalc = (mm, dd, yy) => {
    Number.prototype.pad = function(size) {
        let s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    };
    let sellDate = new Date(yy, mm - 1, dd); //the date entered is the users planned sell date.
    let currentDate = new Date(); //get today's date
    let daysOut = (Math.round((sellDate.getTime() - currentDate.getTime())/(1000*60*60*24))); //converts both dates to milliseconds [LOL] then calculates the difference; output in days.
    let pastDate1 = new Date(new Date().setDate(currentDate.getDate() - daysOut));
    let pastDate1alt1 = new Date(new Date().setDate(currentDate.getDate() - daysOut + 1));
    let pastDate1alt2 = new Date(new Date().setDate(currentDate.getDate() - daysOut + 2));
    console.log(pastDate1.getDay())
    pastDate1.getDay() == 6 ? pastDate1 = new Date(new Date().setDate(currentDate.getDate() - (daysOut - 1))) : pastDate1.getDay() == 0 ? pastDate1 = new Date(new Date().setDate(currentDate.getDate() - (daysOut - 2))) : pastDate1 = pastDate1;
    let pastDate2 = new Date(new Date().setDate(currentDate.getDate() - (2 * daysOut)));
    let pastDate2alt1 = new Date(new Date().setDate(currentDate.getDate() - (2 * daysOut + 1)));
    let pastDate2alt2 = new Date(new Date().setDate(currentDate.getDate() - (2 * daysOut + 2)));
    pastDate2.getDay() == 6 ? pastDate2 = new Date(new Date().setDate(currentDate.getDate() - (2 * (daysOut - 1)))) : pastDate2.getDay() == 0 ? pastDate2 = new Date(new Date().setDate(currentDate.getDate() - (2 * (daysOut - 2)))) : pastDate2 = pastDate2;
    let pastDate3 = new Date(new Date().setDate(currentDate.getDate() - (3 * daysOut)));
    let pastDate3alt1 = new Date(new Date().setDate(currentDate.getDate() - (3 * daysOut + 1)));
    let pastDate3alt2 = new Date(new Date().setDate(currentDate.getDate() - (3 * daysOut + 2)));
    pastDate3.getDay() == 6 ? pastDate3 = new Date(new Date().setDate(currentDate.getDate() - (3 * (daysOut - 1)))) : pastDate3.getDay() == 0 ? pastDate3 = new Date(new Date().setDate(currentDate.getDate() - (3 * (daysOut - 2)))) : pastDate3 = pastDate3;
    return {
            sellDate: sellDate,
            sellDatePlain: (sellDate.getYear() + 1900) + '-' + (sellDate.getMonth() + 1).pad(2) + '-' + sellDate.getDate().pad(2),
            currentDate: currentDate,
            currentDatePlain: (currentDate.getYear() + 1900) + '-' + (currentDate.getMonth() + 1).pad(2) + '-' + currentDate.getDate().pad(2),
            daysOut: daysOut,
            pastDate1: pastDate1,
            pastDate1Plain: (pastDate1.getYear() + 1900) + '-' + (pastDate1.getMonth() + 1).pad(2) + '-' + pastDate1.getDate().pad(2),
            pastDate1alt1plain: (pastDate1alt1.getYear() + 1900) + '-' + (pastDate1alt1.getMonth() + 1).pad(2) + '-' + pastDate1alt1.getDate().pad(2),
            pastDate1alt2plain: (pastDate1alt2.getYear() + 1900) + '-' + (pastDate1alt2.getMonth() + 1).pad(2) + '-' + pastDate1alt2.getDate().pad(2),
            pastDate2: pastDate2,
            pastDate2Plain: (pastDate2.getYear() + 1900) + '-' + (pastDate2.getMonth() + 1).pad(2) + '-' + pastDate2.getDate().pad(2),
            pastDate2alt1plain: (pastDate2alt1.getYear() + 1900) + '-' + (pastDate2alt1.getMonth() + 1).pad(2) + '-' + pastDate2alt1.getDate().pad(2),
            pastDate2alt2plain: (pastDate2alt2.getYear() + 1900) + '-' + (pastDate2alt2.getMonth() + 1).pad(2) + '-' + pastDate2alt2.getDate().pad(2),
            pastDate3: pastDate3,
            pastDate3alt1plain: (pastDate3alt1.getYear() + 1900) + '-' + (pastDate3alt1.getMonth() + 1).pad(2) + '-' + pastDate3alt1.getDate().pad(2),
            pastDate3alt2plain: (pastDate3alt2.getYear() + 1900) + '-' + (pastDate3alt2.getMonth() + 1).pad(2) + '-' + pastDate3alt2.getDate().pad(2),
            pastDate3Plain: (pastDate3.getYear() + 1900) + '-' + (pastDate3.getMonth() + 1).pad(2) + '-' + pastDate3.getDate().pad(2)
           };
  };
});
