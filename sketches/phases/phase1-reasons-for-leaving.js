// phases/phase1-reasons-for-leaving.js
const { createContainer } = require('../containers/container-system');
const { reasonsForLeaving, emotionsDuringImmigration } = require('../data/survey-data');
const { ReasonBubble, EmotionBubble, BubblePhysics } = require('../physics/bubble');

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
    
    console.log('Phase 1 initialized with cleaned bubble system');
    
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
  
  // Create reason bubble using ReasonBubble class
  createReasonBubble(wordData) {
    return new ReasonBubble(wordData, this.container);
  }
  
  // Create emotion bubble using EmotionBubble class
  createEmotionBubble(wordData) {
    return new EmotionBubble(wordData, this.container);
  }
  
  // Purge all reason bubbles with pop animation
  purgeReasonBubbles() {
    console.log('Purging reason bubbles with pop animation...');
    this.reasonBubbles = BubblePhysics.purgeBubbles(this.reasonBubbles);
    this.bubbleIndex = 0;
    this.reasonsComplete = false;
  }
  
  // Purge all emotion bubbles with pop animation
  purgeEmotionBubbles() {
    console.log('Purging emotion bubbles with pop animation...');
    this.emotionBubbles = BubblePhysics.purgeBubbles(this.emotionBubbles);
    this.emotionBubbleIndex = 0;
    this.emotionsTriggered = false;
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
    
    // Update all bubbles using their own update methods
    this.reasonBubbles.forEach(bubble => bubble.update(deltaTime));
    this.emotionBubbles.forEach(bubble => bubble.update(deltaTime));
    
    // Remove destroyed bubbles (those that finished popping)
    this.reasonBubbles = this.reasonBubbles.filter(bubble => !bubble.isDestroyed());
    this.emotionBubbles = this.emotionBubbles.filter(bubble => !bubble.isDestroyed());
    
    // Handle collisions using BubblePhysics
    const allBubbles = [...this.reasonBubbles, ...this.emotionBubbles];
    BubblePhysics.checkCollisions(allBubbles);
    
    // Clear with dark background
    context.fillStyle = '#1a1a1a';
    context.fillRect(0, 0, width, height);
    
    // Draw container
    this.container.render2D(context);
    
    // Draw all bubbles using their own render methods
    this.reasonBubbles.forEach(bubble => bubble.render(context, time));
    this.emotionBubbles.forEach(bubble => bubble.render(context, time));
    
    // UI overlay
    this.renderUI(context, width, height);
  }
  
  renderUI(context, width, height) {
    // Stats
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.font = '16px Arial';
    context.textAlign = 'left';
    context.fillText(`Reason Bubbles: ${this.reasonBubbles.length}`, 20, 30);
    context.fillText(`Emotion Bubbles: ${this.emotionBubbles.length}`, 20, 50);
    context.fillText(`Canvas: ${width} x ${height}`, 20, 70);
    
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
      context.fillText('🖱️ CLICK TO TRIGGER EMOTIONS', width / 2, height - 60);
    } else if (this.emotionsTriggered) {
      context.fillStyle = '#90EE90';
      context.font = 'bold 24px Arial';
      context.textAlign = 'center';
      context.fillText('✨ Emotions Activated!', width / 2, height - 60);
    }
    
    // Debug buttons (optional - could be removed for production)
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
  }
  
  // Handle keyboard inputs for debugging
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
    return false; // Phase continues indefinitely for now
  }
  
  destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }
}

module.exports = Phase1;