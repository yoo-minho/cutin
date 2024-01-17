export const getAvgStat = (row, type, is1000 = false) => {
  if (is1000) {
    return String(Math.round((row[type] * 1000) / row.play) / 1000);
  }
  return String(Math.round((row[type] * 10) / row.play) / 10);
};
