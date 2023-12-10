import { Notify, Dialog } from "quasar";
import type { CutType } from "@/types";

export const useCutStore = async (videoName: string) => {
  const state = useState<CutType[]>(`${videoName}CutStore`, () => []);
  if (state.value.length === 0) {
    state.value = await fetchHighlightsByVideoName(videoName);
  }
  return state;
};

export const addCut = async () => {
  const videoPropsStore = useVideoPropsStore();
  const { currentTime, videoName } = videoPropsStore.value;

  const currGame = useCurrGame();
  const cutStore = await useCutStore(videoName);
  const newStore = [...cutStore.value].filter(
    (c) => c.seekTime !== currentTime
  );
  const isCancelCut = newStore.length < cutStore.value.length;
  if (isCancelCut) {
    Dialog.create({
      title: "컷 삭제",
      ok: "삭제",
      cancel: "취소",
    }).onOk(() => {
      cutStore.value = newStore;
      useFetch("/api/highlights", {
        method: "delete",
        body: { videoName, seekTime: currentTime },
      });
    });
    return;
  }

  const [gameNo, quaterNo] = currGame.value.split(/g|q/g, 2);

  const createData = {
    gameNo: +gameNo,
    quaterNo: +quaterNo,
    seekTime: currentTime,
  } as any;

  cutStore.value = [...newStore, createData].sort(
    (a, b) => time2sec(a.seekTime) - time2sec(b.seekTime)
  );

  await useFetch("/api/highlights", {
    method: "post",
    body: { videoName, seekArr: [createData] },
  });

  return currentTime;
};

export const addCuts = async (props: {
  videoName: string;
  cuts: CutType[];
}) => {
  const { videoName, cuts } = props;
  await useFetch("/api/highlights", {
    method: "post",
    body: { videoName, seekArr: cuts },
  });
};

export const updateCutWithoutFetch = async (
  type: "mainPlayer" | "subPlayer" | "skill" | "videoUrl" | "seekTime",
  value: string,
  targetTime?: string
) => {
  const videoPropsStore = useVideoPropsStore();
  const videoName = videoPropsStore.value.videoName;
  const cutStore = await useCutStore(videoName);
  const cut = cutStore.value.find((c) => c.seekTime === targetTime);
  const updateData = { ...cut, [type]: value } as CutType;
  cutStore.value = cutStore.value.map((c) =>
    c.seekTime === targetTime ? updateData : c
  );
};

export const updateCut = async (
  type: "mainPlayer" | "subPlayer" | "skill" | "videoUrl" | "seekTime",
  value: string,
  targetTime?: string
) => {
  const videoPropsStore = useVideoPropsStore();
  const videoName = videoPropsStore.value.videoName;
  const cutTime = targetTime || videoPropsStore.value.currentTime;

  const cutStore = await useCutStore(videoName);
  const cut = cutStore.value.find((c) => c.seekTime === cutTime);

  if (!cut) {
    Notify.create(`기록된 시간을 선택해주세요`);
    return;
  }

  if ("mainPlayer" === type) {
    if (cut.subPlayer === value) {
      Notify.create(`서브 선수와 다른 메인 선수를 입력해주세요`);
      return;
    }
  }

  if ("subPlayer" === type) {
    if (!cut.mainPlayer) {
      Notify.create(`메인 선수를 먼저 입력해주세요`);
      return;
    }
    if (cut.mainPlayer === value) {
      Notify.create(`메인 선수와 다른 서브 선수를 입력해주세요`);
      return;
    }
  }

  const updateData = { ...cut, [type]: value } as CutType;
  cutStore.value = cutStore.value.map((c) =>
    c.seekTime === cutTime ? updateData : c
  );

  await useFetch("/api/highlights/sync", {
    method: "post",
    body: { videoName, seekTime: cutTime, seekArr: [updateData] },
  });
};

