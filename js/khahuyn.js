var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function onResize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.onresize = onResize;
onResize();

/*- get Model */
function getModelTest(t) {
    return {
        x: ((1 - 0.3) * Math.cos(0.3 * t) + 2 * Math.sin(54 * t)) / 4,
        y: ((1 - 0.3) * Math.sin(0.3 * t) + 2 * Math.cos(54 * t)) / 4,
    }
}

function getModelStar(t) {
    return {
        x: (3 * Math.cos(36 * t - 0.5) + 2 * Math.sin(54 * t)) / 4.5,
        y: (3 * Math.sin(36 * t - 0.5) + 2 * Math.cos(54 * t)) / 4.5,
    }
}

function getModelFlower1(t) {
    return {
        x: (Math.cos(t) - 0.5 * Math.cos(6 * t)) * 0.75,
        y: (Math.sin(t) - 0.5 * Math.sin(6 * t)) * 0.75
    }
}

function getModelFlower2(t) {
    return {
        x: (2 + Math.sin(5 * t)) * Math.cos(t) / 3,
        y: (2 + Math.sin(5 * t)) * Math.sin(t) / 3
    }
}

function getModelFlower3(t) {
    return {
        x: (1 - Math.sin(8 * t)) * Math.cos(t) / 2,
        y: (1 - Math.sin(8 * t)) * Math.sin(t) / 2
    }
}

function getModelCircle(t) {
    return {
        x: Math.sin(t),
        y: Math.cos(t)
    }
}

function getModelHeart(t) {
    return {
        x: Math.pow(Math.sin(t), 3),
        y: 13 / 16 * Math.cos(t) - 5 / 16 * Math.cos(2 * t) - 1 / 8 * Math.cos(3 * t) - 1 / 26 * Math.cos(4 * t) + 0.2
    }
}

/*- Draw Coords */
function drawCoords(x, y, coords, elementImage) {
    coords.forEach(function (item) {
        ctx.drawImage(elementImage, x - elementImage.height / 2 + item.x, y - elementImage.width / 2 - item.y);
    })
}

/*- Gen Element */
function genElement(model, size, color) {
    const canvasVirtual = document.createElement('canvas');
    const contextVirtual = canvasVirtual.getContext('2d');
    canvasVirtual.width = size * 3;
    canvasVirtual.height = size * 3;
    function getModel(t) {
        let coord = model(t);
        coord.x = canvasVirtual.width / 2 + coord.x * size;
        coord.y = canvasVirtual.height / 2 - coord.y * size;
        return coord;
    }
    contextVirtual.beginPath();
    let t = 0;
    let coord = getModel(t);
    contextVirtual.moveTo(coord.x, coord.y);
    while (t < 2 * Math.PI) {
        t += 0.01; // baby steps!
        coord = getModel(t);
        contextVirtual.lineTo(coord.x, coord.y);
    }
    contextVirtual.closePath();
    // create the fill
    contextVirtual.fillStyle = color;
    contextVirtual.fill();
    // create the image
    const newImage = new Image();
    newImage.src = canvasVirtual.toDataURL();
    canvasVirtual.remove();
    return newImage;
}

function genLightElement(model, size, color, lightColor) {
    const canvasVirtual = document.createElement('canvas');
    const contextVirtual = canvasVirtual.getContext('2d');
    canvasVirtual.width = size * 2;
    canvasVirtual.height = size * 2;
    function getModel(t) {
        let coord = model(t);
        coord.x = canvasVirtual.width / 2 + coord.x * size / 8;
        coord.y = canvasVirtual.height / 2 - coord.y * size / 8;
        return coord;
    }
    contextVirtual.beginPath();
    let t = 0;
    let coord = getModel(t);
    contextVirtual.moveTo(coord.x, coord.y);
    while (t < 2 * Math.PI) {
        t += 0.01; // baby steps!
        coord = getModel(t);
        contextVirtual.lineTo(coord.x, coord.y);
    }
    contextVirtual.closePath();
    // create the fill
    contextVirtual.fillStyle = color;
    contextVirtual.shadowColor = lightColor;
    contextVirtual.shadowBlur = size / 2;
    contextVirtual.fill();
    // create the image
    const newImage = new Image();
    newImage.src = canvasVirtual.toDataURL();
    canvasVirtual.remove();
    return newImage;
}

