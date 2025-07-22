// physics/orbital-bubble.js - Fixed orbital system

class OrbitalBubble {
  constructor(data, centerX, centerY, type = 'gratitude', audioSystem = null) {
    this.word = data.word;
    this.color = data.color;
    this.responses = data.responses;
    this.type = type;
    
    // Set base orbital properties from data first
    this.baseOrbitRadius = data.orbitRadius || 120;
    this.baseOrbitSpeed = data.orbitSpeed || 0.5;
    
    // Calculate gravitational properties based on response magnitude
    this.actualOrbitRadius = this.calculateGravitationalRadius();
    this.orbitSpeed = this.calculateGravitationalSpeed();
    
    // Orbital mechanics
    this.centerX = centerX;
    this.centerY = centerY;
    this.angle = Math.random() * Math.PI * 2;
    this.direction = this.getOrbitDirection();
    
    // Bubble properties
    this.bubbleRadius = this.calculateBubbleRadius();
    this.age = 0;
    this.spawnTime = 0.5;
    
    // Gravitational effects
    this.mass = this.responses; // Mass = response count
    this.gravitationalPull = this.calculateGravitationalPull();
    
    // Visual effects
    this.trailPoints = [];
    this.maxTrailLength = Math.floor(15 + (this.responses / 25) * 15); // More responses = longer trails
    
    // Audio-reactive properties
    this.audioSystem = audioSystem;
    this.beatScale = 1;
    this.lastBeatTime = 0;
    this.audioSpeedModifier = 1;
    
    this.updatePosition();
  }
  
  getOrbitDirection() {
    switch(this.type) {
      case 'gratitude': return 1;    // Clockwise
      case 'concern': return -1;     // Counter-clockwise
      case 'coping': return 1;       // Clockwise (inner orbits)
      default: return 1;
    }
  }
  
  calculateBubbleRadius() {
    // INCREASED BUBBLE SIZES FOR BETTER READABILITY
    const baseSize = this.type === 'coping' ? 25 : 30; // Increased from 15/20
    const maxSize = this.type === 'coping' ? 45 : 55;  // Increased from 35/45
    return baseSize + (this.responses / 25) * maxSize;
  }
  
  calculateGravitationalSpeed() {
    // Higher responses = stronger gravitational pull = faster orbit
    const responseWeight = Math.min(this.responses / 25, 1); // Normalize to 0-1, cap at 1
    
    // Gravitational speed modifier based on response magnitude
    const gravityMultiplier = 0.5 + (responseWeight * 1.5); // Range: 0.5x to 2x speed
    
    return this.baseOrbitSpeed * gravityMultiplier;
  }
  
  calculateGravitationalRadius() {
    // More responses = different orbital distance based on sentiment type
    const responseWeight = Math.min(this.responses / 25, 1); // Normalize and cap
    const baseRadius = this.baseOrbitRadius;
    
    // INCREASED SPACING FOR BETTER READABILITY
    if (this.type === 'concern') {
      // Concerns: Push much further from center with more spacing
      return baseRadius + (responseWeight * 120) + 100; // Extra 100px spacing
    } else if (this.type === 'coping') {
      // Coping: Stay close to center with better spacing
      return Math.max(baseRadius - (responseWeight * 15), 80); // Minimum 80px
    } else {
      // Gratitude: Pull closer but with adequate spacing
      return Math.max(baseRadius - (responseWeight * 30), 120); // Minimum 120px
    }
  }
  
  updatePosition() {
    // Use the gravitationally-calculated radius
    this.x = this.centerX + Math.cos(this.angle) * this.actualOrbitRadius;
    this.y = this.centerY + Math.sin(this.angle) * this.actualOrbitRadius;
  }
  
  calculateGravitationalPull() {
    // Simulate gravitational attraction based on response magnitude
    return Math.max(this.responses / 10, 0.5); // Minimum 0.5, prevents division by zero
  }
  
  // Audio reactive methods
  onBeat(bassLevel) {
    this.beatScale = 1 + (bassLevel * 0.3);
    this.lastBeatTime = Date.now();
    
    if (this.trailPoints.length > 0) {
      this.trailPoints[this.trailPoints.length - 1].beatEffect = bassLevel;
    }
  }
  
  onAudioUpdate(audioData) {
    if (audioData?.frequencies) {
      const midFreq = audioData.frequencies[Math.floor(audioData.frequencies.length * 0.3)];
      this.audioSpeedModifier = 1 + (midFreq / 255) * 0.5;
    }
  }
  
