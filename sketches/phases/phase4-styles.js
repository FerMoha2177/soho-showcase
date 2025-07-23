const PHASE4_STYLES = `
/* All of Isabella's CSS here */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    color: #ffffff;
    font-family: 'Helvetica', 'Arial', sans-serif;
    overflow: hidden;
    cursor: pointer;
}

canvas {
    display: block;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #2c3e50, #3498db, #e74c3c, #f39c12);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.instructions {
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    padding: 15px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 1000;
}

.question-indicator {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    z-index: 1000;
    max-width: 80%;
}
`;

module.exports = PHASE4_STYLES;