/*- Gen Coords */
function genContour(model, size) {
    let coords = [];
    let radian = 0;
    while (radian < 2 * Math.PI) { // baby steps!
        let coord = model(radian);
        let scaleX = coord.x * size;
        let scaleY = coord.y * size;
        if (radian == 0) {
            coords.push({
                x: scaleX,
                y: scaleY,
                radian
            })
        }
        else {
            if (Math.round(scaleX / 1) == Math.round(coords[coords.length - 1].x / 1)
                && Math.round(scaleY / 2) == Math.round(coords[coords.length - 1].y / 2)) {
            }
            else {
                coords.push({
                    x: scaleX,
                    y: scaleY,
                    radian
                })
            }
        }
        radian += 0.01;
    }
    return coords;
}

function genLayerContour(model, fromPercent, toPercent, amount) {
    let coords = [];
    let length = model.length;
    for (let i = 0; i < amount; i++) {
        let scale = fromPercent + Math.random() * (toPercent - fromPercent)
        let coord = model[Math.floor(Math.random() * length)];
        let scaleX = coord.x * scale;
        let scaleY = coord.y * scale;
        coords.push({
            x: scaleX,
            y: scaleY,
        })
    }
    return coords;
}

function genRotatingContour(model, size, arcAngle, arcPhi) {
    let coords = [];
    let radian = arcPhi;
    while (radian < 2 * arcAngle + arcPhi) { // baby steps!
        let coord = model(radian);
        let scaleX = coord.x * size;
        let scaleY = coord.y * size;
        if (radian == arcPhi) {
            coords.push({
                x: scaleX,
                y: scaleY,
                radian
            })
        }
        else {
            if (Math.round(scaleX / 1) == Math.round(coords[coords.length - 1].x / 1)
                && Math.round(scaleY / 2) == Math.round(coords[coords.length - 1].y / 2)) {
            }
            else {
                coords.push({
                    x: scaleX,
                    y: scaleY,
                    radian
                })
            }
        }
        radian += 0.01;
    }
    return coords;
}

function genMovingCoutour(model, size, currentCoords, newCoordsAmount, maxAge, deltaTime, velocity, acceleration) {
    let coords = [];
    let contours = genContour(model, size);
    currentCoords.forEach(function (item) {
        if (item.age < maxAge) {
            item.x += item.vx * deltaTime;
            item.y += item.vy * deltaTime;
            item.vx += item.ax * deltaTime * Math.random();
            item.vy += item.ay * deltaTime * Math.random();
            item.age += deltaTime
            coords.push(item);
        }
    })
    coords = coords.concat(
        genLayerContour(contours, 1.0, 1.0, newCoordsAmount).map(
            ({ x, y }) => ({
                x: x,
                y: y,
                vx: velocity * x,
                vy: velocity * y,
                ax: acceleration * x,
                ay: acceleration * y,
                age: 0
            })
        )
    );
    return coords;
}

function genFillCoutour(model, size, amount) {
    let coords = [];
    let contours = genContour(model, size);
    coords = coords.concat(genLayerContour(contours, 1.4, 3.0, amount * 0.15));
    coords = coords.concat(genLayerContour(contours, 1.2, 1.4, amount * 0.15));
    coords = coords.concat(genLayerContour(contours, 1.0, 1.2, amount * 1));
    coords = coords.concat(genLayerContour(contours, 0.9, 1.0, amount * 10));
    coords = coords.concat(genLayerContour(contours, 0.8, 0.9, amount * 8));
    coords = coords.concat(genLayerContour(contours, 0.7, 0.8, amount * 6));
    coords = coords.concat(genLayerContour(contours, 0.6, 0.7, amount * 4));
    coords = coords.concat(genLayerContour(contours, 0.5, 0.6, amount * 2));
    coords = coords.concat(genLayerContour(contours, 0.3, 0.5, amount * 2));
    coords = coords.concat(genLayerContour(contours, 0.2, 0.3, amount * 0.5));
    coords = coords.concat(genLayerContour(contours, 0.0, 0.2, amount * 0.25));
    return coords;
}

