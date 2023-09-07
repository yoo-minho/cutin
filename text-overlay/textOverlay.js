const json2str = (json) =>
  Object.keys(json)
    .map((key) => `${key}=${json[key]}`)
    .join(":");

export const drawLeftTopBanner0 = (text) =>
  json2str({
    text: "🏀",
    x: 36,
    y: 36,
    fontsize: 36,
    fontcolor: "black",
    fontfile: "assets/NotoEmoji-Bold.ttf",
    shadowcolor: "white",
  }) +
  ", drawtext=" +
  json2str({
    text,
    x: 36 + 12 + 36,
    y: 36 + 2,
    fontsize: 36,
    fontcolor: "black",
    fontfile: "assets/vitro_core.ttf",
    shadowcolor: "white",
  });

export const drawLeftTopBanner1 = (text) =>
  json2str({
    text,
    x: 36,
    y: 36 + 36 + 12,
    fontsize: 24,
    fontcolor: "black",
    fontfile: "assets/Roboto-Black.ttf",
    shadowcolor: "white",
    shadowx: 1,
    shadowy: 1,
    // letterspacing: 5,
  });

export const drawLeftTopBanner2 = (text) =>
  json2str({
    text,
    x: 36,
    y: 36 + 36 + 12 + 24 + 6,
    fontsize: 24,
    fontcolor: "black",
    fontfile: "assets/NanumSquareNeo.ttf",
  });

export const drawRightTopBanner0 = (text) =>
  json2str({
    text,
    x: "(w-text_w-100)",
    y: 100,
    fontsize: 36,
    fontcolor: "white",
    fontfile: "assets/vitro_core.ttf",
    shadowcolor: "black",
    shadowx: 2,
    shadowy: 2,
  });

export const drawRightTopBanner1 = (text) =>
  json2str({
    text,
    x: "(w-text_w-100)",
    y: 100 + 36 + 12,
    fontsize: 30,
    fontcolor: "white",
    fontfile: "assets/vitro_core.ttf",
    shadowcolor: "black",
    shadowx: 2,
    shadowy: 2,
  });

export const drawRightTopBanner2 = (text) =>
  json2str({
    text,
    x: "(w-text_w-100)",
    y: 100 + 36 + 12 + 30 + 12,
    fontsize: 24,
    fontcolor: "white",
    fontfile: "assets/vitro_core.ttf",
    shadowcolor: "black",
    shadowx: 2,
    shadowy: 2,
  });
