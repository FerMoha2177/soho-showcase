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
  
  float circle = 1.0 - smoothstep(radius - 0.02, radius, dist);
  
  if (circle > 0.0) {
    // Animated gradient
    vec2 gradientCoord = (coord - center) / radius;
    float angle = atan(gradientCoord.y, gradientCoord.x) + time * 0.5;
    
    vec3 color1 = bubbleColor;
    vec3 color2 = bubbleColor * 0.6 + vec3(0.2, 0.2, 0.3);
    
    float gradient = sin(angle * 3.0 + dist * 10.0) * 0.5 + 0.5;
    vec3 finalColor = mix(color1, color2, gradient);
    
    gl_FragColor = vec4(finalColor, circle);
  } else {
    discard;
  }
}