// 导入
import * as index from '../index.js'


// 生成方块的函数
function squareCreate() {

    // 在html里生成子元素
    const squareElement = document.createElement('div');
    // 给子元素添加类名使其能调用css样式
    squareElement.classList.add('squareElement');
    index.board.appendChild(squareElement);

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
            if (index.gameBox[i][j] === null) {
                emptyLoc.push({row:i, col: j});
            }
        }
    }
    // 如果不存在空位置则游戏结束
    if (emptyLoc.length === 0) {
        index.gameOver = true;
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
    const square = new index.Square(squareValue,squareElement,row,col);
    
    // squareElement是元素 square是对象
    // 创建一个新Square对象square
    squareElement.square = square;


    // 将对象放置在对应位置
    // 在gameBox的位置
    index.gameBox[row][col] = square;
    // 在Html中的位置
    // squareElement.style.top = 120 * square.row + "px";
    // squareElement.style.left = 120 * square.col + "px";
    const heightBody = document.getElementById('body_content').offsetHeight;
    const widthBody = document.getElementById('body_content').offsetWidth;
    squareElement.style.top = 0.24 * heightBody * square.row + "px";
    squareElement.style.left = 0.24 * widthBody * square.col + "px";    

    // 测试用输出
    console.log(index.gameBox);
    // console.log(row,col);
    console.log(square)

    //Yable: add create animation
    // Add the "create" class to apply the animation
    squareElement.classList.add('create');
}

// 导出
export default squareCreate;