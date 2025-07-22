// 2D Orbital System for Phase 3
// Extends your existing bubble system with orbital mechanics

const { Bubble } = require('./bubble');

class OrbitalBubble extends Bubble {
    constructor(data, container, orbitConfig, audioSystem = null) {
      super(data, container);
      
      // Orbital properties
      this.centerX = container.width / 2;
      this.centerY = container.height / 2;
      this.orbitRadius = orbitConfig.radius;
      this.orbitSpeed = orbitConfig.speed;
      this.orbitDirection = orbitConfig.direction; // 1 or -1
      this.orbitAngle = orbitConfig.startAngle || Math.random() * Math.PI * 2;
      
      // Override physics for orbital movement
      this.gravity = 0;
      this.friction = 1; // No friction in space!
      
      // Calculate initial position
      this.updateOrbitalPosition();
      
      // Visual enhancements for space theme
      this.glowIntensity = data.responses / 20; // Glow based on survey responses
      this.trailPoints = []; // For orbital trails
      this.maxTrailLength = 50;

      // Audio-reactive properties
      this.audioData = null;
      this.backgroundGradientOffset = 0;
      this.beatEffects = [];
      this.lastBeatTime = 0;
    }
    
    updateOrbitalPosition() {
      this.x = this.centerX + Math.cos(this.orbitAngle) * this.orbitRadius;
      this.y = this.centerY + Math.sin(this.orbitAngle) * this.orbitRadius;
    }
    
    update(deltaTime) {
      this.age += deltaTime;
      
      // Update orbital motion
      this.orbitAngle += this.orbitSpeed * this.orbitDirection * deltaTime;
      this.updateOrbitalPosition();
      
      // Add to trail
      this.trailPoints.push({ x: this.x, y: this.y, age: 0 });
      if (this.trailPoints.length > this.maxTrailLength) {
        this.trailPoints.shift();
      }
      
      // Age trail points
      this.trailPoints.forEach(point => point.age += deltaTime);
      
      // Handle spawn animation
      if (this.age < this.spawnTime) {
        const progress = this.age / this.spawnTime;
        this.currentRadius = this.targetRadius * progress;
      } else {
        this.currentRadius = this.targetRadius;
      }
    }
    
