export const serviceName = "cutin.cc 🏀";
export const keySet = {
  first: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  second: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
};
export const pts = {
  name: "득점&어시",
  main: { pts: 2 },
  sub: { ast: 1 },
};

export const defaultSkill = [
  { key: "1", name: "풋백", main: { pts: 2, reb: 1, orb: 1 } },
  { key: "2", name: "자유투", main: { pts: 2 } },
  { key: "3", name: "3점슛", main: { pts: 3, tpm: 1 }, sub: { ast: 1 } },
  { key: "4", name: "속공", main: { pts: 2 }, sub: { ast: 1 } },
  { key: "5", name: "앤드원", main: { pts: 3 }, sub: { ast: 1 } },
  { key: "6", name: "스핀무브", main: { pts: 2 }, sub: { ast: 1 } },
  { key: "7", name: "킬패스득점", main: { pts: 2 }, sub: { ast: 1 } },
  { key: "8", name: "픽앤롤", main: { pts: 2 }, sub: { ast: 1 } },
  { key: "9" },
  { key: "0" },
  { key: "Q" },
  { key: "W" },
  { key: "E" },
  { key: "R", name: "리바운드", main: { reb: 1 } },
  { key: "T", name: "스틸", main: { stl: 1 } },
  { key: "Y", name: "블락", main: { blk: 1 } },
  { key: "U", name: "블락&리바", main: { reb: 1, blk: 1 } },
  {
    key: "I",
    name: "3점슛&OREB",
    main: { pts: 2 },
    sub: { ast: 1, reb: 1, orb: 1 },
  },
  { key: "O", name: "오펜스리바", main: { reb: 1, orb: 1 } },
  {
    key: "P",
    name: "득점&OREB",
    main: { pts: 2 },
    sub: { ast: 1, reb: 1, orb: 1 },
  },
];

export const getRecordName = (recordType: string) =>
  ({
    pts: "득점",
    reb: "리바운드",
    orb: "공격리바운드",
    ast: "어시스트",
    stl: "스틸",
    blk: "블락",
    tpm: "3점",
  }[recordType] || "");

export const isMyHighlight = (
  areYouMainPlayer: boolean,
  skill: string,
  record: string
) => {
  skill = skill || "득점&어시";
  const stat = [...defaultSkill, pts].find((v) => v.name === skill);
  if (areYouMainPlayer) {
    return Object.keys(stat?.main || {}).find((k) => k === record);
  } else {
    return Object.keys(stat?.sub || {}).find((k) => k === record);
  }
};

export const isSkillOk = (skill: string, record: string) => {
  skill = skill || "득점&어시";
  const stat = [...defaultSkill, pts].find((v) => v.name === skill);
  const isSubOk = Object.keys(stat?.sub || {}).find((k) => k === record);
  return Object.keys(stat?.main || {}).find((k) => k === record) || isSubOk;
};

export const getSkillPoints = (skill: string): any => {
  return [...defaultSkill, pts].find((k) => k.name === skill);
};

export const skillExpression = (
  skill: string,
  mainPlayer: string,
  subPlayer: string
) => {
  let mainExpression = "";
  let subExpression = "";
  switch (skill) {
    case "득점&어시":
      mainExpression = `${mainPlayer}의 득점!`;
      if (subPlayer) {
        subExpression = `${subPlayer}의 어시!`;
      }
      break;
    case "풋백":
      mainExpression = `${mainPlayer}의 풋백 득점!`;
      break;
    case "3점슛":
      mainExpression = `${mainPlayer}의 쓰리포인트!`;
      if (subPlayer) {
        subExpression = `${subPlayer}의 어시!`;
      }
      break;
    case "속공":
      mainExpression = `${mainPlayer}의 속공 득점!`;
      if (subPlayer) {
        subExpression = `${subPlayer}의 어시!`;
      }
      break;
    case "앤드원":
      mainExpression = `${mainPlayer}의 앤드원!!!`;
      if (subPlayer) {
        subExpression = `${subPlayer}의 어시!`;
      }
      break;
    case "스핀무브":
      mainExpression = `${mainPlayer}의 스핀무브!!!`;
      if (subPlayer) {
        subExpression = `${subPlayer}의 어시!`;
      }
      break;
    case "킬패스":
      subExpression = `${subPlayer}의 킬패스로`;
      mainExpression = `${mainPlayer} 득점!`;
      break;
    case "3점슛&OREB":
      subExpression = `${subPlayer}의 오펜스리바!!`;
      mainExpression = `${mainPlayer}의 쓰리포인트!`;
      break;
    case "득점&OREB":
      subExpression = `${subPlayer}의 오펜스리바!!`;
      mainExpression = `${mainPlayer}의 득점!`;
      break;
    case "자유투":
    case "스틸":
    case "리바운드":
    case "오펜스리바":
    case "블락":
    default:
      mainExpression = `${mainPlayer}의 ${skill}!`;
      break;
  }
  return [mainExpression, subExpression];
};
