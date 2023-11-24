export async function getTeams(id) {
  const dummy = {
    data: [
      {
        id: "gba",
        name: "GBA",
        place: "영등포제2스포츠센터(영등포구)",
        cycle: "매주 토요일 10시~12시",
        method: "8대8 2파전, 10분 4쿼터 2경기",
        memberCount: "32명",
      },
      {
        id: "xxx",
        name: "또 다른 팀을 모집합니다!",
        place: "어디서 하나요?",
        cycle: "언제 하나요?",
        method: "경기방식은 어떻게 되나요?",
        memberCount: "몇명?",
      },
    ],
  };
  if (id) {
    return { data: dummy.data.find((v) => v.id === id) };
  }
  return dummy;
}
