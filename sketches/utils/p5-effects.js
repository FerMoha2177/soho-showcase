// utils/p5-effects.js - Extract p5.js-style utilities
class P5Effects {
    // p5.js-style noise function
    static noise(x, y = 0, z = 0) {
      // Simple implementation - you can use a proper noise library like simplex-noise
      return Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + 0.5;
    }
    
    // p5.js-style lerp function
    static lerp(start, stop, amt) {
      return start + (stop - start) * amt;
    }
    
    // p5.js-style map function
    static map(value, start1, stop1, start2, stop2) {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
    
    // p5.js-style lerpColor function
    static lerpColor(c1, c2, amt) {
      const r1 = parseInt(c1.slice(1, 3), 16);
      const g1 = parseInt(c1.slice(3, 5), 16);
      const b1 = parseInt(c1.slice(5, 7), 16);
      
      const r2 = parseInt(c2.slice(1, 3), 16);
      const g2 = parseInt(c2.slice(3, 5), 16);
      const b2 = parseInt(c2.slice(5, 7), 16);
      
      const r = Math.round(r1 + (r2 - r1) * amt);
      const g = Math.round(g1 + (g2 - g1) * amt);
      const b = Math.round(b1 + (b2 - b1) * amt);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // p5.js-style vector operations
    static createVector(x = 0, y = 0) {
      return {
        x, y,
        add(v) { this.x += v.x; this.y += v.y; return this; },
        mult(scalar) { this.x *= scalar; this.y *= scalar; return this; },
        mag() { return Math.sqrt(this.x * this.x + this.y * this.y); },
        normalize() { 
          const m = this.mag(); 
          if (m > 0) { this.mult(1/m); }
          return this; 
        },
        limit(max) {
          if (this.mag() > max) {
            this.normalize().mult(max);
          }
          return this;
        }
      };
    }
    
    // Advanced canvas effects inspired by p5.js
    static drawGlow(context, x, y, radius, color, intensity = 0.5) {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color.replace('1)', `${intensity})`));
      gradient.addColorStop(1, color.replace('1)', '0)'));
      
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius * 2, 0, Math.PI * 2);
      context.fill();
    }
    
    // Particle trail effect
    static drawTrail(context, points, color) {
      if (points.length < 2) return;
      
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.lineCap = 'round';
      
      for (let i = 0; i < points.length - 1; i++) {
        const alpha = i / points.length;
        context.globalAlpha = alpha;
        context.beginPath();
        context.moveTo(points[i].x, points[i].y);
        context.lineTo(points[i + 1].x, points[i + 1].y);
        context.stroke();
      }
      context.globalAlpha = 1;
    }
    
    // Morphing shape effect
    static drawMorphingCircle(context, x, y, radius, time, morphAmount = 0.1) {
      const points = 16;
      context.beginPath();
      
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noise = Math.sin(time * 2 + angle * 3) * morphAmount;
        const r = radius + (radius * noise);
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (i === 0) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }
      context.closePath();
    }
  }
  
  module.exports = P5Effects;