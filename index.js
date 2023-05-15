// 创建一个4*4的二维数组作为棋盘
// 里面的每一个值都是二的n次幂，其中n>=1，而且可以等于零
const gameBox = []
var score = 0;
var gameOver = false;

const restart = document.getElementById('btn_content');

function init() {
    // 初始化函数
    // 将数组归零
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            row.push(0);
        }
        gameBox[i] = row;
    }
    // console.log(gameBox);
    gameOver = false;

    cubeCreate();
    // 游戏开始：在随机两个位置生成两个方块
}


// 游戏过程：方块的滑动：
function slide() {
    // 方块滑动的函数
    // 接收用户的输入并进行方块动作，分数计算，场景刷新，新方块生成

    // 接收用户输入：
    // 向上划
    // 向下划
    // 向左划
    // 向右划

    // 向上划和向下划一类
    // 向左划和向右划一类

    // 计算场景布局
    // 方块的合并：划动后朝着滑动方向的最远端开始遍历，如果有相同的就合并 并放到能放的首位
    // 方块的移动：按顺序进位
    // 实现原理：每次向某个方向划的时候 水平划就是行 垂直划就是列

    // 判断滑动是否有有效：是否能造成方块合并
    // 如果滑动无效则不算滑动

    // 方块生成
    // 每滑动一次之后在空余 也就是值为0的区域里生成一个方块
    cubeCreate();

    // 场景刷新
    // 给方块的滑动绑定对应的事件和动画 方块合并的动画
    boxRef();

    // 分数计算
    scoreCal();

    // 判断游戏是否结束
    ifGameOver();

    // 游戏结束后操作
    if (gameOver) {
        // 将整个游戏部分加上一层模糊 上面写 游戏结束

        // 记录本次分数 上传到排行榜 待定 

        // 游戏结束 重新开始 随便按一个键重新初始化
        document.addEventListener('keydown',function() {
            init();
        })
    }

}

function cubeCreate() {
    // 生成方块的函数
    // n代表生成方块的数量 开始两个正常一个
    // 生成方块的值可能是2^1也可能是2^2

    // 方块的值不同，颜色也不同

    // 首先在数组里随机选一个空位置
    // 遍历所有的空位置，并用一个数组存储起来
    const emptyLoc = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameBox[i][j] === 0) {
                emptyLoc.push({row:i, col: j});
            }
        }
    }
    // 随机选择其中一个
    const randomLoc = Math.floor(Math.random() * emptyLoc.length);
    // Math.random作用是选择0~1之间的随机小数
    // 它和空数组长度相乘就能得到一个0~空数组长度中间的一个小数
    // Math.floor意思是向下取整 得到一个整数
    const {row,col} = emptyLoc[randomLoc];

    // 随机生成一个值2或者4
    const newVal = Math.random() < 0.8 ? 1 : 2;

    // 将值赋给对应位置
    gameBox[row][col] = newVal;

    // console.log(gameBox);

    // 实现数组中值和方块的绑定
    
}

// 更新游戏面板
function boxRef() {
    
}


// 计算分数 分数是所有进行合并的方块的值的和
function scoreCal() {

}

// 判定游戏是否结束
function ifGameOver() {
    // 如何判定游戏结束：
    // 先遍历吧

    // 首先判断数组是否还存在0    
    let no0 = true;
    for(let i = 0; i < 4; i++) {
        for (let j = 0; j< 4; j++) {
            if (gameBox[i][j] == 0) {
                no0 = false;
            }
        }
    }
    if(no0) {
        // 其次判断生成方块后每个方块周围四格都没有和其值相同的方块
        let noRep = true;
        for (let row = 0; row < 4; row ++){
            for (let col = 0; col < 4; col++) {
                // 检查方块上方
                if (row > 0) {
                    if (gameBox[row][col] === gameBox[row - 1][col]) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块下方
                if (row < 3) {
                    if (gameBox[row][col] === gameBox[row + 1][col]) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块左侧
                if (col > 0) {
                    if (gameBox[row][col] === gameBox[row][col - 1]) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块右侧
                if (col < 3) {
                    if (gameBox[row][col] === gameBox[row][col + 1]) {
                        noRep = false;
                        break;
                    }
                }
            }
        }
        if (noRep) {
            gameOver = true;
            return;
        }
    }
}

// 程序主函数
function gameStart() {
    console.log('gameStart');

    // 初始化棋盘
    init();

    // 每次检测到一个滑动的操作都调用一次滑动的函数
    // document.addEventListener()
    slide();

    // 如果按了重新开始按钮就进行初始化
    restart.addEventListener('click',function () {
        console.log('restart');
        init();
    })

    // 按Rremake
    document.addEventListener('keydown',function (event) {
        if (event.key === 'r' || event.key === 'R') {
            console.log('restart');
            init();
        }
    })

}

// 页面加载完成后自动开始游戏
window.onload = function () {
    gameStart();
}


// 高级功能：
// 优化判断游戏是否结束的遍历算法
// 保存每次游玩的进度
// 实现分数上传功能
// 排行榜？
// 做手机的适配
// 实现微信小程序搭载
