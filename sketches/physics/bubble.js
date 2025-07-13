class Bubble {
    constructor(data, container) {
      this.word = data.word;
      this.color = data.color;
      this.responses = data.responses;
      this.container = container;
      
      // Physics properties
      this.x = container.getRandomSpawnX();
      this.y = container.getBottom();
      this.radius = this.calculateRadius(data.responses);
      this.velocityX = (Math.random() - 0.5) * 4;
      this.velocityY = -8 - Math.random() * 6;
      this.gravity = 0.4;
      this.bounce = 0.6;
      this.age = 0;
    }
    
    update(deltaTime) {
      this.age += deltaTime;
      this.updatePhysics();
      this.container.handleCollisions(this);
    }
    
    render(shader, time) {
      if (this.currentRadius > 0) {
        shader.render({
          position: [this.x, this.y],
          radius: this.currentRadius,
          color: this.color,
          time: time
        });
      }
    }
    
    updatePhysics() {
      // Pop animation
      if (this.age < 0.2) {
        const progress = this.age / 0.2;
        this.currentRadius = this.radius * Math.min(progress * 1.4, 1.0);
      } else {
        this.currentRadius = this.radius;
      }
      
      // Apply forces
      this.velocityY += this.gravity;
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
    
    calculateRadius(responses) {
      const maxResponses = 12; // From your data
      return 50 + (responses / maxResponses) * 150;
    }
  }
  
  module.exports = Bubble;