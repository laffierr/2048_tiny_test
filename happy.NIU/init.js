// 导入
import * as index from '../index.js'
import squareCreate from './squareCreate.js';
import { highScore } from './highScore.js';


function init() {
    // 初始化函数
    // 将数组归零

    // 设置最高分
    index.highScoreText.innerHTML = highScore;

    // Yable: Initialize the gameBox array
    index.gameBox.length = 0; // This will clear the array

    // 重置棋盘
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            row.push(null);
        }
        index.gameBox[i] = row;
    }
    // Yable: Clear the game board in UI
    const board = document.getElementById('square_container');
    while(board.firstChild) {
        board.removeChild(board.firstChild);
    }

    // 生成两个方块
    squareCreate();
    squareCreate();

    // 得分重置为0
    index.shareScore.score = 0;
    document.getElementById("score_content").innerText = index.shareScore.score


    // 游戏状态设置为未结束
    index.shareGameOver.over = false;

    console.log('init');

}

export default init;