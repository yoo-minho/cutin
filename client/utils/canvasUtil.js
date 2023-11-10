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
    letterWidthRatio = 1,
    bgColor = "rgba(0,0,0,0)",
    padding,
    borderRadius = 0,
    shadow = false,
  } = props;

  const topAlign = yAlign === "top";
  const rightAlign = xAlign === "right";

  const fontAlpha = fontSize * 0.1; //폰트보정

  ctx.font = `${fontSize}px ${font}`;
  const textWidth = ctx.measureText(text).width * letterWidthRatio;

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

  ctx.fillText(text, textX, textY, textWidth);

  if (shadow) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  if (textStrokeColor) {
    ctx.strokeStyle = textStrokeColor;
    ctx.lineWidth = fontSize * 0.03;
    ctx.strokeText(text, textX, textY, textWidth);
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

export function drawVideoBanners(canvas, cut, tick = 0, waitSec = 0) {
  const currenrRatioSet = 720;
  const ratio = currenrRatioSet / 720;
  const bigFontSize = 64 * ratio;
  const fontSize = 36 * ratio;
  const smallFontSize = 18 * ratio;
  const padding = 8 * ratio;
  const margin = 32 * ratio;
  canvas?.getContext("2d").setTransform(1, 0, 0, 1, 0, 0);

  const {
    gameNo,
    vsScore,
    quaterNo,
    seekTime,
    skill,
    mainPlayer,
    subPlayer,
    videoName,
  } = cut;
  const [name, date] = videoName.split("_");
  const vsScoreArr = Object.entries(vsScore);
  if (vsScoreArr.length !== 2) throw "vsScore가 2개가 아니네";
  const [aName, aScore] = vsScoreArr[0];
  const [bName, bScore] = vsScoreArr[1];
  const [hour, min, sec] = seekTime.split(":");
  const [mainExpression, subExpression] = skillExpression(
    skill,
    mainPlayer,
    subPlayer
  );

  const { top, right } = drawBanner(canvas, {
    x: margin,
    y: (canvas?.height || 0) - margin,
    text: `${aName}     ${aScore}`,
    font: "Giants-Bold",
    fontSize,
    textColor: "black",
    bgColor: "white",
    padding,
  });

  const { right: right2 } = drawBanner(canvas, {
    x: right,
    y: (canvas?.height || 0) - margin,
    text: `${quaterNo}Q`,
    font: "Giants-Bold",
    fontSize,
    textColor: "white",
    bgColor: "grey",
    padding,
  });

  const { right: right3 } = drawBanner(canvas, {
    x: right2,
    y: (canvas?.height || 0) - margin,
    text: `${bScore}     ${bName}`,
    font: "Giants-Bold",
    fontSize,
    textColor: "black",
    bgColor: "white",
    padding,
  });

  drawBanner(canvas, {
    x: right3,
    y: (canvas?.height || 0) - margin,
    text: `${min}:${sec}`,
    font: "Giants-Bold",
    fontSize,
    textColor: "white",
    bgColor: "black",
    padding,
  });

  drawBanner(canvas, {
    x: margin,
    y: top,
    text:
      `🏀 ${formatDate(date)} ${name} 농구경기` +
      (gameNo ? ` - ${gameNo}게임` : ""),
    font: "NanumSquareNeo-Variable",
    fontSize: smallFontSize,
    textColor: "white",
    bgColor: "yellowgreen",
    padding,
  });

  const fps = 60;
  const floatingSec = 0.2;
  if (tick > fps * waitSec) {
    const tickY =
      (margin + fontSize) *
      Math.max(1 - (tick - fps * waitSec) / (fps * floatingSec), 0);
    const { top } = drawBanner(canvas, {
      xAlign: "right",
      x: (canvas?.width || 0) - margin + tickY,
      y: (canvas?.height || 0) - margin,
      text: mainExpression,
      font: "Giants-Bold",
      fontSize: bigFontSize,
      textColor: "white",
      textStrokeColor: "black",
      letterWidthRatio: 0.95,
      padding,
    });
    drawBanner(canvas, {
      xAlign: "right",
      x: (canvas?.width || 0) - margin + tickY,
      y: top,
      text: subExpression,
      font: "Giants-Bold",
      fontSize,
      textColor: "white",
      textStrokeColor: "black",
      letterWidthRatio: 0.95,
      padding,
    });
  }

  drawBanner(canvas, {
    yAlign: "top",
    x: margin,
    y: margin,
    text: "MYHL🏀",
    font: "Giants-Bold",
    fontSize: fontSize,
    textColor: "white",
    textStrokeColor: "black",
    letterWidthRatio: 0.95,
    padding,
    shadow: true,
  });
}
