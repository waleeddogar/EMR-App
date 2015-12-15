var firebaseRef = new Firebase("https://emrwaitingapp.firebaseio.com/");

var adder = "";
var dataObjJson;
var latestSnapshot = null;
var clientSnapshot = null;


var nameList = [];
var clientNames = [];
var portfolioList = [];
var portfolioDataset = [];

$(document).ready(function () {
    getClientName();
    getPortfolios();
});

//get latest trends
function getPortfolios() {
    firebaseRef.child("portfolios").on("value", function (snapshot) {
        latestSnapshot = snapshot;
        updateView(latestSnapshot);
    })
};

function getClientName() {
    firebaseRef.child("clients").on("value", function (snapshot) {
        clientSnapshot = snapshot;
        readClients(clientSnapshot);
    })
};

function readClients(snap) {

    dataObjJson = snap.val();

    //iterate through each object
    $.each(dataObjJson, function (index, resObject) {

        var clientJSON = {
            id: "",
            name: "",
        }

        clientJSON.id = index;
        clientJSON.name = resObject.full_name;
        console.log(clientJSON.id);
        console.log(clientJSON.name);
        clientNames.push(clientJSON);
    });

    console.log(clientNames[0].id);

}

function updateView(snap) {
    console.log(snap);

    dataObjJson = snap.val();
    console.log(dataObjJson);

    //iterate through each object
    $.each(dataObjJson, function (index, resObject) {

        var portfolioItemJSON = {
            id: '',
            investments: {},
        }
        var x = index;
        portfolioItemJSON.id = index;
        portfolioItemJSON.investments = resObject;
        console.log(portfolioItemJSON.id);
        console.log(portfolioItemJSON.investments);
        portfolioList.push(portfolioItemJSON);

    });

    portfolioDataset = translateInvestments(portfolioList);
    translateNames(portfolioList);
    updateHiCharts(portfolioDataset[0]);
};

function changeGraph(i) {
    updateHiCharts(portfolioDataset[i]);
}

function translateNames(portfolioList) {

    for (var i = 0; i < portfolioList.length; i++) {
        var name = portfolioList[i].id.toString();
        console.log(name);
        nameList.push(name);
    }

    nameList.unshift("Overall Portfolio");

    console.log("nameLIST MOFO");
    for (var i = 1; i < nameList.length; i++) {
        console.log(clientNames[i - 1].name);
        var loc = existInArrayID(clientNames, nameList[i]);
        if (!(loc < 0)) {
            nameList[i] = clientNames[loc].name;
        }
        //console.log(nameList[i]);
    }

    portfolioNames = document.getElementById('portfolioNames');
    for (var i = 0; i < nameList.length; i++) {
        portfolioNames.options[portfolioNames.options.length] = new Option(nameList[i], i);
    }
}

function translateInvestments(portfolioList) {

    var completePortfolio = [];
    var advisorPortfolio = [];
    var investments = [];

    // for isolating the investments for next part
    for (var j = 0; j < portfolioList.length; j++) {
        investments.push(portfolioList[j].investments);
    }

    // For adding investments from 
    for (var i = 0; i < investments.length; i++) {
        var investmentData = [];

        $.each(investments[i], function (key, value) {
            var singleInvestment = {
                name: key,
                y: value
            };
            investmentData.push(singleInvestment);

            //if(!advisorPortfolio.hasOwnProperty(key)){
            if (0 > existInArray(advisorPortfolio, key)) {
                advisorPortfolio.push(singleInvestment);
            } else {
                advisorPortfolio[key] = advisorPortfolio[key] + value;
            }

        });
        completePortfolio.push(investmentData);
    }

    // Adding advisorPortfolio at the beginning
    completePortfolio.unshift(advisorPortfolio);
    console.log(completePortfolio);

    return completePortfolio;
}

function existInArray(array, key) {

    for (var i = 0; i < array.length; i++) {
        if (array[i].name == key) {
            return i;
        }
    }
    return -1;
}

function existInArrayID(array, key) {

    for (var i = 0; i < array.length; i++) {
        if (array[i].id == key) {
            return i;
        }
    }
    return -1;
}

function updateHiCharts(dataset) {

    // Build the chart
    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Portfolio Performance    '
        },
        tooltip: {
            pointFormat: '{series.id}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: dataset //[{name:'this',y:50},{name:'that',y:50}]
            }]
    });
};