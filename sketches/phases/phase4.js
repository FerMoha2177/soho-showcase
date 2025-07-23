const PHASE4_STYLES = require('./phase4-styles.js');
const { identityReflections } = require('../data/survey-data.js');

class Phase4 {
    constructor(width, height, audioSystem) {
        this.width = width;
        this.height = height;
        this.audioSystem = audioSystem;
        this.container = null;
        this.initialized = false;
        this.canvas = null;
        this.ctx = null;
        this.currentReflections = [];
        this.lastClickTime = 0;
        this.currentColorIndices = [0, 0, 0];
        
        // Color schemes based on survey data - top 3 colors for each stage
        this.stageColorSchemes = [
            // Stage 1: The Decision - Blue, Green, Yellow
            [
                ['rgba(33, 150, 243, 0.4)', 'rgba(33, 150, 243, 0.1)'], // Blue
                ['rgba(76, 175, 80, 0.4)', 'rgba(76, 175, 80, 0.1)'],   // Green
                ['rgba(255, 193, 7, 0.4)', 'rgba(255, 193, 7, 0.1)']    // Yellow
            ],
            // Stage 2: New Home - Blue, Green, Orange
            [
                ['rgba(33, 150, 243, 0.4)', 'rgba(33, 150, 243, 0.1)'], // Blue
                ['rgba(76, 175, 80, 0.4)', 'rgba(76, 175, 80, 0.1)'],   // Green
                ['rgba(255, 152, 0, 0.4)', 'rgba(255, 152, 0, 0.1)']    // Orange
            ],
            // Stage 3: Current State - White, Blue, Purple
            [
                ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)'], // White
                ['rgba(33, 150, 243, 0.4)', 'rgba(33, 150, 243, 0.1)'],   // Blue
                ['rgba(156, 39, 176, 0.4)', 'rgba(156, 39, 176, 0.1)']    // Purple
            ]
        ];
        
