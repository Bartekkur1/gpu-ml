import Matrix from "../Matrix";
import { LossFunction } from "../Types";

export const SimpleLoss: LossFunction = (output: Matrix, expectedOutput: Matrix) => {
  return output.sub(expectedOutput);
};