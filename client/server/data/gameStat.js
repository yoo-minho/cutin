import prisma from "./prisma";

export async function getMatchByClubCode(clubCode) {
  try {
    return await prisma.$queryRaw`
        SELECT "playDate", "gameNo", json_agg(jsonb_build_object('teamName',"teamName",'score',"score") ORDER BY "teamName") as match FROM (
            SELECT 
                hl."playDate", hl."gameNo", gp."teamName", 
                SUM((CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원') THEN 3 ELSE 2 END)) score
            FROM "Highlight" as hl
            INNER JOIN "GamePlayer" AS gp ON gp."clubCode" = hl."clubCode" and gp."playDate" = hl."playDate" AND hl."mainPlayer" = gp."player"
            WHERE hl."clubCode" = ${clubCode} 
            GROUP by hl."playDate", hl."gameNo", gp."teamName"
            ORDER by gp."teamName" DESC
        ) t
        GROUP by ("playDate", "gameNo")
        ORDER by ("playDate", "gameNo") DESC
    `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getMatchByGameCode(gameCode) {
  const [clubCode, playDate, gameNo] = gameCode.split("_");
  try {
    return await prisma.$queryRaw`
          SELECT "playDate", "gameNo", json_agg(jsonb_build_object('teamName',"teamName",'score',"score")) as match FROM (
              SELECT 
                  hl."playDate", hl."gameNo", gp."teamName", 
                  SUM((CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원') THEN 3 ELSE 2 END)) score
              FROM "Highlight" as hl
              INNER JOIN "GamePlayer" AS gp ON gp."clubCode" = hl."clubCode" and gp."playDate" = hl."playDate" AND hl."mainPlayer" = gp."player"
              WHERE hl."clubCode" = ${clubCode} 
              AND hl."playDate" = ${playDate}
              AND hl."gameNo" = ${+gameNo}
              GROUP by hl."playDate", hl."gameNo", gp."teamName"
              ORDER by gp."teamName" DESC
          ) t
          GROUP by ("playDate", "gameNo")
          ORDER by ("playDate", "gameNo") DESC
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getStatGroupByPlayerByClub(clubCode) {
  try {
    return await prisma.$queryRaw`
          select 
            "player" "name",  
            "경기수" play,
            "최근경기일" "playDate",
            "득점"::numeric pts,
            "리바"::numeric reb,
            "어시"::numeric ast,
            "3점"::numeric tpm,
            "공리"::numeric orb,
            "스틸"::numeric stl,
            "블락"::numeric blk
          from (
            select 
              "player",
              count(distinct (hl."playDate", hl."gameNo"))::int as "경기수", 
              sum(CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 ELSE 2 END) filter (WHERE gp."player" = hl."mainPlayer") "득점", 
              count(1) filter (where hl.skill in ('오펜스리바','리바운드','풋백','블락&리바','득점&OREB','3점슛&OREB','풋백앤드원')) "리바", 
              count(1) filter (where gp."player" = hl."subPlayer") "어시", 
              count(1) filter (where hl.skill in ('3점슛','3점슛&OREB') AND gp."player" = hl."mainPlayer") "3점", 
              count(1) filter (where hl.skill in ('오펜스리바','풋백','득점&OREB','3점슛&OREB','풋백앤드원')) "공리", 
              count(1) filter (where hl.skill in ('스틸')) "스틸", 
              count(1) filter (where hl.skill in ('블락','블락&리바')) "블락", 
              max(gp."playDate") "최근경기일"
            from "GamePlayer" AS gp
            Inner join "Highlight" as hl ON gp."clubCode" = hl."clubCode" AND gp."playDate" = hl."playDate" AND (gp."player" = hl."mainPlayer" OR gp."player" = hl."subPlayer")
            WHERE gp."clubCode" = ${clubCode}  AND "player" != ''
            GROUP BY "player"
          ) t
          ORDER BY play desc, "playDate" desc, "name" asc
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getStatGroupByGameByClubNPlayer(clubCode, playerName) {
  try {
    return await prisma.$queryRaw`
          select
            "playDate",
            "gameNo",
            "출전쿼터"::numeric qt,
            "득점"::numeric pts,
            "리바"::numeric reb,
            "어시"::numeric ast,
            "3점"::numeric tpm,
            "공리"::numeric orb,
            "스틸"::numeric stl,
            "블락"::numeric blk
          from (
            select
              hl."playDate",
              hl."gameNo",
              count(distinct hl."quaterNo") "출전쿼터",
              sum(CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 ELSE 2 END) filter (WHERE gp."player" = hl."mainPlayer") "득점",
              count(1) filter (where hl.skill in ('오펜스리바','리바운드','풋백','블락&리바','득점&OREB','3점슛&OREB','풋백앤드원')) "리바",
              count(1) filter (where gp."player" = hl."subPlayer") "어시",
              count(1) filter (where hl.skill in ('3점슛','3점슛&OREB') AND gp."player" = hl."mainPlayer") "3점",
              count(1) filter (where hl.skill in ('오펜스리바','풋백','득점&OREB','3점슛&OREB','풋백앤드원')) "공리",
              count(1) filter (where hl.skill in ('스틸')) "스틸",
              count(1) filter (where hl.skill in ('블락','블락&리바')) "블락"
            from "GamePlayer" AS gp
            Inner join "Highlight" as hl ON gp."clubCode" = hl."clubCode" AND gp."playDate" = hl."playDate" AND (gp."player" = hl."mainPlayer" OR gp."player" = hl."subPlayer")
            WHERE gp."clubCode" = ${clubCode}  AND "player" = ${playerName}
            GROUP BY hl."playDate", hl."gameNo"
          ) t
          ORDER BY ("playDate", "gameNo") desc
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getStatGroupByClubByPlayer(playerName) {
  try {
    return await prisma.$queryRaw`
          select
            "clubCode",
            "경기수" play,
            "최근경기일" "playDate",
            "득점"::numeric pts,
            "리바"::numeric reb,
            "어시"::numeric ast,
            "3점"::numeric tpm,
            "공리"::numeric orb,
            "스틸"::numeric stl,
            "블락"::numeric blk
          from (
            select
              gp."clubCode", 
              count(distinct (hl."playDate", hl."gameNo"))::int as "경기수",
              sum(CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 ELSE 2 END) filter (WHERE gp."player" = hl."mainPlayer") "득점",
              count(1) filter (where hl.skill in ('오펜스리바','리바운드','풋백','블락&리바','득점&OREB','3점슛&OREB','풋백앤드원')) "리바",
              count(1) filter (where gp."player" = hl."subPlayer") "어시",
              count(1) filter (where hl.skill in ('3점슛','3점슛&OREB') AND gp."player" = hl."mainPlayer") "3점",
              count(1) filter (where hl.skill in ('오펜스리바','풋백','득점&OREB','3점슛&OREB','풋백앤드원')) "공리",
              count(1) filter (where hl.skill in ('스틸')) "스틸",
              count(1) filter (where hl.skill in ('블락','블락&리바')) "블락",
              max(gp."playDate") "최근경기일"
            from "GamePlayer" AS gp
            Inner join "Highlight" as hl ON gp."clubCode" = hl."clubCode" AND gp."playDate" = hl."playDate" AND (gp."player" = hl."mainPlayer" OR gp."player" = hl."subPlayer")
            WHERE "player" = ${playerName}
            GROUP BY gp."clubCode", "player"
          ) t
          ORDER BY "경기수" desc, "playDate" desc
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}
