import { createContext, useContext, useState } from 'react';
import './App.css';
import victory_check from "./victory_check.png";

const repeat = (n, f) => {
    let out = [];
    for (let i = 0; i < n; i++) {
        out.push(f(i));
    }
    return out;
}
const addIfNotPresent = (item, list) => {
    if (!list.includes(item))
        list.push(item);
    return list;
}
const combineArrays = (a, b) => {
    b.forEach(e => addIfNotPresent(e, a));
    return a;
}
let DIM = 4;
const rcToId = (r, c) => r * DIM + c;
function App() {
    return (
        <div className="App">
            <header className="App-header">
                <GameProvider>
                    <Game />
                </GameProvider>
            </header>
        </div>
    );
}
const GameContext = createContext();
const GameProvider = ({ children }) => {
    const initGameState = () => repeat(DIM, rowIndex => repeat(DIM, colIndex =>
    ({
        key: rcToId(rowIndex, colIndex),
        value: -1,
        operation: "",
        cellNeighbors: [],
        isPencil: false
    })));
    const generatePuzzle = () => {
        const gameState = initGameState();
        const getCell = x => gameState[Math.floor(x / DIM)][x % DIM];
        const findPossibleNumbers = (r, c, state) => {
            const conflictRow = state[r];
            const conflictCol = repeat(DIM, index => state[index][c]);
            // console.log(conflictRow, conflictCol);
            return repeat(DIM, index =>
                conflictRow.includes(index + 1) || conflictCol.includes(index + 1) ?
                    false : index + 1
            ).filter(x => x);
        }
        // console.log(findPossibleNumbers(0, 1));
        const generateValidNumbers = () => {
            let solution, answerFucked;
            while (true) {
                solution = repeat(DIM, () => repeat(DIM, () => 0));
                answerFucked = false;
                outerloop:
                for (let i = 0; i < DIM; i++) {
                    for (let j = 0; j < DIM; j++) {
                        const possibleNumbers = findPossibleNumbers(i, j, solution);
                        // console.log(possibleNumbers)
                        if (possibleNumbers.length === 0) {
                            answerFucked = true;
                            solution = repeat(DIM, () => repeat(DIM, () => 0));
                            break outerloop;
                        }
                        solution[i][j] = possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];
                        // console.log(i, j, possibleNumbers, solution[i][j]);
                    }
                }
                if (!answerFucked)
                    break;
            }
            // apply to gameState
            repeat(DIM, rowIndex => repeat(DIM, colIndex => gameState[rowIndex][colIndex].value = solution[rowIndex][colIndex]));
            return solution;

        }
        const findPossibleOperations = (nums) => {
            if (nums.length === 1)
                return ["" + nums[0]];
            let possibleOperations = [];
            // multipulation
            possibleOperations = addIfNotPresent(nums.reduce((a, b) => a * b, 1) + "×", possibleOperations);
            // addition
            possibleOperations = addIfNotPresent(nums.reduce((a, b) => a + b, 0) + "+", possibleOperations);
            if (nums.length === 2) {
                const [small, large] = [Math.min(...nums), Math.max(...nums)];
                // division 
                if (large % small === 0) {
                    possibleOperations = addIfNotPresent(large / small + "÷", possibleOperations);
                }
                // subtraction
                possibleOperations = addIfNotPresent(large - small + "-", possibleOperations);
            }
            return possibleOperations;

        }
        const generateBounds = () => {
            const generateBitMap = freq => repeat(DIM, () => repeat(DIM - 1, () => Math.random() >= freq));
            let horizontal = generateBitMap(0.6), vertical = generateBitMap(0.85);
            // horizontal = horizontal.map(row => (row.every(x => x) ? repeat(DIM - 1, () => Math.random() >= 0.7) : row));
            // vertical = vertical.map(row => (row.every(x => x) ? repeat(DIM - 1, () => Math.random() >= 0.7) : row));
            const updateAllNeighbors = (id) => {
                let pending = [id], visited = [];
                while (pending.length > 0) {
                    const current = pending.pop();
                    if (current === undefined)
                        break;
                    // console.log("P", pending, current)
                    if (!visited.includes(current)) {
                        visited = addIfNotPresent(current, visited);
                        pending = combineArrays(pending, getCell(current).cellNeighbors);
                        // console.log("A", pending, visited);
                    }


                }
                // console.log(id, visited);
                visited.forEach(elem => getCell(elem).cellNeighbors = visited);

            }
            const addNeighbor = (neighbor, r, c) => gameState[r][c].cellNeighbors = addIfNotPresent(neighbor, gameState[r][c].cellNeighbors)
            // apply to gameState
            repeat(DIM, rowIndex => repeat(DIM - 1, leftIndex => {
                const rightIndex = leftIndex + 1;
                if (vertical[rowIndex][leftIndex]) {
                    addNeighbor(rcToId(rowIndex, rightIndex), rowIndex, leftIndex);
                    addNeighbor(rcToId(rowIndex, leftIndex), rowIndex, rightIndex);
                    updateAllNeighbors(rcToId(rowIndex, leftIndex));
                }
            }));
            repeat(DIM - 1, topIndex => repeat(DIM, colIndex => {
                const bottomIndex = topIndex + 1;
                if (horizontal[colIndex][topIndex]) {
                    addNeighbor(rcToId(bottomIndex, colIndex), topIndex, colIndex);
                    addNeighbor(rcToId(topIndex, colIndex), bottomIndex, colIndex);
                    updateAllNeighbors(rcToId(topIndex, colIndex));
                }
            }));
            // Singleton Fills
            repeat(DIM, rowIndex => repeat(DIM, colIndex => {
                addNeighbor(rcToId(rowIndex, colIndex), rowIndex, colIndex);
            }));
            // Corrections 
            repeat(DIM, rowIndex => repeat(DIM, colIndex => {
                if (gameState[rowIndex][colIndex].cellNeighbors.length === 1) {
                    const currentId = rcToId(rowIndex, colIndex);
                    const neighbors = [
                        currentId < DIM ? -1 : currentId - DIM, // top
                        currentId % DIM === DIM - 1 ? -1 : currentId + 1, // right
                        currentId >= DIM * (DIM - 1) ? -1 : currentId + DIM, // bottom
                        currentId % DIM === 0 ? -1 : currentId - 1, // left
                    ].filter(x => x >= 0 && getCell(x).cellNeighbors.length === 1);

                    // console.log("smol corrections", neighbors, gameState[rowIndex][colIndex].cellNeighbors)
                    neighbors.forEach(neighbor => addNeighbor(neighbor, Math.floor(currentId / DIM), currentId % DIM));
                    updateAllNeighbors(currentId);
                    // console.log("smol after", gameState[rowIndex][colIndex].cellNeighbors)
                }
            }));
            repeat(DIM, rowIndex => repeat(DIM, colIndex => {
                if (gameState[rowIndex][colIndex].cellNeighbors.length > DIM * 0.75) {
                    const currentId = rcToId(rowIndex, colIndex);
                    const neighbors = [
                        currentId < DIM ? -1 : currentId - DIM, // top
                        currentId % DIM === DIM - 1 ? -1 : currentId + 1, // right
                        currentId >= DIM * (DIM - 1) ? -1 : currentId + DIM, // bottom
                        currentId % DIM === 0 ? -1 : currentId - 1, // left
                    ].filter(x => x >= 0 && gameState[rowIndex][colIndex].cellNeighbors.includes(x));

                    const [otherRoot, ...others] = gameState[rowIndex][colIndex].cellNeighbors.filter(x => !neighbors.includes(x) && x !== currentId);
                    // console.log("big corrections", currentId, neighbors, gameState[rowIndex][colIndex].cellNeighbors, others);

                    gameState[rowIndex][colIndex].cellNeighbors.forEach(neighbor => {
                        if (neighbor !== currentId)
                            getCell(neighbor).cellNeighbors = [];
                    });
                    gameState[rowIndex][colIndex].cellNeighbors = [];
                    neighbors.forEach(neighbor => {
                        addNeighbor(neighbor, Math.floor(currentId / DIM), currentId % DIM);
                    });
                    others.forEach(neighbor => {
                        addNeighbor(neighbor, Math.floor(otherRoot / DIM), otherRoot % DIM);
                    });
                    updateAllNeighbors(currentId);
                    updateAllNeighbors(otherRoot)
                    // console.log("big after", gameState[rowIndex][colIndex].cellNeighbors, getCell(otherRoot).cellNeighbors)
                }
            }));
        }
        const generateOperations = () => {
            repeat(DIM, rowIndex => repeat(DIM, colIndex => {
                const currentId = rcToId(rowIndex, colIndex);
                if (currentId === Math.min(...getCell(currentId).cellNeighbors)) {
                    const possibleOperations = findPossibleOperations(getCell(currentId).cellNeighbors.map(x => getCell(x).value));
                    getCell(currentId).operation = possibleOperations[Math.floor(Math.random() * possibleOperations.length)];
                }
            }));
        }
        const solution = generateValidNumbers();
        generateBounds();
        generateOperations();
        repeat(DIM, rowIndex => repeat(DIM, colIndex => {
            gameState[rowIndex][colIndex].value = -1;
        }));
        return { gameState, solution };
    }

    let { gameState: gs, solution: sol } = generatePuzzle();
    const [gameState, setGameState] = useState(gs);
    const [solution, setSolution] = useState(sol);
    const [isGameOver, setGameOver] = useState(false);

    const [inputState, setInputState] = useState({ isPencil: false, value: -1 });
    const getCellData = id => {
        // console.log(id, Math.floor(id / DIM), id % DIM, gameState)
        return gameState[Math.floor(id / DIM)][id % DIM];
    }
    const setCellData = (id, data) => {
        let newGameState = JSON.parse(JSON.stringify(gameState));
        // console.log(data)
        newGameState[Math.floor(id / DIM)][id % DIM] = data;
        setGameState(newGameState);
        // check victory status
        let victory = true;
        outerloop:
        for (let i = 0; i < DIM; i++) {
            for (let j = 0; j < DIM; j++) {
                const currentCell = newGameState[i][j];
                // console.log(currentCell);
                if (currentCell.isPencil || currentCell.value < 1) {
                    // console.log("C1", currentCell, id, data)
                    victory = false;
                    break outerloop;
                }
                if (Math.min(...currentCell.cellNeighbors) === rcToId(i, j)) {
                    const nums = currentCell.cellNeighbors.map(x => newGameState[Math.floor(x / DIM)][x % DIM].value);
                    if (nums.length === 1) {
                        if (nums[0] != currentCell.operation) {
                            // console.log("C2", currentCell, nums[0], currentCell.operation)

                            victory = false;
                            break outerloop;
                        }
                        continue;
                    }
                    let [operator, ...operand] = currentCell.operation.split("").reverse().join("");
                    operand = parseInt(operand.reverse().join(""));
                    // console.log(operand, operator);
                    if (operator === "+") {
                        if (nums.reduce((a, b) => a + b, 0) !== operand) {
                            // console.log("C3")

                            victory = false;
                            break outerloop;
                        }
                    } else if (operator === "×") {
                        if (nums.reduce((a, b) => a * b, 1) !== operand) {
                            // console.log("C4")

                            victory = false;
                            break outerloop;
                        }
                    } else {
                        const [small, large] = [Math.min(...nums), Math.max(...nums)];
                        if (operator === "÷") {
                            if (large % small !== 0 || large / small !== operand) {
                                // console.log("C5")

                                victory = false;
                                break outerloop;
                            }
                        }
                        if (operator === "-") {
                            if (large - small !== operand) {
                                // console.log("C6")

                                victory = false;
                                break outerloop;
                            }
                        }
                    }
                }
            }
        }
        if (victory)
            setGameOver(victory);
    }
    const refreshPuzzle = () => {
        let { gameState, solution } = generatePuzzle();
        setGameState(gameState);
        setSolution(solution);
    }

    return (<GameContext.Provider value={{
        gameState,
        setGameState,
        getCellData,
        setCellData,
        inputState,
        setInputState,
        refreshPuzzle,
        isGameOver
    }}>
        {children}
    </GameContext.Provider>)
}
const Game = () => {
    const { refreshPuzzle, isGameOver } = useContext(GameContext);
    const [dimState, setDimState] = useState(DIM);
    return (
        <>
            <div>
                <div style={{ float: "left", fontSize: 16 }}>Dimension: {dimState}</div>
                <input type="range" min="1" max="15" style={{ float: "left" }} value={dimState} onChange={(e) => setDimState(parseInt(e.target.value))}></input>
                <button className="round-button" style={{ float: "left" }} onClick={() => { DIM = dimState; refreshPuzzle() }}>⟳ New KenKen</button>
            </div>

            <Grid />
            {isGameOver &&
                <img src={victory_check} className="grow-anim" style={{ float: "right", width: 500, height: 500, position: "absolute" }} />
            }
            <InputBar />
        </>
    )
}
const Grid = () => {
    const { gameState } = useContext(GameContext);
    return (
        <div>
            {gameState.map(row =>
                <div key={"row-" + Math.random()}>
                    {
                        row.map(cell =>
                            <Box key={cell.key} id={cell.key} />)
                    }
                </div>)
            }
        </div>
    )
}
const InputBar = () => {
    const { inputState, setInputState } = useContext(GameContext);
    const { isPencil, value } = inputState;
    return (
        <div>

            <button className="round-button" onClick={() => setInputState({ ...inputState, isPencil: !isPencil })}>
                {isPencil ? "Pencil" : "Pen"}
            </button>
            {repeat(DIM, index =>
                <button
                    key={"input-" + (index + 1)}
                    value={index + 1}
                    className="round-button"
                    onClick={(e) => setInputState({ ...inputState, value: parseInt(e.target.value) })}
                    style={(index + 1 === value || (typeof value !== "number" && value.includes(index + 1))) ? { backgroundColor: "#14647a" } : {}}
                >
                    {index + 1}
                </button>
            )}
            {isPencil && <button className="round-button" onClick={() => setInputState({ ...inputState, value: repeat(DIM, index => index + 1) })}>[1-{DIM}]</button>}
            {isPencil && <button className="round-button" onClick={() => setInputState({ ...inputState, value: -1 })}>Clear</button>}
        </div>
    )
}
const Box = ({ id }) => {
    const dim = 100;
    const { getCellData, setCellData, inputState } = useContext(GameContext);
    // console.log(id, getCellData(id))
    const { key, value, cellNeighbors, operation } = getCellData(id);
    const { isPencil, value: inputValue } = inputState;
    const displayValue = () => {
        if (value < 0)
            return <div></div>;
        if (typeof value === "number")
            return <div style={{ position: "absolute", fontSize: dim - 40, left: 20, bottom: 0 }}>{value}</div>;
        else
            return <div style={{ position: "absolute", fontSize: dim - 40, left: 0, bottom: 0 }}>
                {/* {console.log(value)} */}
                {value.map((n, index) => <div
                    className="round-button"
                    style={{ padding: "0px 10px", float: "left" }}
                    onClick={() => { value.splice(index, 1); setCellData(id, { ...getCellData(id), value }) }}
                >{n}</div>)}
            </div>;

    }
    const displayOperation = () => {
        if (Math.min(...cellNeighbors) === key)
            return <div style={{ position: "absolute", left: 5, top: 0 }}>{operation}</div>
    }
    const calcBorder = () => {
        let borderWidthString = "", borderColorString = "";
        const neighbors = [
            key < DIM ? -1 : key - DIM, // top
            key % DIM === DIM - 1 ? -1 : key + 1, // right
            key >= DIM * (DIM - 1) ? -1 : key + DIM, // bottom
            key % DIM === 0 ? -1 : key - 1, // left
        ];
        neighbors.forEach(neighbor => borderWidthString += 4 * (neighbor < 0 ? 2 : 1) + "px ");
        // console.log(cellNeighbors)
        neighbors.forEach(neighbor =>
            borderColorString += (cellNeighbors.includes(neighbor)) ? "#2b2e35 " : "white "
        );
        return {
            borderWidth: borderWidthString.trim(),
            borderColor: borderColorString.trim(),
        }
    }
    // console.log(key, calcBorderWidth())
    return (
        <div style={{
            position: "relative",
            borderColor: "white",
            borderStyle: "solid",
            ...calcBorder(),
            width: dim,
            height: dim,
            float: "left"
        }}
            key={"box-" + key}
            onClick={() => {
                // console.log(typeof value, typeof inputValue)
                let tempValue;
                if (inputValue === -1)
                    tempValue = inputValue;
                else if (isPencil) {
                    if (typeof value === "number")
                        if (typeof inputValue === "number")
                            tempValue = [inputValue];
                        else
                            tempValue = inputValue;
                    else {
                        // console.log(combineArrays(inputValue[0], value))
                        if (typeof inputValue === "number")
                            tempValue = addIfNotPresent(inputValue, value);
                        else
                            tempValue = combineArrays(inputValue, value);
                        tempValue.sort();
                    }
                } else {
                    tempValue = inputValue;
                }
                setCellData(id, { ...getCellData(id), value: tempValue, isPencil });
            }}
        >
            {displayOperation()}
            {displayValue()}
        </div >
    )
}
export default App;