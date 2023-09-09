import fs from "node:fs";

export const existsFile = (outputPath) => fs.existsSync(outputPath);

export function makeFolder({ parentDir, childDir }) {
  const path = `${parentDir}/${childDir}`;
  try {
    fs.mkdirSync(parentDir);
  } catch (err) {
    if (err.code === "EEXIST") {
      //pass
    } else {
      console.error("디렉터리 생성 중 오류 발생:", err);
    }
  } finally {
    try {
      fs.mkdirSync(path);
    } catch (err) {}
    return path;
  }
}

export function changeKeyOnArr(arr, keys) {
  return arr.map((data) => {
    const newData = {};
    for (const key in keys) {
      if (keys.hasOwnProperty(key) && data.hasOwnProperty(keys[key])) {
        newData[key] = data[keys[key]];
      }
    }
    return newData;
  });
}
