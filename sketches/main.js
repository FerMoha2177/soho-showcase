
const canvasSketch = require('canvas-sketch');
const Phase1 = require('./phases/phase1-reasons-for-leaving');
const { settings } = require('./config/settings');

const sketch = ({ width, height }) => {
  console.log('Sketch initialized with 2D context:', { width, height });
  
  // Initialize Phase 1 with canvas-sketch provided dimensions
  const currentPhase = new Phase1(width, height);
  let phaseStartTime = 0;
  
  // Add keyboard listener for testing
  const handleKeyPress = (event) => {
    if (currentPhase && currentPhase.handleKeyPress) {
      currentPhase.handleKeyPress(event.key);
    }
  };
  document.addEventListener('keydown', handleKeyPress);
  
  return {
    render({ context, time, width, height }) {
      // Let the current phase handle all the drawing
      if (currentPhase && currentPhase.render) {
        currentPhase.render({ 
          context, 
          time: time - phaseStartTime, 
          width, 
          height 
        });
      }
    },
    
    resize({ width, height }) {
      // Handle resize - update phase dimensions
      if (currentPhase) {
        currentPhase.width = width;
        currentPhase.height = height;
        // Update container dimensions too
        if (currentPhase.container) {
          currentPhase.container.width = width;
          currentPhase.container.height = height;
        }
      }
    },
    
    unload() {
      // Clean up phase and event listeners
      document.removeEventListener('keydown', handleKeyPress);
      if (currentPhase && currentPhase.destroy) {
        currentPhase.destroy();
      }
    }
  };
};


canvasSketch(sketch, settings);


