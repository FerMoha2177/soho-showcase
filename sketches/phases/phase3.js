
// phases/phase3-current.js
// phases/phase3-current.js
const { gratitudeResponses, concernResponses, copingMechanisms } = require('../data/survey-data');

// Identity Core (central immigrant self)
class IdentityCore {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.pulsePhase = 0;
  }
  
  update(deltaTime) {
    this.pulsePhase += deltaTime;
  }
  
  render(context, time) {
    const pulseScale = Math.sin(this.pulsePhase * 1.5) * 0.15 + 1;
    const currentRadius = this.radius * pulseScale;
    
    // Outer glow (identity energy)
    const outerGlow = context.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, currentRadius * 2
    );
    outerGlow.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    outerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    context.fillStyle = outerGlow;
    context.beginPath();
    context.arc(this.x, this.y, currentRadius * 2, 0, Math.PI * 2);
    context.fill();
    
    // Main identity core gradient
    const coreGradient = context.createRadialGradient(
      this.x - currentRadius * 0.3, this.y - currentRadius * 0.3, 0,
      this.x, this.y, currentRadius
    );
    coreGradient.addColorStop(0, '#FFD700');  // Gold center
    coreGradient.addColorStop(0.4, '#FF8C00'); // Orange
    coreGradient.addColorStop(0.8, '#FF4500'); // Red-orange
    coreGradient.addColorStop(1, '#DC143C');   // Deep red edge
    
    // Draw core
    context.fillStyle = coreGradient;
    context.beginPath();
    context.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    context.fill();
    
    // Inner highlight
    const highlight = context.createRadialGradient(
      this.x - currentRadius * 0.4, this.y - currentRadius * 0.4, 0,
      this.x - currentRadius * 0.2, this.y - currentRadius * 0.2, currentRadius * 0.5
    );
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = highlight;
    context.beginPath();
    context.arc(this.x - currentRadius * 0.3, this.y - currentRadius * 0.3, currentRadius * 0.3, 0, Math.PI * 2);
    context.fill();
  }
}

// Base Orbital Bubble
class OrbitalBubble {
  constructor(data, centerX, centerY, type = 'gratitude') {
    this.word = data.word;
    this.color = data.color;
    this.responses = data.responses;
    this.orbitRadius = data.orbitRadius;
    this.orbitSpeed = data.orbitSpeed;
    this.type = type;
    
    // Orbital mechanics
    this.centerX = centerX;
    this.centerY = centerY;
    this.angle = Math.random() * Math.PI * 2; // Random starting position
    this.direction = type === 'gratitude' ? 1 : -1; // Gratitude clockwise, concerns counter-clockwise
    
    // Bubble properties
    this.bubbleRadius = 20 + (data.responses / 25) * 30; // Size based on responses
    this.age = 0;
    this.spawnTime = 0.5;
    
    // Visual effects
    this.trailPoints = [];
    this.maxTrailLength = 20;
    
    // Calculate initial position
    this.updatePosition();
  }
  
  updatePosition() {
    this.x = this.centerX + Math.cos(this.angle) * this.orbitRadius;
    this.y = this.centerY + Math.sin(this.angle) * this.orbitRadius;
  }
  
  update(deltaTime) {
    this.age += deltaTime;
    
    // Update orbital position
    this.angle += this.orbitSpeed * this.direction * deltaTime;
    this.updatePosition();
    
    // Add trail point
    if (this.age > this.spawnTime) {
      this.trailPoints.push({ 
        x: this.x, 
        y: this.y, 
        age: 0,
        alpha: 1 
      });
      
      if (this.trailPoints.length > this.maxTrailLength) {
        this.trailPoints.shift();
      }
    }
    
    // Age trail points
    this.trailPoints.forEach(point => {
      point.age += deltaTime;
      point.alpha = Math.max(0, 1 - (point.age / 3)); // Fade over 3 seconds
    });
  }
  
  render(context, time) {
    // Don't render until spawned
    if (this.age < this.spawnTime) {
      return;
    }
    
    // Render trail
    this.renderTrail(context);
    
    // Current radius with spawn animation
    const spawnProgress = Math.min(1, (this.age - this.spawnTime) / 0.5);
    const currentRadius = this.bubbleRadius * spawnProgress;
    
    if (currentRadius <= 0) return;
    
    // Create bubble gradient
    const gradient = context.createRadialGradient(
      this.x - currentRadius * 0.3, this.y - currentRadius * 0.3, 0,
      this.x, this.y, currentRadius
    );
    
    if (this.type === 'gratitude') {
      // Warm, positive glow
      gradient.addColorStop(0, this.color + 'FF');
      gradient.addColorStop(0.7, this.color + 'AA');
      gradient.addColorStop(1, this.color + '44');
    } else {
      // Warning/concern styling
      gradient.addColorStop(0, this.color + 'DD');
      gradient.addColorStop(0.6, this.color + '88');
      gradient.addColorStop(1, this.color + '22');
    }
    
    // Draw main bubble
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    context.fill();
    
    // Add glow effect
    this.renderGlow(context, currentRadius, time);
    
    // Render text
    this.renderText(context, currentRadius);
  }
  
