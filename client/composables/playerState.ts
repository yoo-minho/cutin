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

export const useTeamStore = async (videoName: string) => {
  const state = useState<TeamType[]>(`${videoName}TeamStore`, () => []);
  if (state.value.length === 0) {
    const [clubCode, playDate] = videoName.split("_");
    const players = await findPlayer({ clubCode, playDate });
    state.value = createTeams(players);
  }
  return state;
};

export async function findPlayer(props: {
  clubCode: string;
  playDate: string;
}) {
  const { clubCode, playDate } = props;
  const { data } = await useFetch<GamePlayerType[]>("/api/gamePlayer", {
    params: { clubCode, playDate },
  });
  return data.value || [];
}

export async function addTeam(videoName: string, teamName: string) {
  const teamStore = await useTeamStore(videoName);
  const isDuplicated =
    teamStore.value.findIndex((v) => v.name === teamName) > -1;
  if (isDuplicated) {
    return { error: true, message: "중복된 팀 이름은 불가능합니다." };
  }
  if (teamStore.value.length === 0) {
    await addPlayerOnTeam(videoName, teamName, "");
  }
  teamStore.value.push({ name: teamName, players: [] });
  return { error: false };
}

export async function removeTeam(videoName: string, teamName: string) {
  const teamStore = await useTeamStore(videoName);
  teamStore.value = teamStore.value.filter((v) => v.name !== teamName);
}

export async function addPlayerOnTeam(
  videoName: string,
  teamName: string,
  playerName: string
) {
  const videoProps = useVideoPropsStore();
  const videoCode = videoProps.value.videoCode;
  const teamStore = await useTeamStore(videoName);
  teamStore.value = teamStore.value.map((v) => {
    if (v.name == teamName) {
      v.players?.push({ name: playerName });
    }
    return v;
  });
  await useFetch("/api/gamePlayer", {
    method: "post",
    body: {
      videoCode,
      playerArr: [{ teamName: teamName, player: playerName }],
    },
  });
}

export async function removePlayerOnTeam(
  videoName: string,
  teamName: string,
  playerName: string
) {
  const videoProps = useVideoPropsStore();
  const videoCode = videoProps.value.videoCode;
  const teamStore = await useTeamStore(videoName);
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
