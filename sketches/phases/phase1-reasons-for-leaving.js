// sketches/phases/phase1-reasons-for-leaving.js - Enhanced with audio reactivity

const { createContainer } = require('../containers/container-system');
const { reasonsForLeaving, emotionsDuringImmigration } = require('../data/survey-data');
const { ReasonBubble, EmotionBubble, BubblePhysics } = require('../physics/bubble');

class Phase1 {
  constructor(width, height, audioSystem = null) {
    this.width = width;
    this.height = height;
    this.audioSystem = audioSystem;
    this.container = createContainer('popcorn-maker', width, height);
    
    // Bubble management
    this.reasonBubbles = [];
    this.emotionBubbles = [];
    
    // Timing and state
    this.nextBubbleTime = 1.0;
    this.bubbleIndex = 0;
    this.maxIterations = 2;
    
    // Phase states
    this.reasonsComplete = false;
    this.emotionsTriggered = false;
    this.emotionBubbleIndex = 0;
    this.nextEmotionTime = 0;
    
    // Audio-reactive properties
    this.audioData = null;
    this.backgroundGradientOffset = 0;
    this.beatEffects = [];
    this.lastBeatTime = 0;
    
    console.log('🎨 Phase 1 initialized with audio support');
    
    // Add mouse click listener
    this.setupMouseListener();
  }
  
  setupMouseListener() {
    const handleClick = () => {
      if (this.reasonsComplete && !this.emotionsTriggered) {
        this.emotionsTriggered = true;
        this.nextEmotionTime = 0;
        console.log('✨ Emotions triggered by mouse click!');
      }
    };
    
    document.addEventListener('click', handleClick);
    this.cleanup = () => document.removeEventListener('click', handleClick);
  }
  
  // Audio callback: called when beat is detected
  onBeat(bassLevel) {
    this.lastBeatTime = Date.now();
    
    // Create beat effect
    this.beatEffects.push({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: 0,
      maxRadius: 50 + (bassLevel * 100),
      age: 0,
      duration: 0.5,
      intensity: bassLevel
    });
    
    // Limit number of beat effects
    if (this.beatEffects.length > 10) {
      this.beatEffects.shift();
    }
    
    // Make bubbles react to beat
    [...this.reasonBubbles, ...this.emotionBubbles].forEach(bubble => {
      if (bubble.onBeat) {
        bubble.onBeat(bassLevel);
      } else {
        // Add temporary beat wobble
        bubble.beatWobble = bassLevel * 10;
      }
    });
  }
  
  // Audio callback: called every frame with audio data
  onAudioUpdate(audioData) {
    this.audioData = audioData;
    
    // Update background gradient based on audio
    const speed = 0.01 + (audioData.mid * 0.03);
    this.backgroundGradientOffset += speed;
  }
  
  // Create audio-enhanced reason bubble
  createReasonBubble(wordData) {
    const bubble = new ReasonBubble(wordData, this.container);
    
    // Add audio enhancements
    if (this.audioData) {
      // Scale bubble based on overall audio level
      const audioScale = 1 + (this.audioData.overall * 0.3);
      bubble.targetRadius *= audioScale;
      
      // Audio affects initial velocity
      bubble.velocityX *= (1 + this.audioData.bass * 0.5);
      bubble.velocityY *= (1 + this.audioData.treble * 0.3);
    }
    
    return bubble;
  }
  
  // Create audio-enhanced emotion bubble
  createEmotionBubble(wordData) {
    const bubble = new EmotionBubble(wordData, this.container);
    
    // Add audio enhancements
    if (this.audioData) {
      // More dramatic audio scaling for emotions
      const audioScale = 1 + (this.audioData.overall * 0.5);
      bubble.targetRadius *= audioScale;
      
      // Audio affects colors more dramatically
      bubble.audioColorBoost = this.audioData.overall;
    }
    
    return bubble;
  }
  
  // Purge all reason bubbles with pop animation
  purgeReasonBubbles() {
    console.log('💥 Purging reason bubbles with audio-enhanced pop...');
    this.reasonBubbles = BubblePhysics.purgeBubbles(this.reasonBubbles);
    this.bubbleIndex = 0;
    this.reasonsComplete = false;
  }
  
  // Purge all emotion bubbles with pop animation
  purgeEmotionBubbles() {
    console.log('✨ Purging emotion bubbles with audio-enhanced pop...');
    this.emotionBubbles = BubblePhysics.purgeBubbles(this.emotionBubbles);
    this.emotionBubbleIndex = 0;
    this.emotionsTriggered = false;
  }
  
