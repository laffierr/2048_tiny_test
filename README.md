# 2048_tiny_test
A test

用js,html和css,通过ES6模块化实现网页端的2048游戏


index.js:包含了游戏主体和方块对象生成。

init.js:包含数组，分数，游戏状态的初始化，生成两个初始方块。

squareCreate.js:生成方块的函数，包括棋盘空位置的遍历，新方块在网页上的位置

handleKeydown.js:判断每次划动是否有效，并进行方块滑动或合并的逻辑处理和动画处理。

slide.js:方块进行滑动后的事件函数，其中包括新方块的生成，游戏是否结束的判断。应更名为afterMove.js


游戏逻辑：页面加载完成后开始游戏，初始化。如果监听到动作就调用handleKetDown函数。每次划动过后判断游戏是否结束。


目前遇到的问题：2048的动画应该是先进行所有方块的滑动，再处理可能有的方块合并。
但是handleKeydown中的遍历方法导致会对某一行或者某一列进行遍历，处理这一行或者这一列的滑动和遍历。也就是说必须等某一行可能的合并执行之后才能进行下一行的滑动或合并。
这和2048的动画不同：正常应该是所有方块全部滑动结束后在进行方块的合并。

Implementing the 2048 game on the web using js, html, and css, through ES6 modularization.

index.js: Contains the main game and the generation of square objects.

init.js: Includes array, score, game state initialization, and generates two initial squares.

squareCreate.js: The function for generating squares, which includes traversing empty positions on the game board, and the position of the new square on the web page.

handleKeydown.js: It determines whether each swipe is valid, and performs the logic processing and animation of square sliding or merging.

slide.js: The event function after the square slides, which includes the generation of new squares and the judgment of whether the game ends. It should be renamed as afterMove.js.

Game Logic: After the page loads, the game starts and initializes. If an action is detected, it calls the handleKeyDown function. After each swipe, it determines whether the game ends.

Current Issues: The animation of 2048 should first carry out all square slides, then process possible square merges. However, the traversal method in handleKeydown causes traversal of a row or column, and processes the slide and merge of this row or column. That is to say, it must wait for the possible merging of a row to execute before the next row can slide or merge. This is different from the animation of 2048: normally all squares should finish sliding before the squares merge.
