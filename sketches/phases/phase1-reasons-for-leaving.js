// phases/phase1-reasons-for-leaving.js
const { createContainer } = require('../containers/container-system');
const { reasonsForLeaving, emotionsDuringImmigration } = require('../data/survey-data');

class Phase1 {
  constructor(width, height) {
    this.width = width;
    this.height = height;
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
    
    console.log('Phase 1 initialized with 2D context');
    
    // Add mouse click listener
    this.setupMouseListener();
  }
  
  setupMouseListener() {
    const handleClick = () => {
      if (this.reasonsComplete && !this.emotionsTriggered) {
        this.emotionsTriggered = true;
        this.nextEmotionTime = 0;
        console.log('Emotions triggered by mouse click!');
      }
    };
    
    document.addEventListener('click', handleClick);
    this.cleanup = () => document.removeEventListener('click', handleClick);
  }
  
  createReasonBubble(wordData) {
    const maxResponses = Math.max(...reasonsForLeaving.map(w => w.responses));
    const size = 50 + (wordData.responses / maxResponses) * 150;
    
    return {
      type: 'reason',
      word: wordData.word,
      x: this.container.getRandomSpawnX(size),
      y: this.container.getSpawnY(size),
      targetRadius: size,
      currentRadius: 0,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: -8 - Math.random() * 6,
      gravity: 0.4,
      bounce: 0.6 + Math.random() * 0.2,
      friction: 0.99,
      color: '#333333', // Dark gray for reasons
      spawnTime: 0.2,
      age: 0,
      mass: size / 20
    };
  }
  
  createEmotionBubble(wordData) {
    const maxResponses = Math.max(...emotionsDuringImmigration.map(w => w.responses));
    const size = 60 + (wordData.responses / maxResponses) * 120;
    
    return {
      type: 'emotion',
      word: wordData.word,
      x: this.container.getRandomSpawnX(size),
      y: this.container.getSpawnY(size),
      targetRadius: size,
      currentRadius: 0,
      velocityX: (Math.random() - 0.5) * 5,
      velocityY: -10 - Math.random() * 4,
      gravity: 0.3,
      bounce: 0.7 + Math.random() * 0.2,
      friction: 0.99,
      color: this.hexToRgb(wordData.color), // Convert color for gradients
      baseColor: wordData.color, // Keep original hex
      spawnTime: 0.25,
      age: 0,
      mass: size / 20,
      animationOffset: Math.random() * Math.PI * 2 // For gradient animation
    };
  }
  
  // Helper to convert hex to RGB for gradients
  hexToRgb(hex) {
    if (Array.isArray(hex)) {
      // Already RGB array, convert to object
      return { r: hex[0] * 255, g: hex[1] * 255, b: hex[2] * 255 };
    }
    
    // Convert hex string to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
  }
  
  updateBubble(bubble, deltaTime) {
    bubble.age += deltaTime;
    
    // Pop animation
    if (bubble.age < bubble.spawnTime) {
      const progress = bubble.age / bubble.spawnTime;
      const popScale = progress < 0.7 ? 
        progress * 1.4 : 
        1.4 - (progress - 0.7) * 1.33;
      bubble.currentRadius = bubble.targetRadius * Math.min(popScale, 1.0);
    } else {
      bubble.currentRadius = bubble.targetRadius;
    }
    
    // Physics
    if (bubble.age > 0.05) {
      bubble.velocityY += bubble.gravity;
      bubble.velocityX *= bubble.friction;
      bubble.velocityY *= bubble.friction;
      
      bubble.x += bubble.velocityX;
      bubble.y += bubble.velocityY;
      
      // Container collisions
      this.container.handleCollisions(bubble);
    }
  }
  
