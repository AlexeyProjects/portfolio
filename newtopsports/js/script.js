// КРУГОВОЙ ГРАФИК DASH BOARD //
var ctx = document.getElementById('ordersChart').getContext('2d');

let rows = [];
/*-----------------------------------------------------------------------*/
Chart.pluginService.register({
    beforeDraw: function (chart) {
      if (chart.config.options.elements.center) {
        //Get ctx from string
        var ctx = chart.chart.ctx;
        
        //Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
        //Start with a base font of 30px
        ctx.font = "30px " + fontStyle;
        
        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight);

        //Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse+"px " + fontStyle;
        ctx.fillStyle = color;
        
        //Draw text in center
        ctx.fillText(txt, centerX, centerY);
      }
    }
  });

fetch('api.php', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: JSON.stringify({type: "first"})
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            
            console.log(data);

            let dataForDonat = getDonatData(data);

            let labels = Object.keys(dataForDonat);
            let dataDonat = Object.values(dataForDonat);
            var сhart = new Chart(ctx, {
          type: 'doughnut', // тип графика

          // Отображение данных
          data: {
              //  Название линии
              labels: labels,
              //  Настройка отображения данных
              datasets: [{
                  //
                  label: false,
                  //  цвета шкал графика
                  backgroundColor: [ '#9FCB93', '#B5A6BB','#96B6D3', '#FBCD80'],
                  //  цвет бордера шкал и графика
                  borderColor: 'transparent',
                  //  данные для отображения
                  data: dataDonat,
                  //  Цвет бордеров шкал
                  borderColor: [
                    '#ffffff'
                  ],
                  //  расстояние между шкалами
                  borderWidth: 2
              }]
          },

          // Настройки отображения графика
          options: {
            // диаметр "кольца"
            cutoutPercentage: 70,
            elements: {
          center: {
            text: donutText,
                color: '#000000', // Default is #000000
                  fontStyle: 'Arial', // Default is Arial
                  minFontSize: 30,
                  sidePadding: 1 // Defualt is 20 (as a percentage)
          }
          },
            // отключение легенды
            legend: {
              display: false
            },
            //  поворот угла стартового значения
            rotation: 5,
            //  отступы графика
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: -10,
                bottom: 0
              }
            },
            // адаптивность
            responsive: true,
            //  отклюдчаем лишнее свободное пространство вокруг графика

          }
      });


			/**/
			getTable(data);
    });

function getDonatData(data)
{
	let statuses = {
		"Отгружен": 0,
		"Собран": 0,
		"Ожидает подтверждения": 0,
		"В наличии": 0 
	}

	data.forEach(element => {
		let status = element["order_status"];
		statuses[status]++;
	})
	console.log(statuses);

	return statuses;
}

/*--------Создает таблицу исходя из данных---------*/
function getTable(data)
{
	let table = document.getElementById('table');
	content = '';
	let id = 0;
	data.forEach(element => {
		content += `<div id="row${id}" class="row">
	                      		<div class="textR">
	                        		<div class="nameO">${element["order_number"]} от ${element["order_date"]}</div>
	                      			<div class="typeO">${element["order_event"]}</div>
	                      		</div>
	                      		<div id="sum${id}" class="sumR">`;
		if (typeof element["sum1"] != undefined)
		{
			if (element["sum1"] > 0)
			{
				content += `<div id="vp${id}" class="pill vputi c10">${element["sum1"]}</div>`;
			}
		}
		if (typeof element["sum2"] != undefined)
		{
			if (element["sum2"] > 0)
			{
				content += `<div id="vn${id}" class="pill vnali c10">${element["sum2"]}</div>`;
			}
		}
		if (typeof element["sum3"] != undefined)
		{
			if (element["sum3"] > 0)
			{
				content += `<div id="sobr${id}" class="pill sobrn c10">${element["sum3"]}</div>`;
			}
		}
		if (typeof element["sum4"] != undefined)
		{
			if (element["sum4"] > 0)
			{
				content += `<div id="ot${id}" class="pill otgrz c10">${element["sum4"]}</div>`;
			}
		}	                        
	    content += `</div>
	                </div>`;

	   	id++;

    })

    table.innerHTML = content;
    for (let i = 0; i < id; i++)
	{
	    rows.push(document.getElementById(`row${i}`));
	}
	console.log(rows);
}

/*----Объект содержащий информацию о кнопках----*/
let events = {
	"Ожидается" : {"Class": "vputi",
					"Active":true,
					"id":"status1"},
	"В наличии" : {"Class": "vnali",
					"Active":true,
					"id":"status2"},
	"Собран": {"Class": "sobrn",
					"Active":true,
					"id":"status3"},
	"Отгружен": {"Class": "otgrz",
					"Active":true,
					"id":"status4"}
}

/*----Функция присваиваиня события при клике для каждой кнопки----*/
function getOnClick(element, eventName, eventClass)
{
	element.onclick = function()
	{
		if (events[eventName]["Active"])
		{
			rows.forEach(el =>{
				if ((typeof(el.querySelector('.'+eventClass)) != undefined) && (el.querySelector('.'+eventClass) != null))
				{
					el.querySelector('.'+eventClass).classList.add('displayNone');
				}
			})
			events[eventName]["Active"] = false;
		}
		else
		{
			rows.forEach(el =>{
				if ((typeof(el.querySelector('.'+eventClass)) != undefined) && (el.querySelector('.'+eventClass) != null))
				{
					el.querySelector('.'+eventClass).classList.remove('displayNone');
				}
			})
			events[eventName]["Active"] = true;
		}
	}
	console.log(element);
}  

