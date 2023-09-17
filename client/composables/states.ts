import { Notify } from "quasar";
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
  return useState<PlayerType[]>(`${name}PlayerStore`, () => []);
};
export const useSkillStore = () => {
  return useState<SkillType[]>(`SkillStore`, () => defaultSkill);
};
export const useCutStore = (name?: string) => {
  const currVideoName = useCurrVideoName();
  return useState<CutType[]>(
    `${name || currVideoName.value}CutStore`,
    () => []
  );
};

export const addCut = (cutTime: string) => {
  const currGame = useCurrGame();
  const cutStore = useCutStore();
  const newStore = cutStore.value.filter((c) => c.time !== cutTime);
  const isCancelCut = newStore.length < cutStore.value.length;
  if (isCancelCut) {
    cutStore.value = newStore;
    Notify.create(`같은 컷에서 [C]를 누르면 삭제됩니다`);
    return;
  }

  cutStore.value = [...newStore, { game: currGame.value, time: cutTime }].sort(
    (a, b) => time2sec(a.time) - time2sec(b.time)
  );

  console.log("addCut", cutTime, currGame.value, cutStore.value);
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
};
