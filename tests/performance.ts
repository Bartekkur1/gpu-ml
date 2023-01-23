import GpuMath from '../src/lib/GpuMath';
import Matrix from '../src/lib/Matrix';

const math = new GpuMath();

const multiplicationTest = (size: number) => {
  const matrixA = Matrix.createRandom(size, size);
  const matrixB = Matrix.createRandom(size, size);

  let start = Date.now();
  math.matrixMul(matrixA, matrixB);
  const GPU = Date.now() - start;

  start = Date.now();
  matrixA.mul(matrixB);
  const CPU = Date.now() - start;

  return { CPU, GPU };
};

type CreationTimer = { rand?: number, empt?: number, iden?: number };

const creationTestCPU = (size: number) => {
  const CPU: CreationTimer = {};

  let start = Date.now();
  Matrix.createRandom(size, size);
  CPU['rand'] = Date.now() - start;

  start = Date.now();
  Matrix.createBySize(size, size);
  CPU['empt'] = Date.now() - start;

  start = Date.now();
  Matrix.createIdentity(size);
  CPU['iden'] = Date.now() - start;

  return CPU;
};

const multiplicationResults: { [key: number]: { GPU: number, CPU: number } } = {};
multiplicationResults[10] = multiplicationTest(10);
multiplicationResults[100] = multiplicationTest(100);
multiplicationResults[500] = multiplicationTest(500);
multiplicationResults[1000] = multiplicationTest(1000);
console.log('Multiplication test');
console.table(multiplicationResults);

const creationResultsCPU: { [key: number]: CreationTimer } = [];
creationResultsCPU[100] = creationTestCPU(100);
creationResultsCPU[500] = creationTestCPU(500);
creationResultsCPU[1000] = creationTestCPU(1000);
creationResultsCPU[2000] = creationTestCPU(2000);
creationResultsCPU[5000] = creationTestCPU(5000);
console.log('CPU Creation test');
console.table(creationResultsCPU);
