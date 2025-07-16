
// Survey emotion color mapping
const emotionColors = {
  'Fear': '#DC2626',        // Red
  'Anger': '#DC2626',       // Red  
  'Sadness': '#1D4ED8',     // Blue
  'Numbness': '#6B7280',    // Gray
  'Anxiety': '#7C3AED',     // Purple
  'Guilt': '#059669',       // Green
  'Denial': '#000000',      // Black
  'Disappointment': '#F59E0B', // Orange/Yellow
  'Excitement': '#F59E0B',  // Orange
  'Relief': '#1D4ED8',      // Blue
  'Hope': '#059669'         // Green
};

// Phase 1: Reasons for leaving (black bubbles)
const reasonsForLeaving = [
  { word: 'Lack\nof\nOpportunity', color: [0.1, 0.1, 0.1], responses: 13 },
  { word: 'Corrupt Government', color: [0.1, 0.1, 0.1], responses: 6 },
  { word: 'Violence', color: [0.1, 0.1, 0.1], responses: 4 },
  { word: 'Economic Instability', color: [0.1, 0.1, 0.1], responses: 4 },
  { word: 'Police Brutality', color: [0.1, 0.1, 0.1], responses: 2 },
  { word: 'Decay of Educational System', color: [0.1, 0.1, 0.1], responses: 2 },
  { word: 'Lack of Freedom of Speech', color: [0.1, 0.1, 0.1], responses: 2 },
  { word: 'Disinformation', color: [0.1, 0.1, 0.1], responses: 1 },
  { word: 'Decay of Healthcare System', color: [0.1, 0.1, 0.1], responses: 1 }
];

// Phase 1: Emotions during immigration (now with proper colors!)
const emotionsDuringImmigration = [
  { word: 'Hope', color: emotionColors['Hope'], responses: 15 },
  { word: 'Fear', color: emotionColors['Fear'], responses: 12 },
  { word: 'Anxiety', color: emotionColors['Anxiety'], responses: 8 },
  { word: 'Relief', color: emotionColors['Relief'], responses: 6 },
  { word: 'Excitement', color: emotionColors['Excitement'], responses: 5 },
  { word: 'Sadness', color: emotionColors['Sadness'], responses: 5 },
  { word: 'Anger', color: emotionColors['Anger'], responses: 4 },
  { word: 'Guilt', color: emotionColors['Guilt'], responses: 3 }
];

// Phase 3: Current climate (for later)
const currentClimateEmotions = [
  { word: 'Concerned', color: [0.9, 0.4, 0.2], responses: 18 },
  { word: 'Hopeful', color: [0.5, 0.8, 0.3], responses: 12 },
  { word: 'Frustrated', color: [0.8, 0.2, 0.4], responses: 10 }
];

module.exports = {
  emotionColors,
  reasonsForLeaving,
  emotionsDuringImmigration,
  currentClimateEmotions
};