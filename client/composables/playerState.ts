type TeamType = {
  name: string;
  players: PlayerType[];
};

type PlayerType = {
  name: string;
  position?: string;
  weight?: string;
  height?: string;
};

//code = 동호회이름과 날짜 조합
export const useTeamStore = (code: string) => {
  return useState<TeamType[]>(`${code}TeamStore`, () => []);
};

export function loadTeamStore(code: string) {
  try {
    return JSON.parse(localStorage.getItem(`team_${code}`) || "[]");
  } catch (e) {
    return [];
  }
}

export function addTeam(code: string, teamName: string) {
  const teamStore = useTeamStore(code);
  const isDuplicated =
    teamStore.value.findIndex((v) => v.name === teamName) > -1;
  if (isDuplicated) {
    return { error: true, message: "중복된 팀 이름은 불가능합니다." };
  }
  teamStore.value?.push({ name: teamName, players: [] });
  saveTeamStore(code, teamStore.value);
  return { error: false };
}

export function removeTeam(code: string, teamName: string) {
  const teamStore = useTeamStore(code);
  teamStore.value = teamStore.value.filter((v) => v.name !== teamName);
  saveTeamStore(code, teamStore.value);
}

export function addPlayerOnTeam(
  code: string,
  teamName: string,
  playerName: string
) {
  const teamStore = useTeamStore(code);
  teamStore.value = teamStore.value.map((v, i) => {
    if (v.name == teamName) {
      v.players?.push({ name: playerName });
    }
    return v;
  });
  saveTeamStore(code, teamStore.value);
}

export function removePlayerOnTeam(
  code: string,
  teamName: string,
  playerName: string
) {
  const teamStore = useTeamStore(code);
  teamStore.value = teamStore.value.map((v, i) => {
    if (v.name == teamName) {
      v.players = v.players?.filter((player) => player.name !== playerName);
    }
    return v;
  });

  saveTeamStore(code, teamStore.value);
}

function saveTeamStore(code: string, teamStoreVal: TeamType[]) {
  localStorage.setItem(`team_${code}`, JSON.stringify(teamStoreVal));
}
