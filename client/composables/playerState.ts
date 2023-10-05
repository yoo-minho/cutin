type TeamType = {
  name: string;
  players: PlayerType[];
};

export type PlayerType = {
  name: string;
  position?: string;
  weight?: string;
  height?: string;
};

//code = 동호회이름과 날짜 조합
export const useTeamStore = () => {
  const videoProps = useVideoPropsStore();
  const code = videoProps.value.videoCode;
  console.log("useTeamStore", { code }, loadTeamStore(code));
  return useState<TeamType[]>(`${code}TeamStore`, () => loadTeamStore(code));
};

export function loadTeamStore(code: string) {
  try {
    return JSON.parse(localStorage.getItem(`team_${code}`) || "[]");
  } catch (e) {
    return [];
  }
}

export function addTeam(teamName: string) {
  const teamStore = useTeamStore();
  const isDuplicated =
    teamStore.value.findIndex((v) => v.name === teamName) > -1;
  if (isDuplicated) {
    return { error: true, message: "중복된 팀 이름은 불가능합니다." };
  }
  teamStore.value?.push({ name: teamName, players: [] });
  saveTeamStore(teamStore.value);
  return { error: false };
}

export function removeTeam(teamName: string) {
  const teamStore = useTeamStore();
  teamStore.value = teamStore.value.filter((v) => v.name !== teamName);
  saveTeamStore(teamStore.value);
}

export function addPlayerOnTeam(teamName: string, playerName: string) {
  const teamStore = useTeamStore();
  teamStore.value = teamStore.value.map((v, i) => {
    if (v.name == teamName) {
      v.players?.push({ name: playerName });
    }
    return v;
  });
  saveTeamStore(teamStore.value);
}

export function removePlayerOnTeam(teamName: string, playerName: string) {
  const teamStore = useTeamStore();
  teamStore.value = teamStore.value.map((v, i) => {
    if (v.name == teamName) {
      v.players = v.players?.filter((player) => player.name !== playerName);
    }
    return v;
  });

  saveTeamStore(teamStore.value);
}

function saveTeamStore(teamStoreVal: TeamType[]) {
  const videoProps = useVideoPropsStore();
  const code = videoProps.value.videoCode;
  localStorage.setItem(`team_${code}`, JSON.stringify(teamStoreVal));
}
