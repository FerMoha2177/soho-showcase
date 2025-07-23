const PHASE2_STYLES = require("./phase2-styles.js");
const { phase2Data } = require("../data/survey-data.js");
const { seededRandom, enhanceColor } = require("./phase2-utils.js");

class Phase2 {
  constructor(width, height, audioSystem) {
    this.width = width;
    this.height = height;
    this.audioSystem = audioSystem;
    this.container = null;
    this.initialized = false;
    console.log("Phase 2 initialized");
  }

  initializeHTML() {
    // Hide canvas
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.style.display = "none";
    }

    // Add styles
    const style = document.createElement("style");
    style.textContent = PHASE2_STYLES;
    document.head.appendChild(style);

    // Add HTML structure
    this.container = document.createElement("div");
    this.container.innerHTML = `
            <div id="container">
                <h1 class="title">The Immigrant's Journey</h1>
                <p class="subtitle">Part 2: New Home - Real Survey Data</p>
                <div id="loading" class="loading">Loading...</div>
                <div id="questions-container"></div>
            </div>
        `;
    document.body.appendChild(this.container);

    // Start Isabella's visualization with your data
    setTimeout(() => {
      this.createVisualization(phase2Data);
    }, 100);
  }

  createVisualization(data) {
    const container = document.getElementById("questions-container");
    const loading = document.getElementById("loading");

    // Hide loading message
    loading.style.display = "none";

    // Create a visualization section for each survey question
    data.questions.forEach((question, qIndex) => {
      // Create section container
      const section = document.createElement("div");
      section.className = "question-section";

      // Add question title
      const title = document.createElement("h2");
      title.className = "question-title";
      title.textContent = question.fullQuestion;
      section.appendChild(title);

      // Create wave container (16:9 aspect ratio)
      const waveContainer = document.createElement("div");
      waveContainer.className = "wave-container";

      const waveInner = document.createElement("div");
      waveInner.className = "wave-inner";
      waveContainer.appendChild(waveInner);

      // Sort answers by frequency (most common first)
      const sortedAnswers = Object.entries(question.data).sort(
        (a, b) => b[1] - a[1]
      );
      const allParticles = []; // Store all particles for interaction

      // =================================================================
      // CREATE THREE WAVES OF PARTICLES
      // =================================================================
      // Wave 0 & 2: English text
      // Wave 1: Spanish text

      for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
        // Shuffle answers for visual variety while maintaining data integrity
        const shuffledAnswers = [...sortedAnswers];
        for (let i = shuffledAnswers.length - 1; i > 0; i--) {
          const j = Math.floor(
            seededRandom(qIndex * 1000 + waveIndex * 100 + i) * (i + 1)
          );
          [shuffledAnswers[i], shuffledAnswers[j]] = [
            shuffledAnswers[j],
            shuffledAnswers[i],
          ];
        }

        shuffledAnswers.forEach(([answer, count], shuffledIndex) => {
          // Create particle element
          const particle = document.createElement("div");
          particle.className = "particle";

          // Find original position for timing purposes
          const originalIndex = sortedAnswers.findIndex(([a]) => a === answer);
          const particleSeed = qIndex * 1000 + waveIndex * 100 + shuffledIndex;

          // =================================================================
          // CALCULATE PARTICLE SIZE BASED ON RESPONSE COUNT
          // =================================================================
          const maxCount = Math.max(...Object.values(question.data));
          const waveScaleFactor =
            waveIndex === 0 ? 1 : waveIndex === 1 ? 0.85 : 0.7; // Different sizes for each wave
          const minSize = 40 * waveScaleFactor;
          const maxSize = 180 * waveScaleFactor;
          const sizeRatio = count / maxCount;
          // Use exponential scaling for more dramatic size differences
          const exponentialRatio = Math.pow(sizeRatio, 0.6);
          const baseSize = minSize + exponentialRatio * (maxSize - minSize);

          particle.style.width = `${baseSize}px`;
          particle.style.height = `${baseSize}px`;

          // =================================================================
          // ASSIGN RANDOM COLOR FROM SURVEY DISTRIBUTION
          // =================================================================
          const colorIndex = Math.floor(
            seededRandom(particleSeed + 500) * data.colorDistribution.length
          );
          const baseColor = enhanceColor(data.colorDistribution[colorIndex]);

          // Extract RGB values for glass effect
          const r = parseInt(baseColor.slice(1, 3), 16);
          const g = parseInt(baseColor.slice(3, 5), 16);
          const b = parseInt(baseColor.slice(5, 7), 16);

          // Create multi-layer glass effect background
          particle.style.background = `
                      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), transparent 50%),
                      radial-gradient(circle at 70% 70%, rgba(${r}, ${g}, ${b}, 0.25), transparent 60%),
                      radial-gradient(circle at 50% 50%, rgba(${r}, ${g}, ${b}, 0.15), transparent 80%),
                      linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.5), rgba(${r}, ${g}, ${b}, 0.2))
                  `;

          // Add colored border and enhanced shadows
          particle.style.border = `1px solid rgba(${r}, ${g}, ${b}, 0.4)`;
          particle.style.boxShadow = `
                      0 8px 32px rgba(${r}, ${g}, ${b}, 0.15),
                      0 2px 8px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.6),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `;

          // =================================================================
          // ADD TEXT CONTENT (BILINGUAL)
          // =================================================================
          const text = document.createElement("div");
          text.className = "particle-text";

          if (waveIndex === 1) {
            // Middle wave shows Spanish text (before ///)
            const spanishText = answer.split("///")[0]
              ? answer.split("///")[0].trim()
              : answer;
            text.textContent = spanishText;
          } else {
            // Outer waves show English text (after ///)
            const englishText = answer.split("///")[1]
              ? answer.split("///")[1].trim()
              : answer;
            text.textContent = englishText;
          }

          // Scale font size with wave size
          text.style.fontSize = `${0.6 + waveScaleFactor * 0.15}rem`;
          particle.appendChild(text);

          // =================================================================
          // ADD CLICK INTERACTION (NON-TOP-3 ANSWERS)
          // =================================================================
          const isTop3 = originalIndex < 3; // Top 3 most frequent answers
          if (!isTop3) {
            particle.addEventListener("click", function () {
              // Find all particles with the same answer across all waves
              const particlesWithSameAnswer = allParticles.filter(
                (p) => p.answer === answer
              );

              // Burst all particles with the same answer
              particlesWithSameAnswer.forEach((p) => {
                p.element.style.animation =
                  "particleBurst 0.6s ease-out forwards";
                setTimeout(() => {
                  if (p.element.parentNode) {
                    p.element.parentNode.removeChild(p.element);
                  }
                }, 600);
              });
            });
          }

          // Store particle data for animations and interactions
          const particleData = {
            element: particle,
            baseSize: baseSize,
            index: shuffledIndex,
            waveIndex: waveIndex,
            totalAnswers: sortedAnswers.length,
            seed: particleSeed,
            answerIndex: originalIndex,
            count: count,
            answer: answer,
          };

          allParticles.push(particleData);
          waveInner.appendChild(particle);
        });
      }

      // =================================================================
      // PARTICLE APPEARANCE ANIMATION
      // =================================================================

      /**
       * Animate particles to appear one answer group at a time
       * All waves for the same answer appear simultaneously
       */
      function animateParticleAppearance() {
        const totalAnswers = sortedAnswers.length;
        const appearanceDelay = 1000; // milliseconds between each answer group

        // Group particles by answer for synchronized appearance
        for (let answerIndex = 0; answerIndex < totalAnswers; answerIndex++) {
          const answerParticles = allParticles.filter(
            (p) => p.answerIndex === answerIndex
          );

          setTimeout(() => {
            answerParticles.forEach((particleData) => {
              particleData.element.style.animation =
                "particleAppear 0.8s ease-out forwards";
            });
          }, 1000 + qIndex * 500 + answerIndex * appearanceDelay);
        }
      }

      animateParticleAppearance();

      // =================================================================
      // TRAVELING PARTICLE CREATION AND ANIMATION
      // =================================================================

      /**
       * Create a white traveling particle that interacts with others
       */
      function createTravelingParticle() {
        const travelingParticle = document.createElement("div");
        travelingParticle.className = "traveling-particle";
        waveInner.appendChild(travelingParticle);

        // Calculate when to start (after all particles appear + 15.5 seconds)
        const totalAppearanceTime =
          1000 + qIndex * 500 + sortedAnswers.length * 1000;

        setTimeout(() => {
          animateTravelingParticle(travelingParticle, allParticles, waveInner);
        }, totalAppearanceTime + 15500);
      }

      /**
       * Animate the traveling particle movement and collision detection
       * @param {HTMLElement} particle - The traveling particle element
       * @param {Array} allParticles - Array of all particles to check collisions with
       * @param {HTMLElement} container - Container element for boundaries
       */
      function animateTravelingParticle(particle, allParticles, container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const particleRadius = 10; // Half of particle width (20px / 2)

        // Initial position and movement parameters
        let x = particleRadius; // Start at left edge
        let y = containerHeight / 2; // Start in vertical center
        let direction = 1; // 1 = right, -1 = left
        let waveAmplitude = 40; // Height of sine wave movement
        let waveFrequency = 0.005; // How tight the sine wave is
        let baseY = y; // Base Y position for sine wave

        /**
         * Check for collisions between traveling particle and static particles
         */
        function checkCollisions() {
          const particleRect = particle.getBoundingClientRect();

          allParticles.forEach((particleData) => {
            if (!particleData.element.parentNode) return; // Skip if already removed

            const elementRect = particleData.element.getBoundingClientRect();

            // Calculate distance between particle centers
            const dx =
              particleRect.left +
              particleRect.width / 2 -
              (elementRect.left + elementRect.width / 2);
            const dy =
              particleRect.top +
              particleRect.height / 2 -
              (elementRect.top + elementRect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if collision occurs (sum of radii)
            const collisionDistance =
              particleRect.width / 2 + elementRect.width / 2;

            if (distance < collisionDistance) {
              const isTop3 = particleData.answerIndex < 3;

              if (!isTop3) {
                // NON-TOP-3 ANSWERS: Burst and disappear
                const particlesWithSameAnswer = allParticles.filter(
                  (p) => p.answer === particleData.answer
                );
                particlesWithSameAnswer.forEach((p) => {
                  if (p.element.parentNode) {
                    p.element.style.animation =
                      "particleBurst 0.6s ease-out forwards";
                    setTimeout(() => {
                      if (p.element.parentNode) {
                        p.element.parentNode.removeChild(p.element);
                      }
                    }, 600);
                  }
                });
              } else {
                // TOP-3 ANSWERS: Move to edges instead of disappearing
                if (!particleData.element.dataset.displaced) {
                  particleData.element.dataset.displaced = "true";

                  // Get current position
                  const currentLeft = parseFloat(
                    particleData.element.style.left
                  );
                  const currentTop = parseFloat(particleData.element.style.top);
                  const elementCenterX =
                    currentLeft +
                    parseFloat(particleData.element.style.width) / 2;
                  const elementCenterY =
                    currentTop +
                    parseFloat(particleData.element.style.height) / 2;

                  const elementRadius =
                    parseFloat(particleData.element.style.width) / 2;

                  // Determine which edge is closest
                  const distToLeft = elementCenterX;
                  const distToRight = containerWidth - elementCenterX;
                  const distToTop = elementCenterY;
                  const distToBottom = containerHeight - elementCenterY;

                  const minDist = Math.min(
                    distToLeft,
                    distToRight,
                    distToTop,
                    distToBottom
                  );

                  // Calculate target position based on closest edge
                  let targetX, targetY;
                  if (minDist === distToLeft) {
                    targetX = elementRadius;
                    targetY = elementCenterY;
                  } else if (minDist === distToRight) {
                    targetX = containerWidth - elementRadius;
                    targetY = elementCenterY;
                  } else if (minDist === distToTop) {
                    targetX = elementCenterX;
                    targetY = elementRadius;
                  } else {
                    targetX = elementCenterX;
                    targetY = containerHeight - elementRadius;
                  }

                  // Animate to edge with bounce effect
                  particleData.element.style.transition =
                    "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
                  particleData.element.style.left = `${
                    targetX - elementRadius
                  }px`;
                  particleData.element.style.top = `${
                    targetY - elementRadius
                  }px`;
                  particleData.element.style.zIndex = "200"; // Bring to front
                  particleData.isDisplaced = true; // Mark as displaced
                }
              }
            }
          });
        }

        /**
         * Main animation loop for traveling particle
         */
        function animate() {
          // Move horizontally
          x += 4 * direction; // 4 pixels per frame

          // Add sine wave vertical movement
          y = baseY + Math.sin(x * waveFrequency) * waveAmplitude;

          // Keep within vertical boundaries
          const minY = particleRadius;
          const maxY = containerHeight - particleRadius;
          y = Math.max(minY, Math.min(maxY, y));

          // Reverse direction and randomize path at horizontal boundaries
          if (x > containerWidth - particleRadius) {
            x = containerWidth - particleRadius;
            direction = -1; // Move left
            // Randomize new path parameters
            baseY =
              particleRadius +
              Math.random() * (containerHeight - 2 * particleRadius);
            waveAmplitude = 20 + Math.random() * 40;
            waveFrequency = 0.003 + Math.random() * 0.004;
          } else if (x < particleRadius) {
            x = particleRadius;
            direction = 1; // Move right
            // Randomize new path parameters
            baseY =
              particleRadius +
              Math.random() * (containerHeight - 2 * particleRadius);
            waveAmplitude = 20 + Math.random() * 40;
            waveFrequency = 0.003 + Math.random() * 0.004;
          }

          // Update particle position
          particle.style.left = `${x - particleRadius}px`;
          particle.style.top = `${y - particleRadius}px`;

          // Check for collisions with other particles
          checkCollisions();

          // Continue animation
          requestAnimationFrame(animate);
        }

        animate(); // Start the animation loop
      }

      createTravelingParticle(); // Create and start the traveling particle

      // =================================================================
      // WAVE ANIMATION FOR STATIC PARTICLES
      // =================================================================

      /**
       * Animate particles in three sine waves
       * Each wave has different properties for visual variety
       */
      function animateWave() {
        const containerWidth = waveInner.offsetWidth;
        const containerHeight = waveInner.offsetHeight;
        const time = Date.now() * 0.001; // Convert to seconds
        const baseWaveSpeed = (0.4 + qIndex * 0.1) * 0.25; // Slower speed (was 0.5, now 0.25)
        const waveSpacing = containerHeight / 4; // Divide height for 3 waves

        allParticles.forEach((particleData) => {
          const { element, baseSize, index, waveIndex, totalAnswers, seed } =
            particleData;

          // Skip animation if particle has been displaced to edge
          if (particleData.isDisplaced) return;

          // Calculate wave properties (each wave is different)
          const waveSpeed = baseWaveSpeed * (1 + waveIndex * 0.3);
          const waveAmplitude = containerHeight * 0.08 * (1 - waveIndex * 0.1);
          const centerY = waveSpacing * (waveIndex + 1); // Y center for this wave

          // Distribute particles evenly along X-axis
          const spacing = containerWidth / (totalAnswers + 1);
          const x = spacing * (index + 1);

          // Calculate Y position using sine wave
          const phase = (x / containerWidth) * Math.PI * 2;
          const wavePhaseOffset = (waveIndex * Math.PI) / 3; // Different phase for each wave
          const y =
            centerY +
            Math.sin(phase + time * waveSpeed + wavePhaseOffset) *
              waveAmplitude;

          // Add subtle vertical floating animation
          const floatY =
            Math.sin(time * (1.5 + waveIndex * 0.2) + index * 0.5) *
            (3 + waveIndex);

          // Dynamic scaling based on wave position and time
          const scaleVariation = 0.7 + 0.6 * Math.sin(time * 0.8 + seed * 0.1);
          const waveScale =
            1 + 0.3 * Math.sin(phase + time * waveSpeed * 0.5 + seed * 0.05);
          const finalScale = scaleVariation * waveScale;

          const finalSize = baseSize * finalScale;

          // Update particle position and size
          element.style.left = `${x - finalSize / 2}px`;
          element.style.top = `${y + floatY - finalSize / 2}px`;
          element.style.width = `${finalSize}px`;
          element.style.height = `${finalSize}px`;

          // Scale text size with particle size
          const textElement = element.querySelector(".particle-text");
          const waveScaleFactor =
            waveIndex === 0 ? 1 : waveIndex === 1 ? 0.85 : 0.7;
          const newFontSize =
            (0.6 + waveScaleFactor * 0.15) * Math.sqrt(finalScale);
          textElement.style.fontSize = `${newFontSize}rem`;
        });

        // Continue wave animation
        requestAnimationFrame(animateWave);
      }

      // Start wave animation after particles have appeared
      setTimeout(() => {
        animateWave();
      }, 1500);

      // Add completed section to container
      section.appendChild(waveContainer);
      container.appendChild(section);
    });
  }

  render({ time, width, height }) {
    if (!this.initialized) {
      this.initializeHTML();
      this.initialized = true;
    }
  }

  isComplete(time) {
    return time > 30;
  }

  destroy() {
    if (this.container) {
      document.body.removeChild(this.container);
    }
    const canvas = document.querySelector("canvas");
    if (canvas) canvas.style.display = "block";
  }
}


module.exports = Phase2;