  renderTrail(context) {
    if (this.trailPoints.length < 2) return;
    
    const trailColor = this.type === 'gratitude' ? '100, 255, 100' : '255, 100, 100';
    
    for (let i = 1; i < this.trailPoints.length; i++) {
      const point = this.trailPoints[i];
      const prevPoint = this.trailPoints[i - 1];
      
      if (point.alpha > 0) {
        context.strokeStyle = `rgba(${trailColor}, ${point.alpha * 0.3})`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(prevPoint.x, prevPoint.y);
        context.lineTo(point.x, point.y);
        context.stroke();
      }
    }
  }
  
  renderGlow(context, radius, time) {
    const pulseIntensity = Math.sin(time * 2 + this.angle) * 0.3 + 0.7;
    
    if (this.type === 'gratitude') {
      // Sparkle effects for gratitude
      for (let i = 0; i < 3; i++) {
        const sparkleAngle = time * 3 + i * (Math.PI * 2 / 3);
        const sparkleX = this.x + Math.cos(sparkleAngle) * radius * 0.7;
        const sparkleY = this.y + Math.sin(sparkleAngle) * radius * 0.7;
        
        context.fillStyle = `rgba(255, 255, 255, ${pulseIntensity * 0.8})`;
        context.beginPath();
        context.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        context.fill();
      }
    } else {
      // Warning pulse for concerns
      context.strokeStyle = `rgba(255, 0, 0, ${pulseIntensity * 0.4})`;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(this.x, this.y, radius + 3, 0, Math.PI * 2);
      context.stroke();
    }
  }
  
  renderText(context, radius) {
    if (radius < 15) return; // Don't show text on very small bubbles
    
    context.fillStyle = this.type === 'gratitude' ? '#FFFFFF' : '#FFFFFF';
    context.font = `bold ${Math.min(14, radius / 3)}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Handle multi-line text
    const lines = this.word.split('\n');
    const lineHeight = Math.min(16, radius / 2.5);
    const startY = this.y - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      context.fillText(line, this.x, startY + index * lineHeight);
    });
  }
}

class Phase3 {
  constructor(context, width, height) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    
    // Create identity core
    this.identityCore = new IdentityCore(this.centerX, this.centerY, 35);
    
    // Create orbital bubbles
    this.gratitudeBubbles = [];
    this.concernBubbles = [];
    this.copingBubbles = [];
    
    this.spawnBubbles();
    
    console.log('Phase 3 initialized with orbital system');
  }
  
  spawnBubbles() {
    // Create gratitude bubbles (clockwise)
    gratitudeResponses.forEach((data, index) => {
      const bubble = new OrbitalBubble(data, this.centerX, this.centerY, 'gratitude');
      bubble.age = -index * 0.3; // Stagger spawn times
      this.gratitudeBubbles.push(bubble);
    });
    
    // Create concern bubbles (counter-clockwise)
    concernResponses.forEach((data, index) => {
      const bubble = new OrbitalBubble(data, this.centerX, this.centerY, 'concern');
      bubble.age = -index * 0.25; // Slightly different stagger
      this.concernBubbles.push(bubble);
    });
    
    // Create coping mechanism bubbles (fast inner orbits)
    copingMechanisms.forEach((data, index) => {
      const bubble = new OrbitalBubble(data, this.centerX, this.centerY, 'coping');
      bubble.age = -index * 0.2;
      this.copingBubbles.push(bubble);
    });
  }
  
  render({ context, time, width, height }) {
    // Dark space background
    context.fillStyle = '#0a0a0a';
    context.fillRect(0, 0, width, height);
    
    // Draw subtle orbital guides
    this.renderOrbitalGuides(context);
    
    // Update and render identity core
    const deltaTime = 1/60;
    this.identityCore.update(deltaTime);
    this.identityCore.render(context, time);
    
    // Update and render all orbital bubbles
    const allBubbles = [
      ...this.gratitudeBubbles,
      ...this.concernBubbles,
      ...this.copingBubbles
    ];
    
    allBubbles.forEach(bubble => {
      bubble.update(deltaTime);
      bubble.render(context, time);
    });
  }
  
  renderOrbitalGuides(context) {
    // Draw very subtle orbital paths
    const orbits = [70, 75, 80, 85, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250];
    
    context.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    context.lineWidth = 1;
    
    orbits.forEach(radius => {
      context.beginPath();
      context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
      context.stroke();
    });
  }
  
  isComplete(time) {
    return time > 30; // 30 seconds to appreciate the orbital dance
  }
}

module.exports = Phase3;