// containers/container-system.js

class BaseContainer {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.padding = 50;
      this.bounds = this.calculateBounds();
    }
    
    calculateBounds() {
      // Center the container better
      const containerWidth = Math.min(this.width - (this.padding * 2), this.width * 0.8);
      const containerHeight = Math.min(this.height - (this.padding * 2), this.height * 0.8);
      
      return {
        x: (this.width - containerWidth) / 2,
        y: (this.height - containerHeight) / 2,
        width: containerWidth,
        height: containerHeight
      };
    }
    
    getRandomSpawnX(bubbleRadius = 50) {
      return this.bounds.x + bubbleRadius + Math.random() * (this.bounds.width - bubbleRadius * 2);
    }
    
    getSpawnY(bubbleRadius = 50) {
      return this.bounds.y + this.bounds.height - bubbleRadius;
    }
    
    handleCollisions(bubble) {
      // Override in subclasses
    }
    
    // For WebGL, we'll render the container using 2D overlay or separate render pass
    render2D(context) {
      // Override in subclasses for 2D overlay rendering
    }
  }
  
  // Phase 1: Popcorn Maker Container (U-shaped, open top)
  class PopcornMakerContainer extends BaseContainer {
    constructor(width, height) {
      super(width, height);
      this.type = 'popcorn-maker';
    }
    
    handleCollisions(bubble) {
      // Bottom collision
      if (bubble.y + bubble.currentRadius > this.bounds.y + this.bounds.height) {
        bubble.y = this.bounds.y + this.bounds.height - bubble.currentRadius;
        bubble.velocityY *= -bubble.bounce;
      }
      
      // Left wall collision
      if (bubble.x - bubble.currentRadius < this.bounds.x) {
        bubble.x = this.bounds.x + bubble.currentRadius;
        bubble.velocityX *= -bubble.bounce;
      }
      
      // Right wall collision
      if (bubble.x + bubble.currentRadius > this.bounds.x + this.bounds.width) {
        bubble.x = this.bounds.x + this.bounds.width - bubble.currentRadius;
        bubble.velocityX *= -bubble.bounce;
      }
      
      // No top collision - bubbles can escape upward like popcorn!
    }
    
    // 2D overlay rendering for the container walls
    render2D(context) {
      context.strokeStyle = '#666'; // More visible gray
      context.lineWidth = 4; // Thicker lines
      context.beginPath();
      
      // Draw U-shape (left, bottom, right - no top)
      context.moveTo(this.bounds.x, this.bounds.y);                              // Top-left
      context.lineTo(this.bounds.x, this.bounds.y + this.bounds.height);         // Down left side
      context.lineTo(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height); // Across bottom
      context.lineTo(this.bounds.x + this.bounds.width, this.bounds.y);          // Up right side
      
      context.stroke();
      
      // Add corner indicators to make it more visible
      context.fillStyle = '#888';
      const cornerSize = 8;
      
      // Bottom-left corner
      context.fillRect(this.bounds.x - cornerSize/2, this.bounds.y + this.bounds.height - cornerSize/2, cornerSize, cornerSize);
      
      // Bottom-right corner  
      context.fillRect(this.bounds.x + this.bounds.width - cornerSize/2, this.bounds.y + this.bounds.height - cornerSize/2, cornerSize, cornerSize);
      
      // Top-left corner
      context.fillRect(this.bounds.x - cornerSize/2, this.bounds.y - cornerSize/2, cornerSize, cornerSize);
      
      // Top-right corner
      context.fillRect(this.bounds.x + this.bounds.width - cornerSize/2, this.bounds.y - cornerSize/2, cornerSize, cornerSize);
    }
  }
  
  // Phase 2: Migration Path Container (for later)
  class MigrationPathContainer extends BaseContainer {
    constructor(width, height) {
      super(width, height);
      this.type = 'migration-path';
      // Implementation for later phases
    }
    
    handleCollisions(bubble) {
      // For now, just basic boundaries
      super.handleCollisions && super.handleCollisions(bubble);
    }
    
    render2D(context) {
      // Implementation for later
      context.strokeStyle = '#444';
      context.lineWidth = 2;
      context.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    }
  }
  
  // Phase 3: Current Climate Container (for later)  
  class CurrentClimateContainer extends BaseContainer {
    constructor(width, height) {
      super(width, height);
      this.type = 'current-climate';
      // Implementation for later phases
    }
    
    handleCollisions(bubble) {
      // For now, just basic boundaries
      super.handleCollisions && super.handleCollisions(bubble);
    }
    
    render2D(context) {
      // Implementation for later
      context.strokeStyle = '#444';
      context.lineWidth = 2;
      context.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    }
  }
  
  // Factory function
  function createContainer(type, width, height) {
    switch(type) {
      case 'popcorn-maker':
        return new PopcornMakerContainer(width, height);
      case 'migration-path':
        return new MigrationPathContainer(width, height);
      case 'current-climate':
        return new CurrentClimateContainer(width, height);
      default:
        return new BaseContainer(width, height);
    }
  }
  
  module.exports = {
    BaseContainer,
    PopcornMakerContainer,
    MigrationPathContainer,
    CurrentClimateContainer,
    createContainer
  };