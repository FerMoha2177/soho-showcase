// physics/bubble.js - Enhanced with hierarchy
const { reasonsForLeaving, emotionsDuringImmigration, helpingFactors } = require('../data/survey-data');

// Base Bubble Class
class Bubble {
  constructor(data, container) {
    this.word = data.word;
    this.responses = data.responses;
    this.container = container;
    
    // Physics properties
    this.targetRadius = this.calculateRadius(data.responses);
    this.currentRadius = 0;
    this.x = container.getRandomSpawnX(this.targetRadius);
    this.y = container.getSpawnY(this.targetRadius);
    this.velocityX = (Math.random() - 0.5) * 4;
    this.velocityY = -8 - Math.random() * 6;
    this.gravity = 0.4;
    this.bounce = 0.6 + Math.random() * 0.2;
    this.friction = 0.99;
    this.mass = this.targetRadius / 20;
    
    // Animation properties
    this.age = 0;
    this.spawnTime = 0.2;
    this.animationOffset = Math.random() * Math.PI * 2;
    
    // State
    this.isPopping = false;
    this.popStartTime = 0;
    this.popDuration = 0.3;
  }
  
  calculateRadius(responses) {
    const maxResponses = Math.max(...reasonsForLeaving.map(w => w.responses));
    return 50 + (responses / maxResponses) * 150;
  }
  
  update(deltaTime) {
    this.age += deltaTime;
    this.updatePhysics(deltaTime);
    this.container.handleCollisions(this);
  }
  
  updatePhysics(deltaTime) {
    // Handle popping animation when bubble is being destroyed
    if (this.isPopping) {
      const popProgress = (this.age - this.popStartTime) / this.popDuration;
      if (popProgress >= 1) {
        this.currentRadius = 0; // Bubble is gone
        return;
      }
      // Shrinking pop animation
      const popScale = 1 - Math.pow(popProgress, 2);
      this.currentRadius = this.targetRadius * popScale;
      return;
    }
    
    // Spawn animation (growing)
    if (this.age < this.spawnTime) {
      const progress = this.age / this.spawnTime;
      const popScale = progress < 0.7 ? 
        Math.pow(progress / 0.7, 0.5) : 
        1 + Math.sin((progress - 0.7) / 0.3 * Math.PI) * 0.3;
      this.currentRadius = this.targetRadius * popScale;
    } else {
      this.currentRadius = this.targetRadius;
    }
    
    // Physics (only if not popping and aged enough)
    if (!this.isPopping && this.age > 0.05) {
      this.velocityY += this.gravity;
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;
      
      this.x += this.velocityX * deltaTime * 60;
      this.y += this.velocityY * deltaTime * 60;
    }
  }
  
  // Start the popping animation
  startPop() {
    if (!this.isPopping) {
      this.isPopping = true;
      this.popStartTime = this.age;
    }
  }
  
  // Check if bubble is completely gone
  isDestroyed() {
    return this.isPopping && (this.age - this.popStartTime) >= this.popDuration;
  }
  
  // Override in subclasses
  render(context, time) {
    throw new Error('render method must be implemented in subclass');
  }
  
  // Helper to convert hex to RGB
  hexToRgb(hex) {
    if (Array.isArray(hex)) {
      return { r: hex[0] * 255, g: hex[1] * 255, b: hex[2] * 255 };
    }
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
  }
}

// Reason Bubble (dark, representing hardships)
class ReasonBubble extends Bubble {
  constructor(data, container) {
    super(data, container);
    this.type = 'reason';
    this.color = '#333333'; // Dark gray for reasons
    this.gravity = 0.4;
    this.friction = 0.99;
  }
  
  calculateRadius(responses) {
    const maxResponses = Math.max(...reasonsForLeaving.map(w => w.responses));
    return 50 + (responses / maxResponses) * 150;
  }
  
