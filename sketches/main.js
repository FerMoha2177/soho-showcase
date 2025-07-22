// sketches/main.js - Enhanced with audio integration

const canvasSketch = require('canvas-sketch');
const Phase1 = require('./phases/phase1-reasons-for-leaving');
const Phase3 = require('./phases/phase3');
const { settings } = require('./config/settings');
const { audioSystem } = require('./audio/audio-system');

const sketch = ({ width, height, canvas }) => {
  console.log('🎨 Sketch initialized with audio support:', { width, height });
  
  // Initialize Phase 1 with audio-aware capabilities
  //const currentPhase = new Phase1(width, height, audioSystem);
  const currentPhase = new Phase3(width, height, audioSystem);

  let phaseStartTime = 0;
  let audioInitialized = false;
  
  // Initialize audio system immediately (not on click)
  const initAudio = async () => {
    if (!audioInitialized) {
      const success = await audioSystem.init();
      if (success) {
        // Create draggable audio controls in top-right
        audioSystem.createControls({
          position: { top: '20px', right: '20px' }
        });
        
        // Set up audio callbacks for visual effects
        audioSystem.onBeat((bassLevel) => {
          console.log('🥁 Beat detected!', bassLevel);
          // Trigger beat effects in current phase
          if (currentPhase.onBeat) {
            currentPhase.onBeat(bassLevel);
          }
        });
        
        audioSystem.onUpdate((audioData) => {
          // Pass audio data to current phase
          if (currentPhase.onAudioUpdate) {
            currentPhase.onAudioUpdate(audioData);
          }
        });
        
        // Auto-play after audio loads
        setTimeout(async () => {
          try {
            if (!audioSystem.isPlaying) {
              await audioSystem.togglePlayback();
              console.log('🎵 Auto-started playback!');
            }
          } catch (error) {
            console.log('⚠️ Auto-play may require user interaction');
          }
        }, 1000);
        
        audioInitialized = true;
        console.log('🎵 Audio system ready!');
      }
    }
  };
  
  // Initialize audio immediately
  initAudio();
  
  // Keyboard shortcuts
  const handleKeyPress = (event) => {
    switch(event.key.toLowerCase()) {
      case ' ': // Spacebar to play/pause
        event.preventDefault();
        if (audioInitialized) {
          audioSystem.togglePlayback();
        }
        break;
      case 'r': // Reset audio
        if (audioInitialized) {
          audioSystem.stop();
        }
        break;
      default:
        // Pass other keys to current phase
        if (currentPhase && currentPhase.handleKeyPress) {
          currentPhase.handleKeyPress(event.key);
        }
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  
  return {
    render({ context, time, width, height }) {
      // Update audio analysis (this should be called every frame)
      if (audioInitialized) {
        audioSystem.update();
      }
      
      // Let the current phase handle rendering with audio data
      if (currentPhase && currentPhase.render) {
        currentPhase.render({ 
          context, 
          time: time - phaseStartTime, 
          width, 
          height,
          audioData: audioSystem.getAudioData()
        });
      }
      
      // Show audio status instead of initialization prompt
      if (!audioInitialized) {
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillText('🎵 Loading audio system...', width / 2, height / 2);
      } else if (audioInitialized && !audioSystem.isPlaying) {
        context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        context.font = '14px Arial';
        context.textAlign = 'center';
        context.fillText('Music will start automatically or click ▶️', width / 2, height - 30);
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
      // Clean up everything
      document.removeEventListener('keydown', handleKeyPress);
      
      if (currentPhase && currentPhase.destroy) {
        currentPhase.destroy();
      }
      
      if (audioInitialized) {
        audioSystem.destroy();
      }
    }
  };
};

canvasSketch(sketch, settings);