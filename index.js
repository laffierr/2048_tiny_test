// 调用生成方块的函数
import squareCreate from './happy.NIU/squareCreate.js';
import init from './happy.NIU/init.js';
import slide from './happy.NIU/slide.js';
import handleKeydown from './happy.NIU/handelKeydown.js';
//Yable: import handleSwipeMove 
import handleSwipeMove from './happy.NIU/handleSwipeMove.js'
//Yable: import GyroscopeControl
import { handleOrientation, requestOrientationPermission } from './happy.NIU/GyroscopeControl.js';
// 创建一个4*4的二维数组作为棋盘
// 里面的每一个值都是二的n次幂，其中n>=1，而且可以等于零
export const gameBox = []
export const shareScore = {
    score: 0,
}
export const shareGameOver = {
    over: false,
}

// 定义同时导出
export const restart = document.getElementById('btn_content');
export const board = document.getElementById('square_container');

//gyroscope status
var isGyroscopeEnabled = false;
var gyroToggle = document.getElementById("gyro-toggle");
var gyroStatus = document.getElementById("gyro-status");

// 创建方块对象
// 对象名：square
export class Square {
    constructor (value,element,row,col) {
        this.value = value;
        this.element = element;
        this.row = row;
        this.col = col;
    }
}

// 页面加载完成后自动开始游戏
window.onload = function () {
    gameStart();
}

// 程序主函数
export function gameStart() {
    console.log('gameStart');

    // 初始化棋盘
    init();

    document.addEventListener('keydown',handleKeydown);   
    //Yable: add a swipe movement listener
    document.addEventListener('touchstart', handleSwipeMove, false);
    document.addEventListener('touchmove', handleSwipeMove, false);
    document.addEventListener('touchend', handleSwipeMove, false);
    
    //Yable: add a gyroscope listener
    gyroToggle.addEventListener("click", function() {
        isGyroscopeEnabled = !isGyroscopeEnabled;
        gyroStatus.textContent = isGyroscopeEnabled ? "Enabled" : "Disabled";
    
        if (isGyroscopeEnabled) {
            // Add the deviceorientation event listener
            requestOrientationPermission();
        } else {
            // Remove the deviceorientation event listener
            window.removeEventListener('deviceorientation', handleOrientation, false);
            }
        })
                

    
 

    // 如果按了重新开始按钮就进行初始化
    restart.addEventListener('click',function () {
        console.log('restart');
        init();
    })

}

// 更新游戏面板
function boxRef() {
    
}


// 计算分数 分数是所有进行合并的方块的值的和
function scoreCal() {

}

// 高级功能：

// 做手机的适配：：：最优先

// 实现微信小程序搭载
// 实现陀螺仪调用

// 优化判断游戏是否结束的遍历算法
// 保存每次游玩的进度
// 实现分数上传功能
// 最高分?