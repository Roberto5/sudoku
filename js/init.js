let canvas;
let ctx;
let debug;

window.addEventListener("load", function () {
    /*********************************init**********************
    container = document.getElementById("container");
    container.onclick=function(e) {
        console.log(e,this);
        event=e;
    }*/
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
    //**********************canvas**************
    canvas = document.getElementById('noteCanvas');
    canvas.width = table.clientWidth;
    canvas.height = table.clientHeight;
    table.style.top = '-' + canvas.height + 'px';
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.onclick = function (e) {
        // ottieni le coordinate del click sul canvas
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;
        const dimcell = Math.floor(canvas.offsetWidth / 9);
        // determina la cella corrispondente sulla griglia di gioco
        const row = Math.floor(y / dimcell); // 50 è la dimensione di ogni cella
        const col = Math.floor(x / dimcell);
        // ottieni la cella corrispondente dalla tabella del Sudoku
        const cell = table.rows[row].cells[col];

        // avvia l'evento onclick della cella corrispondente
        cell.click();
    }
    debug = document.getElementById('debug');

    ctx = canvas.getContext('2d');

    let ignoreradius = false;
    /*// ottieni il riferimento al canvas e alla tabella del Sudoku
const canvas = document.getElementById("notecanvas");
const table = document.getElementById("sudokuTable");

// aggiungi un gestore di eventi per il click sinistro del canvas
canvas.addEventListener("click", function(event) {
  // ottieni le coordinate del click sul canvas
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  // determina la cella corrispondente sulla griglia di gioco
  const row = Math.floor(y / 50); // 50 è la dimensione di ogni cella
  const col = Math.floor(x / 50);

  // ottieni la cella corrispondente dalla tabella del Sudoku
  const cell = table.rows[row].cells[col];

  // avvia l'evento onclick della cella corrispondente
  cell.click();
});

// aggiungi un gestore di eventi per il click destro del canvas
canvas.addEventListener("contextmenu", function(event) {
  // impedisce il comportamento predefinito del click destro
  event.preventDefault();

  // ottieni le coordinate del click sul canvas
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY -
*/
    /****
     const boundingRect = myElement.getBoundingClientRect();
      
      if (
        event.clientX >= boundingRect.left &&
        event.clientX <= boundingRect.right &&
        event.clientY >= boundingRect.top &&
        event.clientY <= boundingRect.bottom
      )
        */ ///
    function handleStart(e) {
        //getBoundingClientRect 
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
