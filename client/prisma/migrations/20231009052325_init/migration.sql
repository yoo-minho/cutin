-- CreateTable
CREATE TABLE "Highlight" (
    "clubCode" VARCHAR(50) NOT NULL,
    "playDate" VARCHAR(8) NOT NULL,
    "gameNo" SMALLINT NOT NULL,
    "quaterNo" SMALLINT NOT NULL,
    "seekTime" VARCHAR(5) NOT NULL,
    "type" VARCHAR(2),
    "skill" VARCHAR(100),
    "mainPlayer" VARCHAR(6) NOT NULL,
    "subPlayer" VARCHAR(6) NOT NULL,
    "videoUrl" VARCHAR(100) NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("clubCode")
);

-- CreateTable
CREATE TABLE "GamePlayer" (
    "clubCode" VARCHAR(50) NOT NULL,
    "playDate" VARCHAR(8) NOT NULL,
    "teamName" VARCHAR(8) NOT NULL,
    "player" VARCHAR(5) NOT NULL,

    CONSTRAINT "GamePlayer_pkey" PRIMARY KEY ("clubCode")
);
