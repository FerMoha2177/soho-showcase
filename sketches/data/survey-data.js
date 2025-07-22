
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
  { word: 'Lack\nof\nOpportunity', color: [0.1, 0.1, 0.1], responses: 12 },
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


// Phase 2 In progress...





// Phase 3: Gratitude responses (INCREASED SPACING)
const gratitudeResponses = [
  { word: 'My\nFriends', color: '#4CAF50', responses: 15, orbitRadius: 160, orbitSpeed: 0.4 },
  { word: 'My\nCommunity', color: '#2196F3', responses: 14, orbitRadius: 200, orbitSpeed: 0.35 },
  { word: 'My\nFreedom', color: '#9C27B0', responses: 18, orbitRadius: 240, orbitSpeed: 0.25 },
  { word: 'Feeling\nSafety', color: '#00BCD4', responses: 12, orbitRadius: 140, orbitSpeed: 0.5 },
  { word: 'My\nEducation', color: '#FF9800', responses: 10, orbitRadius: 180, orbitSpeed: 0.4 },
  { word: 'Growth\nOpportunities', color: '#8BC34A', responses: 13, orbitRadius: 220, orbitSpeed: 0.3 },
  { word: 'Economic\nStability', color: '#FFC107', responses: 9, orbitRadius: 170, orbitSpeed: 0.42 },
  { word: 'Cultural\nConnection', color: '#E91E63', responses: 11, orbitRadius: 190, orbitSpeed: 0.38 },
  { word: 'Learning\nEnglish', color: '#673AB7', responses: 8, orbitRadius: 150, orbitSpeed: 0.48 },
  { word: 'New\nHome', color: '#795548', responses: 16, orbitRadius: 210, orbitSpeed: 0.32 }
];

// Phase 3: Concern responses (MUCH MORE SPACED OUT)
const concernResponses = [
  { word: 'Growing\nRacism', color: '#D32F2F', responses: 22, orbitRadius: 380, orbitSpeed: 0.2 },
  { word: 'Disinformation\n& Ignorance', color: '#F44336', responses: 18, orbitRadius: 340, orbitSpeed: 0.22 },
  { word: 'Rights\nNot Valued', color: '#FF5722', responses: 19, orbitRadius: 360, orbitSpeed: 0.21 },
  { word: 'Government\nAbuse of Power', color: '#B71C1C', responses: 17, orbitRadius: 320, orbitSpeed: 0.24 },
  { word: 'Justice\nSystem Distrust', color: '#37474F', responses: 14, orbitRadius: 300, orbitSpeed: 0.26 },
  { word: 'Education\nSystem Decay', color: '#795548', responses: 12, orbitRadius: 280, orbitSpeed: 0.28 },
  { word: 'Lack of\nFree Speech', color: '#607D8B', responses: 13, orbitRadius: 290, orbitSpeed: 0.27 },
  { word: 'Economic\nInstability', color: '#424242', responses: 15, orbitRadius: 310, orbitSpeed: 0.25 },
  { word: 'Fear of\nHaving to Leave', color: '#263238', responses: 16, orbitRadius: 330, orbitSpeed: 0.23 },
  { word: 'Lack of\nImmigrant Empathy', color: '#4E342E', responses: 11, orbitRadius: 270, orbitSpeed: 0.29 }
];

// Phase 3: Coping mechanisms (BETTER INNER ORBIT SPACING)
const copingMechanisms = [
  { word: 'Faith', color: '#FFD700', responses: 14, orbitRadius: 100, orbitSpeed: 0.6 },
  { word: 'Hope', color: '#FFA726', responses: 16, orbitRadius: 110, orbitSpeed: 0.55 },
  { word: 'Family\n& Friends', color: '#66BB6A', responses: 20, orbitRadius: 120, orbitSpeed: 0.5 },
  { word: 'Community', color: '#42A5F5', responses: 13, orbitRadius: 95, orbitSpeed: 0.65 },
  { word: 'Art', color: '#AB47BC', responses: 9, orbitRadius: 85, orbitSpeed: 0.7 },
  { word: 'Political\nEducation', color: '#EF5350', responses: 11, orbitRadius: 105, orbitSpeed: 0.6 }
];
// Update the module.exports to include the new data
module.exports = {
  emotionColors,
  reasonsForLeaving,
  emotionsDuringImmigration,
  gratitudeResponses,
  concernResponses,
  copingMechanisms
};