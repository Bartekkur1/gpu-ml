export const XavierInitialization = (inputs: number): () => number => {
  return () => {
    const lower = -(1 / Math.sqrt(inputs));
    const upper = (1 / Math.sqrt(inputs));

    return lower + Math.random() * (upper - lower);
  }
};