const json2str = (json) =>
  Object.keys(json)
    .map((key) => `${key}=${json[key]}`)
    .join(":");

const drawtext = (json) => `drawtext=${json2str(json)}`;
const posY = (v) => v.y + v.fontsize;

export const drawLeftTopBanner = ({ logo, time, place }) => {
  const gap = 16;
  const first = { x: 36, y: 36, fontsize: 44 };
  const second = { x: 36, y: posY(first) + gap, fontsize: 20 };
  const third = { x: 36, y: posY(second) + gap, fontsize: 20 };

  return [
    drawtext({
      ...first,
      text: logo,
      fontcolor: "white",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "black",
      borderw: 6,
    }),
    drawtext({
      ...second,
      text: time,
      fontcolor: "white",
      fontfile: "assets/vitro_core.ttf",
      box: 1,
      boxcolor: "black@0.7",
      boxborderw: 6,
    }),
    drawtext({
      ...third,
      text: place,
      fontcolor: "white",
      fontfile: "assets/vitro_core.ttf",
      box: 1,
      boxcolor: "black@0.7",
      boxborderw: 6,
    }),
  ].join(", ");
};

export const drawRightTopBanner = ({ title, scorer, assister, skill }) => {
  const gap = 16;
  const first = { x: "w-text_w-36", y: 36, fontsize: 32 };
  const second = { x: "w-text_w-36", y: posY(first) + gap, fontsize: 32 };
  const third = { x: "w-text_w-36", y: posY(second) + gap, fontsize: 20 };
  const fourth = { x: "w-text_w-36", y: posY(third) + gap + 2, fontsize: 20 };
  return [
    drawtext({
      ...first,
      text: title,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "white",
      borderw: 4,
    }),
    drawtext({
      ...second,
      text: scorer,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "white",
      borderw: 4,
    }),
    drawtext({
      ...third,
      text: assister,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "white",
      borderw: 4,
    }),
    drawtext({
      ...fourth,
      text: skill,
      fontcolor: "black",
      fontfile: "assets/vitro_core.ttf",
      bordercolor: "white",
      borderw: 4,
    }),
  ].join(", ");
};
