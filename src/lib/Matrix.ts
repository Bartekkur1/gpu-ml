type MatrixValue = Array<Array<number>>;
type GenerateValue = () => number;

export interface MatrixSize {
  rows: number;
  cols: number;
  size: number;
};

export default class Matrix {

  public value: MatrixValue;
  public size: MatrixSize;

  constructor(input: MatrixValue = []) {
    this.value = input;
    this.size = { rows: 0, cols: 0, size: 0 };
    this.updateSize();
  }

  public static iterateNew(rows: number, cols: number, callback: (x: number, y: number) => number, xMax?: number, yMax?: number) {
    const newMatrix = Matrix.createBySize(rows, cols);
    return newMatrix.iterate(callback, xMax, yMax);
  }

  public iterate(callback: (x: number, y: number) => number, xMax?: number, yMax?: number) {
    for (let x = 1; x <= (xMax || this.size.rows); x++) {
      for (let y = 1; y <= (yMax || this.size.cols); y++) {
        this.value[x - 1][y - 1] = callback(x, y);
      }
    }

    return this;
  }

  public static createBySize(rows: number, cols: number, getValue?: GenerateValue): Matrix {
    const value = [];
    for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < cols; c++) {
        row.push(getValue ? getValue() : 0);
      }
      value[r] = row;
    }
    return new Matrix(value);
  }

  public static createIdentity(size: number): Matrix {
    const identityMatrix = Matrix.createBySize(size, size);

    for (let c = 0; c < size; c++) {
      identityMatrix.value[c][c] = 1;
    }

    return identityMatrix;
  }

  public static createRandom(rows: number, cols: number): Matrix {
    return this.createBySize(rows, cols, () => Math.random());
  }

  public getSingularValue(): number {
    return this.value[0][0];
  }

  private updateSize() {
    this.size = {
      rows: this.value.length,
      cols: (this.value[0]?.length) || 0,
      size: (this.value.length * this.value[0]?.length) || 0
    };
  }

  public transpose(): Matrix {
    return Matrix.iterateNew(this.size.cols, this.size.rows, (x, y) => this.getValue(y, x));
  }

  private argInRange(row: number, col: number) {
    if (row > this.size.rows || col > this.size.cols) {
      throw new Error(`Given position is invalid! Given: ${row}, ${col} size is: ${this.size.rows}, ${this.size.cols}`);
    }
  }

  public getRow(row: number): Array<number> {
    this.argInRange(row, 0);
    return this.value[row - 1];
  }

  public getColumn(col: number): Array<number> {
    this.argInRange(0, col);
    return this.value.flatMap(e => e[col - 1]);
  }

  public getValue(row: number, col: number): number {
    this.argInRange(row, col);
    return this.value[row - 1][col - 1];
  }

  public mulEW(matrixB: Matrix) {
    if (this.size.cols !== matrixB.size.cols || this.size.rows !== matrixB.size.rows) {
      throw new Error(`Invalid matrix size! ${this.size.rows}x${this.size.cols} cant be multiplied element wise by ${matrixB.size.rows}x${matrixB.size.cols}`);
    }
    return Matrix.iterateNew(this.size.rows, this.size.cols, (x, y) => this.getValue(x, y) * matrixB.getValue(x, y));
  }

  public mul(matrixB: Matrix | number): Matrix {
    if (typeof matrixB === 'number') {
      return Matrix.iterateNew(this.size.rows, this.size.cols, (x, y) => this.getValue(x, y) * matrixB);
    } else {
      if (this.size.cols !== matrixB.size.rows) {
        throw new Error(`Invalid matrix size! ${this.size.cols} !== ${matrixB.size.rows}`);
      }
      return Matrix.iterateNew(this.size.rows, matrixB.size.cols, (x, y) => {
        let sum = 0;
        for (let i = 1; i <= this.size.cols; i++) {
          sum += this.getValue(x, i) * matrixB.getValue(i, y);
        }
        return sum;
      }, this.size.rows, matrixB.size.cols);
    }
  }

  public sub(val: Matrix | number): Matrix {
    const c = Matrix.createBySize(this.size.rows, this.size.cols);
    if (typeof val === 'number') {
      return c.iterate((x, y) => this.getValue(x, y) - val);
    }
    else {
      if (this.size.cols !== val.size.cols || this.size.rows !== val.size.rows) {
        throw new Error(`Invalid matrix size! ${this.size.rows}x${this.size.cols} cant be sub from ${val.size.rows}x${val.size.cols}`);
      }
      return c.iterate((x, y) => this.getValue(x, y) - val.getValue(x, y));
    }
  }

  public pow(pow: number): Matrix {
    return Matrix.iterateNew(this.size.rows, this.size.cols, (x, y) => Math.pow(this.getValue(x, y), pow));
  }

  public div(val: number): Matrix {
    return Matrix.iterateNew(this.size.rows, this.size.cols, (x, y) => this.getValue(x, y) / val);
  }

  public add(val: Matrix | number): Matrix {
    const c = Matrix.createBySize(this.size.rows, this.size.cols);
    if (typeof val === 'number') {
      return c.iterate((x, y) => this.getValue(x, y) + val);
    } else {
      if (this.size.cols !== val.size.cols || this.size.rows !== val.size.rows) {
        throw new Error(`Invalid matrix size! ${this.size.rows}x${this.size.cols} cant be added to ${val.size.rows}x${val.size.cols}`);
      }
      return c.iterate((x, y) => this.getValue(x, y) + val.getValue(x, y));
    }
  }

};