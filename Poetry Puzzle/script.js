const gridElement = document.getElementById('grid');
const resetButton = document.getElementById('resetBtn');
const statusElement = document.getElementById('status');

// 七言古诗素材
const poems = [
    "孤山寺北贾亭西",
    "水面初平云脚低",
    "几处早莺争暖树",
    "谁家新燕啄春泥",
    "乱花渐欲迷人眼",
    "浅草才能没马蹄"
   
];

// 全部的字
let letters = [];
poems.forEach(poem => {
    for (let char of poem) {
        letters.push(char);
    }
});

// 随机排列字
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 交换元素
    }
}

// 初始化游戏
function initializeGame() {
    letters = [...letters]; // 复制字母数组
    shuffle(letters);
    
    gridElement.innerHTML = ''; // 清空矩阵

    for (let i = 0; i < 42; i++) {
        const cell = document.createElement('div');
        cell.textContent = letters[i];
        cell.setAttribute('data-index', i);
        cell.classList.add('cell');
        cell.addEventListener('click', onCellClick);
        gridElement.appendChild(cell);
    }

    statusElement.textContent = "点击7个字并按正确顺序匹配！";
}

// 当前点击的字
let selectedLetters = [];

// 用户点击某个字
function onCellClick(event) {
    const cell = event.target;
    const index = Number(cell.getAttribute('data-index'));

    // 避免已经消除的字被点击
    if (cell.classList.contains('removed')) {
        return;
    }

    // 将点击的字添加到选中的字数组
    selectedLetters.push({ index, char: cell.textContent });

    // 高亮显示选中的字
    cell.style.backgroundColor = '#ff6347';

    // 如果选中7个字，检查是否匹配成功
    if (selectedLetters.length === 7) {
        checkPoemMatch();
    }
}

// 检查是否匹配成功
function checkPoemMatch() {
    const poemStr = selectedLetters.map(letter => letter.char).join('');
    let matchedPoem = false;

    // 检查用户选择的7个字是否匹配任何诗句
    for (let poem of poems) {
        if (poem === poemStr) {
            matchedPoem = true;
            break;
        }
    }

    if (matchedPoem) {
        selectedLetters.forEach(letter => {
            const cell = gridElement.querySelector(`[data-index="${letter.index}"]`);
            cell.classList.add('removed');
            cell.style.backgroundColor = '#98FB98'; // 设置为绿色表示消除
        });
        selectedLetters = [];
        statusElement.textContent = "匹配成功！继续点击其他字。";

        // 检查是否完成所有字的消除
        const remainingCells = document.querySelectorAll('.cell:not(.removed)');
        if (remainingCells.length === 0) {
            statusElement.textContent = "恭喜你完成了游戏！";
        }
    } else {
        // 如果没有匹配，清空选中的字并恢复颜色
        selectedLetters.forEach(letter => {
            const cell = gridElement.querySelector(`[data-index="${letter.index}"]`);
            cell.style.backgroundColor = '#ffdf8c'; // 恢复原始背景
        });
        selectedLetters = [];
        statusElement.textContent = "选择的字不匹配，请再试一次！";
    }
}

// 重置游戏
resetButton.addEventListener('click', initializeGame);

// 初始化游戏
initializeGame();
