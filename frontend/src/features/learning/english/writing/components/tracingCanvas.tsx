import { useState, useRef, useEffect } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const TracingCanvas = () => {
  const [selectedLetter, setSelectedLetter] = useState("A");
  const canvasRef = useRef(null);
  const pathCanvasRef = useRef(null); // Hidden canvas for path detection
  const containerRef = useRef(null); // Reference to the container div
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);

  // Draw the letter outlines manually (1D)
  const drawLetterOutlines = (ctx, letter, x, y, size, isDotted = false) => {
    if (isDotted) {
      ctx.setLineDash([13,20]);
    } else {
      ctx.setLineDash([]);
    }
    
    const lineWidth = isDotted ? 3 : 13;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isDotted ? "rgba(59, 59, 59, 0.64)" : "black";
    
    // Helper constants for sizing
    const width = size * 0.3;          // Standard letter width
    const height = size * 0.5;         // Standard letter height
    const stemX = x - width * 0.7;     // Left position for vertical stems
    const stemTopY = y - height/2;     // Top position for letters
    const stemBottomY = y + height/2;  // Bottom position for letters
    const crossbarY = y;               // Middle vertical position
    
    switch(letter) {
      case "A":
        // Left leg
        ctx.beginPath();
        ctx.moveTo(x, stemTopY);
        ctx.lineTo(x - width, stemBottomY);
        ctx.stroke();
        
        // Right leg
        ctx.beginPath();
        ctx.moveTo(x-2, stemTopY);
        ctx.lineTo(x + width, stemBottomY);
        ctx.stroke();
        
        // Crossbar
        ctx.beginPath();
        ctx.moveTo(x - width * 0.5, y);
        ctx.lineTo(x + width * 0.5, y);
        ctx.stroke();

        // Left leg
        ctx.beginPath();
        ctx.lineWidth=15;
        ctx.moveTo(x, stemTopY);
        ctx.lineTo(x - width, stemBottomY);
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Right leg
        ctx.beginPath();
        ctx.lineWidth=15;
        ctx.moveTo(x-2, stemTopY);
        ctx.lineTo(x + width, stemBottomY);
        ctx.stroke();
        
        // Crossbar
        ctx.beginPath();
        ctx.lineWidth=15;
        ctx.moveTo(x - width * 0.5, y);
        ctx.lineTo(x + width * 0.5, y);
        ctx.stroke();

        break;
        
      case "B":
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        // Top curve
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x, stemTopY);
        ctx.quadraticCurveTo(x + width * 0.7, stemTopY + height * 0.2, x, y - height * 0.05);
        ctx.lineTo(stemX, y - height * 0.05);
        ctx.stroke();
        
        // Bottom curve
        ctx.beginPath();
        ctx.moveTo(stemX, y - height * 0.05);
        ctx.lineTo(x, y - height * 0.05);
        ctx.quadraticCurveTo(x + width * 0.9, y + height * 0.15, x, stemBottomY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        break;
        
      case "C":
        ctx.beginPath();
        // Increased radius by using width*0.6 instead of width/2
        ctx.arc(x, y, width*0.6, Math.PI * 0.25, Math.PI * 1.75, false);
        ctx.stroke();

          ctx.beginPath();
        // Increased radius by using width*0.6 instead of width/2
        ctx.arc(x, y, width*0.6, Math.PI * 0.25, Math.PI * 1.75, false);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "D":
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        
        // Curved side
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x - width * 0.3, stemTopY);
        ctx.quadraticCurveTo(x + width, y, x - width * 0.3, stemBottomY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
         // Vertical stem
         ctx.beginPath();
         ctx.moveTo(stemX, stemTopY);
         ctx.lineTo(stemX, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         
         // Curved side
         ctx.beginPath();
         ctx.moveTo(stemX, stemTopY);
         ctx.lineTo(x - width * 0.3, stemTopY);
         ctx.quadraticCurveTo(x + width, y, x - width * 0.3, stemBottomY);
         ctx.lineTo(stemX, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
        break;
        
      case "E":
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x + width * 0.5, stemTopY);
        ctx.stroke();
        
        // Middle horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.3, y);
        ctx.stroke();
        
        // Bottom horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, stemBottomY);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.stroke();

        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x + width * 0.5, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Middle horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.3, y);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Bottom horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, stemBottomY);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "F":
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x + width * 0.5, stemTopY);
        ctx.stroke();
        
        // Middle horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.3, y);
        ctx.stroke();
               
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x + width * 0.5, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Middle horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.3, y);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
        case "G":
       // Set line style


