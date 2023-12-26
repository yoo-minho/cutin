export const getAvgStat = (row, type) => {
  return String(Math.round((row[type] * 10) / row.play) / 10);
};
