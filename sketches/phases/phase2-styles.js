const PHASE2_STYLES = `
/* All of Isabella's CSS here */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
        #E84A8A 0%,    /* Pink */
        #0067A3 15%,   /* Blue */
        #00A651 30%,   /* Green */
        #FF6900 45%,   /* Orange */
        #663399 60%,   /* Purple */
        #F7F7F7 75%,   /* White */
        #2B2B2B 90%,   /* Black */
        #FFCC00 100%   /* Yellow */
    );
    background-size: 400% 400%;
    animation: gradientShift 20s ease infinite;
    color: #ffffff;
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-weight: bold;
    overflow-x: hidden;
    overflow-y: auto;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

#container {
    width: 100vw;
    height: 100vh;  // Force container to viewport height
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    box-sizing: border-box;
    position: relative;
    overflow-y: auto;  // Add scrolling to the container
}

#container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
}

.title {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    opacity: 0;
    animation: fadeIn 1s ease-out forwards;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    color: #ffffff;
    text-transform: uppercase;
}

.subtitle {
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    font-weight: bold;
    margin-bottom: 40px;
    text-align: center;
    opacity: 0;
    animation: fadeIn 1s ease-out 0.3s forwards;
    color: #ffffff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
}

.loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    z-index: 1000;
}

.question-section {
    width: 100%;
    max-width: 1600px;
    margin-bottom: 100px;
    opacity: 0;
    animation: fadeIn 1s ease-out 0.6s forwards;
}

.question-title {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    font-weight: bold;
    margin-bottom: 50px;
    text-align: center;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
}

.wave-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    overflow: visible;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.wave-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.particle {
    position: absolute;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 15px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    opacity: 0;
    transform: scale(0);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    z-index: 10;
}

.particle:hover {
    transform: scale(1.15);
    z-index: 100;
    filter: brightness(1.1) saturate(1.2);
}

.particle-text {
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: bold;
    max-width: 140px;
    line-height: 1.3;
    text-transform: uppercase;
    text-shadow: 
        0 1px 2px rgba(0, 0, 0, 0.4),
        0 2px 4px rgba(0, 0, 0, 0.2),
        0 1px 0 rgba(0, 0, 0, 0.8);
    pointer-events: none;
    font-family: 'Helvetica', 'Arial', sans-serif;
}

.traveling-particle {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6));
    box-shadow: 
        0 0 20px rgba(255, 255, 255, 0.8),
        0 0 40px rgba(255, 255, 255, 0.6),
        0 0 60px rgba(255, 255, 255, 0.4),
        0 4px 16px rgba(255, 255, 255, 0.3);
    z-index: 1000;
    pointer-events: none;
}

@keyframes fadeIn {
    to { opacity: 1; }
}

@keyframes particleAppear {
    from {
        opacity: 0;
        transform: scale(0);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes particleBurst {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.5);
    }
    100% {
        opacity: 0;
        transform: scale(0);
    }
}

.back-button {
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    z-index: 1000;
}

.back-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}
`;

module.exports = PHASE2_STYLES;