// === 1. Arc (main curved body like a "C") ===
ctx.beginPath();
ctx.arc(x, y, width, Math.PI * 0.4, Math.PI * 1.6, false); 
ctx.stroke();

// === 2. Outer vertical line (left side of G) ===
ctx.beginPath();
ctx.moveTo(x+27 , y - width * 0.01); // Top outer vertical
ctx.lineTo(x+27 , y + width * 0.9); // Bottom outer vertical
ctx.stroke();

// === 4. Horizontal line joining inner and outer verticals ===
 ctx.beginPath();
 ctx.moveTo(x-20, y + width * 0.);         // From outer vertical
 ctx.lineTo(x + 20 , y );   // To inner vertical
 ctx.stroke();


// === 1. Arc (main curved body like a "C") ===
ctx.beginPath();
ctx.arc(x, y, width, Math.PI * 0.4, Math.PI * 1.6, false); 
ctx.stroke();
ctx.lineWidth=15;
ctx.strokeStyle="rgba(66, 65, 65, 0)";

// === 2. Outer vertical line (left side of G) ===
ctx.beginPath();
ctx.moveTo(x+27 , y - width * 0.01); // Top outer vertical
ctx.lineTo(x+27 , y + width * 0.9); // Bottom outer vertical
ctx.lineWidth=15;
ctx.strokeStyle="rgba(66, 65, 65, 0)";
ctx.stroke();

// === 4. Horizontal line joining inner and outer verticals ===
 ctx.beginPath();
 ctx.moveTo(x-20, y + width * 0.);         // From outer vertical
 ctx.lineTo(x + 20 , y );   // To inner vertical
 ctx.lineWidth=15;
 ctx.strokeStyle="rgba(66, 65, 65, 0)";
 ctx.stroke();