function genScale(currentCoords, scale) {
    let coords = [];
    currentCoords.forEach(function (item) {
        item.x *= scale;
        item.y *= scale;
        coords.push(item);
    })
    return coords;
}

/*- Real time effect */
function rotateAngle() {
    calDeltaTime();
    if (currentAngular > 2 * Math.PI) {
        currentAngular = 0
    }
    else {
        currentAngular += angularVelocity * deltaTime;
    }
}

function beat() {
    calDeltaTime();
    if (isBeatBigger) {
        currentBeatPercent += 2 * deltaTime;
        if (currentBeatPercent >= 1) {
            currentBeatPercent = 1;
            isBeatBigger = false;
        }
    }
    else {
        currentBeatPercent -= 2 * deltaTime;
        if (currentBeatPercent <= 0) {
            currentBeatPercent = 0;
            isBeatBigger = true;
        }
    }
}

function calDeltaTime() {
    let newTime = new Date().getTime() / 1000;
    deltaTime = newTime - (currentTime || newTime);
    currentTime = newTime;
}

/* Render */
function renderFillHeart() {
    beat();
    currentCoords1 = genFillCoutour(getModelHeart, 200 + currentBeatPercent * currentBeatPercent * 30, 110 + currentBeatPercent * 30);
    currentCoords2 = genFillCoutour(getModelHeart, 240 + currentBeatPercent * currentBeatPercent * 5, 30 - currentBeatPercent * 5);
    ctx.clearRect(0, 0, canvas.width, canvas.height); drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords1, elementImage.smallImagePink
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords2, elementImage.smallImagePink
    );
}

function renderFillFlower1() {
    beat();
    let coord1 = genFillCoutour(getModelFlower1, 200 + currentBeatPercent * 30, 300 + currentBeatPercent * 30);
    let coord2 = genFillCoutour(getModelCircle, 30 + currentBeatPercent * 4, 20 + currentBeatPercent * 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        coord1, elementImage.imagePurple
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        coord2, elementImage.imageWhite
    );
}

function renderFillFlower2() {
    beat();
    let coord1 = genFillCoutour(getModelFlower2, 200 + currentBeatPercent * 30, 300 + currentBeatPercent * 30);
    let coord2 = genFillCoutour(getModelCircle, 30 + currentBeatPercent * 15, 10 + currentBeatPercent * 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        coord1, elementImage.imageWhite
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        coord2, elementImage.imageYellow
    );
}

function renderFillFlower3() {
    beat();
    let coord1 = genFillCoutour(getModelFlower3, 200 + currentBeatPercent * 30, 300 + currentBeatPercent * 30);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        coord1, elementImage.imageOrange
    );
}

function renderFillStar() {
    beat();
    let coord1 = genFillCoutour(getModelStar, 200 + currentBeatPercent * 30, 300 + currentBeatPercent * 30);
    let coord2 = genFillCoutour(getModelStar, 30 + currentBeatPercent * 4, 20 + currentBeatPercent * 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        coord1, elementImage.imageYellow
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        coord2, elementImage.imageYellow
    );
}

function renderRotatingHeart() {
    rotateAngle();
    currentCoords1 = genRotatingContour(getModelHeart, 200, Math.PI * 2 / 7, 0 + currentAngular);
    currentCoords2 = genRotatingContour(getModelHeart, 200, Math.PI * 2 / 7, Math.PI + currentAngular);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords1, elementImage.lightImageRed
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords2, elementImage.lightImageBlue
    );
}

function renderRotatingFlower1() {
    rotateAngle();
    currentCoords1 = genRotatingContour(getModelFlower1, 200, Math.PI * 3 / 7, 0 + currentAngular);
    currentCoords2 = genRotatingContour(getModelFlower1, 200, Math.PI * 3 / 7, Math.PI + currentAngular);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords1, elementImage.lightImageRed
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords2, elementImage.lightImageGreen
    );
}

