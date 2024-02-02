[GET] /api/club : 모든 클럽 조회
[GET] /api/club/{clubCode}/game : 게임정보 여러개 조회
[GET] /api/club/{clubCode}/game/{gameCode} : 게임정보 1개 조회
[GET] /api/club/{clubCode}/game/{gameCode}/record : 게임의 팀 기록 여러개 조회
[GET] /api/club/{clubCode}/player : 플레이어정보 여러개 조회
[GET] /api/club/{clubCode}/player/{playerName} : 플레이어정보 1개 조회

[GET] /api/player/{playerName}/club : 플레이어의 클럽 여러개의 조회

select
'INSERT INTO "Highlight" VALUES ('''||
"clubCode"||''','''||
"playDate"||''','||
"gameNo"||','||
"quaterNo"||','''||
"seekTime"||''','''||
coalesce("skill",'')||''','''||
coalesce("mainPlayer",'')||''','''||
coalesce("subPlayer",'')||''',null,'''||
coalesce("videoName",'')||''');'
from "Highlight" where "playDate" = '20240127';

select
'INSERT INTO "GamePlayer" VALUES ('''||
"clubCode"||''','''||
"playDate"||''','''||
"teamName"||''','''||
"player"||''','||
"guest"||');'
from "GamePlayer" where "playDate" = '20240127';
