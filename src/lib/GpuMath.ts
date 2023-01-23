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

  public createEmptyMatrix(rows: number, cols: number): Matrix {
    const generateValues = this.gpu.createKernel(function () {
      return 0;
    }).setOutput([rows, cols]);

    return this.processKernelResult(generateValues());
  }

  public createRandomMatrix(rows: number, cols: number): Matrix {
    const generateValues = this.gpu.createKernel(function () {
      return Math.random();
    }).setOutput([rows, cols]);

    return this.processKernelResult(generateValues());
  }

  public createIdentityMatrix(size: number): Matrix {
    const generateValues = this.gpu.createKernel(function () {
      if (this.thread.x === this.thread.y) {
        return 1;
      }
      return 0;
    }).setOutput([size, size]);

    return this.processKernelResult(generateValues());
  }

  public matrixMul(a: Matrix, b: Matrix | number): Matrix {
    // if (a.size.cols !== b.size.rows) {
    //   throw new Error(`Invalid matrix size! ${a.size.cols} !== ${b.size.rows}`);
    // }

    return a.mul(b);
  }

  public matrixSum(a: Matrix, b: Matrix): Matrix {
    const sumMatrix = this.gpu.createKernel(function (a: number[][], b: number[][]) {
      return a[this.thread.y][this.thread.x] + b[this.thread.y][this.thread.x];
    }).setOutput([a.size.rows, a.size.cols]);
    const result = sumMatrix(a.value, b.value) as Float32Array[];

    return new Matrix(result.map(e => Array.from(e)));
  }

  public matrixSub(a: Matrix, b: Matrix): Matrix {
    const sumMatrix = this.gpu.createKernel(function (a: number[][], b: number[][]) {
      return a[this.thread.x][this.thread.y] - b[this.thread.x][this.thread.y];
    }).setOutput([a.size.rows, a.size.cols]);
    const result = sumMatrix(a.value, b.value) as Float32Array[];

    return new Matrix(result.map(e => Array.from(e)));
  }

  public matrixSigmoid(m: Matrix): Matrix {
    const sigmoidMatrix = this.gpu.createKernel(function (m: number[][]) {
      return 1 / (1 + Math.exp(-m[this.thread.y][this.thread.x]));
    }).setOutput([m.size.cols, m.size.rows]);
    const result = sigmoidMatrix(m.value) as Float32Array[];

    return new Matrix(result.map(e => Array.from(e)));
  }

  public matrixSigmoidDerivative(m: Matrix): Matrix {
    const sigmoidMatrix = this.gpu.createKernel(function (m: number[][]) {
      const x = m[this.thread.y][this.thread.x];
      return x * (1 - x);
    }).setOutput([m.size.cols, m.size.rows]);
    const result = sigmoidMatrix(m.value) as Float32Array[];

    return new Matrix(result.map(e => Array.from(e)));
  }
};