  render({ context, time, width, height, audioData }) {
    const deltaTime = 1/60;
    this.audioData = audioData;
    
    // Update bubble spawn timing based on audio
    const audioSpeedMultiplier = audioData && audioData.isPlaying ? 
      (1 + audioData.overall * 0.7) : 1;
    
    // Add reason bubbles (faster when music is loud)
    if (!this.reasonsComplete && time > this.nextBubbleTime) {
      const totalReasonBubbles = reasonsForLeaving.length * this.maxIterations;
      if (this.reasonBubbles.length < totalReasonBubbles) {
        const dataIndex = this.bubbleIndex % reasonsForLeaving.length;
        this.reasonBubbles.push(this.createReasonBubble(reasonsForLeaving[dataIndex]));
        this.bubbleIndex++;
        
        // Audio-reactive timing
        const baseInterval = 0.5;
        const audioInterval = audioData && audioData.isPlaying ? 
          baseInterval * (1 - audioData.overall * 0.4) : baseInterval;
        this.nextBubbleTime = time + Math.max(0.2, audioInterval + Math.random() * 0.3);
        
        console.log(`🫧 Added reason bubble: ${reasonsForLeaving[dataIndex].word}`);
      } else {
        this.reasonsComplete = true;
        console.log('✅ All reason bubbles complete!');
      }
    }
    
    // Add emotion bubbles (triggered by mouse click)
    if (this.emotionsTriggered && time > this.nextEmotionTime) {
      if (this.emotionBubbleIndex < emotionsDuringImmigration.length) {
        const emotionData = emotionsDuringImmigration[this.emotionBubbleIndex];
        this.emotionBubbles.push(this.createEmotionBubble(emotionData));
        this.emotionBubbleIndex++;
        
        // Audio-reactive emotion timing
        const baseInterval = 0.8;
        const audioInterval = audioData && audioData.isPlaying ? 
          baseInterval * (1 - audioData.mid * 0.3) : baseInterval;
        this.nextEmotionTime = time + Math.max(0.3, audioInterval + Math.random() * 0.4);
        
        console.log(`💫 Added emotion bubble: ${emotionData.word}`);
      }
    }
    
    // Update all bubbles with audio data
    this.reasonBubbles.forEach(bubble => {
      bubble.update(deltaTime);
      // Apply audio wobble effect
      if (bubble.beatWobble) {
        bubble.beatWobble *= 0.9; // Decay
      }
    });
    
    this.emotionBubbles.forEach(bubble => {
      bubble.update(deltaTime);
      // Apply audio wobble effect
      if (bubble.beatWobble) {
        bubble.beatWobble *= 0.9; // Decay
      }
    });
    
    // Update beat effects
    this.beatEffects = this.beatEffects.filter(effect => {
      effect.age += deltaTime;
      const progress = effect.age / effect.duration;
      effect.radius = effect.maxRadius * Math.sin(progress * Math.PI);
      return progress < 1;
    });
    
    // Remove destroyed bubbles
    this.reasonBubbles = this.reasonBubbles.filter(bubble => !bubble.isDestroyed());
    this.emotionBubbles = this.emotionBubbles.filter(bubble => !bubble.isDestroyed());
    
    // Handle collisions
    const allBubbles = [...this.reasonBubbles, ...this.emotionBubbles];
    BubblePhysics.checkCollisions(allBubbles);
    
    // === RENDERING ===
    
    // Clear with audio-reactive background
    this.renderBackground(context, width, height);
    
    // Draw container
    this.container.render2D(context);
    
    // Draw beat effects
    this.renderBeatEffects(context);
    
    // Draw all bubbles with audio enhancements
    this.reasonBubbles.forEach(bubble => this.renderBubbleWithAudio(bubble, context, time));
    this.emotionBubbles.forEach(bubble => this.renderBubbleWithAudio(bubble, context, time));
    
    // UI overlay
    this.renderUI(context, width, height);
  }
  
  // Render audio-reactive background
  renderBackground(context, width, height) {
    // Base dark background first
    context.fillStyle = 'rgba(15, 15, 25, 1.0)';
    context.fillRect(0, 0, width, height);
    
    if (this.audioData && this.audioData.isPlaying) {
      // Audio-reactive gradient background
      const gradient = context.createRadialGradient(
        width * (0.5 + Math.sin(this.backgroundGradientOffset * 2) * 0.2),
        height * (0.5 + Math.cos(this.backgroundGradientOffset * 1.5) * 0.2),
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * (0.8 + this.audioData.overall * 0.4)
      );

      // Colors react to different frequency ranges - MUCH brighter
      const bassIntensity = this.audioData.bass * 0.6;
      const midIntensity = this.audioData.mid * 0.5;
      const trebleIntensity = this.audioData.treble * 0.7;

      gradient.addColorStop(0, `rgba(${Math.floor(80 + bassIntensity * 150)}, ${Math.floor(60 + midIntensity * 120)}, ${Math.floor(100 + trebleIntensity * 155)}, ${bassIntensity + 0.3})`);
      gradient.addColorStop(0.5, `rgba(${Math.floor(70 + trebleIntensity * 100)}, ${Math.floor(80 + bassIntensity * 130)}, ${Math.floor(90 + midIntensity * 140)}, ${midIntensity + 0.25})`);
      gradient.addColorStop(1, 'rgba(40, 30, 60, 0.15)');

      // Use screen blend mode for visibility
      context.globalCompositeOperation = 'screen';
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = 'source-over'; // Reset
    }
  }
  
