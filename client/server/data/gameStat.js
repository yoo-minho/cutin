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
                  SUM((CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락') THEN 0 WHEN hl.skill in ('3점슛','앤드원') THEN 3 ELSE 2 END)) score
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

export async function getAllMatchStatByPlayer(gameCode) {
  const [clubCode, playDate, gameNo] = gameCode.split("_");
  try {
    return await prisma.$queryRaw`
          select 
            "playDate", 
            "gameNo", 
            SUM((CASE WHEN skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN skill in ('3점슛','앤드원') THEN 3 ELSE 2 END)) filter (where "mainPlayer" = '최성민') score,
            count(1) filter (where skill in ('오펜스리바','리바운드','풋백','블락&리바')) reb,
            count(1) filter (where "subPlayer" = '최성민') ast,
            count(1) filter (where skill in ('3점슛')) tpm,
            count(1) filter (where skill in ('오펜스리바','풋백')) orb,
            count(1) filter (where skill in ('스틸')) stl,
            count(1) filter (where skill in ('블락','블락&리바')) blk
          from "Highlight"
          where "clubCode" = 'gba' and ("mainPlayer" = '최성민' OR "subPlayer" = '최성민')
          group by "playDate", "gameNo";
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}
