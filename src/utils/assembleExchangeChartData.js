// assembleExchangeChartData.js

export const assembleExchangeChartData = (rawData1, rawData2, reverse) => {
  let dayLabels = null;
  let dayPrices = null;

  // cur to usd case
  if (rawData1 && !rawData2) {
    dayLabels = rawData1.prices.map((price) =>
      new Date(price[0]).toLocaleDateString()
    );
    dayPrices = rawData1.prices.map((price) => price[1]);
  }

  // cur to cur case
  if (rawData1 && rawData2) {
    dayLabels = rawData1.prices.map((price) =>
      new Date(price[0]).toLocaleDateString()
    );

    dayPrices = [];
    for (let i in rawData1.prices) {
      dayPrices.push(rawData1.prices[i][1] / rawData2.prices[i][1]);
    }
  }

  //if graph should be reversed
  if (dayPrices && reverse) {
    dayPrices = dayPrices.map((price) => 1 / price);
  }

  const chartData = {
    labels: dayLabels,
    datasets: [
      {
        data: dayPrices,
        backgroundColor: [
          "#77CEFF",
          "#0079AF",
          "#123E6B",
          "#97B0C4",
          "#A5C8ED",
        ],
      },
    ],
  };

  // const  options = {
  //   radius: 5,
  //   hitRadius: 30,
  //   hoverRadius: 12,
  //   responsive: true,
  //   // animation: {
  //   //   // from https://www.chartjs.org/docs/latest/samples/animations/delay.html  --> Delay Tab
  //   //   onComplete: () => {
  //   //     delayed = true;
  //   //   },
  //   //   delay: (context) => {
  //   //     let delay = 0;
  //   //     if (context.type === "data" && context.mode === "default" && !delayed) {
  //   //       delay = context.dataIndex * 300 + context.datasetIndex * 100;
  //   //     }
  //   //     return delay;
  //   //   }
  //   // },
  //   scales: {
  //     y: {
  //       ticks: {
  //         callback: function (value) {
  //           return "$" + value;
  //         }
  //       }
  //     }
  //   }
  // }

  return chartData;
};
