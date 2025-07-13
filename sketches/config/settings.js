
// // config/settings.js
// const p5 = require("p5");

// new p5(); // Initialize p5 in global mode or use instance mode

// const settings = {
//   context: '2d',
//   animate: true,
//   // 🎯 Let canvas-sketch handle dimensions properly
//   scaleToView: true,
//   // This prevents overflow and fits content to screen
//   scaleToFit: true,
//   styleCanvas: true, // Let canvas-sketch style it properly
//   hotkeys: false,
//   p5: { p5, preload: (p5) => { /* p5.loadImage(), etc. */ } },

//   audio: {
//     playbackRate: 'throttle'
//   }
// };



// module.exports = { settings };


// const p5 = require('p5');

// // Preload function for any assets (optional)
// const preload = (p5) => {
//   // Use p5.loadImage() or other preload functions here if needed
// };

const settings = {
  //p5: { p5, preload }, // Pass the p5 instance and preload function
  animate: true, // Enable animation loop
  scaleToView: true, // Full screen scaling
  scaleToFit: true, // Fit everything on screen
  hotkeys: false,
  // Optional: For future audio reactivity
  // playbackRate: 'throttle'
};

module.exports = { settings };