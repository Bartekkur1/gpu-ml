import Matrix from "../../lib/Matrix";

export const roundPrediction = (prediction: Matrix) => {
  const row = prediction.getRow(1);
  return row.map(r => Math.round(r));
};
