// sketches/audio/audio-system.js
// Reusable Web Audio API service for all phases

class AudioSystem {
    constructor() {
      this.audioContext = null;
      this.analyser = null;
      this.audioSource = null;
      this.frequencyData = null;
      this.audioElement = null;
      
      // Audio analysis data
      this.bassLevel = 0;
      this.midLevel = 0;
      this.trebleLevel = 0;
      this.overallLevel = 0;
      this.previousBassLevel = 0;
      this.beatDetected = false;
      
      // Configuration
      this.config = {
        fftSize: 256,
        smoothingTimeConstant: 0.8,
        beatThreshold: 0.15,
        bassRange: 0.1,     // 0-10% for bass
        midRange: 0.4,      // 10-50% for mids
        trebleRange: 1.0    // 50-100% for treble
      };
      
      // State
      this.isInitialized = false;
      this.isPlaying = false;
      this.currentFile = null;
      
      // UI elements
      this.controlsContainer = null;
      
      // Callbacks for phases
      this.onBeatDetected = null;
      this.onAudioUpdate = null;
    }
    
    // Initialize the audio system
    async init() {
      try {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create analyser
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = this.config.fftSize;
        this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant;
        
        // Create frequency data array
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        
        // Create audio element
        this.audioElement = document.createElement('audio');
        this.audioElement.crossOrigin = 'anonymous';
        this.audioElement.loop = true;
        
        // Connect audio graph
        this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        this.isInitialized = true;
        console.log('🎵 Audio system initialized successfully');
        
        // Auto-load demo audio (but don't auto-play due to browser restrictions)
        try {
          await this.loadDemoAudio();
          console.log('🎤 Demo beat loaded and ready to play!');
        } catch (error) {
          console.log('⚠️ Demo beat not found, that\'s okay - user can upload their own');
        }
        
        return true;
      } catch (error) {
        console.error('❌ Failed to initialize audio system:', error);
        return false;
      }
    }
    
    // Create UI controls (call this from your main sketch)
    createControls(options = {}) {
      const {
        position = { top: '20px', right: '20px' },
        style = {}
      } = options;
      
      // Remove existing controls
      if (this.controlsContainer) {
        this.controlsContainer.remove();
      }
      
      this.controlsContainer = document.createElement('div');
      this.controlsContainer.style.cssText = `
        position: fixed;
        top: ${position.top};
        right: ${position.right};
        z-index: 1000;
        background: rgba(0, 0, 0, 0.8);
        padding: 8px;
        border-radius: 6px;
        font-family: Arial, sans-serif;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
        backdrop-filter: blur(5px);
        cursor: move;
        user-select: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        ${Object.entries(style).map(([key, value]) => `${key}: ${value}`).join('; ')};
      `;
      
      // Make it draggable
      this.makeDraggable(this.controlsContainer);
      
      // Play/Pause button
      const playButton = document.createElement('button');
      playButton.textContent = '▶️';
      playButton.style.cssText = `
        padding: 6px 10px; 
        border: none; 
        border-radius: 4px; 
        background: #4CAF50; 
        color: white; 
        cursor: pointer; 
        font-size: 14px;
        min-width: 35px;
      `;
      playButton.onclick = (e) => {
        e.stopPropagation(); // Prevent drag when clicking button
        this.togglePlayback();
      };
      
      // Volume slider
      const volumeSlider = document.createElement('input');
      volumeSlider.type = 'range';
      volumeSlider.min = '0';
      volumeSlider.max = '1';
      volumeSlider.step = '0.1';
      volumeSlider.value = '0.7';
      volumeSlider.style.cssText = 'width: 80px; cursor: pointer;';
      volumeSlider.oninput = (e) => {
        e.stopPropagation(); // Prevent drag when using slider
        this.setVolume(parseFloat(e.target.value));
      };
      
      // Volume label
      const volumeLabel = document.createElement('span');
      volumeLabel.textContent = '🔊';
      volumeLabel.style.cssText = 'font-size: 12px; opacity: 0.8;';
      
      // Assemble controls
      this.controlsContainer.appendChild(playButton);
      this.controlsContainer.appendChild(volumeLabel);
      this.controlsContainer.appendChild(volumeSlider);
      
      document.body.appendChild(this.controlsContainer);
      
      // Store references for updates
      this.playButton = playButton;
      this.volumeSlider = volumeSlider;
    }
    
