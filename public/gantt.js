
(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        var $ = window.jQuery;
        $.ajax({ url: "http://localhost:9000/db/read/cards", success: function(data){
            window.onload = draw(data);
        }});
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();

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
    let headers = ['Task', 'Duration', 'Predecessor']
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

function drawGanttChart(ctx, information, chartLength, chartWidth, chartStartingPosition, rectWidth, rectWidthFactor){
    drawRect(ctx, chartStartingPosition['x'], chartStartingPosition['y'], chartLength, chartWidth);
    let taskStartingTime = {};
    let taskEndingTime = {};

    // determine the startingX of rectangles
    information.forEach(tuple => {
        if (tuple['predecessor'] == null) {
            taskStartingTime[tuple['title']] = 0;
        }
        else{
            let taskPredecessor = tuple['predecessor'].split(',');
            taskStartingTime[tuple['title']] = 0;
            taskPredecessor.forEach(pre => {
                if  (taskEndingTime[pre] > taskStartingTime[tuple['title']]) {
                    taskStartingTime[tuple['title']] = taskEndingTime[pre];
                }
            })
        }
        taskEndingTime[tuple['title']] = taskStartingTime[tuple['title']] + parseFloat(tuple['duration']);
    });

    // normalization
    let margin = 0.7
    let weekNum = Math.ceil(Math.max(...Object.values(taskEndingTime)) / 7) + margin;
    let startingX = [];
    let durationLength = [];
    Object.values(taskStartingTime).forEach(endingT => {
        startingX.push(chartStartingPosition['x'] + endingT / (weekNum * 7) * chartLength);
    });
    information.forEach(tuple => {
        durationLength.push(tuple['duration'] / (weekNum * 7) * chartLength);
    });

    // draw header
    drawLine(ctx, [chartStartingPosition['x'], chartStartingPosition['y'] + rectWidth / rectWidthFactor], [chartStartingPosition['x'] + chartLength, chartStartingPosition['y'] + rectWidth / rectWidthFactor])
    for (let wk = 1; wk <= weekNum; wk++) {
        let position1 = [chartStartingPosition['x'] + wk * chartLength / weekNum, chartStartingPosition['y']]
        let  position2 = [chartStartingPosition['x'] + wk * chartLength / weekNum, chartStartingPosition['y'] + rectWidth / rectWidthFactor]
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
        let textX = startingX[rowNo] + durationLength[rowNo] + 20
        let textY = startingY + 0.6 * width
        printText(ctx, tuple['title'], textX, textY)
    });
}

function drawNotation(ctx, notationStartingPositon, notationWidth, notationLength, notationRectWidth, notationRectLength){
    drawRect(ctx, notationStartingPositon['x'], notationStartingPositon['y'], notationLength, notationWidth);
    printText(ctx, 'Task', notationStartingPositon['x'] + 30, notationStartingPositon['y'] + notationWidth * 0.6)
    drawRect(ctx, notationStartingPositon['x'] + 50, notationStartingPositon['y'] + (notationWidth - notationRectWidth) / 2 , notationRectLength, notationRectWidth);
}

function draw(information) {
    information.forEach((input, index) => {
        delete input['_id'];
        delete input['budget'];
        delete input['description'];
        delete input['people'];
        delete input['phaseStatus'];
    });
    console.log(information)
    let myCanvas = document.querySelector('#myCanvas');
    let ctx = myCanvas.getContext('2d');
    let tableLength = 350;
    let tableWidth = 300;
    let rowNum = information.length + 1;
    let columnNum = Object.keys(information[0]).length;
    let tableStartingPosition = {"x": 20, "y": 20};
    let chartStartingPosition = {'x': tableStartingPosition['x'] + tableLength, 'y': tableStartingPosition['y']};
    let chartLength = 350;
    let chartWidth = tableWidth;
    let rectWidthFactor = 0.6;
    let rectWidth = chartWidth * rectWidthFactor / rowNum;
    let notationStartingPositon = {'x': tableStartingPosition['x'], 'y': tableStartingPosition['y'] + tableWidth}
    let notationWidth = rectWidth / rectWidthFactor
    let notationLength = chartLength + tableLength
    let notationRectWidth = rectWidth
    let notationRectLength = 60
    drawTable(ctx, information, tableLength, tableWidth, rowNum, columnNum, tableStartingPosition);
    drawGanttChart(ctx, information, chartLength, chartWidth, chartStartingPosition, rectWidth, rectWidthFactor);
    drawNotation(ctx, notationStartingPositon, notationWidth, notationLength, notationRectWidth, notationRectLength);
}