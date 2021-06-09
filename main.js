


// #region GAME LOGIC AND DATA
// DATA
let clickcount= 0 
let height = 120
let width = 100
let inflationRate= 20
let maxsize = 300
let currentPopCount = 0
let highestPopCount = 0
let disabledKey = "disabled"
let gameLength = 10000
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}
let currentcolor = "red"
let possibleColors = ["green", "blue", "purple", "pink", "red"]

function startGame(){
  document.getElementById("gamecontrols").classList.remove("hidden")
  document.getElementById("maincontrols").classList.add("hidden")
  document.getElementById("scoreboard").classList.add("hidden")

  startClock()
  setTimeout(stopGame, gameLength)
}

function startClock(){
  timeRemaining = gameLength
  drawclock()
  clockId = setInterval(drawclock, 1000)
  
 }
 
function inflate() {
  clickcount++
  height += inflationRate
  width += inflationRate
  checkBalloonPop()
  draw()
}

function checkBalloonPop(){
  if(height >= maxsize){ 
    console.log("pop the balloon")
    let balloonElement = document.getElementById("balloon")
    balloonElement.classList.remove(currentcolor)
    getRandomColor()
    balloonElement.classList.add(currentcolor)

    document.getElementById("popsound").play()

    currentPopCount++
    height = 0
    width = 0
  }
}

function getRandomColor(){
  let i = Math.floor(Math.random() * possibleColors.length) 
  currentcolor = possibleColors[i]//0-1
}

function draw(){
  let balloonElement = document.getElementById("balloon")
  let clickcountelm = document.getElementById("click-count")
  let popcountElm = document.getElementById("pop-count")
  let highestPopCountElm = document.getElementById("high-pop-count")
  let playerNameElm = document.getElementById("player-name")
  
  balloonElement.style.height = height + "px"
  balloonElement.style.width = width + "px"
  
  clickcountelm.innerText = clickcount.toString()
  popcountElm.innerText = currentPopCount.toString()
  highestPopCountElm.innerText = currentPlayer.topScore.toString()
  playerNameElm.innerText = currentPlayer.name
}

function stopGame(){
  console.log("Game is Over")

  document.getElementById("maincontrols").classList.remove("hidden")
  document.getElementById("scoreboard").classList.remove("hidden")
  document.getElementById("gamecontrols").classList.add("hidden")


  clickcount = 0
  height = 120
  width = 100

  if(currentPopCount > currentPlayer.topScore){
    currentPlayer.topScore = currentPopCount
    savePlayers()
  }

  currentPopCount = 0
  
  stopclock()
  draw()
  drawScoreboard()
}

function stopclock(){
  clearInterval(clockId)
}

function drawclock(){
let countdownelm = document.getElementById("countdown")
countdownelm.innerText = (timeRemaining / 1000).toString()
timeRemaining -= 1000
}
// #endregion


let players = []
loadPlayers()

function setPlayer(event) {
  event.preventDefault()
  let form = event.target

  let playerName = form.playerName.value

  currentPlayer = players.find(player => player.name == playerName)

  if(!currentPlayer){
    currentPlayer = { name: playerName, topScore: 0}
    players.push(currentPlayer)
    savePlayers()
  }

  console.log(currentPlayer)
  form.reset()
  document.getElementById("game").classList.remove("hidden")
  form.classList.add("hidden")
  draw()
  drawScoreboard()

}

function changePlayer(){
  document.getElementById("playerForm").classList.remove("hidden")
  document.getElementById("game").classList.add("hidden")
}

function savePlayers(){
  window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers(){
  let playersData = JSON.parse(window.localStorage.getItem("players"))
  if(playersData){
    players = playersData
  }
}

function drawScoreboard(){
  let template = ""

players.sort((p1, p2)  => p2.topScore - p1.topScore)

  players.forEach(player => {
    template += `
    <div class="d-flex space-between">
        <span>
          <i class="fa fa-users"></i>
          ${player.name}
        </span>
        <span>Score ${player.topScore}</span>
      </div>
    `
  })
  document.getElementById("players").innerHTML = template
}

drawScoreboard()