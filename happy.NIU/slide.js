import * as index from '../index.js'
import squareCreate from './squareCreate.js';


// 游戏过程：方块的滑动：
function slide(event) {
    console.log('slide');

    // 方块滑动的函数
    // 接收用户的输入并进行方块动作，分数计算，场景刷新，新方块生成

    // 接收用户输入：
    // 向上划
    // 向下划
    // 向左划
    // 向右划
    // 计算场景布局


    // 方块的合并：划动后朝着滑动方向的最远端开始遍历，如果有相同的就合并 并放到能放的首位
    // 方块的移动：按顺序进位
    // 实现原理：每次向某个方向划的时候 水平划就是行 垂直划就是列

    // 判断滑动是否有有效：是否能造成方块合并
    // 如果滑动无效则不算滑动

    // 方块生成
    // 每滑动一次之后在空余 也就是值为0的区域里生成一个方块
    squareCreate();


    // 场景刷新
    // 给方块的滑动绑定对应的事件和动画 方块合并的动画
    // boxRef();

    // 分数计算
    // scoreCal();

    // 判断游戏是否结束
    ifGameOver();  

    // 游戏结束后操作
    if (index.shareGameOver.over) {
        console.log('Game Over!!!');
        console.log(index.shareGameOver.over);

        //Yable: Remove the previous event listener
        document.removeEventListener('keydown', handleKeydown);
        //Yable: Attach a new event listener
        document.addEventListener('keydown', gameStart());
                
        // 将整个游戏部分加上一层模糊 上面写 游戏结束

        // 判断滑动是否有有效：是否能造成方块合并
        // 如果滑动无效则不算滑动

        // 游戏结束 重新开始 随便按一个键重新初始化
        /*document.addEventListener('keydown',function() {
            gameStart();
            console.log('restart');
        })*/
    }

    // return;
    // }
    
}

// 判定游戏是否结束
function ifGameOver() {
    // 如何判定游戏结束：
    // 先遍历吧

    // 首先判断数组是否还存在0    
    let noNull = true;
    for(let i = 0; i < 4; i++) {
        for (let j = 0; j< 4; j++) {
            if (index.gameBox[i][j] === null) {
                noNull = false;
            }
        }
    }
    if(noNull) {
        // 其次判断生成方块后每个方块周围四格都没有和其值相同的方块
        let noRep = true;
        for (let row = 0; row < 4; row ++){
            for (let col = 0; col < 4; col++) {
                // 检查方块上方
                //Yable: For your ifGameOver function, 
                //you're checking if the board is filled 
                //and then if there are no available moves. 
                //However, you're using strict equality (===) to compare objects, 
                //which only returns true if they are the same object, 
                //not if they have the same value. 
                //You should compare the value property of the Square objects instead.
                if (row > 0) {
                    if (index.gameBox[row][col].value === index.gameBox[row - 1][col].value) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块下方
                if (row < 3) {
                    if (index.gameBox[row][col].value === index.gameBox[row + 1][col].value) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块左侧
                if (col > 0) {
                    if (index.gameBox[row][col].value === index.gameBox[row][col - 1].value) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块右侧
                if (col < 3) {
                    if (index.gameBox[row][col].value === index.gameBox[row][col + 1].value) {
                        noRep = false;
                        break;
                    }
                }
            }
        }
        if (noRep) {
            index.shareGameOver.over = true;
            // console.log('Game Over!!!');
            // console.log(shareGameOver.over);
            window.alert('Game Over!!! Your final score is ' + index.shareScore.score + '. Press any OK to continue.');
            return;
        }
    }
} 

export default slide;