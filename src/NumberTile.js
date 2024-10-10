import React from 'react';
import { Text } from 'react-hexgrid';

const NumberTile = ({ number }) => {
  // Define probability colors
  const getProbabilityColor = (num) => {
    if (num === 6 || num === 8) return '#FF0000';  // Red for high probability
    return '#000000';  // Black for low probability
  };

  const circleRadius = 4;  // Reduced from 15
  const fontSize = 3;      // Reduced from 14
  const dotSize = 0.3;     // Reduced from 2
  const dotSpacing = 0.75;
  const lightTan = '#F5E8D3';  // Very light tan color

  // Calculate number of dots
  const getDots = (num) => {
    const dots = [];
    const count = 6 - Math.abs(7 - num);
    const totalWidth = (count - 1) * dotSpacing;
    const startX = -totalWidth / 2;

    for (let i = 0; i < count; i++) {
      dots.push(
        <circle 
          key={i} 
          cx={startX + i * dotSpacing} 
          cy="1.75" 
          r={dotSize} 
          fill="black"
          stroke="none"
        />
      );
    }
    return dots;
  };

  return (
    <g>
      <circle r={circleRadius} fill={lightTan} />
      <Text fontSize={fontSize} y="0.5" fill={getProbabilityColor(number)} stroke="none">{number}</Text>
      <g fill={getProbabilityColor(number)}>
        {getDots(number)}
      </g>
    </g>
  );
};

export default NumberTile;