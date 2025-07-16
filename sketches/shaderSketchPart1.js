const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');

const settings = {
  context: 'webgl',
  animate: true
};

// Gradient shader for emotion bubbles
const emotionFrag = `
  precision highp float;
  
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 bubblePos;
  uniform float bubbleRadius;
  uniform vec3 bubbleColor;
  
  void main() {
    vec2 coord = gl_FragCoord.xy / resolution.xy;
    vec2 center = bubblePos / resolution.xy;
    
    float dist = distance(coord, center);
    float radius = bubbleRadius / resolution.y;
    
    // Create circle
    float circle = 1.0 - smoothstep(radius - 0.02, radius, dist);
    
    if (circle > 0.0) {
      // Create gradient effect
      vec2 gradientCoord = (coord - center) / radius;
      float gradientAngle = atan(gradientCoord.y, gradientCoord.x) + time * 0.5;
      
      // Color gradient based on position and time
      vec3 color1 = bubbleColor;
      vec3 color2 = bubbleColor * 0.6 + vec3(0.2, 0.2, 0.3);
      vec3 color3 = bubbleColor * 1.2;
      
      float gradient = sin(gradientAngle * 3.0 + dist * 10.0) * 0.5 + 0.5;
      vec3 finalColor = mix(color1, color2, gradient);
      finalColor = mix(finalColor, color3, sin(time + dist * 5.0) * 0.3 + 0.3);
      
      // Add some noise
      float noise = sin(coord.x * 30.0 + time) * cos(coord.y * 30.0 + time) * 0.1;
      finalColor += noise;
      
      gl_FragColor = vec4(finalColor, circle);
    } else {
      discard;
    }
  }
`;

// Simple shader for reason bubbles (black/static)
const reasonFrag = `
  precision highp float;
  
  uniform vec2 resolution;
  uniform vec2 bubblePos;
  uniform float bubbleRadius;
  uniform vec3 bubbleColor;
  
  void main() {
    vec2 coord = gl_FragCoord.xy / resolution.xy;
    vec2 center = bubblePos / resolution.xy;
    
    float dist = distance(coord, center);
    float radius = bubbleRadius / resolution.y;
    
    float circle = 1.0 - smoothstep(radius - 0.02, radius, dist);
    
    gl_FragColor = vec4(bubbleColor, circle);
  }
`;

