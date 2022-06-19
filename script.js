// TODO game ending div, with time, 

// html elements and listeners
let select = document.querySelector('#levels')
let area = document.querySelector('.tiles')
let bombsCount = document.querySelector('.bombs')
let minutes = document.querySelector('.minutes')
let seconds = document.querySelector('.seconds')
select.addEventListener('change', func)


//time handling
let interval = 0
let sec = 0
let min = 0
function timer(){
    sec++

    if(sec<10){
        seconds.textContent = `0${sec}`
    }
    else if(sec<60){
        seconds.textContent = `${sec}`
    }
    else{
        sec = 0
        min++
        seconds.textContent = '00'
        minutes.textContent = `${min}`
    }
}

function timerStop(){
    sec = 0
    min = 0
    seconds.textContent = '00'
    minutes.textContent = '0'
    clearInterval(interval)
}

// function call to create tiles on page refresh
func()


function func(){
    // listening on dropdown changes, means changing difficulty
    // resetting everything under when difficulty changes

    // resetting tiles array, and deleting all previous tiles
    //tiles.length = 0
    area.innerHTML = ''

    // variables
    let level = select.value
    let att = ''
    let howManyTiles = 0
    let tilesSize = 0
    let numColor = 'black'  // color changing border too
    // flag for first mouse left click
    let firstClick = false

    // defining how many tiles generate, and their size
    switch(level){
        case 'Easy':
            timerStop()
            howManyTiles = 11
            bombsCount.textContent = 10
            tilesSize = 8
            break
        case 'Medium':
            timerStop()
            howManyTiles = 21
            bombsCount.textContent = 5
            tilesSize = 4
            break
        case 'Hard':
            timerStop()
            bombsCount.textContent = 30
            howManyTiles = 21
            tilesSize = 4
            break
        default:
            timerStop()
            howManyTiles = 11
            bombsCount.textContent = 20
            tilesSize = 8
            break
    }

    // to check if all tiles are clicked excluding bomb tiles
    let tilesRemain = Math.pow(howManyTiles-1, 2) - bombsCount.textContent
    //console.log(tilesRemain)

    // create two 2d arrays, one for divs, and one for setting bombs, and numbers
    // arrays a little bigger to prevent errors on clicking in border tiles
    // divTiles -> only div with click listeners
    // tiles -> bombs and numbers around
    let divTiles = new Array(howManyTiles+1)
    let tiles = new Array(howManyTiles+1)
    for (let i=0; i < divTiles.length; i++){
        divTiles[i] = new Array(howManyTiles+1)
        tiles[i] = new Array(howManyTiles+1)
    }


    // styling for divTiles
    att = `background-color:salmon; width:${tilesSize}%; height:${tilesSize}%; float:left; border: 0.05em solid; display: flex; justify-content: center; align-items: center; `
    leftClickAtt = `background-color:gray; color:${numColor}; width:${tilesSize}%; height:${tilesSize}%; float:left; border: 0.05em solid; display: flex; justify-content: center; align-items: center;`
    //styling for flags
    attFlag = 'width: 60%; height: 70%;'
    attBomb = 'width: 60%; height: 70%; background-color: red'


    // creating divTiles in loop
    for(let y=1; y<howManyTiles; y++)
    {   
        for(let x=1; x<howManyTiles; x++)
        {   
            // creating empty tile div
            divTiles[y][x] = document.createElement('div')
            // adding css to tile
            divTiles[y][x].setAttribute('style', att)
            // appending tile to area
            area.appendChild(divTiles[y][x])
            
            // flag needed to prevent mutiple flag creation
            let bool = true
            // flag needed to stop putting flags when tile left clicked
            let clicked = false

            // mouse click detection
            divTiles[y][x].addEventListener('mousedown', (e) =>{
                switch (e.button) {
                    case 0: // left click
                        if(!firstClick){
                            // randomizing bombs and setting them in array
                            let k = bombsCount.textContent
                            while(k > 0) // number of bombs = number of flags
                            {   
                                let bombY = getRndInteger(1, howManyTiles-1)
                                let bombX = getRndInteger(1, howManyTiles-1)
                                if(bombX != x || bombY != y){
                                    tiles[bombY][bombX] = 'b'
                                    k--
                                }
                            }
                            // new double loop for setting numbers only
                            for(let y2=1; y2<howManyTiles; y2++)
                            {   
                                for(let x2=1; x2<howManyTiles; x2++)
                                { 
                                    // creating numbers around bombs (checking how many bombs are around)
                                    if(tiles[y2][x2] != 'b'){
                                        let num = 0
                                        //right
                                        if(tiles[y2][x2+1] == 'b'){num++}
                                        //left
                                        if(tiles[y2][x2-1] == 'b'){num++}
                                        //down
                                        if(tiles[y2+1][x2] == 'b'){num++}
                                        //up
                                        if(tiles[y2-1][x2] == 'b'){num++}
                                        //right down
                                        if(tiles[y2+1][x2+1] == 'b'){num++}
                                        // right up
                                        if(tiles[y2-1][x2+1] == 'b'){num++}
                                        // left down
                                        if(tiles[y2+1][x2-1] == 'b'){num++}
                                        // left up
                                        if(tiles[y2-1][x2-1] == 'b'){num++}
                                        
                                        // if num = 0 we don't need to append anything to tiles arr, only delete undefined string
                                        if(num!=0){
                                            tiles[y2][x2] = num
                                        }
                                        else{
                                            tiles[y2][x2] = ' '
                                        }
                                    }
                                }
                            }
                            // timer start
                            interval = setInterval(timer, 1000)
                        }
                        if(bool){
                            clicked = true
                            // removing red tile and making new with tiles array value
                            if(tiles[y][x] == ' '){
                                clickedTile(divTiles[y][x], tiles[y][x], leftClickAtt)
                                revealTiles(y, x, divTiles, tiles, leftClickAtt)
                                winCheck(divTiles, tiles, howManyTiles, tilesRemain)
                            }
                            else if(tiles[y][x] == 'b'){
                                explosion(divTiles, tiles, howManyTiles, attBomb)
                            }
                            else if(tiles[y][x] != 'b'){
                                clickedTile(divTiles[y][x], tiles[y][x], leftClickAtt)
                                winCheck(divTiles, tiles, howManyTiles, tilesRemain)
                            }
                        }
                        //winCheck(divTiles, tiles, howManyTiles, tilesRemain)
                        firstClick = true
                        console.log(tiles, y, x)
                        break
                    case 2: // right click
                        if(!clicked){
                            if(bool){
                                //making flag on right click
                                let flag = document.createElement('img')
                                flag.src = "images/flag_icon.png"
                                flag.setAttribute('style', attFlag)
                                divTiles[y][x].appendChild(flag)
                                bool = false
                                //flags counter
                                bombsCount.textContent--
                            }
                            else{
                                divTiles[y][x].innerHTML = ''
                                bool = true
                                bombsCount.textContent++
                            }
                        }
                        break
                }
            })



        }
        // row clear
        let clear = document.createElement('div')
        clear.setAttribute('style', 'clear:both;')
        area.appendChild(clear)
    }

    console.log(tiles)
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }


