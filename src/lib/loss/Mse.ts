import Matrix from "../Matrix";

export const mse = (input: Matrix, predicted: Matrix): number => {
  const se = predicted.sub(input).pow(2);//.div(2);
  const mean = se.value[0].reduce((prev, next) => {
    prev += next;
    return prev;
  }, 0);
  return mean;
};

export const msePrime = (input: Matrix, predicted: Matrix): Matrix => {
  return input.sub(predicted).mul(2).div(input.size.cols);
};