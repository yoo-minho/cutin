export function getTeams(id) {
  const dummy = {
    data: [
      {
        id: "gba",
        name: "GBA",
        place: "영등포제2스포츠센터(영등포구)",
        cycle: "매주 토요일 10시~12시",
        method: "[5vs5] 8대8 2파전, 10분 4쿼터 2경기",
      },
      {
        id: "noname",
        name: "이름없는농구팀",
        place: "랜덤",
        cycle: "매월1회 2시간",
        method: "[3vs3]|[5vs5]",
      },
      {
        id: "xxx",
        name: "함께 하고 싶은 농구 동호회 모집",
        place: "어디서 하는지",
        cycle: "언제 하는지",
        method: "경기방식은 어떻게 되는지",
      },
    ],
  };
  if (id) {
    return { data: dummy.data.find((v) => v.id === id) };
  }
  return dummy;
}
