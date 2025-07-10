const canvasSketch = require('canvas-sketch');

const settings = {
  context: '2d',
  animate: true
};

const sketch = ({ width, height }) => {
  // Container bounds (like a popcorn maker)
  const container = {
    x: 50,
    y: 50,
    width: width - 100,
    height: height - 100
  };
  
  const kernels = [];
  let nextKernelTime = 1.0; // When next kernel pops
  let kernelId = 0;
  
  // Survey data for different sized kernels
  const surveyWords = [
    { word: 'Violence', color: '#4CAF50',responses: 4 }, ///4
    { word: 'Disinformation', color: '#F44336',responses: 1 }, // 1
    { word: 'Police Brutality', color: '#FF9800',responses: 2 }, // 2
    { word: 'Lack of Opportunity', color: '#9E9E9E',responses: 12 }, // 12
    { word: 'Economic Instability', color: '#2196F3',responses: 4 }, // 4
    { word: 'Decay of Educational System', color: '#9C27B0',responses: 2 }, // 2
    { word: 'Decay of Healthcare System', color: '#607D8B', responses: 1 }, // 0
    { word: 'Lack of Freedom of Speech', color: '#00BCD4', responses: 2 }, // 2
    { word: 'Corrupt Government', color: '#00BCD4', responses: 6 } // 2
  ];
  
  // Calculate sizes based on survey responses
  const maxResponses = Math.max(...surveyWords.map(w => w.responses));
  const minRadius = 50;
  const maxRadius = 200;
  
  function createKernel(wordData) {
    const size = minRadius + (wordData.responses / maxResponses) * (maxRadius - minRadius);
    
    return {
      id: kernelId++,
      word: wordData.word,
      x: container.x + Math.random() * (container.width - size * 2) + size,
      y: container.y + container.height - size, // Start at bottom
      targetRadius: size,
      currentRadius: 0,
      velocityX: (Math.random() - 0.5) * 4, // Random horizontal force
      velocityY: -8 - Math.random() * 6, // Strong upward pop force
      gravity: 0.4,
      bounce: 0.6 + Math.random() * 0.2, // Variable bounciness
      friction: 0.99, // Air resistance
      color: wordData.color,
      spawnTime: 0.2,
      age: 0,
      wordSize: size,
      mass: size / 20 // Mass affects collisions
    };
  }
  
  function updateKernel(kernel, deltaTime) {
    kernel.age += deltaTime;
    
    // Pop growth animation
    if (kernel.age < kernel.spawnTime) {
      const progress = kernel.age / kernel.spawnTime;
      const popScale = progress < 0.7 ? 
        progress * 1.4 : // Big overshoot for dramatic pop
        1.4 - (progress - 0.7) * 1.33; // Settle back
      kernel.currentRadius = kernel.targetRadius * Math.min(popScale, 1.0);
    } else {
      kernel.currentRadius = kernel.targetRadius;
    }
    
    // Apply physics after initial pop
    if (kernel.age > 0.05) {
      // Gravity
      kernel.velocityY += kernel.gravity;
      
      // Air resistance
      kernel.velocityX *= kernel.friction;
      kernel.velocityY *= kernel.friction;
      
      // Update position
      kernel.x += kernel.velocityX;
      kernel.y += kernel.velocityY;
      
      // Container collision
      // Bottom
      if (kernel.y + kernel.currentRadius > container.y + container.height) {
        kernel.y = container.y + container.height - kernel.currentRadius;
        kernel.velocityY *= -kernel.bounce;
      }
      
      // Top
      if (kernel.y - kernel.currentRadius < container.y) {
        kernel.y = container.y + kernel.currentRadius;
        kernel.velocityY *= -kernel.bounce;
      }
      
      // Left wall
      if (kernel.x - kernel.currentRadius < container.x) {
        kernel.x = container.x + kernel.currentRadius;
        kernel.velocityX *= -kernel.bounce;
      }
      
      // Right wall
      if (kernel.x + kernel.currentRadius > container.x + container.width) {
        kernel.x = container.x + container.width - kernel.currentRadius;
        kernel.velocityX *= -kernel.bounce;
      }
    }
  }
  
  function checkCollisions() {
    for (let i = 0; i < kernels.length; i++) {
      for (let j = i + 1; j < kernels.length; j++) {
        const k1 = kernels[i];
        const k2 = kernels[j];
        
        // Skip if either kernel is still popping
        if (k1.age < 0.1 || k2.age < 0.1) continue;
        
        const dx = k2.x - k1.x;
        const dy = k2.y - k1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = k1.currentRadius + k2.currentRadius;
        
        if (distance < minDistance) {
          // Collision detected - separate kernels
          const overlap = minDistance - distance;
          const separationX = (dx / distance) * overlap * 0.5;
          const separationY = (dy / distance) * overlap * 0.5;
          
          k1.x -= separationX;
          k1.y -= separationY;
          k2.x += separationX;
          k2.y += separationY;
          
          // Calculate collision response based on masses
          const totalMass = k1.mass + k2.mass;
          const force = 0.3; // Collision force
          
          const forceX = (dx / distance) * force;
          const forceY = (dy / distance) * force;
          
          k1.velocityX -= forceX * (k2.mass / totalMass);
          k1.velocityY -= forceY * (k2.mass / totalMass);
          k2.velocityX += forceX * (k1.mass / totalMass);
          k2.velocityY += forceY * (k1.mass / totalMass);
        }
      }
    }
  }
  
  return ({ context, time, width, height }) => {
    const deltaTime = 1/60; // Assume 60fps
    
    // Clear screen
    context.fillStyle = '#1a1a1a';
    context.fillRect(0, 0, width, height);
    
    // Draw container
    context.strokeStyle = '#444';
    context.lineWidth = 3;
    context.strokeRect(container.x, container.y, container.width, container.height);
    
    // Add new kernels periodically
    if (time > nextKernelTime && kernels.length < surveyWords.length) {
      const wordIndex = kernels.length % surveyWords.length;
      kernels.push(createKernel(surveyWords[wordIndex]));
      nextKernelTime = time + 0.5 + Math.random() * 1.0; // Random intervals
    }
    
    // Update all kernels
    kernels.forEach(kernel => updateKernel(kernel, deltaTime));
    
    // Handle collisions
    checkCollisions();
    
    // Draw kernels
    kernels.forEach(kernel => {
      if (kernel.currentRadius > 0) {
        // Main kernel
        context.beginPath();
        context.arc(kernel.x, kernel.y, kernel.currentRadius, 0, Math.PI * 2);
        context.fillStyle = kernel.color;
        context.fill();
        
        // Highlight
        context.beginPath();
        context.arc(
          kernel.x - kernel.currentRadius * 0.3, 
          kernel.y - kernel.currentRadius * 0.3, 
          kernel.currentRadius * 0.25, 
          0, Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 255, 255, 0.4)';
        context.fill();
        
        // Draw word if kernel is big enough
        if (kernel.currentRadius > 20 && kernel.age > kernel.spawnTime) {
          context.fillStyle = 'white';
          context.font = `${Math.min(40, kernel.currentRadius / 4)}px Arial`;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(kernel.word, kernel.x, kernel.y);
          
        }
      }
    });
    
    // Instructions
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.fillText(`Kernels: ${kernels.length}/${surveyWords.length}`, 10, 25);
  };
};

canvasSketch(sketch, settings);