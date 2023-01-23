import Matrix from '../../src/lib/Matrix';

describe('Matrix class tests', () => {

  describe('Matrix management operation', () => {
    test('Should construct proper Matrix object', () => {
      const expectedValues = [
        [1, 2],
        [3, 4]
      ];

      const matrix = new Matrix([[1, 2], [3, 4]]);
      const matrixValues = matrix.value;

      expect(matrixValues).toStrictEqual(expectedValues);
      expect(matrix.size.rows).toBe(2);
      expect(matrix.size.cols).toBe(2);
      expect(matrix.size.size).toBe(4);
    });

    test('Should return valid row', () => {
      const expectedValues = [
        [1, 1],
        [0, 0]
      ];

      const matrix = new Matrix(expectedValues);
      const row = matrix.getRow(1);
      expect(row).toStrictEqual([1, 1]);
    });

    test('Should return valid column', () => {
      const expectedValues = [
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0]
      ];

      const matrix = new Matrix(expectedValues);
      const row = matrix.getColumn(1);

      expect(row).toStrictEqual([1, 1, 1]);
      expect(matrix.size.rows).toBe(3);
      expect(matrix.size.cols).toBe(3);
      expect(matrix.size.size).toBe(9);
    });

    test('Should return valid cell value', () => {
      const expectedValues = [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 3, 0],
        [1, 0, 0, 0]
      ];

      const matrix = new Matrix(expectedValues);
      const value = matrix.getValue(3, 3);
      expect(value).toBe(3);

      expect(matrix.size.rows).toBe(4);
      expect(matrix.size.cols).toBe(4);
      expect(matrix.size.size).toBe(16);
    });

    test('Should throw error if arg is out of range', () => {
      const matrixValues = [
        [1, 2],
        [3, 4]
      ];

      const matrix = new Matrix(matrixValues);
      expect(() => matrix.getRow(5)).toThrowError('Given position is invalid! Given: 5, 0 size is: 2, 2');
      expect(() => matrix.getColumn(5)).toThrowError('Given position is invalid! Given: 0, 5 size is: 2, 2');
      expect(() => matrix.getValue(5, 5)).toThrowError('Given position is invalid! Given: 5, 5 size is: 2, 2');
    });

    test('Should generate empty matrix by size', () => {
      const matrix = Matrix.createBySize(5, 5);
      const rawValue = matrix.value;

      expect(rawValue).toStrictEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ]);
    });

    test('Should generate identity matrix', () => {
      expect(Matrix.createIdentity(5).value).toStrictEqual([
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1]
      ]);

      expect(Matrix.createIdentity(3).value).toStrictEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ]);

      expect(Matrix.createIdentity(1).value).toStrictEqual([
        [1],
      ]);
    });

    test('Should generate matrix with random values', () => {
      const randomMatrix = Matrix.createRandom(5, 5);

      expect(randomMatrix.size.size).toBe(25);
      expect(randomMatrix.getValue(1, 1)).toBeLessThanOrEqual(1);
      expect(randomMatrix.getValue(1, 1)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Matrix basic operations', () => {

    test('Should transpose square matrix', () => {
      const initialValues = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];

      const expectedValues = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
      ];

      const matrix = new Matrix(initialValues);
      const transposeMatrix = matrix.transpose();

      expect(matrix.size.rows).toBe(transposeMatrix.size.rows);
      expect(matrix.size.cols).toBe(transposeMatrix.size.cols);
      expect(transposeMatrix.value).toStrictEqual(expectedValues);
    });

    test('Should transpose rectangular matrix', () => {
      const initialValues = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10]
      ];

      const expectedValues = [
        [1, 6],
        [2, 7],
        [3, 8],
        [4, 9],
        [5, 10]
      ];

      const matrix = new Matrix(initialValues);
      const transposeMatrix = matrix.transpose();

      expect(matrix.size.rows).toBe(transposeMatrix.size.cols);
      expect(matrix.size.cols).toBe(transposeMatrix.size.rows);
      expect(transposeMatrix.value).toStrictEqual(expectedValues);
    });

    test('Should subtract matrix by scalar', () => {
      const matrixA = new Matrix([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
      ]);

      const res = matrixA.sub(1);

      expect(res.value).toStrictEqual([
        [0, 1, 2, 3],
        [4, 5, 6, 7]
      ]);
    });

    test('Should divide matrix by scalar', () => {
      const matrixA = new Matrix([
        [2, 4],
        [6, 8],
        [10, 12]
      ]);

      const res = matrixA.div(2);

      expect(res.value).toStrictEqual([
        [1, 2],
        [3, 4],
        [5, 6]
      ]);
    });

    test('Should pow matrix by scalar', () => {
      const matrix = new Matrix([
        [1, 2],
        [3, 4]
      ]);

      const result = matrix.pow(2);

      expect(result.value).toStrictEqual([
        [1, 4],
        [9, 16]
      ]);
    });

    test('Should subtract matrix from matrix', () => {
      const matrixA = new Matrix([
        [5, 4, 3],
        [2, 1, 0]
      ]);

      const matrixB = new Matrix([
        [4, 3, 2],
        [1, 0, -1]
      ]);

      const result = matrixA.sub(matrixB);
      expect(result.value).toStrictEqual([
        [1, 1, 1],
        [1, 1, 1]
      ]);
    });

    test('Should multiply matrixes element wise', () => {
      const matrixA = new Matrix([
        [2, 2, 2],
        [2, 2, 2]
      ]);

      const matrixB = new Matrix([
        [5, 5, 5],
        [5, 5, 5]
      ]);

      const result = matrixA.mulEW(matrixB);
      expect(result.value).toStrictEqual([
        [10, 10, 10],
        [10, 10, 10]
      ]);
    });

    test('Should throw error when multiplying invalid size element wise', () => {
      const matrixA = new Matrix([
        [2, 2,],
        [2, 2]
      ]);

      const matrixB = new Matrix([
        [5, 5, 5],
        [5, 5, 5]
      ]);

      expect(() => matrixA.mulEW(matrixB)).toThrowError('Invalid matrix size! 2x2 cant be multiplied element wise by 2x3');
    });
  });

  describe('Should correctly multiply matrixes', () => {
    test('By scalar value', () => {
      const matrixA = new Matrix([
        [1, 2, 3],
        [4, 5, 6]
      ]);

      const scaledMatrix = matrixA.mul(4);

      expect(scaledMatrix.value).toStrictEqual([
        [4, 8, 12],
        [16, 20, 24]
      ]);
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
      const expectedValue = [
        [15, 30, 45],
        [15, 30, 45],
        [15, 30, 45]
      ];

      const matrixC = matrixA.mul(matrixB);
      expect(matrixC.size).toStrictEqual({
        rows: 3,
        cols: 3,
        size: 9
      });
      expect(matrixC.value).toStrictEqual(expectedValue);
    });

    test('2x3 * 3x2', () => {
      const matrixA = new Matrix([[1, 2, 3], [4, 5, 6]]);
      const matrixB = new Matrix([[7, 8], [9, 10], [11, 12]]);

      const matrixC = matrixA.mul(matrixB);
      expect(matrixC.size).toStrictEqual({
        rows: 2,
        cols: 2,
        size: 4
      });
      expect(matrixC.value).toStrictEqual([[58, 64], [139, 154]]);
      expect(matrixC.getColumn(1)).toStrictEqual([58, 139]);
      expect(matrixC.getColumn(2)).toStrictEqual([64, 154]);
      expect(matrixC.getRow(1)).toStrictEqual([58, 64]);
      expect(matrixC.getRow(2)).toStrictEqual([139, 154]);
    });

    test('3x2 * 2x1', () => {
      const matrixA = new Matrix([[1, 2], [3, 4], [5, 6]]);
      const matrixB = new Matrix([[7], [8]]);

      const matrixC = matrixA.mul(matrixB);
      expect(matrixC.size).toStrictEqual({
        rows: 3,
        cols: 1,
        size: 3
      });
      expect(matrixC.value).toStrictEqual([[23], [53], [83]]);
      expect(matrixC.getRow(1)).toStrictEqual([23]);
      expect(matrixC.getRow(2)).toStrictEqual([53]);
      expect(matrixC.getRow(3)).toStrictEqual([83]);
    });

    test('2x3 * 3x1', () => {
      const matrixA = new Matrix([[1, 2, 3], [4, 5, 6]]);
      const matrixB = new Matrix([[7], [8], [9]]);

      const matrixC = matrixA.mul(matrixB);
      expect(matrixC.size).toStrictEqual({
        rows: 2,
        cols: 1,
        size: 2
      });

      expect(matrixC.value).toStrictEqual([[50], [122]]);
    });
  });
});