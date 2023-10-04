import { defaultSkill } from "./constants";

type SkillType = {
  name: string;
  score: number;
  rebound?: number;
};

export const useCurrGame = () => {
  return useState<string>("useCurrGame", () => "1g1q"); //1게임 1쿼터
};
export const useSkillStore = () => {
  return useState<SkillType[]>(`SkillStore`, () => defaultSkill);
};
