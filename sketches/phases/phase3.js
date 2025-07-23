// phases/phase3-current.js - Clean implementation
const { gratitudeResponses, concernResponses, copingMechanisms } = require('../data/survey-data');
const { OrbitalBubble, IdentityCore } = require('../physics/orbital-bubble');

class Phase3 {
  constructor(width, height, audioSystem = null) {
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.audioSystem = audioSystem;
    
    // Create identity core (LARGER SIZE)
    this.identityCore = new IdentityCore(this.centerX, this.centerY, 80, audioSystem); // Increased from 35
    
    // Create orbital systems
    this.orbitalSystems = {
      gratitude: [],
      concern: [],
      coping: []
    };
    
    this.initializeOrbitalSystems();
    
    console.log('Phase 3 initialized with clean orbital architecture');
  }
  
  initializeOrbitalSystems() {
    // Initialize gratitude bubbles (clockwise, warm colors)
    this.orbitalSystems.gratitude = gratitudeResponses.map((data, index) => {
      const bubble = new OrbitalBubble(data, this.centerX, this.centerY, 'gratitude', this.audioSystem);
      bubble.age = -index * 0.3; // Stagger spawn times
      return bubble;
    });
    
    // Initialize concern bubbles (counter-clockwise, warning colors)
    this.orbitalSystems.concern = concernResponses.map((data, index) => {
      const bubble = new OrbitalBubble(data, this.centerX, this.centerY, 'concern', this.audioSystem);
      bubble.age = -index * 0.25;
      return bubble;
    });
    
    // Initialize coping mechanism bubbles (fast inner orbits)
    this.orbitalSystems.coping = copingMechanisms.map((data, index) => {
      const bubble = new OrbitalBubble(data, this.centerX, this.centerY, 'coping', this.audioSystem);
      bubble.age = -index * 0.2;
      return bubble;
    });
  }
  
  // Audio callbacks - delegate to all orbital elements
  onBeat(bassLevel) {
    this.identityCore.onBeat(bassLevel);
    this.getAllBubbles().forEach(bubble => bubble.onBeat(bassLevel));
  }
  
  onAudioUpdate(audioData) {
    this.getAllBubbles().forEach(bubble => bubble.onAudioUpdate(audioData));
  }
  
  // Utility method to get all bubbles
  getAllBubbles() {
    return [
      ...this.orbitalSystems.gratitude,
      ...this.orbitalSystems.concern,
      ...this.orbitalSystems.coping
    ];
  }
  
  update(deltaTime) {
    // Update identity core
    this.identityCore.update(deltaTime);
    
    // Update all orbital systems
    this.getAllBubbles().forEach(bubble => bubble.update(deltaTime));
  }
  
  render({ context, time, width, height, audioData }) {
    // Audio-reactive background
    this.renderBackground(context, width, height, audioData);
    
    // Draw subtle orbital guides
    this.renderOrbitalGuides(context);
    
    // Render identity core
    this.identityCore.render(context, time);
    
    // Update and render all orbital bubbles
    const deltaTime = 1/60;
    this.update(deltaTime);
    
    // Render bubbles by layer (coping -> gratitude -> concerns)
    this.renderBubbleLayer(context, time, 'coping');
    this.renderBubbleLayer(context, time, 'gratitude');
    this.renderBubbleLayer(context, time, 'concern');
    
    // Show gravitational statistics and project context
    if (time < 180) { // Show for first 180 seconds
      this.renderProjectContext(context, width, height);
    }
  }
  
  renderProjectContext(context, width, height) {
    // Semi-transparent background for readability
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(20, 20, 420, 200);
    
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.font = 'bold 16px Arial';
    context.textAlign = 'left';
    
    let y = 45;
    context.fillText('The Immigrant\'s Orbital System - 2025', 30, y);
    
    context.font = '13px Arial';
    y += 25;
    context.fillText('🌟 Golden Core: Immigrant identity & resilience', 30, y);
    y += 18;
    context.fillText('💚 Green Orbits: What we\'re grateful for (clockwise)', 30, y);
    y += 18;
    context.fillText('⚠️  Red Orbits: Current sociopolitical concerns (counter-clockwise)', 30, y);
    y += 18;
    context.fillText('✨ Inner Orbits: Coping mechanisms that keep us grounded', 30, y);
    
    y += 25;
    context.font = 'bold 12px Arial';
    context.fillText('Gravitational Physics:', 30, y);
    context.font = '11px Arial';
    y += 18;
    context.fillText('• Survey response count = Gravitational mass & orbital speed', 30, y);
    y += 15;
    context.fillText('• More responses = Larger bubbles & stronger influence', 30, y);
    y += 15;
    context.fillText('• Gratitude pulls closer to identity; Concerns push away', 30, y);
    y += 15;
    context.fillText('• The orbital dance shows how hope & fear coexist', 30, y);
  }
  
  renderBackground(context, width, height, audioData) {
    let bgBrightness = 10;
    if (audioData?.bassLevel) {
      bgBrightness += audioData.bassLevel * 5;
    }
    
    // Create subtle space gradient
    const gradient = context.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    gradient.addColorStop(0, `rgb(${Math.floor(bgBrightness * 1.5)}, ${Math.floor(bgBrightness * 1.2)}, ${bgBrightness})`);
    gradient.addColorStop(1, `rgb(${bgBrightness}, ${Math.floor(bgBrightness * 1.2)}, ${Math.floor(bgBrightness * 1.5)})`);
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }
  
  renderOrbitalGuides(context) {
    // Get all unique orbit radii
    const allRadii = new Set();
    this.getAllBubbles().forEach(bubble => {
      allRadii.add(bubble.orbitRadius);
    });
    
    // Draw subtle guides
    context.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    context.lineWidth = 1;
    
    Array.from(allRadii).forEach(radius => {
      context.beginPath();
      context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
      context.stroke();
    });
  }
  
  renderBubbleLayer(context, time, systemType) {
    this.orbitalSystems[systemType].forEach(bubble => {
      bubble.render(context, time);
    });
  }
  
  // Phase lifecycle
  isComplete(time) {
    return time > 30; // 30 seconds to appreciate the orbital dance
  }
  
  // Handle resize
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
    
    // Update identity core position
    this.identityCore.x = this.centerX;
    this.identityCore.y = this.centerY;
    
    // Update all bubble centers
    this.getAllBubbles().forEach(bubble => {
      bubble.centerX = this.centerX;
      bubble.centerY = this.centerY;
      bubble.updatePosition();
    });
  }
  
  // Cleanup
  destroy() {
    // Clean up any resources if needed
    this.orbitalSystems = null;
    this.identityCore = null;
    this.audioSystem = null;
  }
}

module.exports = Phase3;