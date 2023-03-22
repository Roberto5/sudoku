let canvas;
let ctx;
let debug;

window.addEventListener("load", function () {
    //*********************************init**********************
    container = document.getElementById("container");
    container.onclick=function(e) {
        console.log(e,this);
        event=e;
    }
    //*******generate table **********
    table = document.getElementById("sudoku");
    var body = table.createTBody();
    for (let i = 0; i < 9; i++) {
        let tableRow = body.insertRow();
        for (let j = 0; j < 9; j++) {
            let cell = tableRow.insertCell();
            cell.setAttribute("data-x", i);
            cell.setAttribute("data-y", j);
            cell.onclick = function () {
                let x = this.getAttribute("data-x");
                let y = this.getAttribute("data-y");
                //console.log(x,y);
                if ((!sudoku.board[x][y].default) && (sudoku.numberSelected != 0)) {
                    C = sudoku.board[x][y];
                    if (sudoku.functionSelected == 0) { // add number to cell 
                        sudoku.story.push({
                            x: x,
                            y: y,
                            prev: C.value,
                            after: sudoku.numberSelected
                        });
                        C.value = sudoku.numberSelected;

                        sudoku.highlight();
                        //todo validate?
                    } else {
                        if (sudoku.functionSelected == 1) {
                            C.addNote(sudoku.numberSelected);
                        }
                        if (sudoku.functionSelected == 2) {
                            C.addCircled(sudoku.numberSelected);
                        }
                        if (sudoku.functionSelected == 3) {
                            if (C.value != 0) C.value = 0
                            else {
                                C.removeNote(sudoku.numberSelected);
                            }
                        }
                    }
                    sudoku.print();
                }
            };
        }
    }
    //*************** back button*****************
    let backbutton = document.getElementById('back');
    backbutton.onclick = function () {
        let prev = sudoku.story.pop();
        if (prev != null) {
            sudoku.board[prev.x][prev.y].value = prev.prev;
            sudoku.print();
        }
    };
    //check
    let checkbutton = document.getElementById('check');
    checkbutton.addEventListener('click', function () {
        sudoku.check()
    });
    //**********************canvas
    canvas = document.getElementById('noteCanvas');
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    debug = document.getElementById('debug');

    ctx = canvas.getContext('2d');

    let ignoreradius = true;

    function handleStart(e) {
        console.log(event.target.id);
        debug.innerHTML = "radius :" + e.targetTouches[0].radiusX + "; force:" + e.targetTouches[0].force + ";";
        if ((e.targetTouches[0].radiusX === 0) || (ignoreradius)) {
            e.preventDefault();
            var x = e.targetTouches[0].pageX - this.offsetLeft;
            var y = e.targetTouches[0].pageY - this.offsetTop;

            ctx.fillStyle = '#0000FF';
            ctx.fillRect(x, y, 2, 2);
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        return true;
    }

    function handleMove(e) {
        if ((e.targetTouches[0].radiusX === 0) || (ignoreradius)) {
            e.preventDefault();
            var x = e.targetTouches[0].pageX - this.offsetLeft;
            var y = e.targetTouches[0].pageY - this.offsetTop;
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#0000FF';
            ctx.lineWidth = 2;
            ctx.stroke();

        } else {
            //ctx.endPath();
        }
        return true;
    }

    sudoku.generate();

    // Selezione di tutti i tasti
    var buttonsFunction = document.querySelectorAll("button.function");
    var buttonsNumners = document.querySelectorAll("button.numbers");
    // Aggiunta dell'evento "click" ai tasti
    for (var i = 0; i < buttonsFunction.length; i++) {
        buttonsFunction[i].addEventListener("click", function () {
            sudoku.functionSelected = this.getAttribute("data-number");
            if (this.classList.contains("selected")) {
                this.classList.remove("selected");
                sudoku.functionSelected = 0;
            } else {
                document.querySelectorAll(".function.selected").forEach(function (v) {
                    v.classList.remove('selected')
                });
                this.classList.add("selected");
            }

        });
    }
    for (var i = 0; i < buttonsNumners.length; i++) {
        buttonsNumners[i].addEventListener("click", function () {
            sudoku.numberSelected = this.getAttribute("data-number");
            if (this.classList.contains("selected")) {
                this.classList.remove("selected");
                sudoku.numberSelected = 0;
            } else {
                document.querySelectorAll(".numbers.selected").forEach(function (v) {
                    v.classList.remove('selected')
                });
                this.classList.add("selected");
            }

        });
    }
});