function renderRotatingFlower2() {
    rotateAngle();
    currentCoords1 = genRotatingContour(getModelFlower2, 200, Math.PI * 2 / 7, 0 + currentAngular);
    currentCoords2 = genRotatingContour(getModelFlower2, 200, Math.PI * 2 / 7, Math.PI + currentAngular);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords1, elementImage.lightImageYellow
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords2, elementImage.lightImageBlue
    );
}

function renderMovingHeart() {
    calDeltaTime();
    currentCoords1 = genMovingCoutour(getModelHeart, 200, currentCoords1, 100 * deltaTime, 1.7, deltaTime, 0, -1.4);
    currentCoords2 = genMovingCoutour(getModelHeart, 240, currentCoords2, 500 * deltaTime, 1.7, deltaTime, 0, -0.6);
    currentCoords3 = genMovingCoutour(getModelHeart, 240, currentCoords3, 100 * deltaTime, 1.7, deltaTime, 0, 0.2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords1, elementImage.imageRed
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords2, elementImage.imageRed
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords3, elementImage.imageRed
    );
}

function renderMovingFlower2() {
    calDeltaTime();
    currentCoords1 = genMovingCoutour(getModelFlower2, 200, currentCoords1, 100 * deltaTime, 2.7, deltaTime, 0, 1.4);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords1, elementImage.imageBlue
    );
}

function renderMovingFlower3() {
    calDeltaTime();
    currentCoords1 = genMovingCoutour(getModelFlower3, 200, currentCoords1, 100 * deltaTime, 1.7, deltaTime, 0, -1.4);
    currentCoords2 = genMovingCoutour(getModelFlower3, 240, currentCoords2, 500 * deltaTime, 1.7, deltaTime, 0, -0.6);
    currentCoords3 = genMovingCoutour(getModelFlower3, 240, currentCoords3, 100 * deltaTime, 1.7, deltaTime, 0, 0.2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords1, elementImage.imageOrange
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords2, elementImage.imageOrange
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords3, elementImage.imageOrange
    );
}

function renderCustom() {
    if (config.shapeEffect == 0) {
        beat();
        currentCoords1 = genFillCoutour(
            getModel(config.shapeModel1),
            config.shapeSize1 + currentBeatPercent * currentBeatPercent * config.shapeSize1 * 3 / 20,
            config.shapeAmount1 + config.shapeAmount1 * currentBeatPercent * 1 / 3
        );
        currentCoords2 = genFillCoutour(
            getModel(config.shapeModel2),
            config.shapeSize2 + currentBeatPercent * currentBeatPercent * config.shapeSize2 * 5 / 24,
            config.shapeAmount2 - config.shapeAmount2 * currentBeatPercent * 1 / 10
        );
    }
    else if (config.shapeEffect == 1) {
        rotateAngle();
        currentCoords1 = genRotatingContour(
            getModel(config.shapeModel1), config.shapeSize1, Math.PI * 2 / 7, 0 + currentAngular
        );
        currentCoords2 = genRotatingContour(
            getModel(config.shapeModel1), config.shapeSize1, Math.PI * 2 / 7, Math.PI + currentAngular
        );
    }
    else if (config.shapeEffect == 2) {
        calDeltaTime();
        currentCoords1 = genMovingCoutour(
            getModel(config.shapeModel1), config.shapeSize1,
            currentCoords1, config.shapeAmount1 * deltaTime, 1.7, deltaTime, 0, -1.4
        );
        currentCoords2 = genMovingCoutour(
            getModel(config.shapeModel2), config.shapeSize2,
            currentCoords2, config.shapeAmount2 * deltaTime, 1.7, deltaTime, 0, -0.6
        );
        currentCoords3 = genMovingCoutour(
            getModel(config.shapeModel2), config.shapeSize2,
            currentCoords3, config.shapeAmount2 * deltaTime, 1.7, deltaTime, 0, 0.2
        );
    }
    else if (config.shapeEffect == 3) {
        calDeltaTime();
        currentCoords1 = genMovingCoutour(
            getModel(config.shapeModel1), config.shapeSize1,
            currentCoords1, config.shapeAmount1 * deltaTime, 1.7, deltaTime, 0, 2
        );
        currentCoords2 = genMovingCoutour(
            getModel(config.shapeModel2), config.shapeSize1 * 1.2,
            currentCoords2, config.shapeAmount2 * deltaTime, 1.7, deltaTime, 0, 4
        );
    }
    else {
        renderFillFlower1();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords1, elementImage.customImage1
    );
    drawCoords(canvas.width / 2, canvas.height / 2,
        currentCoords2, elementImage.customImage2
    );
    if (config.shapeEffect == 2) {
        drawCoords(canvas.width / 2, canvas.height / 2,
            currentCoords3, elementImage.customImage2
        );
    }
}

