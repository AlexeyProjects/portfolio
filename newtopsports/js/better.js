var ctx = document.getElementById('ordersChart').getContext('2d');
var barChart = document.getElementById('bar-chart').getContext('2d');
var chart1 = document.getElementById('pieChart');

let rows = [];
let hiddenRows = [];
let currentRows = [];

let dataTable = [];
let dataBar = [];
let dataDonat = {};
let preOrderDonat = [];
let currentDonut = {};
let redrDonut = {};
let preOrderTable = [];
let preOrderBar = [];

let chartDonut = null;
let chartBar = null;

let toogleTable = document.getElementById("table-toggle");
let toogleBar = document.getElementById("bar-chart-tgl-1");

let sumShip = 0;
let sumBeforeShip =0;

let titles = ['активный заказ', 'активных заказа', 'активных заказов'];
let donutText = '';
let preOrderDonutText = '';

let events = {
	"Ожидает подтверждения" : {"Class": "vputi",
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
					"id":"status4"},
	"Недопоставка":{"Class": "nedopost",
					"Active":true,
					"id":"status5"}
}

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


startPageWork();


async function startPageWork() 
{
	speedChart();

	dataTable = await queryToServer('orderslist')

	dataDonat = getDonutData(dataTable)
	preOrderTable = getDataPreOrder(dataTable)
	preOrderDonat = getDonutData(preOrderTable)

	dataBar = getBarData(dataTable)
	preOrderBar = getBarData(preOrderTable)

	currentDonut = {...dataDonat}
	redrDonut = {...dataDonat}

	getDataSettleBlocks();

	console.log(dataTable)
	console.log(preOrderTable)
	console.log(dataDonat)
	console.log(preOrderDonat)
	console.log(dataBar)
	console.log(preOrderBar)

	drawTable(dataTable)
	drawDonat(redrDonut,getDonutText(currentRows), false)
	drawBar(dataBar, false)

	toogleClick()

	eventForEvents()
	
	getBanners()
	
}

async function getBanners() 
{
	let bannersSrc =await queryToServer('getbanners')

	let banners = document.querySelector('.banners')
	let content = ''

	for (let i = 0; i < bannersSrc.length; i++)
	{
		content += `<div class="banner">
		                <a class="aBanner" href="https://new.topsports.ru/dashboard/">
		                  <img id="img${i}" src="jpg/${bannersSrc[i]['src']}" alt="banner">
		                  <div id="jpg${i}" class="bContent">${bannersSrc[i]['text']}</div>
		                </a>
		            </div>`
	}

	banners.innerHTML = content

	for (let i = 0; i < bannersSrc.length; i++)
	{
		document.getElementById(`img${i}`).onmouseout = function()
		{
			document.getElementById(`jpg${i}`).style.visibility='hidden'
		}
		document.getElementById(`img${i}`).onmouseover = function()
		{
			document.getElementById(`jpg${i}`).style.visibility='visible'
		}
	}
	
}

function queryToServer(query)
{
	return fetch('api.php', {
	    method: "POST",
	    headers: {
	        'Content-Type': 'application/json',
	        'Accept': 'application/x-www-form-urlencoded;charset=UTF-8'
	    },
	    body: JSON.stringify({type: query})
 	})
	.then((response) => {
	    return response.json();
	})
	.then((data) => {
	            
		return data;
	});
}

/*----------ОТРИСОВКА----------*/
function drawDonat(data, dT, redraw)
{
	if (redraw)
	{
		chartDonut.destroy();
	}
	let labels = Object.keys(data);
	let dataD = Object.values(data);
	chartDonut = new Chart(ctx, {
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
                  data: dataD,
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
          		text: '',
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
                left: 70,
                right: 70,
                top: -70,
                bottom: 0
              }
            },
            // адаптивность
            responsive: true,
            //  отклюдчаем лишнее свободное пространство вокруг графика

          }
			});
	document.querySelector('.orders-info').innerHTML = dT
}

