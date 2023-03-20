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