function getModel(int) {
    if (int == 0) {
        return getModelHeart;
    }
    else if (int == 1) {
        return getModelFlower1;
    }
    else if (int == 2) {
        return getModelFlower2;
    }
    else if (int == 3) {
        return getModelFlower3;
    }
    else if (int == 4) {
        return getModelCircle;
    }
    else if (int == 5) {
        return getModelStar;
    }
    else {
        return getModelTest;
    }
}

function initElement() {
    elementImage.smallImagePink = genLightElement(getModelHeart, 10, 'pink');

    elementImage.imageWhite = genLightElement(getModelHeart, 20, 'white');
    elementImage.imageRed = genLightElement(getModelHeart, 20, 'red');
    elementImage.imagePurple = genLightElement(getModelHeart, 20, 'purple');
    elementImage.imageYellow = genLightElement(getModelHeart, 20, 'yellow');
    elementImage.imagePink = genLightElement(getModelHeart, 20, 'pink', 'pink');
    elementImage.imageGreen = genLightElement(getModelHeart, 20, 'green', 'green');
    elementImage.imageOrange = genLightElement(getModelHeart, 20, 'orange', 'orange');
    elementImage.imageBlue = genLightElement(getModelHeart, 100, 'blue');

    elementImage.lightImageRed = genLightElement(getModelCircle, 50, 'red', 'red');
    elementImage.lightImageBlue = genLightElement(getModelCircle, 50, 'blue', 'blue');
    elementImage.lightImageYellow = genLightElement(getModelCircle, 50, 'yellow', 'yellow');
    elementImage.lightImageGreen = genLightElement(getModelCircle, 50, 'green', 'green');
    elementImage.lightImagePurple = genLightElement(getModelCircle, 50, 'purple', 'purple');
    elementImage.lightImageOrange = genLightElement(getModelCircle, 50, 'orange', 'orange');

    elementImage.customImage1 = genLightElement(
        getModel(config.elementModel1),
        config.elementSize1, config.elementMainColor1, config.elementShadowColor1
    );
    elementImage.customImage2 = genLightElement(
        getModel(config.elementModel2),
        config.elementSize2, config.elementMainColor2, config.elementShadowColor2
    );
}

function render() {
    if (currentShape == 0) {
        renderFillHeart();
    }
    else if (currentShape == 1) {
        renderRotatingHeart();
    }
    else if (currentShape == 2) {
        renderFillFlower2();
    }
    else if (currentShape == 3) {
        renderFillStar();
    }
    else if (currentShape == 4) {
        renderMovingHeart();
    }
    else if (currentShape == 5) {
        renderFillFlower1();
    }
    else if (currentShape == 6) {
        renderMovingFlower2();
    }
    else if (currentShape == 7) {
        renderRotatingFlower1();
    }
    else if (currentShape == 8) {
        renderMovingFlower3();
    }
    else {
        renderCustom();
    }
}

let currentTime = 0;
let deltaTime = 0;
let currentBeatPercent = 0;
let isBeatBigger = true;
let currentAngular = 0;
let angularVelocity = 5;

let currentCoords1 = [];
let currentCoords2 = [];
let currentCoords3 = [];
let currentCoords4 = [];

let currentShape = 0;

