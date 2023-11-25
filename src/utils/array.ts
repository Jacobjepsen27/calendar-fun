export const arrayFromNumber = (count: number) => {
  let arr = [...Array(count)].map((_, i) => i);
  return arr;
};
