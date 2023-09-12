const json2str = (json) =>
  Object.keys(json)
    .map((key) => `${key}=${json[key]}`)
    .join(":");

const drawtext = (json) => `drawtext=${json2str(json)}`;
const posY = (v) => v.y + v.fontsize;

export const drawLeftTopBanner = ({ logo, time, place }) => {
  const gap = 24;
  const first = { x: 36, y: 36, fontsize: 64 };
  const second = { x: 36, y: posY(first) + gap, fontsize: 32 };
  const third = { x: 36, y: posY(second) + gap, fontsize: 32 };
  const borderw = 9;

  return [
    drawtext({
      ...first,
      text: logo,
      fontcolor: "white",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "black",
      borderw: borderw,
    }),
    drawtext({
      ...second,
      text: time,
      fontcolor: "white",
      fontfile: "assets/vitro_core.ttf",
      box: 1,
      boxcolor: "black@0.7",
      boxborderw: borderw,
    }),
    drawtext({
      ...third,
      text: place,
      fontcolor: "white",
      fontfile: "assets/vitro_core.ttf",
      box: 1,
      boxcolor: "black@0.7",
      boxborderw: borderw,
    }),
  ].join(", ");
};

export const drawRightTopBanner = ({ title, scorer, assister, skill }) => {
  const gap = 24;
  const first = { x: "w-text_w-36", y: 36, fontsize: 48 };
  const second = { x: "w-text_w-36", y: posY(first) + gap, fontsize: 48 };
  const third = { x: "w-text_w-36", y: posY(second) + gap, fontsize: 32 };
  const fourth = { x: "w-text_w-36", y: posY(third) + gap + 2, fontsize: 32 };
  const borderw = 9;

  if (!assister) {
    assister = skill;
    skill = "";
  }

  return [
    drawtext({
      ...first,
      text: title,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "white",
      borderw: borderw,
    }),
    drawtext({
      ...second,
      text: scorer,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "white",
      borderw: borderw,
    }),
    drawtext({
      ...third,
      text: assister,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "white",
      borderw: borderw,
    }),
    drawtext({
      ...fourth,
      text: skill,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "white",
      borderw: borderw,
    }),
  ].join(", ");
};

export const drawIntroBanner = ({ name, record }) => {
  return [
    drawtext({
      x: "(w-text_w)/2",
      y: "(h-text_h)/2 - 128",
      fontsize: 36,
      text: "player",
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
    }),
    drawtext({
      x: "(w-text_w)/2",
      y: "(h-text_h)/2",
      fontsize: 128,
      text: name,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
    }),
    drawtext({
      x: "(w-text_w)/2",
      y: "(h-text_h)*3/4",
      fontsize: 64,
      text: record,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
    }),
  ].join(", ");
};
