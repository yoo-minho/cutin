export const keySet = {
  first: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  second: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
};
export const pts = {
  name: "득점&어시",
  main: { score: 2 },
  sub: { assist: 1 },
};

export const defaultSkill = [
  { key: "1", name: "풋백", main: { score: 2, rebound: 1 } },
  { key: "2", name: "자유투", main: { score: 2 } },
  { key: "3", name: "3점슛", main: { score: 3 }, sub: { assist: 1 } },
  { key: "4", name: "속공", main: { score: 2 }, sub: { assist: 1 } },
  { key: "5", name: "앤드원", main: { score: 3 }, sub: { assist: 1 } },
  { key: "6", name: "스핀무브", main: { score: 2 }, sub: { assist: 1 } },
  { key: "7" },
  { key: "8" },
  { key: "9" },
  { key: "0" },
  { key: "Q" },
  { key: "W" },
  { key: "E" },
  { key: "R", name: "리바운드", main: { rebound: 1 } },
  { key: "T", name: "스틸", main: { steal: 1 } },
  { key: "Y", name: "블락", main: { block: 1 } },
  { key: "U" },
  { key: "I" },
  { key: "O", name: "오펜스리바", main: { rebound: 1 } },
  { key: "P" },
];