  update(deltaTime) {
    this.age += deltaTime;
    
    // Beat scale decay
    const timeSinceBeat = (Date.now() - this.lastBeatTime) / 1000;
    this.beatScale = Math.max(1, this.beatScale - timeSinceBeat * 2);
    
    // Update orbital position with gravitational and audio effects
    const finalSpeed = this.orbitSpeed * this.gravitationalPull * this.direction * deltaTime * this.audioSpeedModifier;
    
    this.angle += finalSpeed;
    this.updatePosition();
    
    // Manage trail
    if (this.age > this.spawnTime) {
      this.trailPoints.push({ 
        x: this.x, 
        y: this.y, 
        age: 0,
        alpha: 1,
        beatEffect: 0
      });
      
      if (this.trailPoints.length > this.maxTrailLength) {
        this.trailPoints.shift();
      }
    }
    
    // Age trail points
    this.trailPoints.forEach(point => {
      point.age += deltaTime;
      point.alpha = Math.max(0, 1 - (point.age / 3));
      point.beatEffect = Math.max(0, point.beatEffect - deltaTime * 2);
    });
  }
  
  render(context, time) {
    if (this.age < this.spawnTime) return;
    
    const spawnProgress = Math.min(1, (this.age - this.spawnTime) / 0.5);
    const currentRadius = this.bubbleRadius * spawnProgress * this.beatScale;
    
    if (currentRadius <= 0 || !isFinite(currentRadius)) return;
    
    // Render components
    this.renderTrail(context);
    this.renderBubble(context, currentRadius);
    this.renderTypeSpecificEffects(context, currentRadius, time);
    this.renderText(context, currentRadius);
  }
  
  renderTrail(context) {
    if (this.trailPoints.length < 2) return;
    
    const trailColor = this.getTrailColor();
    
    for (let i = 1; i < this.trailPoints.length; i++) {
      const point = this.trailPoints[i];
      const prevPoint = this.trailPoints[i - 1];
      
      if (point.alpha > 0 && isFinite(point.x) && isFinite(point.y) && 
          isFinite(prevPoint.x) && isFinite(prevPoint.y)) {
        const beatAlpha = point.beatEffect > 0 ? point.alpha + point.beatEffect * 0.5 : point.alpha;
        const lineWidth = 1 + point.beatEffect * 3;
        
        context.strokeStyle = `rgba(${trailColor}, ${beatAlpha * 0.4})`;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(prevPoint.x, prevPoint.y);
        context.lineTo(point.x, point.y);
        context.stroke();
      }
    }
  }
  
  renderBubble(context, currentRadius) {
    // Safety checks for finite values
    if (!isFinite(this.x) || !isFinite(this.y) || !isFinite(currentRadius)) {
      return;
    }
    
    const gradient = context.createRadialGradient(
      this.x - currentRadius * 0.3, 
      this.y - currentRadius * 0.3, 
      0,
      this.x, 
      this.y, 
      currentRadius
    );
    
    // Gravitational intensity affects bubble opacity and glow
    const gravityIntensity = Math.min(this.gravitationalPull / 2.5, 1); // Normalize and cap
    const alphaValue = this.beatScale > 1.1 ? 255 : Math.floor(180 + gravityIntensity * 75);
    const alpha = alphaValue.toString(16).padStart(2, '0');
    const config = this.getBubbleConfig();
    
    gradient.addColorStop(0, this.color + alpha);
    gradient.addColorStop(config.midStop, this.color + config.midAlpha);
    gradient.addColorStop(1, this.color + config.endAlpha);
    
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    context.fill();
    
    // Gravitational field visualization for high-response bubbles
    if (this.responses > 15) {
      this.renderGravitationalField(context, currentRadius);
    }
    
    // Audio-reactive glow
    if (this.beatScale > 1.1) {
      this.renderBeatGlow(context, currentRadius);
    }
  }
  