let config = {
    shapeEffect: 2,
    shapeModel1: 1,
    shapeModel2: 3,
    shapeSize1: 200,
    shapeSize2: 240,
    shapeAmount1: 200,
    shapeAmount2: 200,
    elementModel1: 4,
    elementModel2: 4,
    elementSize1: 10,
    elementSize2: 10,
    elementMainColor1: '#e66465',
    elementMainColor2: '#0400ff',
    elementShadowColor1: '#e66465',
    elementShadowColor2: '#0400ff'
};
let elementImage = {
    smallImagePink: null,
    imageBlue: null,
    imageRed: null,
    imagePurple: null,
    imageWhite: null,
    imageYellow: null,
    imagePink: null,
    imageOrange: null,
    imageGreen: null,
    lightImageRed: null,
    lightImageBlue: null,
    lightImageGreen: null,
    lightImageYellow: null,
    lightImagePurple: null,
    lightImageOrange: null,
    customImage1: null,
    customImage2: null
}

let timer

initElement();

setInterval(function () {
    render()
}, 10)

canvas.addEventListener('click', function (event) {
    if (event.detail === 1) {
        timer = setTimeout(() => {
            currentCoords1 = [];
            currentCoords2 = [];
            currentCoords3 = [];
            currentShape++;
            if (currentShape > 9) currentShape = 0;
        }, 200)
    }
});

canvas.addEventListener('dblclick', function () {
    clearTimeout(timer)
    currentShape = 99;
    configData();
});

function handleInputChange(e) {
    if (!isNaN(e.value)) {
        config[e.name] = Number(e.value);
    }
    else {
        config[e.name] = e.value;
    }
    console.log(config)
    elementImage.customImage1 = genLightElement(
        getModel(config.elementModel1),
        config.elementSize1, config.elementMainColor1, config.elementShadowColor1
    );
    elementImage.customImage2 = genLightElement(
        getModel(config.elementModel2),
        config.elementSize2, config.elementMainColor2, config.elementShadowColor2
    );
}

