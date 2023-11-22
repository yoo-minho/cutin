import dayjs from "dayjs";
import ko from "dayjs/locale/ko";

dayjs.locale(ko);

export function formatGameDate(playDate, gameNo) {
  const parsedDate = dayjs(playDate, { strict: false });
  return parsedDate.format(`YYYY. M. D.(ddd) ${gameNo}게임`);
}
