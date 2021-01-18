      google.charts.load('current', {'packages':['line', 'corechart']});
      google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var button = document.getElementById('change-chart');
      var chartDiv = document.getElementById('chart_div');

      var data = new google.visualization.DataTable();
      data.addColumn('date', '');
      data.addColumn('number', "");

      data.addRows([
        [new Date(2020, 8, 1), 10000],
        [new Date(2020, 8, 3), 10000],
        [new Date(2020, 8, 4), 28000],
        [new Date(2020, 8, 6), 20000],
        [new Date(2020, 8, 9), 10000],
        [new Date(2020, 8, 12), 25000],
        [new Date(2020, 8, 16), 20000],
        [new Date(2020, 8, 20), 3000]
     
      ]);

      var materialOptions = {
        chart: {
          title: ''
        },
        width: '100%',
        height: 400,
        color:"red",
        series: {
          // Gives each series an axis name that matches the Y-axis below.
          0: {
            color: 'red',
          },
          1: {axis: ''}
        },
        axes: {
          // Adds labels to each axis; they don't have to match the axis names.
          y: {
            Temps: {label: ''},
            Daylight: {label: ''}
          }
        }
      };

      

      function drawMaterialChart() {
        var materialChart = new google.charts.Line(chartDiv);
        materialChart.draw(data, materialOptions);
        button.innerText = 'Change to Classic';
        button.onclick = drawClassicChart;
      }

      function drawClassicChart() {
        var classicChart = new google.visualization.LineChart(chartDiv);
        classicChart.draw(data, classicOptions);
        button.innerText = 'Change to Material';
        button.onclick = drawMaterialChart;
      }

      drawMaterialChart();

    }