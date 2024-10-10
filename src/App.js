import React, { useEffect, useState, useCallback } from 'react';
import { HexGrid, Layout, Hexagon } from 'react-hexgrid';
import NumberTile from './NumberTile';
import Port from './Port'; // You'll need to create this component
import './CustomStyles.css';

// Define terrain types with their respective counts
const terrainTypes = [
  'desert', // 1
  'grain', 'grain', 'grain', 'grain', // 4
  'sheep', 'sheep', 'sheep', 'sheep', // 4
  'wood', 'wood', 'wood', 'wood', // 4
  'ore', 'ore', 'ore', // 3
  'brick', 'brick', 'brick' // 3
];

// Define terrain colors
const terrainColors = {
  desert: { fill: '#f4a460', glow: 'rgba(244, 164, 96, 0.7)' },
  grain: { fill: '#daa520', glow: 'rgba(218, 165, 32, 0.7)' },
  sheep: { fill: '#90ee90', glow: 'rgba(144, 238, 144, 0.7)' },
  wood: { fill: '#228b22', glow: 'rgba(34, 139, 34, 0.7)' },
  ore: { fill: '#708090', glow: 'rgba(112, 128, 144, 0.7)' },
  brick: { fill: '#c24720', glow: 'rgba(194, 71, 32, 0.7)' },
};

// Define numbers for the tiles
const numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

// Define port types and their counts
const portTypes = [
  { type: 'any', count: 4 },
  { type: 'grain', count: 1 },
  { type: 'sheep', count: 1 },
  { type: 'wood', count: 1 },
  { type: 'ore', count: 1 },
  { type: 'brick', count: 1 },
];

function App() {
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const updateSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const generateBoard = useCallback(() => {
    const boardLayout = [
      { row: -2, count: 3, startQ: -1 },
      { row: -1, count: 4, startQ: -2 },
      { row: 0, count: 5, startQ: -3 },
      { row: 1, count: 4, startQ: -3 },
      { row: 2, count: 3, startQ: -3 },
    ];

    // Shuffle terrain types
    const shuffledTerrains = shuffleArray(terrainTypes);

    const hexagons = [];
    let terrainIndex = 0;

    // First, create all hexagons without numbers
    boardLayout.forEach(({ row, count, startQ }) => {
      for (let i = 0; i < count; i++) {
        const q = startQ + i;
        const terrain = shuffledTerrains[terrainIndex];
        const fillColor = terrainColors[terrain].fill;

        hexagons.push(
          <Hexagon 
            key={`${q},${row}`} 
            q={q} 
            r={row} 
            s={-q-row} 
            style={{ 
              fill: terrainColors[terrain].fill,
              '--glow-color': terrainColors[terrain].glow
            }}
            stroke="black" 
            strokeWidth={0.2}
            terrain={terrain}
            className='resource-hex'
          />
        );

        terrainIndex++;
      }
    });

    const isValidForSixOrEight = (row, col, hexagons) => {
      const adjacentCoords = [
        [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
        [row - 1, col + 1], [row + 1, col - 1]
      ];

      for (const [adjRow, adjCol] of adjacentCoords) {
        const adjacentHex = hexagons.find(hex => hex.props.r === adjRow && hex.props.q === adjCol);
        if (adjacentHex && (adjacentHex.props.number === 6 || adjacentHex.props.number === 8)) {
          return false;
        }
      }
      return true;
    };

    // Assign 6s and 8s
    const sixAndEights = shuffleArray([6, 6, 8, 8]);
    for (const number of sixAndEights) {
      let placed = false;
      while (!placed) {
        const randomIndex = Math.floor(Math.random() * hexagons.length);
        const hex = hexagons[randomIndex];
        if (hex.props.terrain !== 'desert' && !hex.props.number && isValidForSixOrEight(hex.props.r, hex.props.q, hexagons)) {
          hexagons[randomIndex] = React.cloneElement(hex, { number });
          placed = true;
        }
      }
    }

    // Assign remaining numbers
    const remainingNumbers = shuffleArray(numbers.filter(n => n !== 6 && n !== 8));
    hexagons.forEach((hex, index) => {
      if (hex.props.terrain !== 'desert' && !hex.props.number) {
        const number = remainingNumbers.pop();
        hexagons[index] = React.cloneElement(hex, { number });
      }
    });

    // Generate ports
    const ports = generatePorts();

    return { hexagons, ports };
  }, []);

  useEffect(() => {
    setBoard(generateBoard());
  }, [generateBoard]);

  function generatePorts() {
    const portPositions = [
      { q: -3, r: -1, dir: 'W' },
      { q: -1, r: -3, dir: 'NW' },
      { q: 1, r: -3, dir: 'NE' },
      { q: 2, r: -2, dir: 'E' },
      { q: 2, r: 0, dir: 'E' },
      { q: 0, r: 2, dir: 'SE' },
      { q: -2, r: 3, dir: 'SW' },
      { q: -4, r: 1, dir: 'W' },
      { q: -4, r: 3, dir: 'SW' },
    ];

    const shuffledPorts = shuffleArray(
      portTypes.flatMap(({ type, count }) => Array(count).fill(type))
    );

    return portPositions.map((position, index) => ({
      ...position,
      type: shuffledPorts[index],
    }));
  }

  // Add this new function to handle board regeneration
  const handleRegenerateBoard = () => {
    setBoard(generateBoard());
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div className="App">
      <h1 className="title">Catan Board Generator</h1>
      <div className="board-container">
        <HexGrid width={viewportSize.width * 0.9} height={viewportSize.height * 0.7}>
          <Layout 
            size={{ x: 8.5, y: 8.5 }} 
            flat={false} 
            spacing={1.075} 
            origin={{ x: 15, y: 0 }}
          >
            {board.hexagons.map((hex, index) => React.cloneElement(hex, {
              children: hex.props.number && <NumberTile number={hex.props.number} />
            }))}
            {board.ports.map((port, index) => (
              <Port key={index} q={port.q} r={port.r} type={port.type} direction={port.dir} />
            ))}
          </Layout>
        </HexGrid>
      </div>
      <button onClick={handleRegenerateBoard} className="regenerate-button">
        Regenerate Board
      </button>
    </div>
  );
}

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default App;