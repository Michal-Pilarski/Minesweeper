// TODO making bombs on first click, 
// html elements and listeners
let select = document.querySelector('#levels')
let area = document.querySelector('.tiles')
let bombsCount = document.querySelector('.bombs')
let timer = document.querySelector('.time')
select.addEventListener('change', func)

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
    // flag for first mouse left click
    let firstClick = false

    // defining how many tiles generate, and their size
    switch(level){
        case 'Easy':
            howManyTiles = 11
            bombsCount.textContent = 10
            tilesSize = 8
            break
        case 'Medium':
            howManyTiles = 21
            bombsCount.textContent = 20
            tilesSize = 4
            break
        case 'Hard':
            bombsCount.textContent = 30
            howManyTiles = 21
            tilesSize = 4
            break
        default:
            howManyTiles = 11
            bombsCount.textContent = 20
            tilesSize = 8
            break
    }

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
    att = `background-color:salmon; width:${tilesSize}%; height:${tilesSize}%; float:left; border: 0.1em solid; display: flex; justify-content: center; align-items: center;`
    leftClickAtt = `background-color:gray; width:${tilesSize}%; height:${tilesSize}%; float:left; border: 0.1em solid; display: flex; justify-content: center; align-items: center;`
    //styling for flags
    attFlag = 'width: 60%; height: 70%;'


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
                        if(bool){
                            clicked = true
                            // removing red tile and making new with tiles array value
                            divTiles[y][x].removeAttribute(att)
                            divTiles[y][x].setAttribute('style', leftClickAtt)
                            divTiles[y][x].innerHTML = tiles[y][x]
                        }
                        if(!firstClick){
                            // randomizing bombs and setting them in array
                            for(let k=0; k<bombsCount.textContent; k++) // number of bombs = number of flags
                            {   
                                let bombY = getRndInteger(1, howManyTiles-1)
                                let bombX = getRndInteger(1, howManyTiles-1)
                                tiles[bombY][bombX] = 'b'
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
                                        
                                        // if num = 0 we don't need to append anything to tiles arr
                                        if(num!=0){
                                            tiles[y2][x2] = num
                                        }
                                    }
                                }
                            }
                        }
                        console.log(tiles, y, x)
                        firstClick = true
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