const sketch = ({ gl, width, height }) => {
  // Presentation phases
  const PHASES = {
    REASONS: 'reasons',
    EMOTIONS: 'emotions',
    CURRENT: 'current'
  };
  
  let currentPhase = PHASES.REASONS;
  let phaseStartTime = 0;
  
  // Container
  const container = {
    x: 50,
    y: 50,
    width: width - 100,
    height: height - 100
  };
  
  const bubbles = [];
  let nextBubbleTime = 1.0;
  let bubbleIndex = 0;
  
  // Survey Data
  const reasonsData = [
    { word: 'Violence', color: [0.1, 0.1, 0.1], responses: 4 },
    { word: 'Disinformation', color: [0.1, 0.1, 0.1], responses: 1 },
    { word: 'Police\nBrutality', color: [0.1, 0.1, 0.1], responses: 2 },
    { word: 'Lack\nof\nOpportunity', color: [0.1, 0.1, 0.1], responses: 12 },
    { word: 'Economic\nInstability', color: [0.1, 0.1, 0.1], responses: 4 },
    { word: 'Corrupt\nGovernment', color: [0.1, 0.1, 0.1], responses: 6 }
  ];
  
  const emotionsData = [
    { word: 'Fear', color: [0.8, 0.2, 0.2], responses: 8 },
    { word: 'Hope', color: [0.2, 0.8, 0.4], responses: 15 },
    { word: 'Anxiety', color: [0.7, 0.3, 0.8], responses: 6 },
    { word: 'Relief', color: [0.3, 0.6, 0.9], responses: 10 },
    { word: 'Uncertainty', color: [0.9, 0.7, 0.2], responses: 7 }
  ];
  
  // Create shaders with error handling
  let emotionShader = null;
  let reasonShader = null;
  
  try {
    emotionShader = createShader({ 
      gl, 
      frag: emotionFrag,
      uniforms: {
        time: 0,
        resolution: [width, height],
        bubblePos: [0, 0],
        bubbleRadius: 50,
        bubbleColor: [1, 1, 1]
      }
    });
    
    reasonShader = createShader({ 
      gl, 
      frag: reasonFrag,
      uniforms: {
        resolution: [width, height],
        bubblePos: [0, 0],
        bubbleRadius: 50,
        bubbleColor: [1, 1, 1]
      }
    });
    
    console.log('Shaders created successfully');
  } catch (error) {
    console.error('Failed to create shaders:', error);
  }
  
  function getCurrentData() {
    switch(currentPhase) {
      case PHASES.REASONS: return reasonsData;
      case PHASES.EMOTIONS: return emotionsData;
      default: return reasonsData;
    }
  }
  
  function getCurrentShader() {
    const shader = currentPhase === PHASES.EMOTIONS ? emotionShader : reasonShader;
    return shader;
  }
  
  function createBubble(wordData, phase) {
    const maxResponses = Math.max(...getCurrentData().map(w => w.responses));
    const size = 50 + (wordData.responses / maxResponses) * 150;
    
    return {
      word: wordData.word,
      x: container.x + Math.random() * (container.width - size * 2) + size,
      y: container.y + container.height - size,
      targetRadius: size,
      currentRadius: 0,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: -8 - Math.random() * 6,
      gravity: 0.4,
      bounce: 0.6 + Math.random() * 0.2,
      friction: 0.99,
      color: wordData.color,
      spawnTime: 0.2,
      age: 0,
      phase: phase,
      mass: size / 20
    };
  }
  
  function updateBubble(bubble, deltaTime) {
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
      if (bubble.y + bubble.currentRadius > container.y + container.height) {
        bubble.y = container.y + container.height - bubble.currentRadius;
        bubble.velocityY *= -bubble.bounce;
      }
      
      if (bubble.x - bubble.currentRadius < container.x) {
        bubble.x = container.x + bubble.currentRadius;
        bubble.velocityX *= -bubble.bounce;
      }
      
      if (bubble.x + bubble.currentRadius > container.x + container.width) {
        bubble.x = container.x + container.width - bubble.currentRadius;
        bubble.velocityX *= -bubble.bounce;
      }
    }
  }
  
  function checkCollisions() {
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
  
  return {
    render({ time, width, height, gl }) {
      const deltaTime = 1/60;
      
      // Phase management
      if (currentPhase === PHASES.REASONS && time > 15) {
        currentPhase = PHASES.EMOTIONS;
        phaseStartTime = time;
        bubbles.length = 0; // Clear bubbles
        bubbleIndex = 0;
        nextBubbleTime = time + 1;
      }
      
      // Add bubbles
      const currentData = getCurrentData();
      if (time > nextBubbleTime && bubbleIndex < currentData.length) {
        bubbles.push(createBubble(currentData[bubbleIndex], currentPhase));
        bubbleIndex++;
        nextBubbleTime = time + 0.5 + Math.random() * 0.5;
      }
      
      // Update bubbles
      bubbles.forEach(bubble => updateBubble(bubble, deltaTime));
      checkCollisions();
      
      // Clear
      gl.clearColor(0.05, 0.05, 0.08, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      // Draw bubbles with appropriate shader
      const shader = getCurrentShader();
      if (shader && shader.uniforms) {
        bubbles.forEach(bubble => {
          if (bubble.currentRadius > 0) {
            // Update uniforms
            shader.uniforms.resolution = [width, height];
            shader.uniforms.bubblePos = [bubble.x, height - bubble.y];
            shader.uniforms.bubbleRadius = bubble.currentRadius;
            shader.uniforms.bubbleColor = bubble.color;
            
            if (currentPhase === PHASES.EMOTIONS && shader.uniforms.time !== undefined) {
              shader.uniforms.time = time;
            }
            
            // Render
            shader.bind();
            gl.drawArrays(gl.TRIANGLES, 0, 6);
          }
        });
      } else {
        console.warn('Shader not available, skipping render');
      }
      
      // Draw container (you can add this back with 2D overlay)
      
      // Phase indicator
      // Add text overlay here
    }
  };
};

canvasSketch(sketch, settings);