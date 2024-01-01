import type { CutType, PlayerStatType } from "@/types";

const segmentSet = {
  //8초 => 6초
  deep: [
    { sec: 3, speed: 1.5, zoom: 1 }, //0.5초
    { sec: 3, speed: 0.8, zoom: 1 }, //3.5초
    { sec: 2, speed: 1.5, zoom: 1 }, //1초
  ],
  //8초 => 5초
  wide: [
    { sec: 3, speed: 1.5, zoom: 1 },
    { sec: 2, speed: 0.8, zoom: 1 },
    { sec: 3, speed: 1.5, zoom: 1 },
  ],
  //5초 => 3초
  short: [
    { sec: 2, speed: 1.5, zoom: 1 }, //1
    { sec: 1.5, speed: 1, zoom: 1 },
    { sec: 1.5, speed: 1.5, zoom: 1 },
  ],
};

export const wrapDefSkill = (skill?: string) => skill || "득점&어시";

export const getSegment = (_skill?: string, subPlayer?: string) => {
  _skill = wrapDefSkill(_skill);
  if (!!subPlayer) return segmentSet.deep;
  if (
    [
      "오펜스리바",
      "리바운드",
      "스틸",
      "자유투",
      "속공",
      "블락",
      "블락&리바",
    ].includes(_skill)
  )
    return segmentSet.short;
  if (
    ["득점&어시", "풋백", "풋백앤드원", "앤드원", "득점&OREB"].includes(_skill)
  )
    return segmentSet.deep;
  if (["3점슛", "3점슛&OREB"].includes(_skill)) return segmentSet.wide;
  return segmentSet.wide;
};

function calculateConvertTotalTime(seg: { sec: number; speed: number }[]) {
  let totalTime = 0;
  for (const item of seg) {
    const duration = item.sec / item.speed;
    totalTime += duration;
  }
  return totalTime;
}

export const findShortsSeekSec = (_skill?: string, subPlayer?: string) => {
  const seg = getSegment(_skill, subPlayer);
  return calculateConvertTotalTime(seg) - 2;
};

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

export const getPlayerOption = (selectedPlayerStat?: PlayerStatType) => {
  return [
    { label: "전체", value: "" },
    ...[
      ,
      { label: "득점", value: "pts" },
      { label: "리바", value: "reb" },
      { label: "어시", value: "ast" },
      { label: "3점", value: "tpm" },
      { label: "공리", value: "orb" },
      { label: "스틸", value: "stl" },
      { label: "블락", value: "blk" },
    ].filter((o) => o && selectedPlayerStat && selectedPlayerStat[o.value] > 0),
  ];
};

export const getTitleWithStat = (selectedPlayerStat: PlayerStatType) => {
  const getContents = (statName: string) => {
    if (statName === "pts") return "득점";
    if (statName === "ast") return "어시";
    if (statName === "reb") return "리바";
    if (statName === "stl") return "스틸";
    if (statName === "blk") return "블락";
    return "";
  };
  const x = Object.keys(selectedPlayerStat)
    .filter((k) => ["ast", "reb", "blk", "stl"].includes(k))
    .map((k) => ({ name: k, val: selectedPlayerStat[k] }))
    .filter((v) => v.val > 2)
    .sort((a, b) => b.val - a.val);
  const subStat = x.map((v) => v.val + getContents(v.name)).join(" ");
  if (selectedPlayerStat.pts > 0) {
    return selectedPlayerStat.pts + "득점 " + subStat;
  } else {
    return subStat;
  }
};

export const defaultSkill = [
  { key: "1", name: "풋백", main: { pts: 2, reb: 1, orb: 1 } },
  { key: "2", name: "자유투", main: { pts: 2 }, sub: { ast: 1 } },
  { key: "3", name: "3점슛", main: { pts: 3, tpm: 1 }, sub: { ast: 1 } },
  { key: "4", name: "속공", main: { pts: 2 }, sub: { ast: 1 } },
  { key: "5", name: "앤드원", main: { pts: 3 }, sub: { ast: 1 } },
  { key: "6", name: "풋백앤드원", main: { pts: 3, reb: 1, orb: 1 } },
  { key: "7" },
  { key: "8" },
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
  skill = wrapDefSkill(skill);
  const stat = [...defaultSkill, pts].find((v) => v.name === skill);
  if (areYouMainPlayer) {
    return Object.keys(stat?.main || {}).find((k) => k === record);
  } else {
    return Object.keys(stat?.sub || {}).find((k) => k === record);
  }
};

export const isSkillOk = (skill: string, record: string) => {
  skill = wrapDefSkill(skill);
  const stat = [...defaultSkill, pts].find((v) => v.name === skill);
  const isSubOk = Object.keys(stat?.sub || {}).find((k) => k === record);
  return Object.keys(stat?.main || {}).find((k) => k === record) || isSubOk;
};

export const getSkillPoints = (skill?: string): any => {
  skill = wrapDefSkill(skill);
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
    case "풋백앤드원":
      mainExpression = `${mainPlayer}의 풋백 앤드원!!!`;
      if (subPlayer) {
        subExpression = `${subPlayer}의 어시!`;
      }
      break;
    case "자유투":
      mainExpression = `${mainPlayer}의 자유투!!!`;
      if (subPlayer) {
        subExpression = `${subPlayer}의 어시!`;
      }
      break;
    case "3점슛&OREB":
      subExpression = `${subPlayer}의 오펜스리바!!`;
      mainExpression = `${mainPlayer}의 쓰리포인트!`;
      break;
    case "득점&OREB":
      subExpression = `${subPlayer}의 오펜스리바!!`;
      mainExpression = `${mainPlayer}의 득점!`;
      break;
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

//일반 cuts 데이터에서 순간 스탯들을 더한다.
export const convertCutsWithMomentStat = (allGameCuts: CutType[]) => {
  const uniqueTeam = (cuts: CutType[]) =>
    Array.from(new Set(cuts.map((v) => v.team)));

  const vsScore = {} as { [key: string]: number };
  uniqueTeam(allGameCuts).forEach((name) => {
    if (!name || vsScore[name]) return;
    vsScore[name] = 0;
  });

  console.log("convertCutsWithMomentStat");

  return allGameCuts.map((cut: any) => {
    const preCut = {
      ...cut,
      vsScore: { ...vsScore },
    };
    const { team = "team", skill = "" } = cut;
    const { main } = getSkillPoints(skill);
    const pts = main.pts || 0;
    if (pts > 0) {
      vsScore[team] += pts;
      preCut.score = true;
    } else {
      preCut.score = false;
    }
    return preCut;
  });
};
