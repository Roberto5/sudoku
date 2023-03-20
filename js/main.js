sudoku = {
    // 0 cella vuota 
    // -1 cella vuota ma già processata
    board: Array.from({
        length: 9
    }, () => Array.from({
        length: 9
    }, () => new SCell(0))),
    solution: [],
    story: [],
    minimale: 17,
    level: 17,
    tableName: "sudoku",
    _table: null,
    get table() {
        if (this._table == null) this._table = document.getElementById(this.tableName);
        return this._table;
    },
    tableSolution: "solution",
    blink: 0,
    blinker: null,
    stack: 0,
    _numberSelected: 0,
    get numberSelected() {
        return this._numberSelected;
    },
    set numberSelected(v) {
        this._numberSelected = v * 1;
        this.highlight(v);
    },
    functionSelected: 0,
    get filledCell() {
        let n = 0;
        for (let i = 0; i < this.board.length; i++)
            for (let j = 0; j < this.board[i].length; j++)
                if ((this.board[i][j] != 0) && (this.board[i][j] != -1)) n++;
        return n;
    },
    highlight: function (number = -1) {
        if (number == -1) number = this.numberSelected;
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if ((this.board[x][y].contains(number)) && (number != 0)) {
                    if (this.board[x][y].value == 0) this.table.rows[x].cells[y].classList.add("lightSelected");
                    else
                        this.table.rows[x].cells[y].classList.add("selected");

                } else {
                    this.table.rows[x].cells[y].classList.remove("selected");
                    this.table.rows[x].cells[y].classList.remove("lightSelected");
                }
            }
        }
    },
    getCandidate: function (x, y, solution = false) {
        let board = [];
        if (solution) {
            for (let v of this.solution)
                board.push(v.slice());
        } else {
            for (let v of this.board)
                board.push(v.slice());
        }
        let candidate = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        // Elimina i numeri già presenti nella stessa riga
        for (let j = 0; j < 9; j++) {
            if (board[x][j].value != 0) {
                candidate.delete(board[x][j].value);
            }
        }

        // Elimina i numeri già presenti nella stessa colonna
        for (let i = 0; i < 9; i++) {
            if (board[i][y].value != 0) {
                candidate.delete(board[i][y].value);
            }
        }

        // Elimina i numeri già presenti nella stessa regione 3x3
        let regionX = Math.floor(x / 3) * 3;
        let regionY = Math.floor(y / 3) * 3;
        for (let i = regionX; i < regionX + 3; i++) {
            for (let j = regionY; j < regionY + 3; j++) {
                if (board[i][j].value != 0) {
                    candidate.delete(board[i][j].value);
                }
            }
        }
        return Array.from(candidate);
    },
    generate: function (level = 17) {
        //if (this.blinker==null) this.blinker=document.getElementById('loading');
        if (level < this.minimale) level = this.minimale;
        this.board = Array.from({
            length: 9
        }, () => Array.from({
            length: 9
        }, () => new SCell(0)));
        this.story = [];
        // Inserisce un numero casuale in una cella casuale
        const randomRow = Math.floor(Math.random() * 9);
        const randomCol = Math.floor(Math.random() * 9);
        const randomNum = Math.floor(Math.random() * 9) + 1;
        this.level = level - 1;
        animation = true;
        this.stack = 0;
        animateLoading();
        let bool = this.generateRecuesive();
        animation = false;
        if (!bool) console.log("errore!");
        else this.print();
        return bool;
    },
    generateRecuesive() {
        this.level--;
        if (this.stack > 10000) return false;
        //this.print();
        // Sceglie una cella casuale, diversa da quelle già presenti
        let row, col, possibleNums;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
            possibleNums = this.getCandidate(row, col); //possibili numeri da aggiungere
            if (possibleNums.length == 1) this.board[row][col] = -1;
        } while ((this.board[row][col] != 0) && (this.board[row][col] != -1));

        let bool = false;
        if (possibleNums.length == 0) return false;
        else {
            // Ordina i numeri possibili in modo casuale
            possibleNums.sort(() => Math.random() - 0.5);

            for (let i = 0; i < possibleNums.length && !bool; i++) {
                this.board[row][col] = new SCell(possibleNums[i]);
                this.board[row][col].default = true;
                if (this.level < 0) {
                    this.solution = [];
                    for (let v of this.board)
                        this.solution.push(v.slice());
                    bool = this.solve();
                    if (!bool) console.log("non risolvibile");
                } else
                    bool = this.generateRecuesive();
                if (!bool) this.level++;
            }
        }
        return bool;
    },
    findEmptyCell: function () {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.solution[row][col] == 0) {
                    return [row, col];
                }
            }
        }
        return [-1, -1];
    },
    solve: function () {
        this.stack++;
        if (this.stack > 10000) return false;
        let emptyCell = this.findEmptyCell();
        let row = emptyCell[0];
        let col = emptyCell[1];

        // Se non ci sono altre celle vuote, lo schema è risolto
        if (row == -1 && col == -1) {
            return true;
            animation = false;
        }

        // Cerca il numero possibile per la cella vuota
        let candidates = this.getCandidate(row, col, true);
        for (let i = 0; i < candidates.length; i++) {
            let candidate = candidates[i];
            this.solution[row][col] = new SCell(candidate);
            if (this.stack > 10000) return false;
            // Prova a risolvere lo schema con il numero candidato
            if (this.solve()) {
                return true;
            }

            // Se la soluzione non funziona, ripristina la cella vuota
            this.solution[row][col] = 0;
        }

        // Non ci sono numeri validi per la cella vuota
        return false;
    },
    print: function (useSolution = false) {
        let board = [];
        if (useSolution) {
            for (let v of this.solution)
                board.push(v.slice());
        } else
            for (let v of this.board)
                board.push(v.slice());
        table = document.getElementById( /*useSolution ? this.tableSolution : */ this.tableName);
        /*while (table.rows.length > 0) {
            table.deleteRow(0);
        }*/
        //var body = table.createTBody();
        for (let i = 0; i < board.length; i++) {
            //let tableRow = body.insertRow();
            for (let j = 0; j < board[i].length; j++) {
                let cell = table.rows[i].cells[j];
                cell.innerHTML = board[i][j].toHtml();
                cell.classList.remove("error");
                /*if (Array.isArray(board[i][j])) {
                    cell.innerHTML = new SCell(board[i][j]).toHtml();
                    /*let miniTable = document.createElement("table");
                    miniTable.className = "minitable";
                    let row, c, z = 0;
                    for (let x = 0; x < 9; x++) {
                        if (x % 3 == 0) row = miniTable.insertRow();
                        c = row.insertCell();
                        if (board[i][j][z] == x + 1) c.innerHTML = board[i][j][z++];
                    }
                    cell.appendChild(miniTable);*
                } else {
                    if (board[i][j] > 0) cell.innerHTML = board[i][j];
                    else cell.innerHTML = "";
                }*/

            }
        }
        this.highlight();
    },
    check: function () {
        if (this.solution.length > 0) {
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if ((this.board[i][j].value != 0) && (this.board[i][j].value != this.solution[i][j].value))
                        this.table.rows[i].cells[j].classList.add("error");
                }
            }
        }
    }
};




let loadingElement;
let frame = 0;
let animation = true;

function animateLoading() {
    if (loadingElement == null) loadingElement = document.getElementById('loading');
    switch (frame) {
        case 0:
            loadingElement.innerHTML = '/';
            break;
        case 1:
            loadingElement.innerHTML = '-';
            break;
        case 2:
            loadingElement.innerHTML = '\\';
            break;
        case 3:
            loadingElement.innerHTML = '|';
            break;
    }
    frame = (frame + 1) % 4; // alterna tra i 4 caratteri ogni mezzo secondo
    if (animation) requestAnimationFrame(animateLoading);
    else loadingElement.innerHTML = "Done";
}
