import * as index from '../index.js'
import squareCreate from './squareCreate.js';


// 游戏过程：方块的滑动：
function slide(event) {
    console.log('slide');

    // 方块滑动的函数
    // 接收用户的输入并进行方块动作，分数计算，场景刷新，新方块生成

    // 方块生成
    squareCreate();

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
    }
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
            window.alert('Game Over!!! Your final score is ' + index.shareScore.score + '. Press OK to continue.');
            return;
        }
    }
} 

export default slide;