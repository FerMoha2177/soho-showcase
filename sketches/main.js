const canvasSketch = require('canvas-sketch');
const Phase1 = require('./phases/phase1-reasons-for-leaving');
const { settings } = require('./config/settings');

const sketch = ({ width, height }) => {
  console.log('Sketch initialized with 2D context:', { width, height });
  
  const phases = [
    new Phase1(width, height) // No more gl context needed!
  ];
  
  let currentPhaseIndex = 0;
  let phaseStartTime = 0;
  
  return {
    render({ context, time, width, height }) {
      const currentPhase = phases[currentPhaseIndex];
      
      // Simple 2D rendering - much easier!
      currentPhase.render({ context, time: time - phaseStartTime, width, height });
    },
    
    resize({ width, height }) {
      // Handle resize if needed
      phases.forEach(phase => {
        if (phase.resize) {
          phase.resize(width, height);
        }
      });
    },
    
    unload() {
      // Clean up phases
      phases.forEach(phase => {
        if (phase.destroy) {
          phase.destroy();
        }
      });
    }
  };
};

canvasSketch(sketch, settings);