    renderTrail(context) {
      if (this.trailPoints.length < 2) return;
      
      context.beginPath();
      context.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
      
      for (let i = 1; i < this.trailPoints.length; i++) {
        const point = this.trailPoints[i];
        const alpha = 1 - (point.age / 2); // Fade over 2 seconds
        
        if (alpha > 0) {
          context.lineTo(point.x, point.y);
        }
      }
      
      context.strokeStyle = `rgba(255, 255, 255, 0.1)`;
      context.lineWidth = 1;
      context.stroke();
    }
  }
  
  // Gratitude Bubble (warm colors, clockwise orbits)
  class GratitudeBubble extends OrbitalBubble {
    constructor(data, container, orbitConfig) {
      super(data, container, { ...orbitConfig, direction: 1 });
      this.type = 'gratitude';
      this.baseColor = this.getGratitudeColor(data.word);
    }
    
    getGratitudeColor(word) {
      const gratitudeColors = {
        'Friends': '#4CAF50',      // Green
        'Community': '#2196F3',    // Blue  
        'Education': '#FF9800',    // Orange
        'Freedom': '#9C27B0',      // Purple
        'Safety': '#00BCD4',       // Cyan
        'Growth': '#8BC34A',       // Light green
        'Economic Stability': '#FFC107', // Amber
        'Culture': '#E91E63',      // Pink
        'English': '#673AB7',      // Deep purple
        'Home': '#795548'          // Brown
      };
      
      return gratitudeColors[word] || '#4CAF50';
    }
    
    render(context, time) {
      if (this.currentRadius <= 0) return;
      
      // Render orbital trail
      this.renderTrail(context);
      
      // Create warm glow effect
      const gradient = context.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.currentRadius * 1.5
      );
      
      const pulseIntensity = Math.sin(time * 2 + this.animationOffset) * 0.3 + 0.7;
      
      gradient.addColorStop(0, this.baseColor);
      gradient.addColorStop(0.7, this.baseColor + '80');
      gradient.addColorStop(1, this.baseColor + '00');
      
      // Draw glow
      context.beginPath();
      context.arc(this.x, this.y, this.currentRadius * 1.5, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
      
      // Draw main bubble
      context.beginPath();
      context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
      context.fillStyle = this.baseColor;
      context.fill();
      
      // Add sparkle effects for positive emotions
      this.renderSparkles(context, time);
      
      // Text
      this.renderText(context);
    }
    
    renderSparkles(context, time) {
      for (let i = 0; i < 3; i++) {
        const angle = time * 3 + this.animationOffset + i * (Math.PI * 2 / 3);
        const sparkleX = this.x + Math.cos(angle) * this.currentRadius * 0.8;
        const sparkleY = this.y + Math.sin(angle) * this.currentRadius * 0.8;
        const sparkleAlpha = Math.sin(time * 5 + i) * 0.5 + 0.5;
        
        context.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha * 0.8})`;
        context.beginPath();
        context.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        context.fill();
      }
    }
  }
  
  // Concern Bubble (cooler colors, counter-clockwise orbits)
  class ConcernBubble extends OrbitalBubble {
    constructor(data, container, orbitConfig) {
      super(data, container, { ...orbitConfig, direction: -1 });
      this.type = 'concern';
      this.baseColor = this.getConcernColor(data.word);
    }
    
    getConcernColor(word) {
      const concernColors = {
        'Disinformation': '#F44336',     // Red
        'Racism': '#D32F2F',             // Dark red
        'Government Abuse': '#B71C1C',   // Very dark red
        'Rights Not Valued': '#FF5722',  // Deep orange
        'Education Decay': '#795548',    // Brown
        'Economic Instability': '#607D8B', // Blue gray
        'Having to Leave': '#424242',    // Dark gray
        'Lack of Freedom': '#263238',    // Very dark blue-gray
        'Justice Distrust': '#37474F',   // Dark blue-gray
        'Anti-Environment': '#4E342E'    // Dark brown
      };
      
      return concernColors[word] || '#F44336';
    }
    
    render(context, time) {
      if (this.currentRadius <= 0) return;
      
      // Render orbital trail (darker)
      this.renderDarkTrail(context);
      
      // Create warning glow effect
      const gradient = context.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.currentRadius * 1.3
      );
      
      const pulseIntensity = Math.sin(time * 3 + this.animationOffset) * 0.4 + 0.6;
      
      gradient.addColorStop(0, this.baseColor);
      gradient.addColorStop(0.6, this.baseColor + '60');
      gradient.addColorStop(1, this.baseColor + '00');
      
      // Draw warning glow
      context.beginPath();
      context.arc(this.x, this.y, this.currentRadius * 1.3, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
      
      // Draw main bubble with pulsing border
      context.beginPath();
      context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
      context.fillStyle = this.baseColor;
      context.fill();
      
      // Pulsing warning border
      context.beginPath();
      context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(255, 0, 0, ${pulseIntensity * 0.6})`;
      context.lineWidth = 3;
      context.stroke();
      
      // Text
      this.renderText(context);
    }
    
    renderDarkTrail(context) {
      if (this.trailPoints.length < 2) return;
      
      context.beginPath();
      context.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
      
      for (let i = 1; i < this.trailPoints.length; i++) {
        const point = this.trailPoints[i];
        const alpha = 1 - (point.age / 2);
        
        if (alpha > 0) {
          context.lineTo(point.x, point.y);
        }
      }
      
      context.strokeStyle = `rgba(255, 100, 100, 0.1)`;
      context.lineWidth = 1;
      context.stroke();
    }
  }
  
  // Central Identity Core
  class IdentityCore {
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.pulseOffset = 0;
    }
    
    render(context, time) {
      const pulseScale = Math.sin(time * 1.5) * 0.1 + 1;
      const currentRadius = this.radius * pulseScale;
      
      // Create warm identity gradient
      const gradient = context.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, currentRadius
      );
      
      gradient.addColorStop(0, '#FFD700');  // Golden center
      gradient.addColorStop(0.5, '#FF8C00'); // Orange
      gradient.addColorStop(1, '#FF4500');   // Red-orange edge
      
      // Draw core
      context.beginPath();
      context.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
      
      // Add inner glow
      const innerGradient = context.createRadialGradient(
        this.x - currentRadius * 0.3, this.y - currentRadius * 0.3, 0,
        this.x, this.y, currentRadius * 0.7
      );
      
      innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      context.beginPath();
      context.arc(this.x, this.y, currentRadius * 0.7, 0, Math.PI * 2);
      context.fillStyle = innerGradient;
      context.fill();
    }
  }
  
  // Phase 3 Orbital System
  class Phase3OrbitalSystem {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.center = { x: width / 2, y: height / 2 };
      
      // Create identity core
      this.identityCore = new IdentityCore(this.center.x, this.center.y, 40);
      
      // Create orbital bubbles
      this.gratitudeBubbles = [];
      this.concernBubbles = [];
      
      this.setupOrbitalBubbles();
    }
    
    setupOrbitalBubbles() {
      // Gratitude data with orbital configurations
      const gratitudeData = [
        { word: 'Friends', responses: 15, orbit: { radius: 120, speed: 0.5 } },
        { word: 'Community', responses: 12, orbit: { radius: 160, speed: 0.4 } },
        { word: 'Freedom', responses: 18, orbit: { radius: 200, speed: 0.3 } },
        { word: 'Safety', responses: 10, orbit: { radius: 100, speed: 0.6 } },
        { word: 'Education', responses: 8, orbit: { radius: 140, speed: 0.45 } }
      ];
      
      // Concern data with orbital configurations  
      const concernData = [
        { word: 'Racism', responses: 20, orbit: { radius: 180, speed: 0.35 } },
        { word: 'Disinformation', responses: 16, orbit: { radius: 220, speed: 0.25 } },
        { word: 'Rights Not Valued', responses: 14, orbit: { radius: 150, speed: 0.4 } },
        { word: 'Government Abuse', responses: 12, orbit: { radius: 190, speed: 0.3 } }
      ];
      
      // Create gratitude bubbles
      gratitudeData.forEach((data, i) => {
        const orbitConfig = {
          ...data.orbit,
          startAngle: (i / gratitudeData.length) * Math.PI * 2
        };
        
        const container = { width: this.width, height: this.height };
        this.gratitudeBubbles.push(new GratitudeBubble(data, container, orbitConfig));
      });
      
      // Create concern bubbles
      concernData.forEach((data, i) => {
        const orbitConfig = {
          ...data.orbit,
          startAngle: (i / concernData.length) * Math.PI * 2
        };
        
        const container = { width: this.width, height: this.height };
        this.concernBubbles.push(new ConcernBubble(data, container, orbitConfig));
      });
    }
    
    render(context, time) {
      // Dark space background
      context.fillStyle = '#0a0a0a';
      context.fillRect(0, 0, this.width, this.height);
      
      // Draw orbital paths (optional, subtle)
      this.renderOrbitalPaths(context);
      
      // Render identity core
      this.identityCore.render(context, time);
      
      // Update and render all orbital bubbles
      const deltaTime = 1/60;
      
      [...this.gratitudeBubbles, ...this.concernBubbles].forEach(bubble => {
        bubble.update(deltaTime);
        bubble.render(context, time);
      });
    }
    
    renderOrbitalPaths(context) {
      // Draw subtle orbital guides
      const allRadii = [100, 120, 140, 150, 160, 180, 190, 200, 220];
      
      context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      context.lineWidth = 1;
      
      allRadii.forEach(radius => {
        context.beginPath();
        context.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2);
        context.stroke();
      });
    }
  }
  
  module.exports = {
    OrbitalBubble,
    GratitudeBubble, 
    ConcernBubble,
    IdentityCore,
    Phase3OrbitalSystem
  };