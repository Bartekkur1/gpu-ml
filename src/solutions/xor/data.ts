import Matrix from "../../lib/Matrix";
import { DataSet } from "../../lib/Types";

export const dataSet: DataSet[] = [
  {
    input: new Matrix([[0, 0]]),
    expectedOutput: new Matrix([[0]])
  },
  {
    input: new Matrix([[1, 0]]),
    expectedOutput: new Matrix([[1]])
  },
  {
    input: new Matrix([[0, 1]]),
    expectedOutput: new Matrix([[1]])
  },
  {
    input: new Matrix([[1, 1]]),
    expectedOutput: new Matrix([[0]])
  },
];