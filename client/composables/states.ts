import { Notify, Dialog } from "quasar";
import { defaultSkill } from "./constants";

type CutType = {
  game: string;
  time: string;
  scorer?: string;
  assister?: string;
  skill?: string;
};

type PlayerType = {
  name: string;
  position?: string;
  weight?: string;
  height?: string;
};

type SkillType = {
  name: string;
  score: number;
  rebound?: number;
};

export const useCurrVideoName = () => {
  return useState<string>("useCurrVideoName", () => "");
};
export const useCurrGame = () => {
  return useState<string>("useCurrGame", () => "1g1q"); //1게임 1쿼터
};
export const usePlayerStore = (name: string) => {
  const defStore = loadPlayerStore(name);
  return useState<PlayerType[]>(`${name}PlayerStore`, () => defStore);
};
export const useSkillStore = () => {
  return useState<SkillType[]>(`SkillStore`, () => defaultSkill);
};
export const useCutStore = (name: string = "") => {
  const currVideoName = useCurrVideoName();
  name = name || currVideoName.value;
  return useState<CutType[]>(`${name}CutStore`, () => loadCutStore());
};

export const addCut = (cutTime: string) => {
  const currVideoName = useCurrVideoName();
  const currGame = useCurrGame();
  const cutStore = useCutStore(currVideoName.value);
  const newStore = [...cutStore.value].filter((c) => c.time !== cutTime);
  const isCancelCut = newStore.length < cutStore.value.length;
  if (isCancelCut) {
    Dialog.create({
      title: "컷 삭제",
      ok: "삭제",
      cancel: "취소",
    }).onOk(() => {
      cutStore.value = newStore;
      saveCutStore();
    });
    return;
  }

  cutStore.value = [...newStore, { game: currGame.value, time: cutTime }].sort(
    (a, b) => time2sec(a.time) - time2sec(b.time)
  );
  saveCutStore();
};

export const updateCut = (
  type: "scorer" | "assister" | "skill",
  cutTime: string,
  value: string
) => {
  const cutStore = useCutStore();
  const cut = cutStore.value.find((c) => c.time === cutTime);
  if (!cut) {
    Notify.create(`기록된 시간을 선택해주세요`);
    return;
  }
  if ("assister" === type) {
    if (!cut.scorer) {
      Notify.create(`득점 선수를 먼저 입력해주세요`);
      return;
    }
    if (cut.scorer === value) {
      Notify.create(`득점 선수와 다른 어시스트 선수를 입력해주세요`);
      return;
    }
  }

  const data = { [type]: value };
  cutStore.value = cutStore.value.map((c) =>
    c.time === cutTime ? { ...c, ...data } : c
  );
  saveCutStore();
};

function saveCutStore() {
  const currVideoName = useCurrVideoName();
  const cutStore = useCutStore(currVideoName.value);
  localStorage.setItem(
    `cut_${currVideoName.value}`,
    JSON.stringify(cutStore.value)
  );
}

function loadCutStore() {
  const currVideoName = useCurrVideoName();
  try {
    return JSON.parse(
      localStorage.getItem(`cut_${currVideoName.value}`) || "[]"
    );
  } catch (e) {
    return [];
  }
}

export function addPlayer(teamName: string, playerName: string) {
  const playerStore = usePlayerStore(teamName);
  playerStore.value.push({ name: playerName });
  savePlayerStore(teamName);
}

export function removePlayer(teamName: string, playerName: string) {
  const playerStore = usePlayerStore(teamName);
  playerStore.value = playerStore.value.filter(
    (player) => player.name !== playerName
  );
  savePlayerStore(teamName);
}

function savePlayerStore(teamName: string) {
  const currVideoName = useCurrVideoName();
  const [team, date] = currVideoName.value.split("_");
  const playerStore = usePlayerStore(teamName);
  localStorage.setItem(
    `player_${teamName}_${team + date}`,
    JSON.stringify(playerStore.value)
  );
}

function loadPlayerStore(teamName: string) {
  const currVideoName = useCurrVideoName();
  const [team, date] = currVideoName.value.split("_");
  console.log("loadPlayerStore", `player_${teamName}_${team + date}`);
  try {
    return JSON.parse(
      localStorage.getItem(`player_${teamName}_${team + date}`) || "[]"
    );
  } catch (e) {
    return [];
  }
}