function drawTable(data)
{
	let table = document.getElementById('table');
	content = '';
	let id = 0;
	data.forEach(element => {
		content += `<div id="row${id}" class="row">
	                      		<div class="textR">
	                        		<div class="nameO">${element["order_number"]} от ${element["order_date"]}</div>
	                      			<div class="typeO">${element["order_type"]}</div>
	                      		</div>
	                      		<div id="sum${id}" class="sumR">`;
		if (typeof element["sum"]["1"] != undefined)
		{
			if (element["sum"]["1"] > 0)
			{
				content += `<div id="vp${id}" class="pill vputi c10">${delimiterMoney(Math.ceil(element["sum"]["1"]))}</div>`;
			}
		}
		if (typeof element["sum"]["2"] != undefined)
		{
			if (element["sum"]["2"] > 0)
			{
				content += `<div id="vn${id}" class="pill vnali c10">${delimiterMoney(Math.ceil(element["sum"]["2"]))}</div>`;
			}
		}
		if (typeof element["sum"]["3"] != undefined)
		{
			if (element["sum"]["3"] > 0)
			{
				content += `<div id="sobr${id}" class="pill sobrn c10">${delimiterMoney(Math.ceil(element["sum"]["3"]))}</div>`;
			}
		}
		if (typeof element["sum"]["4"] != undefined)
		{
			if (element["sum"]["4"] > 0)
			{
				content += `<div id="ot${id}" class="pill otgrz c10">${delimiterMoney(Math.ceil(element["sum"]["4"]))}</div>`;
			}
		}
		if (typeof element["sum"]["5"] != undefined)
		{
			if (element["sum"]["5"] > 0)
			{
				content += `<div id="ot${id}" class="pill nedopost c10">${delimiterMoney(Math.ceil(element["sum"]["5"]))}</div>`;
			}
		}		                        
	    content += `</div>
	                </div>`;

	   	id++;

    })

    table.innerHTML = content;
    for (let i = 0; i < id; i++)
	{
		let row = [document.getElementById(`row${i}`), data[i]]
	    //rows.push(document.getElementById(`row${i}`));
	    rows.push(row);
	}
	//console.log(rows)
	currentRows = []
	currentRows = [...rows]
}

