type TeamType = {
  name: string;
  players: PlayerType[];
};

type GamePlayerType = {
  clubCode: string;
  playDate: string;
  teamName: string;
  player: string;
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
  const videoCode = videoProps.value.videoCode;
  const x = useState<TeamType[]>(`${videoCode}TeamStore`, () => []);
  if (x.value.length === 0) {
    loadTeamStore(videoCode).then((data) => {
      x.value = createTeams(data);
    });
  }
  return x;
};

async function loadTeamStore(videoCode: string) {
  const { data } = await useFetch<GamePlayerType[]>("/api/gamePlayer", {
    params: { videoCode },
  });
  return data.value || [];
}

export function addTeam(teamName: string) {
  const teamStore = useTeamStore();
  const isDuplicated =
    teamStore.value.findIndex((v) => v.name === teamName) > -1;
  if (isDuplicated) {
    return { error: true, message: "중복된 팀 이름은 불가능합니다." };
  }
  teamStore.value?.push({ name: teamName, players: [] });
  return { error: false };
}

export function removeTeam(teamName: string) {
  const teamStore = useTeamStore();
  teamStore.value = teamStore.value.filter((v) => v.name !== teamName);
}

export function addPlayerOnTeam(teamName: string, playerName: string) {
  const videoProps = useVideoPropsStore();
  const videoCode = videoProps.value.videoCode;
  const teamStore = useTeamStore();
  teamStore.value = teamStore.value.map((v) => {
    if (v.name == teamName) {
      v.players?.push({ name: playerName });
    }
    return v;
  });
  useFetch("/api/gamePlayer", {
    method: "post",
    body: {
      videoCode,
      playerArr: [{ teamName: teamName, player: playerName }],
    },
  });
}

export function removePlayerOnTeam(teamName: string, playerName: string) {
  const videoProps = useVideoPropsStore();
  const videoCode = videoProps.value.videoCode;
  const teamStore = useTeamStore();
  teamStore.value = teamStore.value.map((v) => {
    if (v.name == teamName) {
      v.players = v.players?.filter((player) => player.name !== playerName);
    }
    return v;
  });
  useFetch("/api/gamePlayer", {
    method: "delete",
    body: { videoCode, player: playerName },
  });
}

function createTeams(gamePlayers: GamePlayerType[]): TeamType[] {
  const teamsMap = new Map<string, TeamType>();
  for (const playerInfo of gamePlayers) {
    const { teamName, player } = playerInfo;
    if (!teamsMap.has(teamName)) {
      teamsMap.set(teamName, { name: teamName, players: [] });
    }
    teamsMap.get(teamName)?.players.push({ name: player });
  }
  return Array.from(teamsMap.values());
}
