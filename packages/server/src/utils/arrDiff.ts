export default function (arr1: Array<string>, arr2: Array<string>): Array<string> {
  const diff = arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
  return diff;
};
