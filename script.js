
// html elements and listeners
let select = document.querySelector('#levels')
let area = document.querySelector('.tiles')
let bombsCount = document.querySelector('.bombs')
let timer = document.querySelector('.time')
tiles = []

select.addEventListener('change', func)

// attributes
const easyAttributes = document.createAttribute('style')
easyAttributes.value = 'background-color:salmon; width:60px; height:60px; float:left; border: 1px solid;'
const mediumAttributes = document.createAttribute('style')
mediumAttributes.value = 'background-color:salmon; width:40px; height:40px; float:left; border: 1px solid;'
const hardAttributes = document.createAttribute('style')
hardAttributes.value = 'background-color:salmon; width:20px; height:20px; float:left; border: 1px solid;'

// function call to create tiles on page refresh
func()


function func(){
    // listening on dropdown changes, means changing difficulty

    // resetting tiles array, and deleting all previous tiles
    tiles.length = 0
    area.innerHTML = ''

    // variables
    let level = select.value
    let att = easyAttributes
    let howManyTiles = 0

    // defining how many tiles generate, and their size
    switch(level){
        case 'Easy':
            howManyTiles = 50
            bombsCount.textContent = 20
            break
        case 'Medium':
            howManyTiles = 100
            bombsCount.textContent = 40
            att = mediumAttributes
            break
        case 'Hard':
            bombsCount.textContent = 120
            howManyTiles = 300
            att = hardAttributes
            break
    }

    // creating tiles in loop
    for(let i=0; i<=howManyTiles; i++)
    {   
        tiles[i] = document.createElement('div')
        tiles[i].setAttribute('style', att.value)
        area.appendChild(tiles[i])
    }
}