  renderGravitationalField(context, radius) {
    if (!isFinite(radius) || radius <= 0) return;
    
    // Draw gravitational field lines for high-magnitude responses
    const fieldRadius = radius * (2 + Math.min(this.gravitationalPull * 0.3, 1));
    
    if (!isFinite(fieldRadius)) return;
    
    const fieldGradient = context.createRadialGradient(
      this.x, this.y, radius,
      this.x, this.y, fieldRadius
    );
    
    const fieldColor = this.type === 'concern' ? '255, 100, 100' : '100, 255, 100';
    fieldGradient.addColorStop(0, `rgba(${fieldColor}, 0.1)`);
    fieldGradient.addColorStop(0.7, `rgba(${fieldColor}, 0.05)`);
    fieldGradient.addColorStop(1, `rgba(${fieldColor}, 0)`);
    
    context.fillStyle = fieldGradient;
    context.beginPath();
    context.arc(this.x, this.y, fieldRadius, 0, Math.PI * 2);
    context.fill();
    
    // Draw field strength indicators
    const numIndicators = Math.floor(this.responses / 5);
    for (let i = 0; i < numIndicators && i < 8; i++) { // Cap at 8 indicators
      const indicatorAngle = (i / numIndicators) * Math.PI * 2;
      const indicatorRadius = radius + 10 + (i * 8);
      const indicatorX = this.x + Math.cos(indicatorAngle) * indicatorRadius;
      const indicatorY = this.y + Math.sin(indicatorAngle) * indicatorRadius;
      
      if (isFinite(indicatorX) && isFinite(indicatorY)) {
        context.fillStyle = `rgba(${fieldColor}, ${Math.max(0.1, 0.3 - i * 0.05)})`;
        context.beginPath();
        context.arc(indicatorX, indicatorY, 2, 0, Math.PI * 2);
        context.fill();
      }
    }
  }
  
  renderTypeSpecificEffects(context, radius, time) {
    if (!isFinite(radius) || radius <= 0) return;
    
    switch(this.type) {
      case 'gratitude':
        this.renderSparkles(context, time, radius);
        break;
      case 'concern':
        this.renderWarningPulse(context, radius, time);
        break;
      case 'coping':
        this.renderCopingAura(context, radius, time);
        break;
    }
  }
  
