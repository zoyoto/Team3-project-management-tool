const hostname = "localhost";
const port = 9000;

const http = require("http");
const querystring = require('querystring');

let cards;
let information = [{}];

let contexts;
let taskStatus = [];

function readCards() {
    const options = {
     hostname: hostname,
     port: port,
     path: '/db/read/cards',
     method: 'GET'
	}

    const req = http.request(options, res => {
        let data = '';

        res.on('data', function(chunk){
            data += chunk;
        });
        
        res.on('end', function(){
            cards = JSON.parse(data);

           addInformation();
        });
	});
    
    req.on('error', function(err) {
       console.log("error: ", err);
    });  

    req.end();
}


export function  ganttLayOut(ctx, options) {
    contexts = ctx;
    readCards();

}

function addInformation() {
    let items = [{}];
    taskStatus = [];
    information = [];

    for(const i in cards) {

       information[i] = {Task: cards[i]["title"], Duration: Number(cards[i]["duration"]), Predecessor: cards[i]["predecessor"]};

       taskStatus.push(Number(cards[i]["phaseStatus"]));
    }


    drawChart();
 }

function drawChart() {

    let tableLength = 500;
    let tableWidth = 300;
    let rowNum = information.length + 1;
    let columnNum = Object.keys(information[0]).length;
    let tableStartingPosition = {"x": 30, "y": 20};
    let chartStartingPosition = {'x': tableStartingPosition['x'] + tableLength, 'y': tableStartingPosition['y']};
    let chartLength = 300;
    let chartWidth = tableWidth;
    let rectWidthFactor = 0.6;
    let rectWidth = chartWidth * rectWidthFactor / rowNum;
    let notationStartingPositon = {'x': tableStartingPosition['x'], 'y': tableStartingPosition['y'] + tableWidth}
    let notationWidth = rectWidth / rectWidthFactor
    let notationLength = chartLength + tableLength
    let notationRectWidth = rectWidth
    let notationRectLength = 60

    drawTable(contexts, information, tableLength, tableWidth, rowNum, columnNum, tableStartingPosition);
    drawGanttChart(contexts, information, chartLength, chartWidth, chartStartingPosition, rectWidth, rectWidthFactor, taskStatus);
    drawNotation(contexts, notationStartingPositon, notationWidth, notationLength, notationRectWidth, notationRectLength)

}

function drawLine(ctx, position1, position2){
    ctx.beginPath();
    ctx.moveTo(...position1);
    ctx.lineTo(...position2);
    ctx.stroke();

}

function printText(ctx, value, xPosition, yPosition){
    ctx.textAlign = "center";
    ctx.font = "12px Verdana";
    ctx.strokeText(value, xPosition, yPosition)  
}

function drawRect(ctx, startingX, startingY, length, width){
    ctx.beginPath();
    ctx.rect(startingX, startingY, length, width);
    ctx.stroke();
}

function drawTable(ctx, information, tableLength, tableWidth, rowNum, columnNum, tableStartingPosition) {
    for (let row = 0; row <= rowNum; row++) {
        let position1 = [tableStartingPosition['x'], tableStartingPosition['y'] + row * tableWidth / rowNum]
        let position2 = [tableStartingPosition['x'] + tableLength, tableStartingPosition['y'] + row * tableWidth / rowNum]
        drawLine(ctx, position1, position2)
    }
    for (let column = 0; column <= columnNum; column++) {
        let position1 = [tableStartingPosition['x'] + column * tableLength / columnNum, tableStartingPosition['y']]
        let position2 = [tableStartingPosition['x'] + column * tableLength / columnNum, tableStartingPosition['y'] + tableWidth]
        drawLine(ctx, position1, position2)
    }
    let headers = Object.keys(information[0])
    for (let columnNo = 0; columnNo < columnNum; columnNo++) {
        let xPosition = tableStartingPosition['x'] + (tableLength / columnNum) * (0.5 + columnNo)
        let yPosition = tableStartingPosition['y'] + (tableWidth / rowNum) * 0.6
        printText(ctx, headers[columnNo], xPosition, yPosition)
    }
    information.forEach((tuple, rowNo) => {
        let entries = Object.values(tuple)
        entries.forEach((value, columnNo) => {
            let xPosition = tableStartingPosition['x'] + (tableLength / columnNum) * (0.5 + columnNo)
            let yPosition = tableStartingPosition['y'] + (tableWidth / rowNum) * (1.6 + rowNo)
            printText(ctx, value, xPosition, yPosition)
        })
    })

}

