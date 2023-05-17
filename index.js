// 创建一个4*4的二维数组作为棋盘
// 里面的每一个值都是二的n次幂，其中n>=1，而且可以等于零
const gameBox = []
var score = 0;
var gameOver = false;

const restart = document.getElementById('btn_content');
const board = document.getElementById('square_container');

// 创建方块对象
// 对象名：square
class Square {
    constructor (value,element,row,col) {
        this.value = value;
        this.element = element;
        this.row = row;
        this.col = col;
    }
}

function init() {
    // 初始化函数
    // 将数组归零

    // 是不是应该先创建两个对象 然后把他们分配到相应的位置？
    // 也就是说我需要一个创建对象的函数，一个分配位置的函数

    // 合并时不生成新的对象，而是将其中一个对象的值改变

    // Yable: Initialize the gameBox array
    gameBox.length = 0; // This will clear the array

    // 重置棋盘
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            row.push(null);
        }
        gameBox[i] = row;
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
    score = 0;

    // 游戏状态设置为未结束
    gameOver = false;

    console.log('init');

}

// 生成方块的函数
function squareCreate() {

    // 在html里生成子元素
    const squareElement = document.createElement('div');
    // 给子元素添加类名使其能调用css样式
    squareElement.classList.add('squareElement');
    board.appendChild(squareElement);

    // 随机生成一个值2或者4并给方块赋值
    //Yable edit: new way of generating value. Instead of using 2^1 or 2^2
    //we directly assign 2 and 4 to squares
    const squareValue = Math.random() < 0.8 ? 2 : 4;

    squareElement.textContent = squareValue;

    // 方块的值不同，颜色也不同

    // 在数组里随机选一个空位置
    // 遍历所有的空位置，并用一个数组存储起来
    const emptyLoc = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameBox[i][j] === null) {
                emptyLoc.push({row:i, col: j});
            }
        }
    }
    // 如果不存在空位置则游戏结束
    if (emptyLoc.length === 0) {
        gameOver = true;
        //Yable: Dispatch a keydown event with the 'r' key
        const event = new KeyboardEvent('keydown', { key: 'r' });
        document.dispatchEvent(event);
        return;
    

    }
    // 随机选择其中一个
    const randomLoc = Math.floor(Math.random() * emptyLoc.length);
    // Math.random作用是选择0~1之间的随机小数
    // 它和空数组长度相乘就能得到一个0~空数组长度中间的一个小数
    // Math.floor意思是向下取整 得到一个整数
    const {row,col} = emptyLoc[randomLoc];


    // value有了 element有了 行列有了 可以生成对象了
    const square = new Square(squareValue,squareElement,row,col);
    
    // squareElement是元素 square是对象
    // 创建一个新Square对象square
    squareElement.square = square;


    // 将对象放置在对应位置
    // 在gameBox的位置
    gameBox[row][col] = square;
    // 在Html中的位置
    squareElement.style.top = 120 * square.row + "px";
    squareElement.style.left = 120 * square.col + "px";

    // 测试用输出
    console.log(gameBox);
    // console.log(row,col);
    console.log(square)
}

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
    boxRef();

    // 分数计算
    scoreCal();

    // 判断游戏是否结束
    ifGameOver();  

    // 游戏结束后操作
    if (gameOver) {
        console.log('Game Over!!!');
        console.log(gameOver);

        //Yable: Remove the previous event listener
        document.removeEventListener('keydown', handleKeydown);
        //Yable: Attach a new event listener
        document.addEventListener('keydown', gameStart());
                
        // 将整个游戏部分加上一层模糊 上面写 游戏结束

        // 记录本次分数 上传到排行榜 待定 

        // 游戏结束 重新开始 随便按一个键重新初始化
        /*document.addEventListener('keydown',function() {
            gameStart();
            console.log('restart');
        })*/
    }

    return;
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
    let noNull = true;
    for(let i = 0; i < 4; i++) {
        for (let j = 0; j< 4; j++) {
            if (gameBox[i][j] === null) {
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
                    if (gameBox[row][col].value === gameBox[row - 1][col].value) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块下方
                if (row < 3) {
                    if (gameBox[row][col].value === gameBox[row + 1][col].value) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块左侧
                if (col > 0) {
                    if (gameBox[row][col].value === gameBox[row][col - 1].value) {
                        noRep = false;
                        break;
                    }
                }
                // 检查方块右侧
                if (col < 3) {
                    if (gameBox[row][col].value === gameBox[row][col + 1].value) {
                        noRep = false;
                        break;
                    }
                }
            }
        }
        if (noRep) {
            gameOver = true;
            console.log('Game Over!!!');
            console.log(gameOver);
            return;
        }
    }
}