function drawBar(data, redraw)
{
	if(redraw)
	{
		chartBar.destroy();
	}

	chartBar = new Chart(barChart, {
			    type: 'bar',  // тип графика
			    // Отображение данных
			    data: {
			      labels: data[1],
			      //  Настройка отображения данных
			      datasets: [{
			        label: false,  //  название диаграммы
			        barPercentage: 1,
			        barThickness: 'flex',
			        maxBarThickness: 120,
			        minBarLength: 1,
			        data: data[0],
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

}
/*----------ОТРИСОВКА----------*/

/*----------ПОЛУЧЕНИЕ ДАННЫХ----------*/
async function getDataSettleBlocks()
{
	let blocks = document.querySelector('.settle-blocks')
	let beforeShipment = blocks.querySelector('#before-shipment').querySelector('.money')
	let sumShipment = blocks.querySelector('#sum-shipment').querySelector('.money')
	sumBeforeShip = 0
	sumShip = 0
	let numBeforeShip = 0
	let numShip = 0
	dataTable.forEach(element => {
		if (element["sum"]["1"] != undefined || element["sum"]["2"] != undefined)
		{
			if (element["sum"]["1"] != undefined)
			{
				let el = element["sum"]["1"]
				sumBeforeShip += Number(el)
			}
			if (element["sum"]["2"] != undefined)
			{
				let el = element["sum"]["2"]
				sumBeforeShip += Number(el)
			}
			//sumBeforeShip += Number(element["order_sum"])
			numBeforeShip++
		}
		if (element["sum"]["4"] != undefined)
		{
			let el = element["sum"]["4"]
			sumShip += Number(el)
			//sumShip += Number(element["order_sum"])
			numShip++
		}
	})

	let deposits = await queryToServer('deposits')

	blocks.querySelector('#overpayment').querySelector('.money').innerHTML = `${delimiterMoney(Math.ceil(deposits['kredit']))}`
	blocks.querySelector('#deposit').querySelector('.money').innerHTML = `${delimiterMoney(Math.floor(deposits['depos']))}`
	document.getElementById('activeorder').textContent = deposits["numkredit"];
	beforeShipment.innerHTML = `${delimiterMoney(Math.ceil(sumBeforeShip))}`
	document.getElementById('active-before-ships').innerHTML = `${numBeforeShip}`
	sumShipment.innerHTML = `${delimiterMoney(Math.ceil(sumShip))}`
	document.getElementById('active-ships').innerHTML = `${numShip}`

	if (!deposits["expired"])
	{
		document.querySelector('.attention').style.visibility = 'hidden'
	}
	
	document.getElementById('balance').innerHTML = `${deposits["numdepos"]}`
	document.getElementById('payment-before').innerHTML = `${deposits["date_expired"]}`
}


function delimiterMoney(num) 
{
	//console.log(String(num))
	let strNum = String(num).split("").reverse();
	let res = '';

	for (let i = 0; i < strNum.length; i++)
	{
		res += strNum[i]
		if ((((i+1) % 3) == 0) && (i != (strNum.length-1)))
		{
			res += ' ';
		}
	}
	
	return res.split("").reverse().join("")
}

function getDonutData(data)
{
	let statuses = {
		"Отгружен": 0,
		"Собран": 0,
		"Ожидает подтверждения": 0,
		"В наличии": 0 ,
		"Недопоставка": 0
	}
	data.forEach(element => {
		if (element["sum"]["1"] != undefined)
		{
			statuses["Ожидает подтверждения"] += Math.ceil(Number(element["sum"]["1"]))
		}
		if (element["sum"]["2"] != undefined)
		{
			statuses["В наличии"] += Math.ceil(Number(element["sum"]["2"]))
		}
		if (element["sum"]["3"] != undefined)
		{
			statuses["Собран"] += Math.ceil(Number(element["sum"]["3"]))
		}
		if (element["sum"]["4"] != undefined)
		{
			statuses["Отгружен"] += Math.ceil(Number(element["sum"]["4"]))
		}
		if (element["sum"]["5"] != undefined)
		{
			statuses["Недопоставка"] += Math.ceil(Number(element["sum"]["5"]))
		}
	})

	return statuses
}

function getDataPreOrder(data)
{
	let preOrderData = [];
	data.forEach(element => {
		if (typeof element["order_type"] != undefined)
		{
			if (element["order_type"].indexOf('Предзаказ') >= 0)
			{
				preOrderData.push(element);
			}
		}
	})

	return preOrderData;
}

function getBarData(data)
{
	let valueForBar = []
	let years = []
	let sum = []
	data.forEach(element => {
		let year = ''
		if (element["order_date"] != undefined)
		{
			year = element["order_date"].split('.')[2]
			if (years.indexOf(year) === -1)
			{
				years.push(year)
				sum.push(0)
			}
			sum[years.indexOf(year)] += Number(element["order_sum"])
		}
	})
	console.log(years)
	console.log(sum)
	for (let i = 0 ; i < years.length; i++)
	{
		let min = Number(years[i])
		let num = 0
		let need = false
		for (let j = i; j < years.length; j++)
		{
			if (Number(years[j]) < min)
			{
				min = years[j]
				num = j
				need = true
			}
		}
		if (need)
		{
			let tmp = years[i]
			years[i] = years[num]
			years[num] = tmp

			tmp = sum[i]
			sum[i] = sum[num]
			sum[num] = tmp
		}
	}
	console.log(years)
	console.log(sum)

	valueForBar.push(sum)
	valueForBar.push(years)

	return valueForBar
}


function getDonutText(data)
{
	let num = 0
	let sum = 0
	data.forEach(element => {
		if (!element[0].classList.contains('displayNone'))
		{
			num++
			sum += Number(element[1]["order_sum"])
		}
		
	})
	let cases = [2, 0, 1, 1, 1, 2];
	let str = titles[ (num%100>4 && num%100<20)? 2 : cases[(num%10<5)?num%10:5]];

	return `${num} ${str} на общую сумму ${delimiterMoney(Math.ceil(sum))} Р`
}

/*----------ПОЛУЧЕНИЕ ДАННЫХ----------*/
 
/*----------ПЕРЕРИСОВКА-----------*/

function toogleClick()
{
	toogleTable.onclick = function()
	{
		if (this.classList.contains('checked'))
		{
			this.classList.remove('checked');
			currentDonut = dataDonat
			redrDonut = {...currentDonut}
			redrawTable(dataTable);
		}
		else
		{
			this.classList.add('checked');
			currentDonut = preOrderDonat
			redrDonut = {...currentDonut}
			redrawTable(preOrderTable);
		}
		
	}

	toogleBar.onclick = function()
	{
		if (this.classList.contains('checked'))
		{
			this.classList.remove('checked');
			drawBar(dataBar, true)
		}
		else
		{
			this.classList.add('checked');
			drawBar(preOrderBar, true)
		}
	}
}


function redrawTable(data)
{
	let table = document.getElementById('table');
	content = '';
	table.innerHTML = content;
	rows = [];
	drawTable(data);
	atChangeTable();	
}
/*----------ПЕРЕРИСОВКА-----------*/


function checkRows(rowsTable)
{
	hiddenRows = []
	rowsTable.forEach(element =>{
		if (element[0].classList.contains('displayNone'))
		{
			let row = element[0].querySelector('.sumR').querySelectorAll('div')
			let hidden = true;
			row.forEach(el => {
				if (!el.classList.contains('displayNone'))
				{
					hidden = false;
				}
			})
			if (!hidden)
			{
				element[0].classList.remove('displayNone')
			}
		}
		else
		{
			let row = element[0].querySelector('.sumR').querySelectorAll('div')
			let hidden = true;
			row.forEach(el => {
				if (!el.classList.contains('displayNone'))
				{
					hidden = false;
				}
			})
			if (hidden)
			{
				hiddenRows.push(element)
			}
		}
		
	})
}

function hiddeRows()
{
	hiddenRows.forEach(element =>{
		element[0].classList.add('displayNone')
	})
}
/*------------------------------------------*/

function atChangeTable()
{	
	let keys = Object.keys(events);
	keys.forEach(element =>{
		let el = document.getElementById(events[element]["id"]);
		let eC = events[element]["Class"];

		if (events[element]["Active"])
		{
			currentRows.forEach(elem =>{
				if ((typeof(elem[0].querySelector('.'+eC)) != undefined) && (elem[0].querySelector('.'+eC) != null))
				{
					elem[0].querySelector('.'+eC).classList.remove('displayNone');
				}
			})
		}
		else
		{
			currentRows.forEach(elem =>{
				if ((typeof(elem[0].querySelector('.'+eC)) != undefined) && (elem[0].querySelector('.'+eC) != null))
				{
					elem[0].querySelector('.'+eC).classList.add('displayNone');
				}
			})
			redrDonut[element] = 0
		}
	})
	checkRows(currentRows);
	hiddeRows();
	console.log(redrDonut)
	drawDonat(redrDonut, getDonutText(currentRows),true)
	
}



function getOnClick(element, eventName, eventClass)
{
	element.onclick = function()
	{
		if (events[eventName]["Active"])
		{
			currentRows.forEach(el =>{
				if ((typeof(el[0].querySelector('.'+eventClass)) != undefined) && (el[0].querySelector('.'+eventClass) != null))
				{
					el[0].querySelector('.'+eventClass).classList.add('displayNone');
				}
			})
			events[eventName]["Active"] = false;
			this.classList.remove(this.id)
			this.classList.add('status6')
			redrDonut[eventName] = 0
		}
		else
		{
			currentRows.forEach(el =>{
				if ((typeof(el[0].querySelector('.'+eventClass)) != undefined) && (el[0].querySelector('.'+eventClass) != null))
				{
					el[0].querySelector('.'+eventClass).classList.remove('displayNone');
				}
			})
			events[eventName]["Active"] = true;
			this.classList.add(this.id)
			this.classList.remove('status6')
			redrDonut[eventName] = currentDonut[eventName]
		}
		checkRows(currentRows);
		hiddeRows();
		drawDonat(redrDonut,getDonutText(currentRows),true)
	}
	
}

function eventForEvents()
{
	let keys = Object.keys(events);
	keys.forEach(element =>{
		let el = document.getElementById(events[element]["id"]);
		let eC = events[element]["Class"];
		getOnClick(el, element, eC);
	})
}	





/*---СТАРЫЙ КОД---*/
async function speedChart() 
{
  	let speedChartDiv = document.querySelector('.speed-chart');
	let gaugeEl = document.querySelector('.gauge'); //  сама диаграмма
	let reclResult = document.querySelector('.recl-result');  //  надпись с результатом под диаграммой
	let speedPointer = document.querySelector('.speed-point');  //  стрелка указатьель в диаграмме

	let recl = await queryToServer('recllist')

	//  Автовыравнивание стрелки диаграммы
	speedPointer.style.left = speedChartDiv.clientWidth / 2 + 'px';
	speedPointer.style.top = gaugeEl.clientHeight + 'px';

	//  данные для примера, так как источник оригинальных данных для этих значений неизвестен
	let totalRecls = recl.length;  //  количество поданных всего рекламаций пользователем
	let doneRecls = 0;
	recl.forEach(element => {
		if ((element["status_text"] == 'Исполнена') || (element["status_text"] == 'Не удовлетворена'))
		{
			doneRecls++
		}
	})
	 //  колличество обработанных рекламаций пользователя
	let reclsInWork = totalRecls - doneRecls; //  рекламации в работе
	let result = doneRecls / totalRecls;  //  коэффицент обработанных рекламаций
	let pointerStep = 0.005 * (result * 100).toFixed(0);
	let pointerDeg = -0.25 + pointerStep;


  //  функция для динамического запуска диаграммы с данными
	function setGaugeValue(gauge, value) 
	{  //  gauge - диаграмма, value - данные (в формате от 0.01 (1%) до 1 (100%))
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


function declOfNum(number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5]];
}


let ordersInfo = document.querySelector('.orders-info');

if (window.innerWidth > 1927) {
  ordersChart.parentNode.style.width = '100%';
  /*ordersChart.parentNode.style.height = '493px';*/
  ordersInfo.style.left = (chart1.offsetWidth / 2) - (ordersInfo.offsetWidth / 2) + 'px';
  /* ordersInfo.style.top = (chart1.offsetHeight / 2) - (ordersInfo.offsetHeight / 2) + 'px'; */

} else if (window.innerWidth > 1337 && window.innerWidth < 1927) {
  ordersChart.parentNode.style.width = '100%';
  /*ordersChart.parentNode.style.height = '393px';*/
  ordersInfo.style.left = (chart1.offsetWidth / 2) - (ordersInfo.offsetWidth / 2) + 'px';
  ordersInfo.style.top = (chart1.offsetHeight / 2) - (ordersInfo.offsetHeight / 2) + 'px';
}
 else if (window.innerWidth < 1337 && window.innerWidth > 1080) {
  ordersChart.parentNode.style.width = '50%';
  /*ordersChart.parentNode.style.height = '600px';*/
}
  else if (window.innerWidth < 1080 && window.innerWidth > 890) {
  ordersChart.parentNode.style.width = '50%';
  /*ordersChart.parentNode.style.height = '400px';
  ordersInfo.style.left = chart1.offsetWidth / 2 + 'px';
  ordersInfo.style.top = chart1.offsetHeight / 2 + 'px';*/
} 
  else if (window.innerWidth < 890 && window.innerWidth > 590) {
  ordersChart.parentNode.style.width = '100%';
  /*ordersChart.parentNode.style.height = '600px';
  ordersInfo.style.left = chart1.offsetWidth / 2 + 'px';
  ordersInfo.style.top = chart1.offsetHeight / 2 + 'px';*/
}
  else if (window.innerWidth < 590) {
  ordersChart.parentNode.style.width = '100%';
  /*ordersInfo.style.left = chart1.offsetWidth / 2 + 'px';
  ordersInfo.style.top = chart1.offsetHeight / 2 + 'px';*/
}