        console.log('Phase 4 initialized - Identity Reflections');
    }
    
    initializeHTML() {
        // Hide canvas-sketch canvas
        const existingCanvas = document.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.style.display = 'none';
        }
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = PHASE4_STYLES;
        document.head.appendChild(style);
        
        // Create HTML structure
        this.container = document.createElement('div');
        this.container.innerHTML = `
            <canvas id="reflectionCanvas"></canvas>
            <div class="instructions">Click anywhere to see new reflections</div>
            <div class="question-indicator" id="questionIndicator">Loading identity reflections...</div>
        `;
        document.body.appendChild(this.container);
        
        // Setup canvas and start visualization
        setTimeout(() => {
            this.setupCanvas();
            this.init();
        }, 100);
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('reflectionCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Resize canvas to fill viewport
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Add event listeners
        this.canvas.addEventListener('click', () => this.loadNewReflections());
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' || event.code === 'Enter') {
                event.preventDefault();
                this.loadNewReflections();
            }
        });
    }
    
    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    selectRandomReflections() {
        const reflections = [];
        
        // Shuffle all identity reflections and pick 3
        const shuffledReflections = this.shuffleArray(identityReflections);
        const selectedReflections = shuffledReflections.slice(0, 3);
        
        // Update color indices to next color for each card
        this.currentColorIndices = this.currentColorIndices.map((currentIndex, cardIndex) => {
            const stageColors = this.stageColorSchemes[cardIndex];
            return (currentIndex + 1) % stageColors.length;
        });
        
        selectedReflections.forEach((reflection, index) => {
            reflections.push({
                text: reflection,
                x: 0,
                y: 0,
                targetY: 0,
                currentY: 0,
                opacity: 0,
                targetOpacity: 1,
                index: index
            });
        });
        
        return reflections;
    }
    
    wrapText(text, maxWidth, context) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
    
    calculateTextHeight(text, textWidth, context) {
        context.font = '18px Helvetica, Arial, sans-serif';
        const lines = this.wrapText(text, textWidth, context);
        const lineHeight = 22;
        const headerHeight = 80;
        const padding = 40;
        
        return headerHeight + (lines.length * lineHeight) + padding;
    }
    
    getCurrentColorScheme(cardIndex) {
        const stageColors = this.stageColorSchemes[cardIndex];
        const colorIndex = this.currentColorIndices[cardIndex];
        return stageColors[colorIndex];
    }
    
    drawReflection(reflection, index) {
        const cardWidth = Math.min(this.canvas.width * 0.85, 600);
        const textWidth = cardWidth - 50;
        
        const requiredHeight = this.calculateTextHeight(reflection.text, textWidth, this.ctx);
        const cardHeight = Math.max(150, requiredHeight);
        
        const margin = 20;
        const availableHeight = this.canvas.height - (margin * 2);
        let totalRequiredHeight = 0;
        
        this.currentReflections.forEach(r => {
            const rHeight = this.calculateTextHeight(r.text, textWidth, this.ctx);
            totalRequiredHeight += Math.max(150, rHeight);
        });
        
        const cardSpacing = Math.max(15, (availableHeight - totalRequiredHeight) / 4);
        
        let currentY = margin + cardSpacing;
        for (let i = 0; i < index; i++) {
            const prevHeight = this.calculateTextHeight(this.currentReflections[i].text, textWidth, this.ctx);
            currentY += Math.max(150, prevHeight) + cardSpacing;
        }
        
        const x = (this.canvas.width - cardWidth) / 2;
        const targetY = currentY;
        
        reflection.targetY = targetY;
        reflection.currentY += (reflection.targetY - reflection.currentY) * 0.1;
        reflection.opacity += (reflection.targetOpacity - reflection.opacity) * 0.05;
        
        this.ctx.save();
        this.ctx.globalAlpha = reflection.opacity * 0.9;
        
        const currentColors = this.getCurrentColorScheme(index);
        const gradient = this.ctx.createLinearGradient(x, reflection.currentY, x + cardWidth, reflection.currentY + cardHeight);
        gradient.addColorStop(0, currentColors[0]);
        gradient.addColorStop(1, currentColors[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, reflection.currentY, cardWidth, cardHeight);
        
        const borderOpacity = index === 0 ? 0.6 : index === 1 ? 0.5 : 0.7;
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${borderOpacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, reflection.currentY, cardWidth, cardHeight);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = 'bold 16px Helvetica, Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Identity Reflection', x + cardWidth / 2, reflection.currentY + 30);
        
        const stageLabels = ['Stage 1: The Decision', 'Stage 2: New Home', 'Stage 3: Current State'];
        this.ctx.font = '12px Helvetica, Arial, sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillText(stageLabels[index], x + cardWidth / 2, reflection.currentY + 50);
        
        const textX = x + 25;
        const textY = reflection.currentY + 80;
        const lineHeight = 22;
        
        this.ctx.font = '18px Helvetica, Arial, sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.textAlign = 'center';
        
        const textLines = this.wrapText(reflection.text, textWidth, this.ctx);
        
        textLines.forEach((line, lineIndex) => {
            this.ctx.fillText(line, x + cardWidth / 2, textY + (lineIndex * lineHeight));
        });
        
        this.ctx.font = 'bold 12px Helvetica, Arial, sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${index + 1}/3`, x + cardWidth - 15, reflection.currentY + 25);
        
        this.ctx.restore();
    }
    
    renderLoop() {
        this.ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.currentReflections.length > 0) {
            let totalContentHeight = 40;
            const cardWidth = Math.min(this.canvas.width * 0.85, 600);
            const textWidth = cardWidth - 50;
            
            this.currentReflections.forEach(reflection => {
                const requiredHeight = this.calculateTextHeight(reflection.text, textWidth, this.ctx);
                totalContentHeight += Math.max(150, requiredHeight) + 15;
            });
            
            if (totalContentHeight > this.canvas.height) {
                this.ctx.save();
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.font = '14px Helvetica, Arial, sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Content adapted to fit screen', this.canvas.width / 2, 20);
                this.ctx.restore();
            }
        }
        
        this.currentReflections.forEach((reflection, index) => {
            this.drawReflection(reflection, index);
        });
        
        requestAnimationFrame(() => this.renderLoop());
    }
    
    loadNewReflections() {
        const currentTime = Date.now();
        if (currentTime - this.lastClickTime < 1000) return;
        this.lastClickTime = currentTime;
        
        this.currentReflections.forEach(reflection => {
            reflection.targetOpacity = 0;
        });
        
        setTimeout(() => {
            this.currentReflections = this.selectRandomReflections();
            
            this.currentReflections.forEach((reflection, index) => {
                reflection.currentY = -200;
                reflection.opacity = 0;
            });
            
            const questionIndicator = document.getElementById('questionIndicator');
            if (questionIndicator) {
                questionIndicator.textContent = "Mostrando reflexiones sobre identidad • Showing identity reflections";
            }
        }, 500);
    }
    
    init() {
        this.loadNewReflections();
        this.renderLoop();
        
        setTimeout(() => {
            const questionIndicator = document.getElementById('questionIndicator');
            if (questionIndicator) {
                questionIndicator.textContent = "Click anywhere or press Space to see new reflections";
            }
        }, 2000);
    }
    
    render({ time, width, height }) {
        if (!this.initialized) {
            this.initializeHTML();
            this.initialized = true;
        }
    }
    
    isComplete(time) {
        return time > 45; // Longer duration for reading reflections
    }
    
    destroy() {
        if (this.container) {
            document.body.removeChild(this.container);
        }
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.style.display = 'block';
        
        // Remove event listeners
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

module.exports = Phase4;