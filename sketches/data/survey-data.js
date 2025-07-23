
// Survey questions for each section
    const surveyquestions = {
     reasons: {
          spanish: "¿Cuales fueron las principales realidades de tu país natal que te hicieron inmigrar?",
          english: "What were the main realities from your home country that made you immigrate?"
            },
      emotions: {
        spanish: "Cierra los ojos y piensa en las emociones que vinieron con la experiencia de aceptar que ibas emigrar",
        english: "Close your eyes and think of the emotions that came with the experience of knowing that you were going to emigrate"
            },
      help: {
        spanish: "Cierra los ojos y piensa en que te ayudo a sobrellevar el proceso de irte de tu pais",
        english: "Close your eyes and think of what helped you go through the process of leaving your country"
            }
        };

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
  { word: 'Lack\nof\nOpportunity', color: [0.1, 0.1, 0.1], responses: 29 },
  { word: 'Corrupt Government', color: [0.1, 0.1, 0.1], responses: 15 },
  { word: 'Violence', color: [0.1, 0.1, 0.1], responses: 18 },
  { word: 'Economic Instability', color: [0.1, 0.1, 0.1], responses: 8 },
  { word: 'Police Brutality', color: [0.1, 0.1, 0.1], responses: 5 },
  { word: 'Decay of Educational System', color: [0.1, 0.1, 0.1], responses: 6 },
  { word: 'Lack of Freedom of Speech', color: [0.1, 0.1, 0.1], responses: 6 },
  { word: 'Disinformation', color: [0.1, 0.1, 0.1], responses: 5 },
  { word: 'Decay of Healthcare System', color: [0.1, 0.1, 0.1], responses: 3 },
  { word: 'Falta de Oportunidades', color: [0.1, 0.1, 0.1], responses: 29 },
  { word: 'Corrupcion', color: [0.1, 0.1, 0.1], responses: 15 },
  { word: 'Violencia', color: [0.1, 0.1, 0.1], responses: 18 },
  { word: 'Desigualdad Economica', color: [0.1, 0.1, 0.1], responses: 8 },
  { word: 'Brutalidad Policial', color: [0.1, 0.1, 0.1], responses: 5 },
  { word: 'Decadencia de la Educacion', color: [0.1, 0.1, 0.1], responses: 6 },
  { word: 'Falta de Libertad de Expresion', color: [0.1, 0.1, 0.1], responses: 6 },
  { word: 'Desinformacion', color: [0.1, 0.1, 0.1], responses: 5 },
  { word: 'Decadencia del Sistema de Salud', color: [0.1, 0.1, 0.1], responses: 3 }
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
  { word: 'Guilt', color: emotionColors['Guilt'], responses: 3 },
  { word: 'Esperanza', color: emotionColors['Hope'], responses: 15 },
  { word: 'Miedo', color: emotionColors['Fear'], responses: 12 },
  { word: 'Ansiedad', color: emotionColors['Anxiety'], responses: 8 },
  { word: 'Alivio', color: emotionColors['Relief'], responses: 6 },
  { word: 'Emoción', color: emotionColors['Excitement'], responses: 5 },
  { word: 'Tristeza', color: emotionColors['Sadness'], responses: 5 },
  { word: 'Rabia', color: emotionColors['Anger'], responses: 4 },
  { word: 'Culpa', color: emotionColors['Guilt'], responses: 3 }
];

 // What helped go through the process of leaving (from actual survey)
  const helpFactors = [
    { word: 'Family', color: '#4CAF50', responses: 23 },
    { word: 'Wanting New\nOpportunities', color: '#FF9800', responses: 19 },
    { word: 'Faith', color: '#9C27B0', responses: 10 },
    { word: 'Dreams', color: '#2196F3', responses: 10 },
    { word: 'Friends', color: '#FFC107', responses: 7 },
    { word: 'Hope', color: '#00BCD4', responses: 7 },
    { word: 'Detachment', color: '#607D8B', responses: 6 },
    { word: 'Desperation\nfor Change', color: '#F44336', responses: 6 },
    { word: 'No Other\nOption', color: '#795548', responses: 4 },
    { word: 'Staying\nInformed', color: '#009688', responses: 3 },
    { word: 'Football', color: '#8BC34A', responses: 1 },
    { word: 'Familia', color: '#4CAF50', responses: 23 },
    { word: 'Desear Nuevas\nOportunidades', color: '#FF9800', responses: 19 },
    { word: 'Fe', color: '#9C27B0', responses: 10 },
    { word: 'Sueños', color: '#2196F3', responses: 10 },
    { word: 'Amigos', color: '#FFC107', responses: 7 },
    { word: 'Ilusiones', color: '#00BCD4', responses: 7 },
    { word: 'Desapego', color: '#607D8B', responses: 6 },
    { word: 'Desesperación\npor Cambio', color: '#F44336', responses: 6 },
    { word: 'Sin Otra\nOpción', color: '#795548', responses: 4 },
    { word: 'Mantenerse\nInformado', color: '#009688', responses: 3 },
    { word: 'Fútbol', color: '#8BC34A', responses: 1 }
        ];


// Phase 3: Current climate (for later)
const currentClimateEmotions = [
  { word: 'Concerned', color: [0.9, 0.4, 0.2], responses: 18 },
  { word: 'Hopeful', color: [0.5, 0.8, 0.3], responses: 12 },
  { word: 'Frustrated', color: [0.8, 0.2, 0.4], responses: 10 }
];

module.exports = {
  surveyquestions,
  emotionColors,
  reasonsForLeaving,
  emotionsDuringImmigration,
  helpFactors,
  currentClimateEmotions
};