//Yable: execute moving left. This involves both merge and move
async function moveLeft() {
    for (let row = 0; row < 4; row ++) {
        for (let col = 0; col < 4; col++) {
            const currentSquare = gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col - 1;
            while (targetCol >= 0 && !gameBox[row][targetCol]) {
                targetCol--;
            }
            if (targetCol >= 0 && gameBox[row][targetCol].value === currentSquare.value) {
                //merge squares
                gameBox[row][targetCol].value = gameBox[row][targetCol].value + currentSquare.value; // Update the value
                gameBox[row][targetCol].element.textContent = gameBox[row][targetCol].value; // Update the displayed value
                // Remove the current square
                currentSquare.element.remove(); // Removes the element from the DOM
                gameBox[row][col] = null; // Removes the square from the gameBox
                console.log("Merged to left!!!", gameBox)
            } else {
                //Move square
                targetCol++ // Adjust the target column to be the first empty cell
                if (targetCol !== col) {
                    // Move the square to the target cell
                gameBox[row][targetCol] = currentSquare;
                gameBox[row][col] = null;  // Remove the square from the current cell
                currentSquare.col = targetCol;  // Update the square's column
                // Update the square's position in the DOM
                currentSquare.element.style.left = 120 * currentSquare.col + "px";
                console.log("Moved to left!!!",gameBox)
                }
            }
        }
    }
}

//Yable: detect whether a left movement is effective
function isEffectiveMoveLeft() {
    for (let row = 0; row < 4; row ++) {
        for (let col = 0; col < 4; col++) {
            const currentSquare = gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col - 1;
            while (targetCol >= 0 && !gameBox[row][targetCol]) {
                targetCol--;
            }
            if (targetCol >= 0 && gameBox[row][targetCol].value === currentSquare.value) {
                // squares would merge
                return true;
            } else {
                targetCol++; // Adjust the target column to be the first empty cell
                if (targetCol !== col) {
                    // square would move
                    return true;
                }
            }
        }
    }
    return false; // no square would move or merge
}

//Yable: execute moving right
async function moveRight() {
    for (let row = 0; row < 4; row ++) {
        for (let col = 3; col >= 0; col--) {
            const currentSquare = gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col + 1;
            while (targetCol < 4 && !gameBox[row][targetCol]) {
                targetCol++;
            }
            if (targetCol < 4 && gameBox[row][targetCol].value === currentSquare.value) {
                //merge squares
                gameBox[row][targetCol].value = gameBox[row][targetCol].value + currentSquare.value;
                gameBox[row][targetCol].element.textContent = gameBox[row][targetCol].value;
                currentSquare.element.remove();
                gameBox[row][col] = null;
                console.log("Merged to right!!!", gameBox)
            } else {
                //Move square
                targetCol--;
                if (targetCol !== col) {
                    gameBox[row][targetCol] = currentSquare;
                    gameBox[row][col] = null;
                    currentSquare.col = targetCol;
                    currentSquare.element.style.left = 120 * currentSquare.col + "px";
                    console.log("Moved to right!!!", gameBox)
                }
            }
        }
    }
}

//Yable: detect if a right movement is effective
function isEffectiveMoveRight() {
    for (let row = 0; row < 4; row ++) {
        for (let col = 3; col >= 0; col--) {
            const currentSquare = gameBox[row][col];
            if (!currentSquare) continue;

            let targetCol = col + 1;
            while (targetCol < 4 && !gameBox[row][targetCol]) {
                targetCol++;
            }
            if (targetCol < 4 && gameBox[row][targetCol].value === currentSquare.value) {
                return true;
            } else {
                targetCol--;
                if (targetCol !== col) {
                    return true;
                }
            }
        }
    }
    return false;
}

//Yable: execute moving up
async function moveUp() {
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row ++) {
            const currentSquare = gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row - 1;
            while (targetRow >= 0 && !gameBox[targetRow][col]) {
                targetRow--;
            }
            if (targetRow >= 0 && gameBox[targetRow][col].value === currentSquare.value) {
                //merge squares
                gameBox[targetRow][col].value = gameBox[targetRow][col].value + currentSquare.value;
                gameBox[targetRow][col].element.textContent = gameBox[targetRow][col].value;
                currentSquare.element.remove();
                gameBox[row][col] = null;
                console.log("Merged upwards!!!", gameBox)
            } else {
                //Move square
                targetRow++;
                if (targetRow !== row) {
                    gameBox[targetRow][col] = currentSquare;
                    gameBox[row][col] = null;
                    currentSquare.row = targetRow;
                    currentSquare.element.style.top = 120 * currentSquare.row + "px";
                    console.log("Moved upwards!!!", gameBox)
                }
            }
        }
    }
}

//Yable: detect whether a up movement is effective
function isEffectiveMoveUp() {
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row ++) {
            const currentSquare = gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row - 1;
            while (targetRow >= 0 && !gameBox[targetRow][col]) {
                targetRow--;
            }
            if (targetRow >= 0 && gameBox[targetRow][col].value === currentSquare.value) {
                return true;
            } else {
                targetRow++;
                if (targetRow !== row) {
                    return true;
                }
            }
        }
    }
    return false;
}

