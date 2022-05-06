// assembleWalletChartData.js

export const assembleWalletChartData = (labels, data) => {

    const chartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
      ],
    };

    function shuffleData() {
      data.value = shuffle(data.value);
    }

    return chartData;
}