    // Make element draggable
    makeDraggable(element) {
      let isDragging = false;
      let currentX;
      let currentY;
      let initialX;
      let initialY;
      let xOffset = 0;
      let yOffset = 0;
      
      element.addEventListener('mousedown', dragStart);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', dragEnd);
      
      function dragStart(e) {
        // Only drag if clicking on the container itself, not buttons/sliders
        if (e.target === element) {
          initialX = e.clientX - xOffset;
          initialY = e.clientY - yOffset;
          isDragging = true;
          element.style.cursor = 'grabbing';
        }
      }
      
      function drag(e) {
        if (isDragging) {
          e.preventDefault();
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
          
          xOffset = currentX;
          yOffset = currentY;
          
          // Keep within viewport bounds
          const rect = element.getBoundingClientRect();
          const maxX = window.innerWidth - rect.width;
          const maxY = window.innerHeight - rect.height;
          
          currentX = Math.max(0, Math.min(currentX, maxX));
          currentY = Math.max(0, Math.min(currentY, maxY));
          
          element.style.left = currentX + 'px';
          element.style.top = currentY + 'px';
          element.style.right = 'auto';
          element.style.bottom = 'auto';
        }
      }
      
      function dragEnd() {
        if (isDragging) {
          isDragging = false;
          element.style.cursor = 'move';
        }
      }
    }
    
    // Load audio file (supports both File objects and URLs)
    async loadFile(fileOrUrl) {
      if (!fileOrUrl) return false;
      
      try {
        let url;
        let fileName;
        
        if (typeof fileOrUrl === 'string') {
          // It's a URL/path
          url = fileOrUrl;
          fileName = fileOrUrl.split('/').pop();
        } else {
          // It's a File object from input
          url = URL.createObjectURL(fileOrUrl);
          fileName = fileOrUrl.name;
        }
        
        this.audioElement.src = url;
        this.currentFile = fileName;
        
        await new Promise((resolve, reject) => {
          this.audioElement.onloadeddata = resolve;
          this.audioElement.onerror = reject;
        });
        
        // Update UI to show loaded file
        if (this.fileNameDisplay) {
          this.fileNameDisplay.textContent = `📀 ${fileName}`;
          this.fileNameDisplay.style.color = '#4CAF50';
        }
        if (this.fileButton) {
          this.fileButton.textContent = '✅ File Loaded - Choose Another';
        }
        
        console.log(`🎵 Loaded: ${this.currentFile}`);
        return true;
      } catch (error) {
        console.error('❌ Failed to load audio file:', error);
        return false;
      }
    }
    
    // Load demo audio file
    async loadDemoAudio() {
      return await this.loadFile('./data/audio/bubblebeat1.mp3');
    }
    
    // Play/pause toggle
    async togglePlayback() {
      if (!this.isInitialized) {
        console.warn('⚠️ Audio system not initialized');
        return;
      }
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      if (this.isPlaying) {
        this.audioElement.pause();
        this.isPlaying = false;
        if (this.playButton) this.playButton.textContent = '▶️ Play';
      } else {
        try {
          await this.audioElement.play();
          this.isPlaying = true;
          if (this.playButton) this.playButton.textContent = '⏸️ Pause';
        } catch (error) {
          console.error('❌ Failed to play audio:', error);
        }
      }
    }
    