  checkCollisions(bubbles) {
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const b1 = bubbles[i];
        const b2 = bubbles[j];
        
        if (b1.age < 0.1 || b2.age < 0.1) continue;
        
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = b1.currentRadius + b2.currentRadius;
        
        if (distance < minDistance) {
          // Separation and collision response
          const overlap = minDistance - distance;
          const separationX = (dx / distance) * overlap * 0.5;
          const separationY = (dy / distance) * overlap * 0.5;
          
          b1.x -= separationX;
          b1.y -= separationY;
          b2.x += separationX;
          b2.y += separationY;
          
          const totalMass = b1.mass + b2.mass;
          const force = 0.3;
          const forceX = (dx / distance) * force;
          const forceY = (dy / distance) * force;
          
          b1.velocityX -= forceX * (b2.mass / totalMass);
          b1.velocityY -= forceY * (b2.mass / totalMass);
          b2.velocityX += forceX * (b1.mass / totalMass);
          b2.velocityY += forceY * (b1.mass / totalMass);
        }
      }
    }
  }
  
  // Draw reason bubble (simple with outline)
  drawReasonBubble(context, bubble) {
    // Main bubble
    context.beginPath();
    context.arc(bubble.x, bubble.y, bubble.currentRadius, 0, Math.PI * 2);
    context.fillStyle = bubble.color;
    context.fill();
    
    // White outline
    context.beginPath();
    context.arc(bubble.x, bubble.y, bubble.currentRadius, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    context.lineWidth = 2;
    context.stroke();
    
    // Highlight
    context.beginPath();
    context.arc(
      bubble.x - bubble.currentRadius * 0.3,
      bubble.y - bubble.currentRadius * 0.3,
      bubble.currentRadius * 0.25,
      0, Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 255, 255, 0.4)';
    context.fill();
  }
  
  // Draw emotion bubble with animated gradient
  drawEmotionBubble(context, bubble, time) {
    const { r, g, b } = bubble.color;
    
    // Create animated radial gradient
    const gradient = context.createRadialGradient(
      bubble.x - bubble.currentRadius * 0.3,
      bubble.y - bubble.currentRadius * 0.3,
      0,
      bubble.x,
      bubble.y,
      bubble.currentRadius
    );
    
    // Animate gradient colors
    const animationTime = time + bubble.animationOffset;
    const wave1 = Math.sin(animationTime * 2) * 0.3 + 0.7;
    const wave2 = Math.cos(animationTime * 1.5) * 0.2 + 0.8;
    
    // Create color variations
    const color1 = `rgba(${Math.floor(r * wave1)}, ${Math.floor(g * wave1)}, ${Math.floor(b * wave1)}, 1)`;
    const color2 = `rgba(${Math.floor(r * wave2 * 0.6)}, ${Math.floor(g * wave2 * 0.6)}, ${Math.floor(b * wave2 * 0.6)}, 0.8)`;
    const color3 = `rgba(${Math.floor(r * 1.2)}, ${Math.floor(g * 1.2)}, ${Math.floor(b * 1.2)}, 0.6)`;
    
    gradient.addColorStop(0, color3); // Bright center
    gradient.addColorStop(0.5, color1); // Main color
    gradient.addColorStop(1, color2); // Darker edge
    
    // Draw main bubble
    context.beginPath();
    context.arc(bubble.x, bubble.y, bubble.currentRadius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    
    // Animated outline
    const outlineAlpha = Math.sin(animationTime * 3) * 0.3 + 0.7;
    context.beginPath();
    context.arc(bubble.x, bubble.y, bubble.currentRadius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${outlineAlpha})`;
    context.lineWidth = 3;
    context.stroke();
    
    // Bright highlight
    context.beginPath();
    context.arc(
      bubble.x - bubble.currentRadius * 0.4,
      bubble.y - bubble.currentRadius * 0.4,
      bubble.currentRadius * 0.2,
      0, Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fill();
  }
  
  render({ context, time, width, height }) {
    const deltaTime = 1/60;
    
    // Add reason bubbles
    if (!this.reasonsComplete && time > this.nextBubbleTime) {
      const totalReasonBubbles = reasonsForLeaving.length * this.maxIterations;
      if (this.reasonBubbles.length < totalReasonBubbles) {
        const dataIndex = this.bubbleIndex % reasonsForLeaving.length;
        this.reasonBubbles.push(this.createReasonBubble(reasonsForLeaving[dataIndex]));
        this.bubbleIndex++;
        this.nextBubbleTime = time + 0.5 + Math.random() * 0.3;
        console.log(`Added reason bubble: ${reasonsForLeaving[dataIndex].word}`);
      } else {
        this.reasonsComplete = true;
        console.log('All reason bubbles complete! Click to trigger emotions.');
      }
    }
    
    // Add emotion bubbles (triggered by mouse click)
    if (this.emotionsTriggered && time > this.nextEmotionTime) {
      if (this.emotionBubbleIndex < emotionsDuringImmigration.length) {
        const emotionData = emotionsDuringImmigration[this.emotionBubbleIndex];
        this.emotionBubbles.push(this.createEmotionBubble(emotionData));
        this.emotionBubbleIndex++;
        this.nextEmotionTime = time + 0.8 + Math.random() * 0.4;
        console.log(`Added emotion bubble: ${emotionData.word}`);
      }
    }
    
    // Update all bubbles
    this.reasonBubbles.forEach(bubble => this.updateBubble(bubble, deltaTime));
    this.emotionBubbles.forEach(bubble => this.updateBubble(bubble, deltaTime));
    
    // Handle collisions
    const allBubbles = [...this.reasonBubbles, ...this.emotionBubbles];
    this.checkCollisions(allBubbles);
    
    // Clear with dark background
    context.fillStyle = '#1a1a1a';
    context.fillRect(0, 0, width, height);
    
    // Draw container
    this.container.render2D(context);
    
    // Draw reason bubbles
    this.reasonBubbles.forEach(bubble => {
      if (bubble.currentRadius > 0) {
        this.drawReasonBubble(context, bubble);
      }
    });
    
    // Draw emotion bubbles with animated gradients
    this.emotionBubbles.forEach(bubble => {
      if (bubble.currentRadius > 0) {
        this.drawEmotionBubble(context, bubble, time);
      }
    });
    
    // Draw text labels
    allBubbles.forEach(bubble => {
      if (bubble.currentRadius > 20 && bubble.age > bubble.spawnTime) {
        context.fillStyle = bubble.type === 'emotion' ? '#FFFFFF' : '#CCCCCC';
        context.font = `${Math.min(40, bubble.currentRadius / 4)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(bubble.word, bubble.x, bubble.y);
      }
    });
    
    // UI
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.textAlign = 'left';
    context.fillText(`Reason Bubbles: ${this.reasonBubbles.length}`, 10, 25);
    context.fillText(`Emotion Bubbles: ${this.emotionBubbles.length}`, 10, 45);
    
    // Show interaction prompt
    if (this.reasonsComplete && !this.emotionsTriggered) {
      context.fillStyle = '#FFD700';
      context.font = 'bold 24px Arial';
      context.textAlign = 'center';
      context.fillText('🖱️ CLICK TO TRIGGER EMOTIONS', width / 2, height - 50);
    } else if (this.emotionsTriggered) {
      context.fillStyle = '#90EE90';
      context.font = '18px Arial';
      context.textAlign = 'center';
      context.fillText('✨ Emotions Activated!', width / 2, height - 50);
    }
  }
  
  isComplete(time) {
    return false;
  }
  
  destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }
}

module.exports = Phase1;