break;
          
      case "H":
        // Left vertical
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        // Right vertical
        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, stemTopY);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.stroke();
        
        // Middle horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.5, y);
        ctx.stroke();

        // Left vertical
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Right vertical
        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, stemTopY);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Middle horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.5, y);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "I":
        // Vertical
        ctx.beginPath();
        ctx.moveTo(x, stemTopY);
        ctx.lineTo(x, stemBottomY);
        ctx.stroke();
        
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(x - width * 0.4, stemTopY);
        ctx.lineTo(x + width * 0.4, stemTopY);
        ctx.stroke();
        
        // Bottom horizontal
        ctx.beginPath();
        ctx.moveTo(x - width * 0.4, stemBottomY);
        ctx.lineTo(x + width * 0.4, stemBottomY);
        ctx.stroke();

        // Vertical
        ctx.beginPath();
        ctx.moveTo(x, stemTopY);
        ctx.lineTo(x, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(x - width * 0.4, stemTopY);
        ctx.lineTo(x + width * 0.4, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Bottom horizontal
        ctx.beginPath();
        ctx.moveTo(x - width * 0.4, stemBottomY);
        ctx.lineTo(x + width * 0.4, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "J":
        // Main vertical
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, stemTopY);
        ctx.lineTo(x + width * 0.2, y + height * 0.2);
        ctx.stroke();
        
        // Bottom curve
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, y + height * 0.2);
        ctx.quadraticCurveTo(x + width * 0.2, stemBottomY, x - width * 0.3, stemBottomY);
        ctx.stroke();
        
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(x - width * 0.2, stemTopY);
        ctx.lineTo(x + width * 0.6, stemTopY);
        ctx.stroke();

             // Main vertical
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, stemTopY);
        ctx.lineTo(x + width * 0.2, y + height * 0.2);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Bottom curve
        ctx.beginPath();
        ctx.moveTo(x + width * 0.2, y + height * 0.2);
        ctx.quadraticCurveTo(x + width * 0.2, stemBottomY, x - width * 0.3, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(x - width * 0.2, stemTopY);
        ctx.lineTo(x + width * 0.6, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "K":
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        // Upper diagonal
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.5, stemTopY);
        ctx.stroke();
        
        // Lower diagonal
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.stroke();

         // Vertical stem
         ctx.beginPath();
         ctx.moveTo(stemX, stemTopY);
         ctx.lineTo(stemX, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Upper diagonal
         ctx.beginPath();
         ctx.moveTo(stemX, y);
         ctx.lineTo(x + width * 0.5, stemTopY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Lower diagonal
         ctx.beginPath();
         ctx.moveTo(stemX, y);
         ctx.lineTo(x + width * 0.5, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
        break;
        
      case "L":
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        // Horizontal
        ctx.beginPath();
        ctx.moveTo(stemX, stemBottomY);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.stroke();

         // Vertical stem
         ctx.beginPath();
         ctx.moveTo(stemX, stemTopY);
         ctx.lineTo(stemX, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Horizontal
         ctx.beginPath();
         ctx.moveTo(stemX, stemBottomY);
         ctx.lineTo(x + width * 0.5, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
        break;
        
      case "M":
        // Left vertical
        ctx.beginPath();
        ctx.moveTo(x - width, stemBottomY);
        ctx.lineTo(x - width, stemTopY);
        ctx.stroke();
        
        // Middle peak
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x, y + height * 0.1);
        ctx.lineTo(x + width, stemTopY);
        ctx.stroke();
        
        // Right vertical
        ctx.beginPath();
        ctx.moveTo(x + width, stemTopY);
        ctx.lineTo(x + width, stemBottomY);
        ctx.stroke();
        
           // Left vertical
        ctx.beginPath();
        ctx.moveTo(x - width, stemBottomY);
        ctx.lineTo(x - width, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Middle peak
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x, y + height * 0.1);
        ctx.lineTo(x + width, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Right vertical
        ctx.beginPath();
        ctx.moveTo(x + width, stemTopY);
        ctx.lineTo(x + width, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "N":
        // Left vertical
        ctx.beginPath();
        ctx.moveTo(x - width, stemBottomY);
        ctx.lineTo(x - width, stemTopY);
        ctx.stroke();
        
        // Diagonal
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x + width, stemBottomY);
        ctx.stroke();
        
        // Right vertical
        ctx.beginPath();
        ctx.moveTo(x + width, stemBottomY);
        ctx.lineTo(x + width, stemTopY);
        ctx.stroke();

            // Left vertical
        ctx.beginPath();
        ctx.moveTo(x - width, stemBottomY);
        ctx.lineTo(x - width, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Diagonal
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x + width, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Right vertical
        ctx.beginPath();
        ctx.moveTo(x + width, stemBottomY);
        ctx.lineTo(x + width, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "O":
        ctx.beginPath();
        ctx.ellipse(x, y, width * 0.8, height * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(x, y, width * 0.8, height * 0.5, 0, 0, Math.PI * 2);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "P":
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        // Loop
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x, stemTopY);
        ctx.quadraticCurveTo(x + width * 0.7, stemTopY + height * 0.25, x, y);
        ctx.lineTo(stemX, y);
        ctx.stroke();

        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Loop
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x, stemTopY);
        ctx.quadraticCurveTo(x + width * 0.7, stemTopY + height * 0.25, x, y);
        ctx.lineTo(stemX, y);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "Q":
        // Circle
        ctx.beginPath();
        ctx.ellipse(x, y - height * 0.1, width * 0.8, height * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Tail
        ctx.beginPath();
        ctx.moveTo(x + width * 0.3, y + height * 0.2);
        ctx.lineTo(x + width * 0.6, y + height * 0.4);
        ctx.stroke();

         // Circle
         ctx.beginPath();
         ctx.ellipse(x, y - height * 0.1, width * 0.8, height * 0.45, 0, 0, Math.PI * 2);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Tail
         ctx.beginPath();
         ctx.moveTo(x + width * 0.3, y + height * 0.2);
         ctx.lineTo(x + width * 0.6, y + height * 0.4);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
        break;
        
      case "R":
        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.stroke();
        
        // Loop
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x, stemTopY);
        ctx.quadraticCurveTo(x + width * 0.7, stemTopY + height * 0.25, x, y);
        ctx.lineTo(stemX, y);
        ctx.stroke();
        
        // Diagonal leg
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.stroke();

        // Vertical stem
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(stemX, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Loop
        ctx.beginPath();
        ctx.moveTo(stemX, stemTopY);
        ctx.lineTo(x, stemTopY);
        ctx.quadraticCurveTo(x + width * 0.7, stemTopY + height * 0.25, x, y);
        ctx.lineTo(stemX, y);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Diagonal leg
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "S":
        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, stemTopY);
        ctx.quadraticCurveTo(x - width * 0.5, stemTopY + height * 0.2, x - width * 0.2, y);
        ctx.quadraticCurveTo(x + width * 0.8, y + height * 0.2, x - width * 0.5, stemBottomY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, stemTopY);
        ctx.quadraticCurveTo(x - width * 0.5, stemTopY + height * 0.2, x - width * 0.2, y);
        ctx.quadraticCurveTo(x + width * 0.8, y + height * 0.2, x - width * 0.5, stemBottomY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "T":
        // Vertical
        ctx.beginPath();
        ctx.moveTo(x, stemTopY);
        ctx.lineTo(x, stemBottomY);
        ctx.stroke();
        
        // Horizontal
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x + width, stemTopY);
        ctx.stroke();

         // Vertical
         ctx.beginPath();
         ctx.moveTo(x, stemTopY);
         ctx.lineTo(x, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Horizontal
         ctx.beginPath();
         ctx.moveTo(x - width, stemTopY);
         ctx.lineTo(x + width, stemTopY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
        break;
        
      case "U":
        // Left vertical
        ctx.beginPath();
        ctx.moveTo(x - width * 0.7, stemTopY);
        ctx.lineTo(x - width * 0.7, y + height * 0.2);
        ctx.stroke();
        
        // Bottom curve
        ctx.beginPath();
        ctx.moveTo(x - width * 0.7, y + height * 0.2);
        ctx.quadraticCurveTo(x, stemBottomY + height * 0.1, x + width * 0.7, y + height * 0.2);
        ctx.stroke();
        
        // Right vertical
        ctx.beginPath();
        ctx.moveTo(x + width * 0.7, y + height * 0.2);
        ctx.lineTo(x + width * 0.7, stemTopY);
        ctx.stroke();

        // Left vertical
        ctx.beginPath();
        ctx.moveTo(x - width * 0.7, stemTopY);
        ctx.lineTo(x - width * 0.7, y + height * 0.2);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Bottom curve
        ctx.beginPath();
        ctx.moveTo(x - width * 0.7, y + height * 0.2);
        ctx.quadraticCurveTo(x, stemBottomY + height * 0.1, x + width * 0.7, y + height * 0.2);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        
        // Right vertical
        ctx.beginPath();
        ctx.moveTo(x + width * 0.7, y + height * 0.2);
        ctx.lineTo(x + width * 0.7, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "V":
        // Left diagonal
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x, stemBottomY);
        ctx.stroke();
        
        // Right diagonal
        ctx.beginPath();
        ctx.moveTo(x, stemBottomY);
        ctx.lineTo(x + width, stemTopY);
        ctx.stroke();

         // Left diagonal
         ctx.beginPath();
         ctx.moveTo(x - width, stemTopY);
         ctx.lineTo(x, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Right diagonal
         ctx.beginPath();
         ctx.moveTo(x, stemBottomY);
         ctx.lineTo(x + width, stemTopY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
        break;
        
      case "W":
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x - width * 0.5, stemBottomY);
        ctx.lineTo(x, y - height * 0.2);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.lineTo(x + width, stemTopY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x - width * 0.5, stemBottomY);
        ctx.lineTo(x, y - height * 0.2);
        ctx.lineTo(x + width * 0.5, stemBottomY);
        ctx.lineTo(x + width, stemTopY);
        ctx.lineWidth=15;
        ctx.strokeStyle = "rgba(66, 65, 65, 0)";
        ctx.stroke();
        break;
        
      case "X":
        // Diagonal from top-left to bottom-right
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x + width, stemBottomY);
        ctx.stroke();
        
        // Diagonal from top-right to bottom-left
        ctx.beginPath();
        ctx.moveTo(x + width, stemTopY);
        ctx.lineTo(x - width, stemBottomY);
        ctx.stroke();

         // Diagonal from top-left to bottom-right
         ctx.beginPath();
         ctx.moveTo(x - width, stemTopY);
         ctx.lineTo(x + width, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Diagonal from top-right to bottom-left
         ctx.beginPath();
         ctx.moveTo(x + width, stemTopY);
         ctx.lineTo(x - width, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
        break;
        
      case "Y":
        // Upper left diagonal
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Upper right diagonal
        ctx.beginPath();
        ctx.moveTo(x + width, stemTopY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Lower vertical
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, stemBottomY);
        ctx.stroke();

         // Upper left diagonal
         ctx.beginPath();
         ctx.moveTo(x - width, stemTopY);
         ctx.lineTo(x, y);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Upper right diagonal
         ctx.beginPath();
         ctx.moveTo(x + width, stemTopY);
         ctx.lineTo(x, y);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
         
         // Lower vertical
         ctx.beginPath();
         ctx.moveTo(x, y);
         ctx.lineTo(x, stemBottomY);
         ctx.lineWidth=15;
         ctx.strokeStyle = "rgba(66, 65, 65, 0)";
         ctx.stroke();
        break;
        
      case "Z":
        // Top horizontal
        ctx.beginPath();
        ctx.moveTo(x - width, stemTopY);
        ctx.lineTo(x + width, stemTopY);
        ctx.stroke();
        
        // Diagonal
        ctx.beginPath();
        ctx.moveTo(x + width, stemTopY);
        ctx.lineTo(x - width, stemBottomY);
        ctx.stroke();
        
        // Bottom horizontal
        ctx.beginPath();
        ctx.moveTo(x - width, stemBottomY);
        ctx.lineTo(x + width, stemBottomY);
        ctx.stroke();

          // Top horizontal
          ctx.beginPath();
          ctx.moveTo(x - width, stemTopY);
          ctx.lineTo(x + width, stemTopY);
          ctx.lineWidth=15;
          ctx.strokeStyle = "rgba(66, 65, 65, 0)";
          ctx.stroke();
          
          // Diagonal
          ctx.beginPath();
          ctx.moveTo(x + width, stemTopY);
          ctx.lineTo(x - width, stemBottomY);
          ctx.lineWidth=15;
          ctx.strokeStyle = "rgba(66, 65, 65, 0)";
          ctx.stroke();
          
          // Bottom horizontal
          ctx.beginPath();
          ctx.moveTo(x - width, stemBottomY);
          ctx.lineTo(x + width, stemBottomY);
          ctx.lineWidth=15;
          ctx.strokeStyle = "rgba(66, 65, 65, 0)";
          ctx.stroke();
        break;
    }
  };

  const drawDottedLetter = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear visible canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw 1D dotted letter guide
    drawLetterOutlines(
      ctx, 
      selectedLetter, 
      canvas.width / 2, 
      canvas.height / 2, 
      canvas.width * 0.6,
      true // dotted
    );

    // Draw letter path on hidden canvas for detection
    drawLetterPath();
  };

  const drawLetterPath = () => {
    const pathCanvas = pathCanvasRef.current;
    const ctx = pathCanvas?.getContext("2d");
    if (!pathCanvas || !ctx) return;

    // Clear path canvas
    ctx.clearRect(0, 0, pathCanvas.width, pathCanvas.height);

    // Draw solid letter outlines for collision detection
    drawLetterOutlines(
      ctx, 
      selectedLetter, 
      pathCanvas.width / 2, 
      pathCanvas.height / 2, 
      pathCanvas.width * 0.6,
      false // solid
    );
  };

  // Check if a point is on the letter path with strict tolerance
  const isPointOnLetterPath = (x, y) => {
    const pathCanvas = pathCanvasRef.current;
    if (!pathCanvas) return false;
    
    const ctx = pathCanvas.getContext("2d");
    
    // Small tolerance for precise tracing
    const tolerance = 3;
    for (let offsetX = -tolerance; offsetX <= tolerance; offsetX++) {
      for (let offsetY = -tolerance; offsetY <= tolerance; offsetY++) {
        const pixelData = ctx.getImageData(x + offsetX, y + offsetY, 1, 1).data;
        // If any pixel in the tolerance area is part of the letter
        if (pixelData[3] > 0) {
          return true;
        }
      }
    }
    return false;
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const pathCanvas = pathCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !pathCanvas || !container) return;
    
    // Get the container width and set a max width
    const containerWidth = container.clientWidth;
    const width = Math.min(containerWidth, 600);
    
    canvas.width = width;
    canvas.height = width * 0.66;
    
    // Match dimensions of hidden canvas
    pathCanvas.width = width;
    pathCanvas.height = width * 0.66;
    
    drawDottedLetter();
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    drawDottedLetter();
  }, [selectedLetter]);

  // Prevent default touch behavior to stop scrolling during drawing
  useEffect(() => {
    const preventTouchMove = (e) => {
      if (isDrawing.current) {
        e.preventDefault();
      }
    };

    // Add passive: false to override default browser behavior
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

  const getTouchPosition = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault(); // Prevent default behavior
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let position;
    if (e.type.includes('mouse')) {
      const rect = canvas.getBoundingClientRect();
      position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    } else {
      position = getTouchPosition(e, canvas);
    }
    
    isDrawing.current = true;
    lastPoint.current = position;
  };

  const draw = (e) => {
    e.preventDefault(); // Prevent default behavior
    if (!isDrawing.current || !canvasRef.current || !lastPoint.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    let position;
    if (e.type.includes('mouse')) {
      const rect = canvas.getBoundingClientRect();
      position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    } else {
      position = getTouchPosition(e, canvas);
    }

    // Check if the current point is on the letter path
    const isOnPath = isPointOnLetterPath(position.x, position.y);
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(position.x, position.y);
    
    // Change color based on tracing accuracy
    ctx.strokeStyle = isOnPath ? "green" : "red";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();

    lastPoint.current = position;
  };

  const stopDrawing = (e) => {
    e.preventDefault(); // Prevent default behavior
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDottedLetter();
    }
  };

  // Handle letter selection
  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
    // Clear the canvas when a new letter is selected
    clearCanvas();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-lg mx-auto" ref={containerRef}>
      <h2 className="text-xl font-bold">Letter Tracing Practice</h2>
      
      {/* Letter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterSelect(letter)}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedLetter === letter
                ? "bg-purple-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Tracing Canvas */}
      <div className="relative w-full touch-none">
        <canvas
          ref={canvasRef}
          className="border-2 border-dashed border-purple-400 rounded-xl bg-white dark:bg-gray-900 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          style={{ touchAction: 'none' }}
        />
        
        {/* Hidden canvas for path detection */}
        <canvas
          ref={pathCanvasRef}
          className="absolute top-0 left-0 opacity-0 pointer-events-none"
        />
      </div>
      
      <div className="flex gap-4 mt-2">
        <button 
          onClick={clearCanvas}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Clear
        </button>
      </div>
      
      <div className="text-sm mt-2 flex items-center gap-4">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> 
          <span>Correct</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span> 
          <span>Incorrect</span>
        </div>
      </div>
    </div>
  );
};

export default TracingCanvas;