import { StopFunction } from "../Types";

export const CreateSimpleStop = (minEpoch: number, minLoss: number): StopFunction => {
  return (epoch: number, loss: number) => {
    return epoch > minEpoch && loss < minLoss;
  }
};