  render(context, time) {
    if (this.currentRadius <= 0) return;
    
    // Subtle gradient for depth
    const gradient = context.createRadialGradient(
      this.x - this.currentRadius * 0.3,
      this.y - this.currentRadius * 0.3,
      0,
      this.x,
      this.y,
      this.currentRadius
    );
    
    gradient.addColorStop(0, '#555555');
    gradient.addColorStop(0.7, '#333333');
    gradient.addColorStop(1, '#111111');
    
    // Main bubble
    context.beginPath();
    context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    
    // Subtle outline
    context.beginPath();
    context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(100, 100, 100, 0.6)';
    context.lineWidth = 2;
    context.stroke();
    
    // Small highlight
    context.beginPath();
    context.arc(
      this.x - this.currentRadius * 0.3,
      this.y - this.currentRadius * 0.3,
      this.currentRadius * 0.25,
      0, Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    context.fill();
    
    // Text
    if (this.currentRadius > 20 && this.age > this.spawnTime) {
      context.fillStyle = '#CCCCCC';
      context.font = `bold ${Math.min(40, this.currentRadius / 4)}px Helvetica`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(this.word, this.x, this.y);
    }
  }
}

// Emotion Bubble (colorful, representing feelings)
class EmotionBubble extends Bubble {
  constructor(data, container) {
    super(data, container);
    this.type = 'emotion';
    this.baseColor = data.color;
    this.color = this.hexToRgb(data.color);
    this.gravity = 0.3;
    this.friction = 0.99;
    this.spawnTime = 0.25;
  }
  
  calculateRadius(responses) {
    const maxResponses = Math.max(...emotionsDuringImmigration.map(w => w.responses));
    return 60 + (responses / maxResponses) * 120;
  }
  
  render(context, time) {
    if (this.currentRadius <= 0) return;
    
    const { r, g, b } = this.color;
    
    // Beautiful animated gradient with survey colors
    const gradient = context.createRadialGradient(
      this.x - this.currentRadius * 0.4,
      this.y - this.currentRadius * 0.4,
      0,
      this.x,
      this.y,
      this.currentRadius
    );
    
    // Create color variations
    const animationTime = time + this.animationOffset;
    const wave = Math.sin(animationTime * 2) * 0.2 + 0.8;
    
    const color1 = this.baseColor;
    const color2 = `rgb(${Math.floor(r * 0.6)}, ${Math.floor(g * 0.6)}, ${Math.floor(b * 0.6)})`;
    const color3 = `rgba(${Math.floor(r * 1.3)}, ${Math.floor(g * 1.3)}, ${Math.floor(b * 1.3)}, 0.8)`;
    
    gradient.addColorStop(0, color3); // Bright center
    gradient.addColorStop(0.5, color1); // Main survey color
    gradient.addColorStop(1, color2); // Darker edge
    
    // Draw main bubble
    context.beginPath();
    context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    
    // Animated outline with survey color
    const outlineAlpha = Math.sin(animationTime * 3) * 0.3 + 0.7;
    context.beginPath();
    context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${outlineAlpha})`;
    context.lineWidth = 3;
    context.stroke();
    
    // Bright highlight
    context.beginPath();
    context.arc(
      this.x - this.currentRadius * 0.4,
      this.y - this.currentRadius * 0.4,
      this.currentRadius * 0.2,
      0, Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fill();
    
    // Sparkle effects for emotions
    if (this.age > this.spawnTime) {
      for (let i = 0; i < 3; i++) {
        const angle = time * 2 + this.animationOffset + i * (Math.PI * 2 / 3);
        const sparkleX = this.x + Math.cos(angle) * this.currentRadius * 0.7;
        const sparkleY = this.y + Math.sin(angle) * this.currentRadius * 0.7;
        const sparkleAlpha = Math.sin(time * 4 + i) * 0.5 + 0.5;
        
        context.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha * 0.6})`;
        context.beginPath();
        context.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
        context.fill();
      }
    }
    
    // Text
    if (this.currentRadius > 20 && this.age > this.spawnTime) {
      context.fillStyle = '#FFFFFF';
      context.font = `bold ${Math.min(40, this.currentRadius / 4)}px Helvetica`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(this.word, this.x, this.y);
    }
  }
}

// Help Bubble (colorful, representing feelings)
class HelpBubble extends Bubble {
  constructor(data, container) {
    super(data, container);
    this.type = 'Tools';
    this.baseColor = data.color;
    this.color = this.hexToRgb(data.color);
    this.gravity = 0.3;
    this.friction = 0.99;
    this.spawnTime = 0.25;
  }
  
  calculateRadius(responses) {
    const maxResponses = Math.max(...helpingFactors.map(w => w.responses));
    return 60 + (responses / maxResponses) * 120;
  }
  
