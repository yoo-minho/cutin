export function drawBanner(canvas, props) {
  const ctx = canvas?.getContext("2d");

  //숫자는 16배수 추천
  const {
    xAlign,
    yAlign,
    x,
    y,
    text,
    font,
    fontSize,
    textColor,
    textStrokeColor,
    bgColor = "rgba(0,0,0,0)",
    padding,
    borderRadius = 0,
    shadow = false,
  } = props;

  const topAlign = yAlign === "top";
  const rightAlign = xAlign === "right";

  const fontAlpha = fontSize * 0.1; //폰트보정

  ctx.font = `${fontSize}px ${font}`; // 원하는 폰트 및 크기로 설정
  const textWidth = ctx.measureText(text).width;

  ctx.fillStyle = bgColor;
  roundRect(
    ctx,
    x,
    y - fontSize - 2 * padding,
    textWidth + 2 * padding,
    fontSize + 2 * padding,
    borderRadius
  );

  ctx.fillStyle = textColor;
  const textX = x + padding + (rightAlign ? -textWidth : 0);
  const textY = y - padding + (topAlign ? +fontSize : 0) - fontAlpha;

  if (shadow) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
  }

  ctx.fillText(text, textX, textY);

  if (shadow) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  if (textStrokeColor) {
    ctx.strokeStyle = textStrokeColor;
    ctx.lineWidth = fontSize * 0.03;
    ctx.strokeText(text, textX, textY);
  }

  return {
    top: y - fontSize - 2 * padding,
    right: x + textWidth + 2 * padding,
  };
}

export function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

export function drawGrid(canvas, gridSize = 16) {
  const ctx = canvas?.getContext("2d");
  const canvasW = canvas.width;
  const canvasH = canvas.height;
  ctx.strokeStyle = "rgba(128, 128, 128, 0.5)";
  for (let y = gridSize; y < canvasH; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasW, y);
    ctx.stroke();
  }
  for (let x = gridSize; x < canvasW; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasH);
    ctx.stroke();
  }
}

export function drawVideoBanners(canvas, cut) {
  console.log("111", { cut });

  const { gameNo, vsScore, quaterNo, seekTime, skill, mainPlayer } = cut;

  const vsScoreArr = Object.entries(vsScore);

  console.log({ vsScoreArr });

  const [aName, aScore] = vsScoreArr[0];
  const [bName, bScore] = vsScoreArr.length > 1 ? vsScoreArr[1] : ["블랙", 0];

  const [hour, min, sec] = seekTime.split(":");

  const gogo = `${mainPlayer}의 ${skill}`;

  const margin = 32;
  const { top, right } = drawBanner(canvas, {
    x: margin,
    y: (canvas?.height || 0) - margin,
    text: `${aName}     ${aScore}`,
    font: "Giants-Bold",
    fontSize: 32,
    textColor: "black",
    bgColor: "white",
    padding: 8,
  });

  const { right: right2 } = drawBanner(canvas, {
    x: right,
    y: (canvas?.height || 0) - margin,
    text: `${quaterNo}Q`,
    font: "Giants-Bold",
    fontSize: 32,
    textColor: "white",
    bgColor: "grey",
    padding: 8,
  });

  const { right: right3 } = drawBanner(canvas, {
    x: right2,
    y: (canvas?.height || 0) - margin,
    text: `${bScore}     ${bName}`,
    font: "Giants-Bold",
    fontSize: 32,
    textColor: "black",
    bgColor: "white",
    padding: 8,
  });

  drawBanner(canvas, {
    x: right3,
    y: (canvas?.height || 0) - margin,
    text: `${min}:${sec}`,
    font: "Giants-Bold",
    fontSize: 32,
    textColor: "white",
    bgColor: "black",
    padding: 8,
  });

  drawBanner(canvas, {
    x: margin,
    y: top,
    text:
      "🏀 2023-10-24(토) GBA 동아리 농구경기" +
      (gameNo ? ` - ${gameNo}게임` : ""),
    font: "NanumSquareNeo-Variable",
    fontSize: 16,
    textColor: "white",
    bgColor: "yellowgreen",
    padding: 8,
  });

  drawBanner(canvas, {
    xAlign: "right",
    x: (canvas.value?.width || 0) - margin,
    y: (canvas.value?.height || 0) - margin,
    text: gogo,
    font: "Giants-Bold",
    fontSize: 48,
    textColor: "white",
    textStrokeColor: "black",
    padding: 8,
  });

  drawBanner(canvas, {
    xAlign: "right",
    yAlign: "top",
    x: (canvas?.width || 0) - margin,
    y: margin,
    text: "SPOTV NOW",
    font: "Giants-Bold",
    fontSize: 36,
    textColor: "black",
    padding: 8,
    shadow: true,
  });

  console.log("222", { cut });
}
