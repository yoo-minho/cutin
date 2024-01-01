import prisma from "./prisma";

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
    ],
  };
  if (id) {
    return { data: dummy.data.find((v) => v.id === id) };
  }
  return dummy;
}

export async function getInfoByClubCode() {
  try {
    return await prisma.$queryRaw`
          select 
            "clubCode", 
            max("playDate") as "lastPlayDate",
            (count(distinct "player") filter(where not guest))::numeric as "memberCount",
            (count(distinct "player") filter(where guest))::numeric as "guestCount"
          from "GamePlayer" 
          where "player" != ''
          group by "clubCode"
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}
