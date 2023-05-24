import * as index from '../index.js'

export var highScore = getHighScore(); // 获取最高分数据

// 存储最高分数据
function storeHighScore(score) {
    if (typeof(Storage) !== "undefined") {
    // 使用localStorage存储最高分数据
    // 默认是0
        localStorage.setItem("highScore", score);
    }
}
  
// 获取最高分数据
function getHighScore() {
    if (typeof(Storage) !== "undefined") {
      // 从localStorage中获取最高分数据
      return localStorage.getItem("highScore");
    }
    return 0; // 如果浏览器不支持localStorage，则返回默认值0
}

  
// 示例用法
export function ifHighScore(score) {
    if (score > highScore) {
        // 更新最高分数据
        highScore = score;
        storeHighScore(highScore);
    }
}


// 要用这个函数干嘛？
// 每次划动之后检测最高分是否高于当前分 T不改变 F改变并实现实时合并