function configData() {
    function effectOptionHtml(value) {
        return `
            <option value=0 ${(value == 0) ? 'selected' : ''}>Nhấp nháy</option>
            <option value=1 ${(value == 1) ? 'selected' : ''}>Xoay</option>
            <option value=2 ${(value == 2) ? 'selected' : ''}>Hướng tâm</option>
            <option value=3 ${(value == 3) ? 'selected' : ''}>Hướng ngoại</option>
        `;
    }
    function shapeOptionHtml(value) {
        return `
            <option value=0 ${(value == 0) ? 'selected' : ''}>Trái tim</option>
            <option value=1 ${(value == 1) ? 'selected' : ''}>Hoa 1</option>
            <option value=2 ${(value == 2) ? 'selected' : ''}>Hoa 2</option>
            <option value=3 ${(value == 3) ? 'selected' : ''}>Hoa 3</option>
            <option value=4 ${(value == 4) ? 'selected' : ''}>Tròn</option>
            <option value=5 ${(value == 5) ? 'selected' : ''}>Ngôi sao</option>
        `;
    }
    Swal.fire({
        title: "Chọn",
        width: "1000px",
        background: 'rgba(0,0,0,0.6)',
        html: `
            <div class="row">
                <div class="column left">
                    <input onchange=handleInputChange(this) name="a" type="text" 
                        class="swal2-input" value="Hiệu ứng" disabled>
                </div>
                <div class="column fullright">
                    <select onchange=handleInputChange(this) name="shapeEffect" type="select" 
                        class="swal2-input">
                        ${effectOptionHtml(config.shapeEffect)}
                    </select>
                </div>
            <div class="row">
                <div class="column left">
                    <label>#<label>
                </div>
                <div class="column middle">
                    <label>Mẫu chính<label>
                </div>
                <div class="column right">
                    <label>Mẫu phụ<label>
                </div>
            </div>
            <div class="row">
                <div class="column left">
                    <input onchange=handleInputChange(this) name="a" type+"text" 
                        class="swal2-input" value="Hình" disabled>
                </div>
                <div class="column middle">
                    <select onchange=handleInputChange(this) name="shapeModel1" type="select" 
                        class="swal2-input">
                        ${shapeOptionHtml(config.shapeModel1)}
                    </select>
                </div>
                <div class="column right">
                    <select onchange=handleInputChange(this) name="shapeModel2" type="select" 
                        class="swal2-input" value = 3>
                        ${shapeOptionHtml(config.shapeModel2)}
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="column left">
                    <input onchange=handleInputChange(this) name="a" type+"text" 
                        class="swal2-input" value="Kích thước" disabled>
                </div>
                <div class="column middle">
                    <input onchange=handleInputChange(this) name="shapeSize1" type="range" 
                        class="swal2-input" min=10 max=400 value="${config.shapeSize1}">
                </div>
                <div class="column right">
                    <input onchange=handleInputChange(this) name="shapeSize2" type="range" 
                        class="swal2-input" min=10 max=400 value="${config.shapeSize2}">
                </div>
            </div>
            <div class="row">
                <div class="column left">
                    <input onchange=handleInputChange(this) name="a" type+"text" 
                        class="swal2-input" value="Số lượng" disabled>
                </div>
                <div class="column middle">
                    <input onchange=handleInputChange(this) name="shapeAmount1" type="range" 
                        class="swal2-input" min=0 max=400 value="${config.shapeAmount1}">
                </div>
                <div class="column right">
                    <input onchange=handleInputChange(this) name="shapeAmount2" type="range" 
                        class="swal2-input" min=0 max=400 value="${config.shapeAmount2}">
                </div>
            </div>
            <div class="row">
                <div class="column left">
                    <input onchange=handleInputChange(this) name="a" type+"text" 
                        class="swal2-input" value="Hình điểm" disabled>
                </div>
                <div class="column middle">
                    <select onchange=handleInputChange(this) name="elementModel1" type="select" 
                        class="swal2-input">
                        ${shapeOptionHtml(config.elementModel1)}
                    </select>
                </div>
                <div class="column right">
                    <select onchange=handleInputChange(this) name="elementModel2" type="select" 
                        class="swal2-input" value = 3>
                        ${shapeOptionHtml(config.elementModel2)}
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="column left">
                    <input onchange=handleInputChange(this) name="a" type+"text" 
                        class="swal2-input" value="Kích thước điểm" disabled>
                </div>
                <div class="column middle">
                    <input onchange=handleInputChange(this) name="elementSize1" type="range" 
                        class="swal2-input" min=10 max=200 value="${config.elementSize1}">
                </div>
                <div class="column right">
                    <input onchange=handleInputChange(this) name="elementSize2" type="range" 
                        class="swal2-input" min=10 max=200 value="${config.elementSize2}">
                </div>
            </div>
            <div class="row">
                <div class="column left">
                    <input onchange=handleInputChange(this) name="a" type+"text" 
                        class="swal2-input" value="Màu chính" disabled>
                </div>
                <div class="column middle">
                    <input onchange=handleInputChange(this) name="elementMainColor1" type="color" 
                        class="swal2-input" value="${config.elementMainColor1}">
                </div>
                <div class="column right">
                    <input onchange=handleInputChange(this) name="elementMainColor2" type="color" 
                        class="swal2-input" value="${config.elementMainColor2}">
                </div>
            </div>
            <div class="row">
                <div class="column left">
                    <input onchange=handleInputChange(this) name="a" type+"text" 
                        class="swal2-input" value="Màu hiệu ứng" disabled>
                </div>
                <div class="column middle">
                    <input onchange=handleInputChange(this) name="elementShadowColor1" type="color" 
                        class="swal2-input" value="${config.elementShadowColor1}">
                </div>
                <div class="column right">
                    <input onchange=handleInputChange(this) name="elementShadowColor2" type="color" 
                        class="swal2-input" value="${config.elementShadowColor2}">
                </div>
            </div>
            `,
        imageAlt: "Custom image",
    });
}

Swal.fire({
    title: 'Một chút dongcode dành riêng cho em',
    html: `
        <div style="width: 290px;margin:0 auto">
        <p style="text-align: left;">x = 16sin(t)&#179;</p> 
        <p style="text-align: left;">y = 13cos(t)-5cos(2t)-2cos(3t) - cos(4t)</p>
        </div>
        <p>Em</p>`,
    // imageUrl: "img/hoicham.jpg",
    // imageWidth: 300,
    // imageHeight: 300,
    // background: '#fff url("img/iput-bg.jpg")',
    background: '#fff url("img/iput-bg.jpg")',
    imageAlt: "Custom image",
});