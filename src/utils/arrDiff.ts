export const arrDiff = (arr1: Array, arr2: Array): Array => {
  const diff = arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
  return diff;
};