eventForEvents();

        
/*----Функция раздающая и подготавливающая переменные для oncliclk----*/			                        
function eventForEvents()
{
	let keys = Object.keys(events);
	keys.forEach(element =>{
		let el = document.getElementById(events[element]["id"]);
		let eC = events[element]["Class"];
		console.log(el + element + eC);
		getOnClick(el, element, eC);
	})
}			                                    

              

/*-----------------------------------------------------------------------*/


var barChart = document.getElementById('bar-chart').getContext('2d');

/*------------------------------------*/
	fetch('api.php', {
       	method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: JSON.stringify({type: "second"})
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            
            //console.log(data);

            let dataForBar = getBarData(data);

        	var barChartObj = new Chart(barChart, {
			    type: 'bar',  // тип графика
			    // Отображение данных
			    data: {
			      labels: [`2017`, `2018`, `2019`, `2020`,'2021'],
			      //  Настройка отображения данных
			      datasets: [{
			        label: 'test',  //  название диаграммы
			        barPercentage: 1,
			        barThickness: 'flex',
			        maxBarThickness: 120,
			        minBarLength: 1,
			        data: dataForBar,
			        backgroundColor: ['#9FCB93', '#F7AC93', '#96B6D3', '#B5A6BB', '#FBCD80']
			      }]
			    },
			    options: {
			      legend: false,  // отображение/скрытие названия диаграммы
			      scales: {
			        xAxes: [{
			          gridLines: {
			            offsetGridLines: true,
			            //  Убрать/показать сетку
			            drawOnChartArea: true
			          }
			        }],
			        yAxes: [{
			          ticks: {
			            //  Начало всегда с нуля
			            beginAtZero: true
			          },
			          gridLines: {
			            offsetGridLines: true,
			            //  Убрать/показать сетку
			            drawOnChartArea: false
			          }
			        }]
			      },
			      // адаптивность
			      responsive: true,
			      maintainAspectRatio: false, // отклюдчаем лишнее свободное пространство вокруг графика
			    }
			  })
        });

function getBarData(data)
{
	let d = data[0];
	let keysD = Object.keys(d);
	let valueForBar = [];
	keysD.forEach(element => {
		 let values = Object.values(d[element]);
		 let sum = 0;
		 values.forEach(val => sum+=Number(val));
		 valueForBar.push(sum);
	});
	

	return valueForBar;
}
/*------------------------------------*/

// КРУГОВОЙ ГРАФИК DASH BOARD END //
function speedChart() {
  var speedChartDiv = document.querySelector('.speed-chart');
  var gaugeEl = document.querySelector('.gauge'); //  сама диаграмма
  var reclResult = document.querySelector('.recl-result');  //  надпись с результатом под диаграммой
  var speedPointer = document.querySelector('.speed-point');  //  стрелка указатьель в диаграмме

  //  Автовыравнивание стрелки диаграммы
  speedPointer.style.left = speedChartDiv.clientWidth / 2 + 'px';
  speedPointer.style.top = gaugeEl.clientHeight + 'px';

  //  данные для примера, так как источник оригинальных данных для этих значений неизвестен
  let totalRecls = "20";  //  количество поданных всего рекламаций пользователем
  let doneRecls = "15"; //  колличество обработанных рекламаций пользователя
  let reclsInWork = totalRecls - doneRecls; //  рекламации в работе
  let result = doneRecls / totalRecls;  //  коэффицент обработанных рекламаций
  let pointerStep = 0.005 * (result * 100).toFixed(0);
  let pointerDeg = -0.25 + pointerStep;


  //  функция для динамического запуска диаграммы с данными
  function setGaugeValue(gauge, value) {  //  gauge - диаграмма, value - данные (в формате от 0.01 (1%) до 1 (100%))
    if (value < 0 || value > 1) {
      return;
    }

    gauge.querySelector('.g-fill').style.transform = `rotate(${value / 2}turn)`;  //  работа спид-диагараммы согласно переданным данным данными
    speedPointer.style.transform = `rotate(-0.25turn)`; //  поворот стрекли согласно данным шкалы
    setTimeout(() => {
      speedPointer.style.transform = `rotate(${pointerDeg}turn)`; //  поворот стрекли согласно данным шкалы
    }, 500);

    //  отображение результата в надписи

    if (Number(totalRecls) > 0) {
      reclResult.innerHTML = `Мы обработали ${Math.round(value * 100)}% ваших обращений. В работе ${reclsInWork} ${declOfNum(reclsInWork,['обращение','обращения','обращений'])}`;
    } else if (Number(totalRecls) <= 0) {
      reclResult.innerHTML = 'Вы не подавали рекламаций';
    }
  }

  //  вызов функции с пользовательскими данными
  setGaugeValue(gaugeEl, result.toFixed(2));
}
speedChart();


let totalOrdersSum = 70;

function declOfNum(number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5]];
}

var ordersInfo = document.querySelector('.orders-info');

function getOrdersInfo(data) {
  var totalOrders = 1;
  /*var trs = querySelectorAll('titleOrder');

  for (let i = 0; i < data.length; i++) {
    totalOrders++;
  }
*/
  ordersInfo.textContent = `${totalOrders}
    ${declOfNum(totalOrders, ['активный', 'активных', 'активных'])}
    ${declOfNum(totalOrders, ['заказ', 'заказа', 'заказов'])} на общую сумму
    ${totalOrdersSum.toLocaleString('ru-RU')} руб.`;
}
/*getOrdersInfo();*/

var totalOrders = 1;
let donutText = (`${totalOrders} ${declOfNum(totalOrders,['активный', 'активных', 'активных'])} ${declOfNum(totalOrders, ['заказ', 'заказа', 'заказов'])} на общую сумму ${totalOrdersSum.toLocaleString('ru-RU')} руб.`);
console.log(donutText);
