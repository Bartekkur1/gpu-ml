import Matrix from "../Matrix";

export const mse = (output: Matrix, predictedOutput: Matrix): number => {
  const se = predictedOutput.sub(output).pow(2);//.div(2);
  const mean = se.value[0].reduce((prev, next) => {
    prev += next;
    return prev;
  }, 0);
  return mean / se.value[0].length;
};

export const msePrime = (input: Matrix, predicted: Matrix): Matrix => {
  return input.sub(predicted).mul(2).div(input.size.cols);
};