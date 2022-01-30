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

    attachEvent('#clear_complete',"click", () => {
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


//* MENU

const menu = document.querySelector(".menu");
const buttons = document.querySelector(".left");

menu.addEventListener("click",(e)=>{
    if(buttons.classList.contains("off")){
        buttons.classList.remove("off");
        buttons.classList.add("show");        
    }
    else{
        buttons.classList.remove("show");
        buttons.classList.add("off");  
    }
})

//* Hover
const clearHover = document.querySelector(".clear");
const newHover = document.querySelector(".new");
const saveHover = document.querySelector(".save");
const undoHover = document.querySelector(".undo");
const saveWorkHover = document.querySelector(".saveWork");
const deleteSavedHover = document.querySelector(".deleteSaved");

const clearBtn = document.querySelector(".clearBtn");
const newBtn = document.querySelector(".newBtn");
const saveBtn = document.querySelector(".saveBtn");
const undoBtn = document.querySelector(".undoBtn");
const saveWorkBtn = document.querySelector(".saveWorkBtn");
const deleteSavedBtn = document.querySelector(".deleteSavedBtn");

clearBtn.addEventListener("mouseover",()=>{
    clearHover.style.display = "block";
});

clearBtn.addEventListener("mouseout",()=>{
    clearHover.style.display = "none";
});

newBtn.addEventListener("mouseover",()=>{
    newHover.style.display = "block";
});

newBtn.addEventListener("mouseout",()=>{
    newHover.style.display = "none";
});

saveBtn.addEventListener("mouseover",()=>{
    saveHover.style.display = "block";
});

saveBtn.addEventListener("mouseout",()=>{
    saveHover.style.display = "none";
});

undoBtn.addEventListener("mouseover",()=>{
    undoHover.style.display = "block";
});

undoBtn.addEventListener("mouseout",()=>{
    undoHover.style.display = "none";
});

saveWorkBtn.addEventListener("mouseover",()=>{
    saveWorkHover.style.display = "block";
});

saveWorkBtn.addEventListener("mouseout",()=>{
    saveWorkHover.style.display = "none";
});

deleteSavedBtn.addEventListener("mouseover",()=>{
    deleteSavedHover.style.display = "block";
});

deleteSavedBtn.addEventListener("mouseout",()=>{
    deleteSavedHover.style.display = "none";
});

