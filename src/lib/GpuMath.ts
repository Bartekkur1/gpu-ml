import { GPU, KernelOutput } from "gpu.js";
import Matrix from "./Matrix";

export default class GpuMath {

  private gpu: GPU;

  constructor() {
    this.gpu = new GPU();
  }

  private processKernelResult(result: KernelOutput): Matrix {
    return new Matrix((result as Float32Array[]).map(r => Array.from(r)));
  }

  public matrixMul(a: Matrix, b: Matrix | number): Matrix {
    if (typeof b === 'number') {
      const multiplyMatrix = this.gpu.createKernel(function (a: number[][], b: number, size: number) {
        return a[this.thread.y][this.thread.x] * b;
      }).setOutput([a.size.cols, a.size.rows]);
      return this.processKernelResult(multiplyMatrix(a.value, b, a.size.cols));
    }

    const multiplyMatrix = this.gpu.createKernel(function (a: number[][], b: number[][], size: number) {
      let sum = 0;
      for (let i = 0; i < size; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
      }
      return sum;
    }).setOutput([b.size.cols, a.size.rows]);

    return this.processKernelResult(multiplyMatrix(a.value, b.value, a.size.cols));
  }

  public matrixMulEW(a: Matrix, b: Matrix): Matrix {
    const multiplyMatrix = this.gpu.createKernel(function (a: number[][], b: number[][]) {
      return a[this.thread.y][this.thread.x] * b[this.thread.y][this.thread.x];
    }).setOutput([b.size.cols, a.size.rows]);

    return this.processKernelResult(multiplyMatrix(a.value, b.value));
  }

  public matrixSum(a: Matrix, b: Matrix | number): Matrix {
    if (typeof b === 'number') {
      const sumMatrix = this.gpu.createKernel(function (a: number[][], b: number) {
        return a[this.thread.y][this.thread.x] + b;
      }).setOutput([a.size.rows, a.size.cols]);
      return this.processKernelResult(sumMatrix(a.value, b));
    }

    if (a.size.cols !== b.size.cols || a.size.rows !== b.size.rows) {
      throw new Error(`Invalid matrix size! ${a.size.rows}x${a.size.cols} cant be added to ${b.size.rows}x${b.size.cols}`);
    }
    const sumMatrix = this.gpu.createKernel(function (a: number[][], b: number[][]) {
      return a[this.thread.y][this.thread.x] + b[this.thread.y][this.thread.x];
    }).setOutput([a.size.rows, a.size.cols]);
    return this.processKernelResult(sumMatrix(a.value, b.value));
  }

  public matrixSub(a: Matrix, b: Matrix): Matrix {
    const sumMatrix = this.gpu.createKernel(function (a: number[][], b: number[][]) {
      return a[this.thread.x][this.thread.y] - b[this.thread.x][this.thread.y];
    }).setOutput([a.size.rows, a.size.cols]);
    const result = sumMatrix(a.value, b.value) as Float32Array[];

    return new Matrix(result.map(e => Array.from(e)));
  }
};
