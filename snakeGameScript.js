if(!JSON.parse(localStorage.getItem("notFirst"))){
  localStorage.setItem("scores",JSON.stringify([]))
  localStorage.setItem("notFirst",JSON.stringify(true))
}
const board = document.querySelector(".board"); 
const startScreen = document.querySelector(".start-screen"); 
const startButton = document.querySelector(".board .start-screen button");
const scoreValue= document.querySelector(".scores .value");
const highScoreValue= document.querySelector(".scores .highscore .value");
const scores=JSON.parse(localStorage.getItem("scores"))
  
const audio = new Audio("eat-sound.mp3")

highScoreValue.innerHTML=Math.max(...scores)

const startGame=()=>{
  board.innerHTML="";
  moveDirection="u"
  tailDirection=20;
  foodNodeIndex=999; 
  newCellDirection=+20;
  freeCellsIndexes=[];
  rightBorders= [399];
  leftBorders =[0];
  snakeBody=[234,254,274];
  snakeBodyBefore=[254,274,294];
  headIndex=snakeBody[0];
  isWon=0;
  isGameOver=0;
  score=0;
  gameSpeed=100;
  isHighscore=0;
  
  createBoard();
  const game = setInterval(()=>{  
    updateBoard()
    if(isGameOver){
      clearInterval(game)
      if(score>Math.max(...scores)){
        isHighscore=1
      }
      if(!scores.includes(score))scores.push(score)
      localStorage.setItem("scores",JSON.stringify(scores))
      showEndScreen()
    } 
  },gameSpeed);
}


function changeSpeed(){
  // TODO
}


function createBoard(){
  for(let i =0;i<400;i++){
    let div = document.createElement("div");
    div.classList.add("cell");
    board.appendChild(div);
    //div.innerHTML=i;
  
  }
  createFood(freeCellsIndexes);

  for(let i =20;i<381;i+=20){
    leftBorders.push(i)
    rightBorders.push(i-1)
  }
}//in order to build board cells at start 

function updateBoard(){
  for(i=0;i<snakeBody.length;i++){
    snakeBodyBefore[i]=snakeBody[i];
  } // cloning snakeBody array to save it
  
  headIndex=snakeBody[0];
  let tailIndexBefore=snakeBodyBefore[snakeBodyBefore.length-1];
  snakeBody.forEach(cell=>{
    board.children[cell].classList.remove("snake")
  })
  board.children[headIndex].classList.remove("head")
  board.children[snakeBody[snakeBody.length-1]].classList.remove("tail")
  switch(moveDirection){
    
    case "u":
      headIndex-=20;
      break;
    case "d":
      headIndex+=20;
      break;
    case "r":
      headIndex+=1;
      break;
    case "l":
      headIndex-=1;
      break;
  }

  if(!gameOver(headIndex)){

    for(let i=snakeBody.length-1;i>0;i--){
      snakeBody[i]=snakeBody[i-1];
    }

    snakeBody[0]=headIndex;
    
    snakeBody.forEach(cell=>{
      board.children[cell].classList.add("snake")
    })
    board.children[headIndex].classList.add("head")
    board.children[snakeBody[snakeBody.length-1]].classList.add("tail")

    newCellDirection=tailIndexBefore-snakeBody[snakeBody.length-1]


    if(snakeBody[0]==foodNodeIndex){
      eatFood(newCellDirection);
      audio.play()
    }

    
  }

  else{
    isGameOver=1;
    board.classList.add("gameover")
  }
}


function updateFreeCells(){
  freeCellsIndexes.length=0;
  const freeCells=document.querySelectorAll(".cell:not(.snake):not(.food")
  if(freeCells.length===0)isWon=1;
  else{
    freeCells.forEach(cell=>{
      freeCellsIndexes.push(getIndex(board,cell))
    })
  }
  
}

function gameOver(newHeadIndex){
  if (newHeadIndex>400 ||newHeadIndex<0) return 1
    
  if(rightBorders.includes(snakeBodyBefore[0])&moveDirection==="r"&newHeadIndex-snakeBodyBefore[0]===1)return 1
  else if(leftBorders.includes(snakeBodyBefore[0])&moveDirection==="l"&newHeadIndex-snakeBodyBefore[0]===-1) return 1
  
  if(snakeBody.includes(newHeadIndex)) return 1
  
  return 0
}

function createFood(indexList){
  updateFreeCells();
  if(foodNodeIndex!==999){
    board.children[foodNodeIndex].classList.remove("food");
  }
  let randomIndex=indexList[Math.floor(Math.random()*indexList.length)];
  board.children[randomIndex].classList.add("food");
  foodNodeIndex = randomIndex;
}//spawn a food randomly and remove last one

function eatFood(newCellDirection){
  createFood(freeCellsIndexes);
  snakeBody.push(snakeBody[snakeBody.length-1]+newCellDirection);
  score++;
  scoreValue.innerHTML=score;
}

function getIndex(parent,cell){
  return (Array.prototype.indexOf.call(parent.children,cell));
}//in order to get index number of any cell in the board


function winGame(){
  alert("Gerçekten bu kadar oynadın mı ?");
}

const moveInput =event=>{
  switch(event.key){
  case "w":
  case "ArrowUp":
    if(moveDirection!=="d")moveDirection="u";
    break;
  case "s":
  case "ArrowDown":  
    if(moveDirection!=="u")moveDirection="d";
    break;
  case "a":
  case "ArrowLeft":
    if(moveDirection!=="r")moveDirection="l";
    break;
  case "d":
  case "ArrowRight":
    if(moveDirection!=="l")moveDirection="r";
    break;
}
}
function showEndScreen(){
  board.innerHTML=""
  const scoreInfoText=document.createElement("p")
  const gameOverText=document.createElement("p")
  const gameOverButton=document.createElement("button") 
  gameOverText.classList.add("gameover-text")
  scoreInfoText.classList.add("new-text")
  gameOverButton.classList.add("gameover-button")
  board.appendChild(gameOverText)
  board.appendChild(scoreInfoText)
  console.log(score,scores)
  if(isHighscore) scoreInfoText.innerHTML=`New Highscore ! : ${Math.max(...scores)}`
  else scoreInfoText.innerHTML=`Score : ${score}`
  board.appendChild(gameOverButton)
  highScoreValue.innerHTML=Math.max(...scores)
  gameOverText.innerHTML="Game Over"
  gameOverButton.innerHTML="Restart"
  gameOverButton.addEventListener("click",restartGame)
}


function restartGame(){
  board.classList.remove("gameover")
  board.innerHTML="<div class='start-screen'><button onclick='startGame();'>Start</button></div>";
  scoreValue.innerHTML=0

}

startButton.addEventListener("click",startGame)
document.addEventListener("keydown",moveInput)


/* const manuelStop =event=>{
  if(event.key==="Enter") isGameOver=1
}
document.addEventListener("keydown",manuelStop)

 */
