import prisma from "./prisma";

export async function getMatchByClubCode(clubCode) {
  try {
    return await prisma.$queryRaw`
        SELECT "playDate", "gameNo", json_agg(jsonb_build_object('teamName',"teamName",'score',"score") ORDER BY "teamName") as match FROM (
            SELECT 
                hl."playDate", hl."gameNo", gp."teamName", 
                SUM((CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원') THEN 3 WHEN hl.skill in ('자유투1점') THEN 1 ELSE 2 END)) score
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
                  SUM((CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원') THEN 3 WHEN hl.skill in ('자유투1점') THEN 1 ELSE 2 END)) score
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
            "guest",
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
              "guest",
              count(distinct (hl."playDate", hl."gameNo"))::int as "경기수", 
              sum(CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 WHEN hl.skill in ('자유투1점') THEN 1 ELSE 2 END) filter (WHERE gp."player" = hl."mainPlayer") "득점", 
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
            GROUP BY "player", "guest"
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
            "teamName",
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
              gp."teamName",
              count(distinct hl."quaterNo") "출전쿼터",
              sum(CASE 
              WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 
              WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 
              WHEN hl.skill in ('자유투1점') THEN 1 
              ELSE 2 
              END) filter (WHERE gp."player" = hl."mainPlayer") "득점",
              count(1) filter (where hl.skill in ('오펜스리바','리바운드','풋백','블락&리바','득점&OREB','3점슛&OREB','풋백앤드원')) "리바",
              count(1) filter (where gp."player" = hl."subPlayer") "어시",
              count(1) filter (where hl.skill in ('3점슛','3점슛&OREB') AND gp."player" = hl."mainPlayer") "3점",
              count(1) filter (where hl.skill in ('오펜스리바','풋백','득점&OREB','3점슛&OREB','풋백앤드원')) "공리",
              count(1) filter (where hl.skill in ('스틸')) "스틸",
              count(1) filter (where hl.skill in ('블락','블락&리바')) "블락"
            from "GamePlayer" AS gp
            Inner join "Highlight" as hl ON gp."clubCode" = hl."clubCode" AND gp."playDate" = hl."playDate" AND (gp."player" = hl."mainPlayer" OR gp."player" = hl."subPlayer")
            WHERE gp."clubCode" = ${clubCode}  AND "player" = ${playerName}
            GROUP BY hl."playDate", hl."gameNo", gp."teamName"
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
              sum(CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 WHEN hl.skill in ('자유투1점') THEN 1 ELSE 2 END) filter (WHERE gp."player" = hl."mainPlayer") "득점",
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

export async function getStatByClubNPlayer(playerName, clubCode) {
  try {
    return await prisma.$queryRaw`
          with stat_t as (
            select 
              "player",
              "guest",
              count(distinct (hl."playDate", hl."gameNo"))::int as "경기수",
              coalesce(sum(CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 WHEN hl.skill in ('자유투1점') THEN 1 ELSE 2 END) filter (WHERE gp."player" = hl."mainPlayer"), 0) "득점",
              count(1) filter (where hl.skill in ('오펜스리바','리바운드','풋백','블락&리바','득점&OREB','3점슛&OREB','풋백앤드원')) "리바",
              count(1) filter (where gp."player" = hl."subPlayer") "어시",
              count(1) filter (where hl.skill in ('3점슛','3점슛&OREB') AND gp."player" = hl."mainPlayer") "3점",
              count(1) filter (where hl.skill in ('오펜스리바','풋백','득점&OREB','3점슛&OREB','풋백앤드원')) "공리",
              count(1) filter (where hl.skill in ('스틸')) "스틸",
              count(1) filter (where hl.skill in ('블락','블락&리바')) "블락",
              max(gp."playDate") "최근경기일"
            from "GamePlayer" AS gp
            Inner join "Highlight" as hl ON gp."clubCode" = hl."clubCode" AND gp."playDate" = hl."playDate" AND (gp."player" = hl."mainPlayer" OR gp."player" = hl."subPlayer")
            WHERE gp."clubCode" = ${clubCode}
            GROUP BY gp."clubCode", "player", "guest"
          ), rank_t as (
            SELECT 
              "player",
              RANK() OVER (ORDER BY "득점"::numeric/"경기수" DESC)::numeric AS pts_rank,
              RANK() OVER (ORDER BY "리바"::numeric/"경기수" DESC)::numeric AS reb_rank,
              RANK() OVER (ORDER BY "어시"::numeric/"경기수" DESC)::numeric AS ast_rank,
              RANK() OVER (ORDER BY "3점"::numeric/"경기수" DESC)::numeric AS tpm_rank,
              RANK() OVER (ORDER BY "공리"::numeric/"경기수" DESC)::numeric AS orb_rank,
              RANK() OVER (ORDER BY "스틸"::numeric/"경기수" DESC)::numeric AS stl_rank,
              RANK() OVER (ORDER BY "블락"::numeric/"경기수" DESC)::numeric AS blk_rank
            FROM stat_t
            WHERE NOT "guest"
            -- AND "경기수" > 2
          )
          select
            "경기수" play,
            "최근경기일" "playDate",
            "득점"::numeric pts,
            "리바"::numeric reb,
            "어시"::numeric ast,
            "3점"::numeric tpm,
            "공리"::numeric orb,
            "스틸"::numeric stl,
            "블락"::numeric blk,
            "guest",
            rank_t.*
          from stat_t 
          left outer join rank_t ON stat_t."player" = rank_t."player"
          where stat_t."player" = ${playerName}
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

//팀 내 스탯 베스트
export async function 팀내스탯베스트(playerName, clubCode) {
  try {
    return await prisma.$queryRaw`
          with stat_t as (
	select 
	  "player",
	  hl."playDate",
	  hl."gameNo",
	  coalesce(sum(CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 WHEN hl.skill in ('자유투1점') THEN 1 ELSE 2 END) filter (WHERE gp."player" = hl."mainPlayer"), 0) "득점",
	  count(1) filter (where hl.skill in ('오펜스리바','리바운드','풋백','블락&리바','득점&OREB','3점슛&OREB','풋백앤드원')) "리바",
	  count(1) filter (where gp."player" = hl."subPlayer") "어시",
	  count(1) filter (where hl.skill in ('3점슛','3점슛&OREB') AND gp."player" = hl."mainPlayer") "3점",
	  count(1) filter (where hl.skill in ('오펜스리바','풋백','득점&OREB','3점슛&OREB','풋백앤드원')) "공리",
	  count(1) filter (where hl.skill in ('스틸')) "스틸",
	  count(1) filter (where hl.skill in ('블락','블락&리바')) "블락"
	from "GamePlayer" AS gp
	Inner join "Highlight" as hl ON gp."clubCode" = hl."clubCode" AND gp."playDate" = hl."playDate" AND (gp."player" = hl."mainPlayer" OR gp."player" = hl."subPlayer")
	WHERE gp."clubCode" = 'gba' and not gp.guest
	GROUP BY gp."clubCode", "player", hl."playDate", hl."gameNo"
)
(select '득점' his, * from stat_t order by "득점" desc, "playDate" desc limit 1) union
(select '리바' his, * from stat_t order by "리바" desc, "playDate" desc limit 1) union
(select '어시' his, * from stat_t order by "어시" desc, "playDate" desc limit 1) union
(select '3점' his, * from stat_t order by "3점" desc, "playDate" desc limit 1) union
(select '공리' his, * from stat_t order by "공리" desc, "playDate" desc limit 1) union
(select '스틸' his, * from stat_t order by "스틸" desc, "playDate" desc limit 1) union
(select '블락' his, * from stat_t order by "블락" desc, "playDate" desc limit 1)
order by his;
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function 콤비베스트(playerName, clubCode) {
  try {
    return await prisma.$queryRaw`
          select 
  hl."playDate",
  hl."gameNo",
  (case when hl."mainPlayer" > hl."subPlayer" then hl."mainPlayer"||'_'||hl."subPlayer" else hl."subPlayer"||'_'||hl."mainPlayer" end),
  count(1)
from "GamePlayer" AS gp
Inner join "Highlight" as hl ON gp."clubCode" = hl."clubCode" AND gp."playDate" = hl."playDate" AND (gp."player" = hl."mainPlayer" OR gp."player" = hl."subPlayer")
WHERE gp."clubCode" = 'gba' and not gp.guest and hl."subPlayer" != ''
GROUP BY hl."playDate", hl."gameNo", (case when hl."mainPlayer" > hl."subPlayer" then hl."mainPlayer"||'_'||hl."subPlayer" else hl."subPlayer"||'_'||hl."mainPlayer" end)
order by hl."playDate" desc, hl."gameNo" desc, count desc;
      `;
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

/*
with stat_t as (
	select 
	  "player",
	  gp."clubCode",
	  hl."playDate",
	  hl."gameNo",
	  coalesce(sum(CASE WHEN hl.skill in ('스틸','오펜스리바','리바운드','블락','블락&리바') THEN 0 WHEN hl.skill in ('3점슛','앤드원','풋백앤드원') THEN 3 WHEN hl.skill in ('자유투1점') THEN 1 ELSE 2 END) filter (WHERE gp."player" = hl."mainPlayer"), 0) "득점",
	  count(1) filter (where hl.skill in ('오펜스리바','리바운드','풋백','블락&리바','득점&OREB','3점슛&OREB','풋백앤드원')) "리바",
	  count(1) filter (where gp."player" = hl."subPlayer") "어시",
	  count(1) filter (where hl.skill in ('3점슛','3점슛&OREB') AND gp."player" = hl."mainPlayer") "3점",
	  count(1) filter (where hl.skill in ('오펜스리바','풋백','득점&OREB','3점슛&OREB','풋백앤드원')) "공리",
	  count(1) filter (where hl.skill in ('스틸')) "스틸",
	  count(1) filter (where hl.skill in ('블락','블락&리바')) "블락"
	from "GamePlayer" AS gp
	Inner join "Highlight" as hl ON gp."clubCode" = hl."clubCode" AND gp."playDate" = hl."playDate" AND (gp."player" = hl."mainPlayer" OR gp."player" = hl."subPlayer")
	WHERE gp."clubCode" = 'gba' and not gp.guest
	GROUP BY gp."clubCode", "player", hl."playDate", hl."gameNo"
)
-- select '득점-TOP5', *, (select "clubCode"||'_'||"playDate"||'_'||"gameNo" "videoCode" from stat_t t1 where t.player = t1.player and t1."득점" = max order by "playDate" desc, "gameNo" desc limit 1) from (select player, max("득점") from stat_t group by player order by max DESC LIMIT 5) t
-- select '리바-TOP5', *, (select "clubCode"||'_'||"playDate"||'_'||"gameNo" "videoCode" from stat_t t1 where t.player = t1.player and t1."리바" = max order by "playDate" desc, "gameNo" desc limit 1) from (select player, max("리바") from stat_t group by player order by max DESC LIMIT 5) t
-- select '어시-TOP5', *, (select "clubCode"||'_'||"playDate"||'_'||"gameNo" "videoCode" from stat_t t1 where t.player = t1.player and t1."어시" = max order by "playDate" desc, "gameNo" desc limit 1) from (select player, max("어시") from stat_t group by player order by max DESC LIMIT 5) t
-- select '3점-TOP5', *, (select "clubCode"||'_'||"playDate"||'_'||"gameNo" "videoCode" from stat_t t1 where t.player = t1.player and t1."3점" = max order by "playDate" desc, "gameNo" desc limit 1) from (select player, max("3점") from stat_t group by player order by max DESC LIMIT 5) t
-- select '공리-TOP5', *, (select "clubCode"||'_'||"playDate"||'_'||"gameNo" "videoCode" from stat_t t1 where t.player = t1.player and t1."공리" = max order by "playDate" desc, "gameNo" desc limit 1) from (select player, max("공리") from stat_t group by player order by max DESC LIMIT 5) t
-- select '스틸-TOP5', *, (select "clubCode"||'_'||"playDate"||'_'||"gameNo" "videoCode" from stat_t t1 where t.player = t1.player and t1."스틸" = max order by "playDate" desc, "gameNo" desc limit 1) from (select player, max("스틸") from stat_t group by player order by max DESC LIMIT 5) t
-- select '블락-TOP5', *, (select "clubCode"||'_'||"playDate"||'_'||"gameNo" "videoCode" from stat_t t1 where t.player = t1.player and t1."블락" = max order by "playDate" desc, "gameNo" desc limit 1) from (select player, max("블락") from stat_t group by player order by max DESC LIMIT 5) t

-- (select '더블더블', '득점+리바', * from stat_t where "득점" >= 10 and "리바" >= 10) union
-- (select '더블더블', '득점+어시', * from stat_t where "득점" >= 10 and "어시" >= 10) union
-- (select '더블더블', '리바+어시', * from stat_t where "리바" >= 10 and "어시" >= 10) union

-- (select '트리플6', '득점+리바+어시', * from stat_t where "득점" >=6 AND "리바" >=6 AND "어시" >= 6) union
-- (select '트리플6', '득점+리바+스틸', * from stat_t where "득점" >=6 AND "리바" >=6 AND "스틸" >= 6) union
-- (select '트리플6', '득점+어시+스틸', * from stat_t where "득점" >=6 AND "어시" >=6 AND "스틸" >= 6) union
-- (select '트리플6', '어시+리바+스틸', * from stat_t where "어시" >=6 AND "리바" >=6 AND "스틸" >= 6) union

-- (select '쿼드러플4', '득점+리바+어시+스틸', * from stat_t where "득점" >=4 AND "어시" >=4 AND "스틸" >= 4 AND "리바" >= 4) 







*/