export const moveNextCut = async (n: 1 | 0 | -1) => {
  const videoPropsStore = useVideoPropsStore();
  const { videoName, currentTime: cutTime } = videoPropsStore.value;
  const cutStore = await useCutStore(videoName);
  let targetIdx = -1;
  cutStore.value.forEach((cut, idx) => {
    if (targetIdx < 0 && cut.seekTime >= cutTime) targetIdx = idx;
  });
  if (!cutStore.value.find((cut) => cut.seekTime === cutTime)) n = 0;
  return (
    cutStore.value.find((_, i) => i === targetIdx + n) || {
      seekTime: "0:00:00",
    }
  );
};

export async function fetchHighlightsByVideoName(videoName: string) {
  const { data } = await useFetch<CutType[]>("/api/highlights", {
    params: { videoName },
  });
  return data.value || [];
}

export async function fetchAllGameCut(props: {
  clubCode: string;
  playDate: string;
  gameNo: string;
}) {
  const { clubCode, playDate, gameNo } = props;
  const { data } = await useFetch<CutType[]>("/api/highlights/game", {
    params: { clubCode, playDate, gameNo },
  });
  return convertCutsWithMomentStat(data.value || []);
}

export const getCutsWithStat2 = async (playerArr: any[], props: any) => {
  const vsScore = {} as { [key: string]: number };

  let playerArrWithStat = playerArr
    .filter((v) => !!v.player)
    .map((v) => {
      const { player, teamName } = v;
      vsScore[teamName] = 0;
      return {
        name: player,
        team: teamName,
        ...{ pts: 0, tpm: 0, ast: 0 },
        ...{ reb: 0, orb: 0, blk: 0, stl: 0 },
      };
    });

  const setPlayerStat = (playerName: string, skillPoints: any) => {
    playerArrWithStat = playerArrWithStat.map((v) => {
      if (playerName !== v.name) return v;
      const { pts, tpm, reb, orb, blk, stl, ast } = v;
      const {
        pts: _pts = 0,
        tpm: _tpm = 0,
        ast: _ast = 0,
        reb: _reb = 0,
        orb: _orb = 0,
        blk: _blk = 0,
        stl: _stl = 0,
      } = skillPoints;
      return {
        ...v,
        ...{ pts: pts + _pts, tpm: tpm + _tpm, ast: ast + _ast },
        ...{ reb: reb + _reb, orb: orb + _orb },
        ...{ blk: blk + _blk, stl: stl + _stl },
      };
    });
  };

  const { clubCode, playDate, gameNo } = props;
  const cuts = await fetchAllGameCut({ clubCode, playDate, gameNo });
  cuts.forEach((cut) => {
    const { team = "team", skill = "", mainPlayer = "", subPlayer = "" } = cut;
    const { main, sub } = getSkillPoints(skill);
    vsScore[team] += main.pts || 0;
    setPlayerStat(mainPlayer, main);
    setPlayerStat(subPlayer, sub);
  });

  //https://namu.wiki/w/%EB%86%8D%EA%B5%AC/%EA%B8%B0%EB%A1%9D%20%EA%B3%84%EC%82%B0%EB%B2%95#s-5.5.3
  const getPlayerStatByTeam = (teamName: string) => {
    const result = playerArrWithStat
      .map((v) => ({ ...v, kbl: kblEff(v) }))
      .filter((v) => v.team === teamName)
      .sort((a, b) => b.kbl - a.kbl);
    const sum = (v: string) =>
      result.reduce((curr, acc: any) => curr + acc[v], 0);

    return [
      ...result,
      {
        name: "전체",
        pts: sum("pts"),
        tpm: sum("tpm"),
        ast: sum("ast"),
        reb: sum("reb"),
        orb: sum("orb"),
        blk: sum("blk"),
        stl: sum("stl"),
      },
    ];
  };

  const [teamName1, teamName2] = Object.keys(vsScore);

  return [
    {
      teamName: teamName1,
      totalPts: vsScore[teamName1],
      playerStat: getPlayerStatByTeam(teamName1),
    },
    {
      teamName: teamName2,
      totalPts: vsScore[teamName2],
      playerStat: getPlayerStatByTeam(teamName2),
    },
  ].sort((a, b) => a.teamName.localeCompare(b.teamName));
};

function kblEff(v: any) {
  return (
    (v.pts + v.stl + v.blk + (v.reb - v.orb)) * 1.0 + (v.orb + v.ast) * 1.5
  );
}
