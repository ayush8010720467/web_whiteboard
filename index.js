window.web_whiteboard = {}
web_whiteboard = (function(){
    let context = document.getElementById('white_board').getContext("2d");
    let wb = document.getElementById('white_board')
    wb.height = window.innerHeight;
    wb.width = window.innerWidth;
    let clickX = new Array();
    let clickY = new Array();
    let clickDrag = new Array();
    let colorWhite = "#ffffff";
    let colorBlack = "#000000";
    let currentColor = colorBlack;
    
    let curColor = colorWhite;
    let clickColor = new Array();
    let paint;
    $('#white_board').mousedown(function(e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
    
        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });
    $('#white_board').mousemove(function(e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });
    $('#white_board').mouseup(function(e) {
        paint = false;
    });
    $('#white_board').mouseleave(function(e) {
        paint = false;
    });
    $('#toggleTheme').change(function(e) {
        toggleColor($("#toggleTheme").prop('checked'));
    })
    
    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        clickColor.push(curColor);
    }
    
    
    function toggleColor(checked) {
        if (checked === false) {
            curColor = colorBlack;
            currentColor = colorWhite;
        } else {
            curColor = colorWhite;
            currentColor = colorBlack;
        }
        var currentLength = clickColor.length;
        clickColor.fill(curColor, 0, currentLength-1)
        redraw();
    }
    
    function redraw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        context.fillStyle = currentColor;
        context.fillRect(0, 0, wb.width, wb.height)
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
    $('#clear_complete').click(function() {
        let canvas = document.getElementById('white_board')
        clickX = [];
        clickY = [];
        clickDrag = [];
        context.fillStyle = currentColor;
        context.fillRect(0, 0, wb.width, wb.height)
    });
    
    function saveImage() {
        var image = wb.toDataURL()
        aLink = document.getElementById('test')
        aLink.download = 'web_whiteboard.png'
        aLink.href = image;
        console.log('done')
        aLink.click()
    }
    
    function createPage() {
        var counter = 1;
        return function() {
            wb.height = window.innerHeight * (++counter);
            window.scrollTo(0, window.innerHeight * (counter - 1));
            redraw();
        }
    }
    function undo(){
        if(clickX.length>20){
            clickX = clickX.slice(0, clickX.length-10);
            clickY = clickY.slice(0, clickY.length-10);
            clickDrag = clickDrag.slice(0, clickDrag.length-10);
        }
        else{
            clickX = [];
            clickY = [];
            clickDrag = [];
        }
        redraw();
    }
    
    let newPage = createPage();
    return {newPage, saveImage, undo}
})()
function eventHandlers(e){
    if (e.ctrlKey && e.key === 'z') {
        web_whiteboard.undo();
    }
}
document.addEventListener('keyup', eventHandlers, false);
