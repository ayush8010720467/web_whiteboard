"use strict"
window.web_whiteboard = {}
web_whiteboard = (function(){
    let prevSate = getSavedWork();
    console.log(prevSate)
    let context = document.getElementById('white_board').getContext("2d");
    let wb = document.getElementById('white_board')
    if(prevSate && window.innerHeight >= prevSate.height){
        
        wb.height = window.innerHeight;
    } else{
        wb.height = prevSate?.height || window.innerHeight;
    }
    if(prevSate && window.innerWidth >= prevSate.width){
        wb.width = window.innerWidth;
    } else{
        wb.width = prevSate?.width || window.innerWidth;
    }
    let clickX = prevSate?.clickX || [];
    let clickY = prevSate?.clickY || [];
    let clickDrag = prevSate?.clickDrag || [];
    let clickColor = prevSate?.clickColor || [];
    let colorWhite = "#ffffff";
    let colorBlack = "#000000";
    let currentColor = colorBlack;
    
    let curColor = colorWhite;
    
    let paint;
    if(clickX.length > 0){
        redraw();
    } else{
        fillCanvas();
    }

    const getElement = (selector) => {
        return document.querySelector(selector);
    };

    const attachEvent = (selector, eventType, listener) => {
        getElement(selector).addEventListener(eventType, listener);
    };

    attachEvent("#white_board", "mousedown", (e) => {
        const mouseX = e.pageX - wb.offsetLeft;
        const mouseY = e.pageY - wb.offsetTop;
        
        paint = true;
        addClick(mouseX, mouseY);
        redraw();
    });

    attachEvent("#white_board", "mousemove", (e) => {
        if (paint) {
            addClick(e.pageX - wb.offsetLeft, e.pageY - wb.offsetTop, true);
            redraw();
        }
    });

    attachEvent("#white_board", "mouseup", () => {
        paint = false;
    });

    attachEvent("#white_board", "mouseleave", () => {
        paint = false;
    });

    attachEvent("#toggleTheme", "change", () => {
        toggleColor(getElement("#toggleTheme").checked);
    });
    
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
    
    function fillCanvas(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
        context.fillStyle = currentColor;
        context.fillRect(0, 0, wb.width, wb.height)
    }

    function redraw() {
        fillCanvas();
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
    
    function saveImage() {
        let image = wb.toDataURL()
        let aLink = document.getElementById('imageGetter')
        aLink.download = 'web_whiteboard.png'
        aLink.href = image;
        aLink.click();
    }
    
    function clearAll(){
        clickX = [];
        clickY = [];
        clickDrag = [];
        context.fillStyle = currentColor;
        context.fillRect(0, 0, wb.width, wb.height)
    }

    function createPage() {
        var counter = +localStorage.getItem("current_page") || 1;
        localStorage.setItem("current_page",counter);
        return function() {
            wb.height = window.innerHeight * (++counter);
            localStorage.setItem("current_page",counter);
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
    
    function saveWork(){
        localStorage.setItem("previous_parms",JSON.stringify(getWork()));
    }
    function getSavedWork(){
        // this function gets the parametes from the local storage and returns them
        return JSON.parse(localStorage.getItem("previous_parms"));
    }
    function getWork(){
        return {
            height: wb.height,
            width: wb.width,
            clickX,
            clickY,
            clickDrag,
            clickColor
        }
    }
    let newPage = createPage();
    return {newPage, saveImage, undo, saveWork, clearAll}
})()
function clearStorage(){
    localStorage.clear();
    location.reload();
}
function eventHandlers(e){
    if (e.ctrlKey && e.key === 'z') {
        web_whiteboard.undo();
    }
}
document.addEventListener('keyup', eventHandlers, false);

setInterval(()=>{
    web_whiteboard.saveWork();
},100);