  // Render beat effect rings
  renderBeatEffects(context) {
    this.beatEffects.forEach(effect => {
      if (effect.radius > 0) {
        context.save();
        context.globalAlpha = (1 - effect.age / effect.duration) * effect.intensity;
        context.strokeStyle = `hsl(${effect.age * 360}, 80%, 60%)`;
        context.lineWidth = 3 + effect.intensity * 5;
        context.beginPath();
        context.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
    });
  }
  
  // Render bubble with audio enhancements
  renderBubbleWithAudio(bubble, context, time) {
    context.save();
    
    // Apply audio wobble if present
    const wobbleX = bubble.beatWobble ? Math.sin(time * 10) * bubble.beatWobble : 0;
    const wobbleY = bubble.beatWobble ? Math.cos(time * 12) * bubble.beatWobble : 0;
    
    // Audio-reactive glow
    if (this.audioData && this.audioData.overall > 0.3) {
      context.shadowColor = bubble.type === 'emotion' ? 
        `rgba(255, 100, 150, ${this.audioData.overall})` : 
        `rgba(100, 100, 255, ${this.audioData.bass})`;
      context.shadowBlur = 10 + (this.audioData.overall * 20);
    }
    
    // Translate for wobble effect
    context.translate(wobbleX, wobbleY);
    
    // Render the bubble normally
    bubble.render(context, time);
    
    context.restore();
  }
  
  renderUI(context, width, height) {
    // Stats with audio info
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.font = '16px Arial';
    context.textAlign = 'left';
    context.fillText(`Reason Bubbles: ${this.reasonBubbles.length}`, 20, 30);
    context.fillText(`Emotion Bubbles: ${this.emotionBubbles.length}`, 20, 50);
    context.fillText(`Canvas: ${width} x ${height}`, 20, 70);
    
    // Audio status
    if (this.audioData) {
      const audioStatus = this.audioData.isPlaying ? '🎵 Playing' : '⏸️ Paused';
      context.fillText(`Audio: ${audioStatus}`, 20, 90);
      
      if (this.audioData.beat) {
        context.fillStyle = '#ff4444';
        context.fillText('🥁 BEAT!', 20, 110);
      }
    }
    
    // Title
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.font = 'bold 28px Arial';
    context.textAlign = 'center';
    context.fillText('Part 1: The Decision - Reasons for Leaving & Emotions', width / 2, 40);
    
    // Interaction prompts
    if (this.reasonsComplete && !this.emotionsTriggered) {
      context.fillStyle = '#FFD700';
      context.font = 'bold 32px Arial';
      context.textAlign = 'center';
      const scale = this.audioData && this.audioData.beat ? 1.2 : 1.0;
      context.save();
      context.translate(width / 2, height - 60);
      context.scale(scale, scale);
      context.fillText('🖱️ CLICK TO TRIGGER EMOTIONS', 0, 0);
      context.restore();
    } else if (this.emotionsTriggered) {
      context.fillStyle = '#90EE90';
      context.font = 'bold 24px Arial';
      context.textAlign = 'center';
      context.fillText('✨ Emotions Activated!', width / 2, height - 60);
    }
    
    // Debug controls (optional)
    if (this.reasonBubbles.length > 0) {
      context.fillStyle = 'rgba(255, 0, 0, 0.7)';
      context.font = '14px Arial';
      context.textAlign = 'right';
      context.fillText('Press R to purge reasons', width - 20, height - 100);
    }
    
    if (this.emotionBubbles.length > 0) {
      context.fillStyle = 'rgba(0, 255, 0, 0.7)';
      context.font = '14px Arial';
      context.textAlign = 'right';
      context.fillText('Press E to purge emotions', width - 20, height - 80);
    }
    
    // Audio controls hint
    context.fillStyle = 'rgba(255, 255, 255, 0.6)';
    context.font = '12px Arial';
    context.textAlign = 'right';
    context.fillText('SPACE = play/pause | R = reset audio', width - 20, height - 40);
  }
  
  // Handle keyboard inputs
  handleKeyPress(key) {
    switch(key.toLowerCase()) {
      case 'r':
        this.purgeReasonBubbles();
        break;
      case 'e':
        this.purgeEmotionBubbles();
        break;
    }
  }
  
  isComplete(time) {
    return false; // Phase continues indefinitely
  }
  
  destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }
}

module.exports = Phase1;