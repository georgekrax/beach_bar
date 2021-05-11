export const avg = (arr: number[]) => {
  const avgNum = arr.reduce((total, current) => total + current, 0);
  return avgNum;
};