  render(context, time) {
    if (this.currentRadius <= 0) return;
    
    const { r, g, b } = this.color;
    
    // Beautiful animated gradient with survey colors
    const gradient = context.createRadialGradient(
      this.x - this.currentRadius * 0.4,
      this.y - this.currentRadius * 0.4,
      0,
      this.x,
      this.y,
      this.currentRadius
    );
    
    // Create color variations
    const animationTime = time + this.animationOffset;
    const wave = Math.sin(animationTime * 2) * 0.2 + 0.8;
    
    const color1 = this.baseColor;
    const color2 = `rgb(${Math.floor(r * 0.6)}, ${Math.floor(g * 0.6)}, ${Math.floor(b * 0.6)})`;
    const color3 = `rgba(${Math.floor(r * 1.3)}, ${Math.floor(g * 1.3)}, ${Math.floor(b * 1.3)}, 0.8)`;
    
    gradient.addColorStop(0, color3); // Bright center
    gradient.addColorStop(0.5, color1); // Main survey color
    gradient.addColorStop(1, color2); // Darker edge
    
    // Draw main bubble
    context.beginPath();
    context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    
    // Animated outline with survey color
    const outlineAlpha = Math.sin(animationTime * 3) * 0.3 + 0.7;
    context.beginPath();
    context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${outlineAlpha})`;
    context.lineWidth = 3;
    context.stroke();
    
    // Bright highlight
    context.beginPath();
    context.arc(
      this.x - this.currentRadius * 0.4,
      this.y - this.currentRadius * 0.4,
      this.currentRadius * 0.2,
      0, Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fill();
    
    // Sparkle effects for emotions
    if (this.age > this.spawnTime) {
      for (let i = 0; i < 3; i++) {
        const angle = time * 2 + this.animationOffset + i * (Math.PI * 2 / 3);
        const sparkleX = this.x + Math.cos(angle) * this.currentRadius * 0.7;
        const sparkleY = this.y + Math.sin(angle) * this.currentRadius * 0.7;
        const sparkleAlpha = Math.sin(time * 4 + i) * 0.5 + 0.5;
        
        context.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha * 0.6})`;
        context.beginPath();
        context.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
        context.fill();
      }
    }
    
    // Text
    if (this.currentRadius > 20 && this.age > this.spawnTime) {
      context.fillStyle = '#FFFFFF';
      context.font = `bold ${Math.min(40, this.currentRadius / 4)}px Helvetica`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(this.word, this.x, this.y);
    }
  }
}

// Bubble collision detection utility
class BubblePhysics {
  static checkCollisions(bubbles) {
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const bubble1 = bubbles[i];
        const bubble2 = bubbles[j];
        
        // Skip if either bubble is too young or popping
        if (bubble1.age < 0.1 || bubble2.age < 0.1 || 
            bubble1.isPopping || bubble2.isPopping) continue;
        
        const dx = bubble2.x - bubble1.x;
        const dy = bubble2.y - bubble1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = bubble1.currentRadius + bubble2.currentRadius;
        
        if (distance < minDistance && distance > 0) {
          // Collision response
          const overlap = minDistance - distance;
          const separationX = (dx / distance) * overlap * 0.5;
          const separationY = (dy / distance) * overlap * 0.5;
          
          bubble1.x -= separationX;
          bubble1.y -= separationY;
          bubble2.x += separationX;
          bubble2.y += separationY;
          
          // Velocity exchange based on mass
          const totalMass = bubble1.mass + bubble2.mass;
          const velocityChangeX = (bubble2.velocityX - bubble1.velocityX) * 0.5;
          const velocityChangeY = (bubble2.velocityY - bubble1.velocityY) * 0.5;
          
          bubble1.velocityX += velocityChangeX * (bubble2.mass / totalMass);
          bubble1.velocityY += velocityChangeY * (bubble2.mass / totalMass);
          bubble2.velocityX -= velocityChangeX * (bubble1.mass / totalMass);
          bubble2.velocityY -= velocityChangeY * (bubble1.mass / totalMass);
        }
      }
    }
  }
  
  static purgeBubbles(bubbles) {
    // Start pop animation for all bubbles
    bubbles.forEach(bubble => bubble.startPop());
    
    // Return only non-destroyed bubbles
    return bubbles.filter(bubble => !bubble.isDestroyed());
  }
}

module.exports = {
  Bubble,
  ReasonBubble,
  EmotionBubble,
  HelpBubble,
  BubblePhysics
};