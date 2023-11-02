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
  { key: "U" },
  { key: "I" },
  { key: "O", name: "오펜스리바", main: { reb: 1, orb: 1 } },
  { key: "P" },
];

export const skillInfo = (skill: string): any =>
  [...defaultSkill, pts].find((k) => k.name === skill);

export const skillExpression = (
  skill: string,
  mainPlayer: string,
  subPlayer: string
) => {
  const expression = [];
  switch (skill) {
    case "득점&어시":
      expression.push(`${mainPlayer}의 득점!`);
      if (subPlayer) {
        expression.push(`${subPlayer}의 어시!`);
      }
      break;
    case "풋백":
      expression.push(`${mainPlayer}의 풋백득점!`);
      break;
    case "자유투":
      expression.push(`${mainPlayer}의 자유투!`);
      break;
    case "3점슛":
      expression.push(`${mainPlayer}의 Three Pointer!`);
      break;
    case "속공":
      expression.push(`${mainPlayer}의 속공 득점!`);
      break;
    case "앤드원":
      expression.push(`${mainPlayer}의 앤드원!!!`);
      break;
    case "스핀무브":
      expression.push(`${mainPlayer}의 스핀무브!!!`);
      break;
    case "리바운드":
      expression.push(`${mainPlayer}의 리바운드!`);
      break;
    case "오펜스리바":
      expression.push(`${mainPlayer}의 오펜스리바!`);
      break;
    case "스틸":
      expression.push(`${mainPlayer}의 스틸!`);
      break;
    case "블락":
      expression.push(`${mainPlayer}의 블락!`);
      break;
    case "킬패스":
      expression.push(`${subPlayer}의 킬패스로`);
      expression.push(`${mainPlayer}의 득점!`);
      break;
    default:
      expression.push(`${mainPlayer}의 ${skill}!`);
      break;
  }
  return expression.join(" ");
};
