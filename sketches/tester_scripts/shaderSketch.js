const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');

const settings = {
  context: 'webgl',
  animate: true
};

// Super simple fragment shader
const frag = `
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
    
    // Create circle with noise
    float circle = 1.0 - smoothstep(radius - 0.02, radius, dist);
    
    // Simple noise
    float noise = sin(coord.x * 50.0 + time * 2.0) * cos(coord.y * 50.0 + time * 1.5) * 0.1;
    
    vec3 color = bubbleColor + noise;
    
    gl_FragColor = vec4(color, circle);
  }
`;

const sketch = ({ gl, width, height }) => {
  const bubbles = [];
  let nextPop = 1.0;
  let bubbleIndex = 0;
  
  const words = [
    { word: 'Violence', color: [0.9, 0.2, 0.2], responses: 120 },
    { word: 'Hope', color: [0.2, 0.9, 0.4], responses: 200 },
    { word: 'Fear', color: [0.5, 0.3, 0.9], responses: 85 }
  ];
  
  const shader = createShader({ gl, frag });
  
  function addBubble(wordData) {
    const size = 40 + (wordData.responses / 200) * 60;
    bubbles.push({
      x: 100 + Math.random() * (width - 200),
      y: height,
      radius: size,
      currentRadius: 0,
      velocityX: (Math.random() - 0.5) * 3,
      velocityY: -8,
      gravity: 0.4,
      bounce: 0.6,
      color: wordData.color,
      age: 0
    });
  }
  
  return {
    render({ time, width, height, gl }) {
      // Add bubbles
      if (time > nextPop && bubbleIndex < words.length) {
        addBubble(words[bubbleIndex]);
        bubbleIndex++;
        nextPop = time + 1.5;
      }
      
      // Update bubbles
      bubbles.forEach(bubble => {
        bubble.age += 1/60;
        
        // Pop animation
        if (bubble.age < 0.3) {
          bubble.currentRadius = bubble.radius * (bubble.age / 0.3);
        } else {
          bubble.currentRadius = bubble.radius;
        }
        
        // Physics
        bubble.velocityY += bubble.gravity;
        bubble.x += bubble.velocityX;
        bubble.y += bubble.velocityY;
        
        // Bounce
        if (bubble.y + bubble.currentRadius > height) {
          bubble.y = height - bubble.currentRadius;
          bubble.velocityY *= -bubble.bounce;
        }
      });
      
      // Clear
      gl.clearColor(0.02, 0.02, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      // Draw bubbles
      bubbles.forEach(bubble => {
        if (bubble.currentRadius > 0) {
          shader({
            time,
            resolution: [width, height],
            bubblePos: [bubble.x, height - bubble.y],
            bubbleRadius: bubble.currentRadius,
            bubbleColor: bubble.color
          });
        }
      });
    }
  };
};

canvasSketch(sketch, settings);