  renderSparkles(context, time, radius) {
    const sparkleCount = this.beatScale > 1.1 ? 5 : 3;
    
    for (let i = 0; i < sparkleCount; i++) {
      const angle = time * 3 + i * (Math.PI * 2 / sparkleCount);
      const distance = radius * 0.7;
      const sparkleX = this.x + Math.cos(angle) * distance;
      const sparkleY = this.y + Math.sin(angle) * distance;
      const sparkleAlpha = Math.sin(time * 5 + i) * 0.5 + 0.5;
      
      if (isFinite(sparkleX) && isFinite(sparkleY)) {
        context.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha * this.beatScale})`;
        context.beginPath();
        context.arc(sparkleX, sparkleY, 2 * this.beatScale, 0, Math.PI * 2);
        context.fill();
      }
    }
  }
  
  renderWarningPulse(context, radius, time) {
    const pulseIntensity = Math.sin(time * 3) * 0.4 + 0.6;
    const warningAlpha = this.beatScale > 1.1 ? pulseIntensity * 0.8 : pulseIntensity * 0.4;
    
    context.strokeStyle = `rgba(255, 0, 0, ${warningAlpha})`;
    context.lineWidth = 2 * this.beatScale;
    context.beginPath();
    context.arc(this.x, this.y, radius + 3, 0, Math.PI * 2);
    context.stroke();
  }
  
  renderCopingAura(context, radius, time) {
    // Gentle pulsing aura for coping mechanisms
    const auraRadius = radius * (1.3 + Math.sin(time * 4) * 0.1);
    
    if (!isFinite(auraRadius) || auraRadius <= 0) return;
    
    const auraGradient = context.createRadialGradient(
      this.x, this.y, radius,
      this.x, this.y, auraRadius
    );
    
    auraGradient.addColorStop(0, this.color + '22');
    auraGradient.addColorStop(1, this.color + '00');
    
    context.fillStyle = auraGradient;
    context.beginPath();
    context.arc(this.x, this.y, auraRadius, 0, Math.PI * 2);
    context.fill();
  }
  
  renderBeatGlow(context, radius) {
    const glowRadius = radius * this.beatScale;
    
    if (!isFinite(glowRadius) || glowRadius <= 0) return;
    
    const glowGradient = context.createRadialGradient(
      this.x, this.y, radius,
      this.x, this.y, glowRadius
    );
    
    glowGradient.addColorStop(0, this.color + '44');
    glowGradient.addColorStop(1, this.color + '00');
    
    context.fillStyle = glowGradient;
    context.beginPath();
    context.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
    context.fill();
  }
  
  renderText(context, radius) {
    if (radius < 20 || !isFinite(radius)) return; // Increased threshold
    
    context.fillStyle = '#FFFFFF';
    context.font = `bold ${Math.min(18, radius / 2.5)}px Arial`; // Larger font, better ratio
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    const lines = this.word.split('\n');
    const lineHeight = Math.min(20, radius / 2); // Increased line height
    const startY = this.y - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      const textY = startY + index * lineHeight;
      if (isFinite(this.x) && isFinite(textY)) {
        context.fillText(line, this.x, textY);
      }
    });
  }
  
  // Helper methods for type-specific configurations
  getTrailColor() {
    switch(this.type) {
      case 'gratitude': return '100, 255, 100';
      case 'concern': return '255, 100, 100';
      case 'coping': return '255, 215, 0';
      default: return '255, 255, 255';
    }
  }
  
  getBubbleConfig() {
    switch(this.type) {
      case 'gratitude':
        return { midStop: 0.7, midAlpha: '88', endAlpha: '22' };
      case 'concern':
        return { midStop: 0.6, midAlpha: '77', endAlpha: '11' };
      case 'coping':
        return { midStop: 0.8, midAlpha: '99', endAlpha: '33' };
      default:
        return { midStop: 0.7, midAlpha: '88', endAlpha: '22' };
    }
  }
}

// Enhanced Identity Core
class IdentityCore {
  constructor(x, y, radius, audioSystem = null) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.pulsePhase = 0;
    this.audioSystem = audioSystem;
    this.beatScale = 1;
    this.lastBeatTime = 0;
  }
  
  onBeat(bassLevel) {
    this.beatScale = 1 + (bassLevel * 0.5);
    this.lastBeatTime = Date.now();
  }
  
  update(deltaTime) {
    this.pulsePhase += deltaTime;
    
    const timeSinceBeat = (Date.now() - this.lastBeatTime) / 1000;
    this.beatScale = Math.max(1, this.beatScale - timeSinceBeat * 2);
  }
  
  render(context, time) {
    const pulseScale = Math.sin(this.pulsePhase * 1.5) * 0.15 + 1;
    const currentRadius = this.radius * pulseScale * this.beatScale;
    
    if (!isFinite(currentRadius) || currentRadius <= 0) return;
    
    // Outer glow
    this.renderOuterGlow(context, currentRadius);
    
    // Main core
    this.renderCore(context, currentRadius);
    
    // Inner highlight
    this.renderHighlight(context, currentRadius);
  }
  
  renderOuterGlow(context, radius) {
    const glowIntensity = this.beatScale > 1.1 ? 0.5 : 0.3;
    const glowRadius = radius * 2.5;
    
    if (!isFinite(glowRadius) || glowRadius <= 0) return;
    
    const outerGlow = context.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, glowRadius
    );
    outerGlow.addColorStop(0, `rgba(255, 215, 0, ${glowIntensity})`);
    outerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    context.fillStyle = outerGlow;
    context.beginPath();
    context.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
    context.fill();
  }
  
  renderCore(context, radius) {
    const coreGradient = context.createRadialGradient(
      this.x - radius * 0.3, this.y - radius * 0.3, 0,
      this.x, this.y, radius
    );
    
    const beatBrightness = this.beatScale > 1.1 ? 1.2 : 1;
    coreGradient.addColorStop(0, `hsl(51, 100%, ${Math.min(70 * beatBrightness, 90)}%)`);
    coreGradient.addColorStop(0.4, `hsl(33, 100%, ${Math.min(60 * beatBrightness, 80)}%)`);
    coreGradient.addColorStop(0.8, `hsl(16, 100%, ${Math.min(50 * beatBrightness, 70)}%)`);
    coreGradient.addColorStop(1, `hsl(348, 83%, ${Math.min(45 * beatBrightness, 65)}%)`);
    
    context.fillStyle = coreGradient;
    context.beginPath();
    context.arc(this.x, this.y, radius, 0, Math.PI * 2);
    context.fill();
  }
  
  renderHighlight(context, radius) {
    const highlightRadius = radius * 0.5;
    const highlightX = this.x - radius * 0.2;
    const highlightY = this.y - radius * 0.2;
    
    if (!isFinite(highlightRadius) || highlightRadius <= 0) return;
    
    const highlight = context.createRadialGradient(
      this.x - radius * 0.4, this.y - radius * 0.4, 0,
      highlightX, highlightY, highlightRadius
    );
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = highlight;
    context.beginPath();
    context.arc(this.x - radius * 0.3, this.y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
    context.fill();
  }
}

module.exports = {
  OrbitalBubble,
  IdentityCore
};