//Yable: execute moving down
async function moveDown() {
    for (let col = 0; col < 4; col++) {
        for (let row = 3; row >= 0; row--) {
            const currentSquare = gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row + 1;
            while (targetRow < 4 && !gameBox[targetRow][col]) {
                targetRow++;
            }
            if (targetRow < 4 && gameBox[targetRow][col].value === currentSquare.value) {
                //merge squares
                gameBox[targetRow][col].value = gameBox[targetRow][col].value + currentSquare.value;
                gameBox[targetRow][col].element.textContent = gameBox[targetRow][col].value;
                currentSquare.element.remove();
                gameBox[row][col] = null;
                console.log("Merged downwards!!!", gameBox)
            } else {
                //Move square
                targetRow--;
                if (targetRow !== row) {
                    gameBox[targetRow][col] = currentSquare;
                    gameBox[row][col] = null;
                    currentSquare.row = targetRow;
                    currentSquare.element.style.top = 120 * currentSquare.row + "px";
                    console.log("Moved downwards!!!", gameBox)
                }
            }
        }
    }
}

//Yable: detect whether a down movement is effective
function isEffectiveMoveDown() {
    for (let col = 0; col < 4; col++) {
        for (let row = 3; row >= 0; row--) {
            const currentSquare = gameBox[row][col];
            if (!currentSquare) continue;

            let targetRow = row + 1;
            while (targetRow < 4 && !gameBox[targetRow][col]) {
                targetRow++;
            }
            if (targetRow < 4 && gameBox[targetRow][col].value === currentSquare.value) {
                return true;
            } else {
                targetRow--;
                if (targetRow !== row) {
                    return true;
                }
            }
        }
    }
    return false;
}

//Yable: Create a function handling keydown
function handleKeydown(event) {
    // If the game is over and the 'r' key was pressed, restart the game
    if (gameOver) {
        gameStart();
        console.log('restart');
    } 
    //Yable edit: move out the && (event.key === 'r' || event.key === 'R') part and make it independent
    if (event.key === 'r' || event.key === 'R') {
        gameStart();
        console.log('restart');
    }
    else {
        // Handle other key presses
        //Yable: Now maybe there is no need to have a ifslide boolean value
        //since we will detect whether the move is effective every time an event happens.
        
        //yable edit:
        //let ifslide = true;
        if (event.key === 'ArrowLeft') {
            console.log('L');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveLeft()) {
                moveLeft();
                console.log('Move Left executed')
                slide();
            }
        }
        else if (event.key === 'ArrowUp') {
            console.log('U');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveUp()) {
                moveUp();
                console.log('Move Up executed')
                slide();
            }
        }
        else if (event.key === 'ArrowDown') {
            console.log('D');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveDown()) {
                moveDown();
                console.log('Move Down executed')
                slide();
            }
        }
        else if (event.key === 'ArrowRight') {
            console.log('R');
            //Yable: Detect if the move is an effective move
            if (isEffectiveMoveRight()) {
                moveRight();
                console.log('Move Right executed')
                slide();
            }
        }

        //Yable edit:
        /*else {
            ifslide = false;
        }*/

        /*if (ifslide) {
            slide();
        }*/
    }
}

// 程序主函数
function gameStart() {
    console.log('gameStart');

    // 初始化棋盘
    init();

    //Yable: Attach the keydown event listener
    document.addEventListener('keydown', handleKeydown);

    // 每次检测到一个滑动的操作都调用一次滑动的函数
    /*document.addEventListener('keydown',function (event) {
        let ifslide = true;
        if (event.key === 'ArrowLeft') {
            console.log('L');
        }
        else if (event.key === 'ArrowUp') {
            console.log('U');
        }
        else if (event.key === 'ArrowDown') {
            console.log('D');
        }
        else if (event.key === 'ArrowRight') {
            console.log('R');
        }
        else {
            ifslide = false;
        }

        if (ifslide) {
            slide();
        }
    })

    // 向上划和向下划一类
    // 向左划和向右划一类
*/
    // 如果按了重新开始按钮就进行初始化
    restart.addEventListener('click',function () {
        console.log('restart');
        init();
    })
/*
    // 按Rremake
    document.addEventListener('keydown',function (event) {
        if (event.key === 'r' || event.key === 'R') {
            console.log('restart');
            init();
        }
    })


    
*/
}

// 页面加载完成后自动开始游戏
window.onload = function () {
    gameStart();
}


// 高级功能：

// 做手机的适配：：：最优先

// 实现微信小程序搭载
// 实现陀螺仪调用

// 优化判断游戏是否结束的遍历算法
// 保存每次游玩的进度
// 实现分数上传功能
// 最高分?