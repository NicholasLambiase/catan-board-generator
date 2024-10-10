import React from 'react';
import { Hexagon } from 'react-hexgrid';

const Port = ({ q, r, type, direction }) => {
  const getPortIcon = () => {
    switch (type) {
      case 'any':
        return (
          <g transform="translate(-3.75, 0) scale(0.015)">
            <polygon points="250,10 490,490 10,490" fill="#f0f0f0" stroke="#000" strokeWidth="20"/>
            <text x="250" y="350" fontSize="120" textAnchor="middle" fill="#000">3:1</text>
          </g>
        );
      case 'grain':
        return (
          <g transform="translate(-3.75, 0) scale(0.015)">
            <polygon points="250,10 490,490 10,490" fill="#f1c40f" stroke="#000" strokeWidth="20"/>
            <path d="M150 350 Q250 100 350 350 Z" fill="#e67e22" stroke="#000" strokeWidth="10"/>
          </g>
        );
      case 'sheep':
        return (
          <g transform="translate(-3.75, 0) scale(0.015)">
            <polygon points="250,10 490,490 10,490" fill="#2ecc71" stroke="#000" strokeWidth="20"/>
            <circle cx="250" cy="300" r="100" fill="#ecf0f1"/>
            <circle cx="220" cy="270" r="20" fill="#000"/>
          </g>
        );
      case 'wood':
        return (
          <g transform="translate(-3.75, 0) scale(0.015)">
            <polygon points="250,10 490,490 10,490" fill="#27ae60" stroke="#000" strokeWidth="20"/>
            <rect x="200" y="250" width="100" height="200" fill="#795548"/>
            <polygon points="250,100 350,250 150,250" fill="#27ae60"/>
          </g>
        );
      case 'ore':
        return (
          <g transform="translate(-3.75, 0) scale(0.015)">
            <polygon points="250,10 490,490 10,490" fill="#95a5a6" stroke="#000" strokeWidth="20"/>
            <polygon points="200,250 300,250 350,350 300,450 200,450 150,350" fill="#7f8c8d"/>
          </g>
        );
      case 'brick':
        return (
          <g transform="translate(-3.75, 0) scale(0.015)">
            <polygon points="250,10 490,490 10,490" fill="#e74c3c" stroke="#000" strokeWidth="20"/>
            <rect x="180" y="280" width="140" height="60" fill="#c0392b"/>
            <rect x="180" y="350" width="140" height="60" fill="#c0392b"/>
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <Hexagon q={q} r={r} s={-q-r} className={`port ${type} ${direction}`} fill="transparent" stroke="none">
      <g transform={`rotate(${direction === 'W' ? 270: direction === 'NW' ? 330 : direction === 'NE' ? 30 : direction === 'E' ? 90 : direction === 'SE' ? 150 : direction === 'S' ? 240 : direction === 'SW' ? 210 : 360})`}>
        {getPortIcon()}
        <polygon points="0,-10 8,-5 8,5 0,10 -8,5 -8,-5" fill="transparent" stroke="none"/>
      </g>
    </Hexagon>
  );
};

export default Port;