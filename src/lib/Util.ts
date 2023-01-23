export const scaleArray = (numbers: number[], size: number = 20) => {
  const avg = [];
  const chunkSize = numbers.length / size;
  for (let i = chunkSize; i <= numbers.length; i += chunkSize) {
    avg.push(numbers.slice(i - chunkSize, i).reduce((prev, curr) => {
      prev += curr;
      return prev;
    }, 0) / chunkSize);
  }
  return avg;
};