class SCell {

    constructor(note = []) {
        this.value = 0;
        this.notes = new Array();
        this.circled = new Array();
        if (Array.isArray(note)) this.notes = note.slice(0, 9);
        else this.value = note;
        this.notes.sort((a, b) => a - b);
        this.default = false;
    }
    addCircled(n) {
        if (n > 0 && n <= 9) {
            if (!this.circled.includes(n)) {
                this.circled.push(n);
                this.circled.sort((a, b) => a - b);
                if (!this.notes.includes(n)) this.addNote(n);
            }
        }
    }
    removeCircled(n) {
        if (n > 0 && n <= 9) {
            const index = this.circled.indexOf(n);
            if (index > -1) {
                this.circled.splice(index, 1);
            }
        }
    }
    addNote(n) {
        if (n > 0 && n <= 9) {
            if (!this.notes.includes(n)) {
                this.notes.push(n);
                this.notes.sort((a, b) => a - b);
            }
        }
    }
    removeNote(n) {
        if (n > 0 && n <= 9) {
            const index = this.notes.indexOf(n);
            if (index > -1) {
                this.notes.splice(index, 1);
            }
        }
        this.removeCircled(n);
    }
    toString() {
        return this.value;
    }

    toHtml() {
        if (this.value != 0) {
            if (this.default) return "<b>" + this.value + "</b>";
            else return this.value;
        }
        if (this.notes.length == 0) return "";
        const table = document.createElement('div');
        table.className = "minitable";
        let noteIndex = 0;
        for (let i = 0; i < 3; i++) {
            const row = document.createElement('div');
            row.className = "miniclear";
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.className = "minitable-cell";
                cell.textContent = this.notes.includes(noteIndex + 1) ? noteIndex + 1 : '';
                if (this.circled.includes(noteIndex + 1)) cell.classList.add('circle');
                else cell.classList.remove('circle');
                table.appendChild(cell);
                noteIndex++;
            }
            table.appendChild(row);
        }
        return table.outerHTML;
    }
    contains(n) {
        return this.value == n ? true : this.notes.includes(n);
    }
}
