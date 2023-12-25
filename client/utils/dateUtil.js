import dayjs from "dayjs";
import ko from "dayjs/locale/ko";

dayjs.locale(ko);

export function formatGameDate(playDate, gameNo) {
  const parsedDate = dayjs(playDate, { strict: false });
  if (gameNo) return parsedDate.format(`YYYY. M. D.(ddd) ${gameNo}게임`);
  return parsedDate.format(`YYYY. M. D.(ddd)`);
}

export function formatSimpletGameDate(playDate) {
  const parsedDate = dayjs(playDate, { strict: false });
  return parsedDate.format(`YY.M.D`);
}
