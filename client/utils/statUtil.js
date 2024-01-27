export const getAvgStat = (row, type, is1000 = false) => {
  if (is1000) {
    return String(Math.round((row[type] * 1000) / row.play) / 1000);
  }
  return String(Math.round((row[type] * 10) / row.play) / 10);
};

export function getKblEff(v) {
  return (
    (+v.pts + +v.stl + +v.blk + (+v.reb - +v.orb)) * 1.0 +
    (+v.orb + +v.ast) * 1.5
  );
}

export const getKblAvgStat = (row) => {
  return String(Math.round((getKblEff(row) * 10) / row.play) / 10);
};