function drawGanttChart(ctx, information, chartLength, chartWidth, chartStartingPosition, rectWidth, rectWidthFactor, taskStatus){
    drawRect(ctx, chartStartingPosition['x'], chartStartingPosition['y'], chartLength, chartWidth);
    let taskStartingTime = {};
    let taskEndingTime = {};
    // determine the startingX of rectangles
    information.forEach(tuple => {
        if (tuple['Predecessor'] == null) {
            taskStartingTime[tuple['Task']] = 0;
        }
        else{
            let taskPredecessor = tuple['Predecessor'].split(',');
            taskStartingTime[tuple['Task']] = 0;
            taskPredecessor.forEach(pre => {
                if  (taskEndingTime[pre] > taskStartingTime[tuple['Task']]) {
                    taskStartingTime[tuple['Task']] = taskEndingTime[pre];
                }
            })
        }
        taskEndingTime[tuple['Task']] = taskStartingTime[tuple['Task']] + tuple['Duration'];
    });
    // normalization
    let margin = 0.2
    let weekNum = Math.ceil(Math.max(...Object.values(taskEndingTime)) / 7) + margin;
    let startingX = [];
    let durationLength = [];
    Object.values(taskStartingTime).forEach(endingT => {
        startingX.push(chartStartingPosition['x'] + endingT / (weekNum * 7) * chartLength);
    });
    information.forEach(tuple => {
        durationLength.push(tuple['Duration'] / (weekNum * 7) * chartLength);
    });
    // draw header
    drawLine(ctx, [chartStartingPosition['x'], chartStartingPosition['y'] + rectWidth / rectWidthFactor], [chartStartingPosition['x'] + chartLength, chartStartingPosition['y'] + rectWidth / rectWidthFactor])
    for (var wk = 1; wk <= weekNum; wk++) {
        let position1 = [chartStartingPosition['x'] + wk * chartLength / weekNum, chartStartingPosition['y']]
        let position2 = [chartStartingPosition['x'] + wk * chartLength / weekNum, chartStartingPosition['y'] + rectWidth / rectWidthFactor]
        drawLine(ctx, position1, position2)
        let text = "Wk" + String(wk)
        let textXPosition = position1[0] - chartLength / (2 * weekNum)
        let textYPosition = chartStartingPosition['y'] + rectWidth / (rectWidthFactor * 2)
        printText(ctx, text, textXPosition, textYPosition)

    }
    // draw rectangles and print task name
    information.forEach((tuple, rowNo) => {
        let startingY = chartStartingPosition['y'] + (rowNo + (3 - rectWidthFactor) / 2) * rectWidth / rectWidthFactor;
        let width = rectWidth;
        drawRect(ctx, startingX[rowNo], startingY, durationLength[rowNo], width);
        let textX = startingX[rowNo] + durationLength[rowNo] + 10
        let textY = startingY + 0.6 * width
        

        if(taskStatus[rowNo] == 1) {

            ctx.fillStyle = "#ED6C63";
            ctx.fill();
        } else if(taskStatus[rowNo] == 2) {
            ctx.fillStyle = "#FCE473";
            ctx.fill();
        } else if(taskStatus[rowNo] == 3) {
            ctx.fillStyle = "#97CD76";
            ctx.fill();
        }

        printText(ctx, tuple['Task'], textX, textY)

    });
}

function drawNotation(ctx, notationStartingPositon, notationWidth, notationLength, notationRectWidth, notationRectLength){
    drawRect(ctx, notationStartingPositon['x'], notationStartingPositon['y'], notationLength, notationWidth);

    printText(ctx, 'Task (To Do)', notationStartingPositon['x'] + 140, notationStartingPositon['y'] + notationWidth * 0.6);
    drawRect(ctx, notationStartingPositon['x'] + 30, notationStartingPositon['y'] + (notationWidth - notationRectWidth) / 2 , notationRectLength, notationRectWidth);       

    ctx.fillStyle = "#ED6C63";
    ctx.fill();

    printText(ctx, 'Task (In Progress)', notationStartingPositon['x'] + 380, notationStartingPositon['y'] + notationWidth * 0.6);
    drawRect(ctx, notationStartingPositon['x'] + 250, notationStartingPositon['y'] + (notationWidth - notationRectWidth) / 2 , notationRectLength, notationRectWidth);       

    ctx.fillStyle = "#FCE473";
    ctx.fill();

    printText(ctx, 'Task (Done)', notationStartingPositon['x'] + 580, notationStartingPositon['y'] + notationWidth * 0.6);
    drawRect(ctx, notationStartingPositon['x'] + 470, notationStartingPositon['y'] + (notationWidth - notationRectWidth) / 2 , notationRectLength, notationRectWidth);       

    ctx.fillStyle = "#97CD76";
    ctx.fill();
}