function clickedTile(divTile, tile, newAttribute){
    let oldAttribute =  divTile.getAttribute('style')
    divTile.removeAttribute(oldAttribute)
    divTile.setAttribute('style', newAttribute)
    divTile.innerHTML = tile

}

// if tile without value has been hitted
// loop switching directions randomly and 'clicking' tile is not gray and if innerHTML of component is space
// checking right, then up/down, then right/left, then up/down untill steps=0
function revealTiles(pos_y, pos_x, divTiles, tiles, newAttribute){
    let steps = 700
    // directions
    // 1 - right  2 - left
    // 3 - up   4 - down
    let direction = 1

    while(steps>0){
        // 8 step loop to uncover first numbers around empty tiles
        for(let i=1; i<9; i++){
            switch(direction){
                case 1: //right
                    if(tiles[pos_y][pos_x+1] == ' '){ 
                        pos_x++ 
                        clickedTile(divTiles[pos_y][pos_x], tiles[pos_y][pos_x], newAttribute)
                        steps--
                        direction = getRndInteger(3, 4)
                    }
                    else if(tiles[pos_y][pos_x+1] == i ){
                        pos_x++ 
                        clickedTile(divTiles[pos_y][pos_x], tiles[pos_y][pos_x], newAttribute)
                        pos_x--
                        steps--
                        direction = getRndInteger(3, 4)
                    }
                    else{
                        direction = getRndInteger(3, 4)
                    }
                    break
                case 2: //left
                    if(tiles[pos_y][pos_x-1] == ' ' ){ //left
                        pos_x-- 
                        clickedTile(divTiles[pos_y][pos_x], tiles[pos_y][pos_x], newAttribute)
                        steps--
                        direction = getRndInteger(3, 4)
                    }
                    else if(tiles[pos_y][pos_x-1] == i){
                        pos_x-- 
                        clickedTile(divTiles[pos_y][pos_x], tiles[pos_y][pos_x], newAttribute)
                        pos_x++
                        steps--
                        direction = getRndInteger(3, 4)
                    }
                    else{
                        direction = getRndInteger(3, 4)
                    }
                    break
                case 3: //up
                    if(tiles[pos_y+1][pos_x] == ' '){ // up
                        pos_y++ 
                        clickedTile(divTiles[pos_y][pos_x], tiles[pos_y][pos_x], newAttribute)
                        steps--
                        direction = getRndInteger(1, 2)
                    }
                    else if(tiles[pos_y+1][pos_x] == i){
                        pos_y++ 
                        clickedTile(divTiles[pos_y][pos_x], tiles[pos_y][pos_x], newAttribute)
                        pos_y--
                        steps--
                        direction = getRndInteger(1, 2)
                    }
                    else{
                        direction = getRndInteger(1, 2)
                    }
                    break
                case 4: // down
                    if(tiles[pos_y-1][pos_x] == ' '){ // down
                        pos_y-- 
                        clickedTile(divTiles[pos_y][pos_x], tiles[pos_y][pos_x], newAttribute)
                        steps--
                        direction = getRndInteger(1, 2)
                    }
                    else if(tiles[pos_y-1][pos_x] == i){
                        pos_y-- 
                        clickedTile(divTiles[pos_y][pos_x], tiles[pos_y][pos_x], newAttribute)
                        pos_y++
                        steps--
                        direction = getRndInteger(1, 2)
                    }
                    else{
                        direction = getRndInteger(1, 2)
                    }
                    break
                default:
                    steps = 0
                    break
            }
        }
    }
}


function explosion(divTiles, tiles, HowManyTiles, att){
    for(let y=1; y<HowManyTiles; y++)
    {   
        for(let x=1; x<HowManyTiles; x++){
            if(tiles[y][x] == 'b'){
                let bomb = document.createElement('img')
                bomb.src = "images/bomb.png"
                bomb.setAttribute('style', att)
                divTiles[y][x].appendChild(bomb)
            }
        }
    }

}

// make win function and implement it in empty tile hit as well
function winCheck(divTiles, tiles, HowManyTiles, tilesRemain){
    for(let y=1; y<HowManyTiles; y++)
    {   
        for(let x=1; x<HowManyTiles; x++){
            if(divTiles[y][x].style.backgroundColor == 'gray'){ 
                console.log(tilesRemain)
                tilesRemain-- 
            }
        }
    }
    if(tilesRemain < 1){
        alert('win')
    }

}
