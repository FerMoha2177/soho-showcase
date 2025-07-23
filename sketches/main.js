const canvasSketch = require('canvas-sketch');
const Phase1 = require('./phases/phase1-reasons-for-leaving');
const Phase3 = require('./phases/phase3');
const Phase2Simple = require('./phases/phase2');
const Phase4 = require('./phases/phase4');


const { settings } = require('./config/settings');
const { audioSystem } = require('./audio/audio-system');

const sketch = ({ width, height, canvas }) => {
  console.log('🎨 Sketch initialized with audio support and phase management:', { width, height });
  
  // Phase Management System
  const PHASES = [
    { name: 'Phase 1: Reasons for Leaving', class: Phase1, key: '1' },
    { name: 'Phase 2: New Home', class: Phase2Simple, key: '2' },        // <- Add this line
    { name: 'Phase 3: Current Reality (2025)', class: Phase3, key: '3' },
    { name: 'Phase 4: Identity Reflections', class: Phase4, key: '4' }
  ];
  
  let currentPhaseIndex = 0; // Start with Phase 1 (index 0)
  let currentPhase = null;
  let phaseStartTime = 0;
  let audioInitialized = false;
  let isTransitioning = false;
  let transitionStartTime = 0;
  let transitionDuration = 1.0; // 1 second transition
  let fromPhase = null;
  let toPhase = null;
  
  // Initialize the current phase
  const initializePhase = (phaseIndex) => {
    if (currentPhase && currentPhase.destroy) {
      currentPhase.destroy();
    }
    
    const PhaseClass = PHASES[phaseIndex].class;
    currentPhase = new PhaseClass(width, height, audioSystem);
    phaseStartTime = 0; // Reset phase timer
    
    // Connect audio callbacks
    if (audioInitialized && currentPhase) {
      if (currentPhase.onBeat) {
        audioSystem.onBeat((bassLevel) => {
          if (!isTransitioning) {
            currentPhase.onBeat(bassLevel);
          }
        });
      }
      
      if (currentPhase.onAudioUpdate) {
        audioSystem.onUpdate((audioData) => {
          if (!isTransitioning) {
            currentPhase.onAudioUpdate(audioData);
          }
        });
      }
    }
    
    console.log(`🎬 Switched to ${PHASES[phaseIndex].name}`);
  };
  
  // Phase transition system
  const startTransition = (newPhaseIndex) => {
    if (isTransitioning || newPhaseIndex === currentPhaseIndex) return;
    
    console.log(`🔄 Starting transition from ${PHASES[currentPhaseIndex].name} to ${PHASES[newPhaseIndex].name}`);
    
    isTransitioning = true;
    transitionStartTime = 0;
    fromPhase = currentPhase;
    
    // Create new phase
    const PhaseClass = PHASES[newPhaseIndex].class;
    toPhase = new PhaseClass(width, height, audioSystem);
    
    currentPhaseIndex = newPhaseIndex;
  };
  
  const updateTransition = (time) => {
    if (!isTransitioning) return;
    
    const progress = Math.min(transitionStartTime / transitionDuration, 1);
    
    if (progress >= 1) {
      // Transition complete
      if (fromPhase && fromPhase.destroy) {
        fromPhase.destroy();
      }
      currentPhase = toPhase;
      fromPhase = null;
      toPhase = null;
      isTransitioning = false;
      phaseStartTime = time;
      console.log('✅ Transition complete');
    }
    
    transitionStartTime += 1/60; // Increment by frame time
  };
  
  const renderTransition = (context, time, width, height, audioData) => {
    if (!isTransitioning) return;
    
    const progress = Math.min(transitionStartTime / transitionDuration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    
    // Render both phases with opacity
    context.save();
    
    // Render outgoing phase (fade out)
    if (fromPhase && fromPhase.render) {
      context.globalAlpha = 1 - easeProgress;
      fromPhase.render({ context, time: time - phaseStartTime, width, height, audioData });
    }
    
    // Render incoming phase (fade in)
    if (toPhase && toPhase.render) {
      context.globalAlpha = easeProgress;
      toPhase.render({ context, time: 0, width, height, audioData });
    }
    
    context.restore();
    
    // Transition progress indicator
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.font = '14px Arial';
    context.textAlign = 'center';
    context.fillText(`Transitioning to ${PHASES[currentPhaseIndex].name}...`, width / 2, height - 50);
    
    // Progress bar
    const barWidth = 200;
    const barHeight = 4;
    const barX = (width - barWidth) / 2;
    const barY = height - 30;
    
    context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    context.fillRect(barX, barY, barWidth, barHeight);
    
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillRect(barX, barY, barWidth * easeProgress, barHeight);
  };
  
  // Initialize starting phase
  initializePhase(currentPhaseIndex);
  
  // Initialize audio system
  const initAudio = async () => {
    if (!audioInitialized) {
      const success = await audioSystem.init();
      if (success) {
        // Create draggable audio controls in top-right
        audioSystem.createControls({
          position: { top: '20px', right: '20px' }
        });
        
        // Set up audio callbacks for current phase
        audioSystem.onBeat((bassLevel) => {
          if (!isTransitioning && currentPhase && currentPhase.onBeat) {
            currentPhase.onBeat(bassLevel);
          }
        });
        
        audioSystem.onUpdate((audioData) => {
          if (!isTransitioning && currentPhase && currentPhase.onAudioUpdate) {
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
  
  // Enhanced keyboard shortcuts
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
      case '1': // Switch to Phase 1
        event.preventDefault();
        startTransition(0);
        break;
      case '3': // Switch to Phase 3
        event.preventDefault();
        startTransition(1);
        break;
      case 'arrowright': // Next phase
      case 'n':
        event.preventDefault();
        const nextIndex = (currentPhaseIndex + 1) % PHASES.length;
        startTransition(nextIndex);
        break;
      case 'arrowleft': // Previous phase
      case 'p':
        event.preventDefault();
        const prevIndex = (currentPhaseIndex - 1 + PHASES.length) % PHASES.length;
        startTransition(prevIndex);
        break;
      default:
        // Pass other keys to current phase
        if (!isTransitioning && currentPhase && currentPhase.handleKeyPress) {
          currentPhase.handleKeyPress(event.key);
        }
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  
  return {
    render({ context, time, width, height }) {
      // Update audio analysis
      if (audioInitialized) {
        audioSystem.update();
      }
      
      const audioData = audioSystem.getAudioData();
      
      // Update transition state
      updateTransition(time);
      
      // Render current state
      if (isTransitioning) {
        renderTransition(context, time, width, height, audioData);
      } else if (currentPhase && currentPhase.render) {
        currentPhase.render({ 
          context, 
          time: time - phaseStartTime, 
          width, 
          height,
          audioData
        });
      }
      
      // Show phase controls and status
      renderPhaseControls(context, width, height);
      
      // Show audio status
      if (!audioInitialized) {
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillText('🎵 Loading audio system...', width / 2, height / 2);
      }
    },
    
    resize({ width, height }) {
      // Handle resize for all phases
      if (currentPhase && currentPhase.resize) {
        currentPhase.resize(width, height);
      }
      if (fromPhase && fromPhase.resize) {
        fromPhase.resize(width, height);
      }
      if (toPhase && toPhase.resize) {
        toPhase.resize(width, height);
      }
    },
    
    unload() {
      // Clean up everything
      document.removeEventListener('keydown', handleKeyPress);
      
      if (currentPhase && currentPhase.destroy) {
        currentPhase.destroy();
      }
      if (fromPhase && fromPhase.destroy) {
        fromPhase.destroy();
      }
      if (toPhase && toPhase.destroy) {
        toPhase.destroy();
      }
      
      if (audioInitialized) {
        audioSystem.destroy();
      }
    }
  };
  
  // Phase control UI
  function renderPhaseControls(context, width, height) {
    if (isTransitioning) return; // Hide during transitions
    
    // Semi-transparent background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(width - 350, height - 120, 330, 100);
    
    // Border
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    context.lineWidth = 1;
    context.strokeRect(width - 350, height - 120, 330, 100);
    
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.font = 'bold 14px Arial';
    context.textAlign = 'left';
    
    let y = height - 100;
    context.fillText(`Current: ${PHASES[currentPhaseIndex].name}`, width - 340, y);
    
    context.font = '12px Arial';
    y += 20;
    context.fillText('Controls:', width - 340, y);
    y += 16;
    context.fillText('• 1, 2, 3: Switch to specific phase', width - 340, y);
    y += 14;
    context.fillText('• N/→: Next phase  • P/←: Previous phase', width - 340, y);
    y += 14;
    context.fillText('• Space: Play/Pause music  • I: Toggle info', width - 340, y);
  }
};

canvasSketch(sketch, settings);