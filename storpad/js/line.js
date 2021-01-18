

function renderlinegarph(){
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawBackgroundColor);
}

function drawBackgroundColor() {
    let data = new google.visualization.DataTable();
    data.addColumn('date', '');
    data.addColumn('number', '');

    data.addRows(setlinedata());

    let options = {
        hAxis: {
            title: '',
            textStyle: {
                color: '#4C5862',
                fontSize: 12,
                fontName: 'Gilroy_Medium'
            },
            baselineColor: '#EBEDF0',
            gridlines: {
                color: '#EBEDF0'
            },
            format: 'd MMM '
        },
        vAxis: {
            title: '',
            textStyle: {
                color: '#4C5862',
                fontSize: 12,
                fontName: 'Gilroy_Medium'
            },
            baselineColor: '#EBEDF0',
            gridlines: {
                color: '#EBEDF0'
            }
        },
        backgroundColor: '#ffffff',
        chartArea: {
            width:'80%',

        },
        colors: ['#F96E7D'],
        pointSize: 5
    };

    let chart = new google.visualization.LineChart(document.getElementById('chart_div2'));
    chart.draw(data, options);

}


document.getElementById('selection-line').addEventListener('change',renderline);

function renderline(){
    let listFilter;
    let datakey = this.options[this.selectedIndex].getAttribute('datakey');
    datakey == 'Today' ? listFilter = filterdate() : listFilter = PointDefine(datakey);
    gruppingdataline(listFilter);
}
let datalistline;
function gruppingdataline(list){
    let betwenObject = {};
    for(let key in list){
        if(betwenObject[list[key].date_create]){
            betwenObject[list[key].date_create] += parseInt(list[key].summ_with_discount_vitrina);
        }
        else{
            betwenObject[list[key].date_create] = parseInt(list[key].summ_with_discount_vitrina);
        }
    }
    let testarray = [];
    for(let key in betwenObject){
        let betSum = {};
        let sum = key.split('.');
        sum = parseInt(sum[0]) + (parseInt(sum[1]) * 1000) + parseInt(sum[2])
        betSum[sum] = betwenObject[key];
        testarray.push(betSum);
    }
    testarray = testarray.sort((a,b)=>{
        return Object.keys(a) - Object.keys(b)
    });

    var listsorted = {};
    for(let key in testarray){
        for(let keytwo in testarray[key]){
            for(let kk in betwenObject) {
                if (betwenObject[kk] == testarray[key][keytwo]){
                    listsorted[kk] = betwenObject[kk];
                }
            }

        }
    }
    let data = [];
    for(let key in listsorted){
        let currentar = [];
        let currentdate = key.split('.');
        let teksum = listsorted[key];
        console.log(new Date(currentdate[2],currentdate[1],currentdate[0]));
        currentar.push(new Date(currentdate[2],--currentdate[1],currentdate[0]));
        currentar.push(parseInt(teksum));
        data.push(currentar);
    }
   /* data = data.reverse();*/
    datalistline = data;
    renderlinegarph();
}

function setlinedata(){
    let startarray = [
        [new Date(2019, 0, 19), 90000],
        [new Date(2019, 1, 1), 10000],
        [new Date(2019, 1, 20), 8000],
        [new Date(2019, 1, 22), 80000],
        [new Date(2019, 3, 10), 100000],
        [new Date(2019, 4, 18), 480000],
        [new Date(2019, 4, 30), 190000],
        [new Date(2019, 5, 21), 110000],
        [new Date(2019, 6, 11), 40000],
        [new Date(2019, 6, 19), 52000],
        [new Date(2019, 6, 27), 103000],
        [new Date(2019, 7, 10), 1300000],
        [new Date(2019, 8, 8), 200000],
        [new Date(2019, 9, 1), 65000],
        [new Date(2019, 10, 1), 290000]
    ];
    return typeof datalistline === 'object' ?  datalistline:  startarray;
}

function startLine(key){
    let listFilter;
    let datakey = key || '30'
    datakey == 'Today' ? listFilter = filterdate() : listFilter = PointDefine(datakey);
    gruppingdataline(listFilter);
}





