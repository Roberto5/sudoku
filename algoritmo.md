primo passo

genera un numero casuale in una cella casuale.


***iterazione ricorsiva.***

prendi una cella casuale tra quelle rimaste (diverse da 0 e -1)
calcola i candidati possibili
se i candidati sono 1 contrasegna la cella come -1 e scegli un altra cella


se i candidati sono 0 il numero precedente è sbagliato ritorna falso

se i candidati sono + di 1 allora prendine uno a caso e reitera
se la reiterazione da falso allora prendi un altro numero casuale e ripeti.
se tutti i candidati danno falso allora restituisci falso.

// ottieni il riferimento al canvas e alla tabella del Sudoku
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
