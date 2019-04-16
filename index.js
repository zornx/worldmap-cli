var blessed = require('blessed'), contrib = require('blessed-contrib');
const getCountries = require('./utils/countriesCoordinates');
const countries = getCountries();

module.exports = (args) => {
  // Create screen
  var screen = createScreen();

  // Create grid layout
  var grid = createGridLayout(screen);
  
  // Create world map
  createMap(grid, countries[1][3], countries[1][2]);

  // Create table
  createTable(grid, screen);

  // Set keys
  setKeys(grid, screen);
  
  // Render the screen.
  screen.render();
}

function createScreen(){
  var screen = blessed.screen({
    smartCSR: true,
    useBCE: true,
    cursor: {
        artificial: true,
        blink: true,
        shape: 'underline'
    },
    log: `${__dirname}/application.log`,
    debug: true,
    dockBorders: true
  });
  
  screen.title = 'World Map';

  return screen;
};

function createGridLayout(screen){
  var grid = new contrib.grid({rows: 10, cols: 1, screen: screen})

  return grid;
}

function createMap(grid, lon, lat){  
  contrib.map()

  var map = grid.set(0, 0, 7, 1, contrib.map, {label: 'World Map CLI (Press Esc, q or ctrl + c to exit)'});
  map.addMarker({"lon" : lon, "lat" : lat, color: "red", char: "X" })

  return map;
}

function createTable(grid, screen){
  var table = grid.set(7, 0, 3, 1, contrib.table, 
    { keys: true
    , fg: 'white'
    , selectedFg: 'black'
    , selectedBg: '#00875f'
    , interactive: true
    , align: 'left'
    , label: 'List of countries (Total: ' + (countries.length  - 1) + ')'
    , width: '100%'
    , height: '100%'
    , border: {type: "line", fg: "white"}
    , columnSpacing: 5
    , columnWidth: [20, 40, 20, 20]});

  table.focus();

  table.rows.on('select', (item, index) => {
    createMap(grid, countries[index + 1][3], countries[index + 1][2]);
    screen.render();
  });

  table.setData(
    { headers: countries[0]
    , data: deleteTableHeader(countries) })

  return table;
}

function deleteTableHeader(matrix) {
  matrix = matrix.slice(0);
  matrix.splice(0, 1);
  return matrix;
}

function setKeys(grid, screen){
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });
};