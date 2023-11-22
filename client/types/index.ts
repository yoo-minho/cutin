export type CutType = {
  gameNo: number;
  quaterNo: number;
  seekTime: string;
  mainPlayer?: string;
  subPlayer?: string;
  skill?: string;
  videoName?: string;
  team?: string;
  vsScore?: any;
  playerStat?: any;
};

export type VsType = {
  playDate: string;
  gameNo: number;
  gameCode?: string;
  dateInfo?: string;
  match: [VsInfoType, VsInfoType];
};

export type VsInfoType = {
  teamName: string;
  score: number;
};

export type TeamInfoType = {
  id: string,
  name: string,
  place: string,
  cycle: string,
  method: string,
  memberCount: string,
},