    // Stop playback
    stop() {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.isPlaying = false;
        if (this.playButton) this.playButton.textContent = '▶️ Play';
      }
    }
    
    // Set volume
    setVolume(volume) {
      if (this.audioElement) {
        this.audioElement.volume = Math.max(0, Math.min(1, volume));
      }
    }
    
    // Main update method - call this in your render loop
    update() {
      if (!this.isInitialized || !this.isPlaying) {
        // Reset levels when not playing
        this.bassLevel = 0;
        this.midLevel = 0;
        this.trebleLevel = 0;
        this.overallLevel = 0;
        this.beatDetected = false;
        return;
      }
      
      // Get frequency data
      this.analyser.getByteFrequencyData(this.frequencyData);
      
      // Calculate frequency ranges
      const dataLength = this.frequencyData.length;
      const bassEnd = Math.floor(dataLength * this.config.bassRange);
      const midEnd = Math.floor(dataLength * this.config.midRange);
      
      // Calculate levels for each frequency range
      let bassSum = 0, midSum = 0, trebleSum = 0, totalSum = 0;
      
      // Bass (0-10%)
      for (let i = 0; i < bassEnd; i++) {
        bassSum += this.frequencyData[i];
      }
      
      // Mids (10-50%)
      for (let i = bassEnd; i < midEnd; i++) {
        midSum += this.frequencyData[i];
      }
      
      // Treble (50-100%)
      for (let i = midEnd; i < dataLength; i++) {
        trebleSum += this.frequencyData[i];
      }
      
      // Total
      for (let i = 0; i < dataLength; i++) {
        totalSum += this.frequencyData[i];
      }
      
      // Normalize to 0-1 range
      this.bassLevel = (bassSum / bassEnd) / 255;
      this.midLevel = (midSum / (midEnd - bassEnd)) / 255;
      this.trebleLevel = (trebleSum / (dataLength - midEnd)) / 255;
      this.overallLevel = (totalSum / dataLength) / 255;
      
      // Simple beat detection (bass level increase)
      const bassIncrease = this.bassLevel - this.previousBassLevel;
      this.beatDetected = bassIncrease > this.config.beatThreshold;
      this.previousBassLevel = this.bassLevel;
      
      // Update UI
      this.updateUI();
      
      // Call callbacks
      if (this.onAudioUpdate) {
        this.onAudioUpdate({
          bass: this.bassLevel,
          mid: this.midLevel,
          treble: this.trebleLevel,
          overall: this.overallLevel,
          beat: this.beatDetected,
          rawData: this.frequencyData
        });
      }
      
      if (this.beatDetected && this.onBeatDetected) {
        this.onBeatDetected(this.bassLevel);
      }
    }
    
    // Update UI displays
    updateUI() {
      // Minimal UI - no level displays needed anymore
    }
    
    // Get current audio data (for phases to use)
    getAudioData() {
      return {
        bass: this.bassLevel,
        mid: this.midLevel,
        treble: this.trebleLevel,
        overall: this.overallLevel,
        beat: this.beatDetected,
        isPlaying: this.isPlaying,
        rawFrequencyData: this.frequencyData
      };
    }
    
    // Set callback for beat detection
    onBeat(callback) {
      this.onBeatDetected = callback;
    }
    
    // Set callback for audio updates
    onUpdate(callback) {
      this.onAudioUpdate = callback;
    }
    
    // Cleanup method
    destroy() {
      this.stop();
      
      if (this.controlsContainer) {
        this.controlsContainer.remove();
      }
      
      if (this.audioContext) {
        this.audioContext.close();
      }
      
      if (this.currentFile) {
        URL.revokeObjectURL(this.audioElement.src);
      }
    }
    
    // Helper: Create audio-reactive gradient
    createReactiveGradient(context, width, height, options = {}) {
      const {
        centerX = width * 0.5,
        centerY = height * 0.5,
        baseRadius = 100,
        maxRadius = 300,
        colors = ['#ff6b6b', '#4ecdc4', '#45b7d1']
      } = options;
      
      const radius = baseRadius + (this.overallLevel * (maxRadius - baseRadius));
      const gradient = context.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      // Colors that react to different frequencies
      const bassColor = `rgba(255, ${Math.floor(100 + this.bassLevel * 100)}, ${Math.floor(100 + this.midLevel * 100)}, ${0.1 + this.bassLevel * 0.3})`;
      const midColor = `rgba(${Math.floor(100 + this.trebleLevel * 100)}, 255, ${Math.floor(100 + this.bassLevel * 100)}, ${0.1 + this.midLevel * 0.2})`;
      const trebleColor = `rgba(${Math.floor(100 + this.midLevel * 100)}, ${Math.floor(100 + this.bassLevel * 100)}, 255, ${0.1 + this.trebleLevel * 0.2})`;
      
      gradient.addColorStop(0, bassColor);
      gradient.addColorStop(0.5, midColor);
      gradient.addColorStop(1, trebleColor);
      
      return gradient;
    }
    
    // Helper: Get beat-scaled value
    getBeatScale(baseValue = 1, intensity = 0.3) {
      return baseValue + (this.beatDetected ? intensity : 0);
    }
    
    // Helper: Get audio-influenced color
    getReactiveColor(baseColor, influence = 0.2) {
      // Parse base color (assumes hex format)
      const hex = baseColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // Apply audio influence
      const newR = Math.min(255, r + (this.bassLevel * influence * 255));
      const newG = Math.min(255, g + (this.midLevel * influence * 255));
      const newB = Math.min(255, b + (this.trebleLevel * influence * 255));
      
      return `rgb(${Math.floor(newR)}, ${Math.floor(newG)}, ${Math.floor(newB)})`;
    }
  }
  
  // Create singleton instance
  const audioSystem = new AudioSystem();
  
  // Export for use in phases
  module.exports = { audioSystem, AudioSystem };