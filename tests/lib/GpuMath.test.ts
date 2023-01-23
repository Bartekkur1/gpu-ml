import Matrix from '../../src/lib/Matrix';
import GpuMath from '../../src/lib/GpuMath';

describe('GPU Math tests', () => {

  const math = new GpuMath();

  describe('Should correctly multiply matrixes', () => {
    test('By scalar value', () => {
      const matrixA = new Matrix([
        [1, 2, 3],
        [4, 5, 6]
      ]);

      const scaledMatrix = matrixA.mul(4);
      const gpuCalculated = math.matrixMul(matrixA, 4);

      expect(gpuCalculated.value).toStrictEqual(scaledMatrix.value);
    });

    test('3x5 * 5x3', () => {
      const matrixA = new Matrix([
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5]]);
      const matrixB = new Matrix([
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3]]);

      const matrixC = matrixA.mul(matrixB);
      const gpuCalculated = math.matrixMul(matrixA, matrixB);
      expect(gpuCalculated.size).toStrictEqual({
        rows: 3,
        cols: 3,
        size: 9
      });
      expect(gpuCalculated.value).toStrictEqual(matrixC.value);
    });

    test('2x3 * 3x2', () => {
      const matrixA = new Matrix([[1, 2, 3], [4, 5, 6]]);
      const matrixB = new Matrix([[7, 8], [9, 10], [11, 12]]);

      const matrixC = matrixA.mul(matrixB);
      const gpuCalculated = math.matrixMul(matrixA, matrixB);
      expect(gpuCalculated.size).toStrictEqual({
        rows: 2,
        cols: 2,
        size: 4
      });
      expect(gpuCalculated.value).toStrictEqual(matrixC.value);
      expect(gpuCalculated.getColumn(1)).toStrictEqual([58, 139]);
      expect(gpuCalculated.getColumn(2)).toStrictEqual([64, 154]);
      expect(gpuCalculated.getRow(1)).toStrictEqual([58, 64]);
      expect(gpuCalculated.getRow(2)).toStrictEqual([139, 154]);
    });

    test('3x2 * 2x1', () => {
      const matrixA = new Matrix([[1, 2], [3, 4], [5, 6]]);
      const matrixB = new Matrix([[7], [8]]);

      const matrixC = matrixA.mul(matrixB);
      const gpuCalculated = math.matrixMul(matrixA, matrixB);
      expect(gpuCalculated.size).toStrictEqual({
        rows: 3,
        cols: 1,
        size: 3
      });
      expect(gpuCalculated.value).toStrictEqual(matrixC.value);
      expect(gpuCalculated.getRow(1)).toStrictEqual([23]);
      expect(gpuCalculated.getRow(2)).toStrictEqual([53]);
      expect(gpuCalculated.getRow(3)).toStrictEqual([83]);
    });

    test('2x3 * 3x1', () => {
      const matrixA = new Matrix([[1, 2, 3], [4, 5, 6]]);
      const matrixB = new Matrix([[7], [8], [9]]);

      const matrixC = matrixA.mul(matrixB);
      const gpuCalculated = math.matrixMul(matrixA, matrixB);
      expect(gpuCalculated.size).toStrictEqual({
        rows: 2,
        cols: 1,
        size: 2
      });

      expect(gpuCalculated.value).toStrictEqual(matrixC.value);
    });
  });
});