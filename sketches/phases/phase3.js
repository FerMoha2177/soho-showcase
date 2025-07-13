
// phases/phase3-current.js
class Phase3 {
    constructor(gl, width, height) {
      this.gl = gl;
      console.log('Phase 3 initialized (placeholder)');
    }
    
    render({ time, width, height, gl }) {
      // Clear with different color to show phase change
      gl.clearColor(0.05, 0.1, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    
    isComplete(time) {
      return time > 10; // 10 second placeholder duration
    }
  }
  
  module.exports = Phase3;