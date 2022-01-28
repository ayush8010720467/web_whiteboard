const web_whiteboard = (function(){
    const COLOR_WHITE = '#ffffff';
    const COLOR_BLACK = '#000000';

    const wb = document.getElementById('white_board');
    const context = wb.getContext('2d');
    wb.height = window.innerHeight;
    wb.width = window.innerWidth;
    
    let clickX = [];
    let clickY = [];
    let clickDrag = [];
    let currentColor = COLOR_BLACK;
    
    let curColor = COLOR_WHITE;
    const clickColor = [];
    let paint;

    const getElement = (selector) => {
        return document.querySelector(selector);
    };

    const attachEvent = (selector, eventType, listener) => {
        getElement(selector).addEventListener(eventType, listener);
    };

    attachEvent('#white_board', 'mousedown', (e) => {
        const mouseX = e.pageX - wb.offsetLeft;
        const mouseY = e.pageY - wb.offsetTop;
        
        paint = true;
        addClick(mouseX, mouseY);
        redraw();
    });

    attachEvent('#white_board', 'mousemove', (e) => {
        if (paint) {
            addClick(e.pageX - wb.offsetLeft, e.pageY - wb.offsetTop, true);
            redraw();
        }
    });

    attachEvent('#white_board', 'mouseup', () => {
        paint = false;
    });

    attachEvent('#white_board', 'mouseleave', () => {
        paint = false;
    });

    attachEvent('#toggleTheme', 'change', () => {
        toggleColor(getElement('#toggleTheme').checked);
    });
    
    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        clickColor.push(curColor);
    }

    function toggleColor(checked) {
        if (checked === false) {
            curColor = COLOR_BLACK;
            currentColor = COLOR_WHITE;
        } else {
            curColor = COLOR_WHITE;
            currentColor = COLOR_BLACK;
        }
        const currentLength = clickColor.length;
        clickColor.fill(curColor, 0, currentLength - 1);
        redraw();
    }
    
    function redraw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        context.fillStyle = currentColor;
        context.fillRect(0, 0, wb.width, wb.height);
        // context.strokeStyle = "#df4b26";
        context.lineJoin = 'round';
    
        for (let i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.strokeStyle = clickColor[i];
            // context.lineWidth = radius; // change the size of the stroke
            context.stroke();
        }
    }

    attachEvent('#clear_complete','click', () => {
        clickX = [];
        clickY = [];
        clickDrag = [];
        context.fillStyle = currentColor;
        context.fillRect(0, 0, wb.width, wb.height);
    });
    
    function saveImage() {
        const image = wb.toDataURL();
        const aLink = document.getElementById('test');
        aLink.download = 'web_whiteboard.png';
        aLink.href = image;
        aLink.click();
    }
    
    function createPage() {
        let counter = 1;
        return function() {
            wb.height = window.innerHeight * (++counter);
            window.scrollTo(0, window.innerHeight * (counter - 1));
            redraw();
        };
    }

    function undo(){
        if(clickX.length>20){
            clickX = clickX.slice(0, clickX.length - 10);
            clickY = clickY.slice(0, clickY.length - 10);
            clickDrag = clickDrag.slice(0, clickDrag.length - 10);
        } else{
            clickX = [];
            clickY = [];
            clickDrag = [];
        }
        redraw();
    }
    
    const newPage = createPage();
    return {newPage, saveImage, undo};
})();

function eventHandlers(e){
    if (e.ctrlKey && e.key === 'z') {
        web_whiteboard.undo();
    }
}

document.addEventListener('keyup', eventHandlers, false);
