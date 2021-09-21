let dataTable
let firstRender = false;

async function createChartContainer(array) {
    dataTable = anychart.data.table();
    dataTable.addData(array);
    var mapping = dataTable.mapAs();
    mapping.addField("open", 1, "first");
    mapping.addField("high", 2, "max");
    mapping.addField("low", 3, "min");
    mapping.addField("close", 4, "last");
    mapping.addField("value", 4, "last");
    var chart = anychart.stock();

    var series = chart.plot(0).line(mapping);
    series.name("Price");
    var pricePlot = chart.plot(0);
    // pricePlot.height(5000)
    var stochasticPlot = chart.plot(1);

    var stochastic = stochasticPlot.stochastic(mapping, 10, "EMA", 3, "SMA", 3);
    stochastic_k = stochastic.kSeries();
    stochastic_k.stroke("blue");
    stochastic_d = stochastic.dSeries();
    stochastic_d.stroke("red");
    // stochasticPlot.height(5000)
    // stochasticPlot.width(5000)

    // var iterator = stochastic_k.data().createSelectable().getIterator()
    // while (iterator.advance()) {
    //     console.log(iterator.getKey());
    //     console.log(iterator.get('value'));
    // }

    chart.container('container')
    chart.draw();
    return chart
}

function testWS() {
    let ws = new WebSocket('wss://eqonex.com/wsapi');

    function heartbeat() {
        jsonString = {
            heartbeat: new Date().getTime()
        }
        ws.send(JSON.stringify(jsonString))
    }

    ws.onopen = function() {
        let requestString = 'CHART_' + randomString(10)
        let jsonString = {
            requestId: requestString,
            event: 'S',
            types: [4],
            symbols: ["BTC/USDC"],
            timespan: 4
        }
        ws.send(JSON.stringify(jsonString))
        setInterval(function() { heartbeat() }, 10000);
    }

    function randomString(len) {
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    ws.onmessage = async function(msg) {
        let data = JSON.parse(msg.data)
        if (data.o) {
            if (!firstRender) {
                let array = await collectData(data)
                await createChartContainer(array)
                firstRender = true;
            } else {
                appendData(data)
            }
        }
    }

    ws.onerror = function(msg) {
        console.log(msg.data)
    };

    ws.onclose = function() {
        console.log('closed')
    };
}

function appendData(data) {
    let latestData = [
        []
    ]
    latestData[0].push(new Date().getTime())
    latestData[0].push(roundDecimal(data.o))
    latestData[0].push(roundDecimal(data.h))
    latestData[0].push(roundDecimal(data.l))
    latestData[0].push(roundDecimal(data.c))
    dataTable.addData(latestData)
}

async function collectData(data) {
    let array = []
    let latestData = []
    if (data.o) {
        latestData.push(new Date().getTime())
        latestData.push(roundDecimal(data.o))
        latestData.push(roundDecimal(data.h))
        latestData.push(roundDecimal(data.l))
        latestData.push(roundDecimal(data.c))
        array.push(latestData)
        await Promise.all(data.chart.map(async element => {
            let data = []
            data.push(element[0])
            data.push(element[1] / 100)
            data.push(element[2] / 100)
            data.push(element[3] / 100)
            data.push(element[4] / 100)
            array.push(data)
        }))
    }
    return array
}

function roundDecimal(num) { return Math.round(num * 100) / 100; }

testWS()