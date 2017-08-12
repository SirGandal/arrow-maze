export default class Utils {
    // Converts row/col to universal index.
    static getIndex(row: number, col: number, columns: number) {
        return row * columns + col;
    }

    // Gets the row index from the universal index.
    static getRow(index: number, columns: number) {
        return Math.floor(index / columns);
    }

    // Gets the column index from the universal index.
    static getCol(index: number, columns: number) {
        return Math.floor(index % columns);
    }
}