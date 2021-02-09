context = document.getElementById('white_board').getContext("2d");
wb =  document.getElementById('white_board')
wb.height = window.innerHeight;
wb.width = window.innerWidth;
$('#white_board').mousedown(function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
});
$('#white_board').mousemove(function (e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});
$('#white_board').mouseup(function (e) {
    paint = false;
});
$('#white_board').mouseleave(function (e) {
    paint = false;
});
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var colorWhite = "#ffffff";

var curColor = colorWhite;
var clickColor = new Array();
var paint;

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(curColor);
}
function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.fillStyle = '#000'
    context.fillRect(0,0,wb.width,wb.height)
    // context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    
    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.strokeStyle = clickColor[i]
        // context.lineWidth = radius; // change the size of the stroke
        context.stroke();
    }
}
$('#clear_complete').click(function () {
    let canvas = document.getElementById('white_board')
    clickX = [];
    clickY = [];
    clickDrag = [];
    context.fillStyle = '#000'
    context.fillRect(0,0,wb.width,wb.height)
});
function saveImage(){
    var image = wb.toDataURL()
    aLink = document.getElementById('test')
    aLink.download = 'web_whiteboard.png'
    aLink.href = image;
    console.log('done')
    aLink.click()
}
function createPage(){
    var counter =1;
    return function(){
        wb.height = window.innerHeight * (++counter);
        window.scrollTo(0, window.innerHeight * (counter-1));
        redraw();
    }
}
newPage = createPage();