// data/survey-data.js

// Phase 1: Reasons for leaving (black bubbles)
const reasonsForLeaving = [
  { word: 'Lack of Opportunity', color: [0.1, 0.1, 0.1], responses: 12 },
  { word: 'Corrupt Government', color: [0.1, 0.1, 0.1], responses: 6 },
  { word: 'Violence', color: [0.1, 0.1, 0.1], responses: 4 },
  { word: 'Economic Instability', color: [0.1, 0.1, 0.1], responses: 4 },
  { word: 'Police Brutality', color: [0.1, 0.1, 0.1], responses: 2 },
  { word: 'Decay of Educational System', color: [0.1, 0.1, 0.1], responses: 2 },
  { word: 'Lack of Freedom of Speech', color: [0.1, 0.1, 0.1], responses: 2 },
  { word: 'Disinformation', color: [0.1, 0.1, 0.1], responses: 1 },
  { word: 'Decay of Healthcare System', color: [0.1, 0.1, 0.1], responses: 1 }
];

// Phase 2: Emotions during immigration (colorful - for later)
const emotionsDuringImmigration = [
  { word: 'Hope', color: [0.3, 0.8, 0.3], responses: 15 },
  { word: 'Fear', color: [0.9, 0.3, 0.3], responses: 12 },
  { word: 'Uncertainty', color: [0.9, 0.6, 0.2], responses: 8 },
  { word: 'Relief', color: [0.2, 0.5, 0.9], responses: 6 },
  { word: 'Excitement', color: [0.7, 0.3, 0.8], responses: 5 }
];

// Phase 3: Current climate (for later)
const currentClimateEmotions = [
  { word: 'Concerned', color: [0.9, 0.4, 0.2], responses: 18 },
  { word: 'Hopeful', color: [0.5, 0.8, 0.3], responses: 12 },
  { word: 'Frustrated', color: [0.8, 0.2, 0.4], responses: 10 }
];

module.exports = {
  reasonsForLeaving,
  emotionsDuringImmigration,
  currentClimateEmotions
};