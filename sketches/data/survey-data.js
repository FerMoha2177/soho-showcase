
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


// Phase 2: New Home - Survey data from Isabella's implementation
const phase2Data = {
  questions: [
    {
      name: 'Internal Battles',
      fullQuestion: 'What major internal battles did you face when you arrived to the United States?',
      data: {
        'Ansiedad /// Anxiety': 22,
        'Soledad /// Loneliness': 17,
        'Desgaste Mental /// Burnout': 15,
        'Miedo /// Fear': 13,
        'Tristeza /// Sadness': 11,
        'Insensibilidad /// Numbness': 5,
        'Confusión /// Confusion': 5,
        'Culpa /// Guilt': 4,
        'Decepción /// Disappointment': 2,
        'Negación /// Denial': 2
      }
    },
    {
      name: 'What Helped Overcome',
      fullQuestion: 'What helped you overcome the internal battles you experienced?',
      data: {
        'Familia o Amigos /// Family or Friends': 27,
        'Nuevas Opportunidades /// New Opportunities': 18,
        'El sentir seguridad /// To Feel Safety': 14,
        'Sueños /// Dreams': 12,
        'Fe /// Faith': 8,
        'Ilusiones /// Hopes': 7,
        'Arte /// Art': 7,
        'La música /// Music': 7,
        'Nuevos Amigos /// New Friends': 6,
        'La Comunidad /// Community': 4,
        'Compartir con otros inmigrantes /// Share with other immigrants': 2,
        'Disfrutar de la libertad de expresión /// Enjoy freedom of speech': 1
      }
    },
    {
      name: 'Reasons to Choose US',
      fullQuestion: 'What were the main reasons that inspired you to choose the United States as your "new home"?',
      data: {
        'Las oportunidades de Trabajo /// The Opportunities to work': 20,
        'La seguridad y establidad del pais /// The safety and stability of the country': 19,
        'Acceso a educación de calidad /// Access to world-class education': 11,
        '"El Sueño Americano" /// "The American Dream"': 10,
        'Su sistema democratico /// Its democratic system': 7,
        'Acceso a un proceso sencillo para conseguir residencia legal /// Access to a straight forward process to achieve permanent residency': 5,
        'La diversidad y gran población de inmigrantes /// The diversity and strong immigrant population': 4,
        'Confianza en su sistema judicial /// Trust in its justice system': 3,
        'Familia /// Family': 4
      }
    }
  ],
  // Color distribution based on Phase 2 survey responses (Blue most common)
  colorDistribution: [
    '#0067A3', // Blue (9 responses)
    '#00A651', // Green (8 responses) 
    '#FF6900', // Orange (5 responses)
    '#E84A8A', // Pink (4 responses)
    '#663399', // Purple (3 responses)
    '#FFCC00', // Yellow (2 responses)
    '#F7F7F7', // White (1 response)
    '#2B2B2B'  // Black (1 response)
  ]
};

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


//phase 4: identity reflections
// Phase 4: Identity reflections from final survey question (28 real responses)
const identityReflections = [
  "Ser inmigrante, especialmente en estos momentos de incertidumbre, me ha hecho sentir aún más orgullo de ser latina. Sí, estoy preocupada, pero también me he dado cuenta de que frente al racismo, la indiferencia y la xenofobia, nosotros los latinos seguimos siendo especiales: cálidos, acogedores, alegres y, sobre todo, fuertes. Esta experiencia también ha despertado en mí una empatía y entendimiento aún más profundo por otros grupos étnicos y comunidades que han vivido bajo opresión por sus cultural. Siempre sentí empatía, pero nunca había comprendido su experiencia con tanta cercanía como ahora.",
  "Ha sido un reto pero que me ha hecho crecer en todo nivel personal",
  "Emigrar fue una decisión propia, pero hacerlo sola marco un antes y un despues en mi vida. Lejos de familia y amigos, tuve que aprender a ser mi propia red e apoyo, a reinventarme en un pais donde los sueños a veces se rompen. Esa experiencia me enseño resiliencia, me hizo valorar mi capacidad de empezar de nuevo y me mostró que soy mas fuerte de lo que creí.",
  "Me ha dado muchas cosss, tanto negativas como positivas. Pero me ha hecho ser más empatica",
  "Me ha hecho reflexionar de que verdaderamente es un hogar",
  "Fue ub proceso complicado que me ayudo a entenderme mejor y a conectar con mis raices",
  "Me ha hecho valorar el presente, disfrutar de las personas que están cerca de mí y que se preocupan por mí y me ha hecho estar más cerca de mis papás y mi hermano aún estando lejos.",
  "i feel very blessed as an immigrant who was born in the US, but it's hard to see all the hate and division happening in this country where I moved to looking for opportunities (I was born here and moved when I was 2 to Peru where I was grew up and moved back to the US at 25)",
  "Ser inmigrante me ha enseñado a encontrarme a mí mismo, para superar las dificultades",
  "It has helped me develop resilience, to never loose hope even when every door is closed. Being an immigrant has given me a deeper understanding and respect for other cultures and their struggles in attaining the American Dream.",
  "It has brought me closer to what I consider my essence and made me more appreciative of the culture that surrounded me growing up",
  "Es un reto que nunca termina, siempre hay algo mas a lo que enfrentarse siendo inmigrante. Nunca me siento 100% segura de mi status",
  "Me siento obligada a alejarme de mis raíces por miedo a ser juzgada y el rechazo",
  "Definitivamente ha sido un antes y un después, un aprender y desaprender. Todo ha valido la pena si, pero ahora solo pensar que tendría que volver a pasar por esto debido al gobierno me da bastante ansiedad pero me sigue dando la misma ilusión que tenía cuando me venía a usa",
  "Ha sido una época confusa y de adaptación, de duelo y alegrías",
  "Being an immigrant has made me more emphatic towards the smaller voices. Even thought I'm no longer in my home country and more proud than ever to be from where I am from",
  "El ser inmigrante me enseñó sobre empatía, sensibilidad y valentía en un solo momento",
  "No seria quien fuera hoy sin las experiencias y obstaculos que sobrelleve durante mi proceso de imigracion. El nicel de adaptacion y resiliencia que aprendi a los 14 años, ha hecho que mi adultez sea mas facil.",
  "Me ha hecho concluir que \"empezar de cero\" es una rutina mas a la que hay acostumbrarse para poder llevar los retos y obstaculos inesperados de una mejor manera",
  "No a Audi facial pero a grades I cada minuto con fe y con mi familia uni da",
  "Siento que después de unos años acá en USA me he consientizado de quién soy, que quiero, cómo lograr mis objetivos. Creo que después de todo el dolor que he atravesado he conseguido una motivación que no estoy seguro que habría obtenido si no hubiera sido por todas las dificultades anteriores.",
  "El ser inmigrante se a convertido una parte fundamental de mi vida, de quien soy. No solo por la decisión que tomé al venirme, pero por la manera en la que soy percibida por mi entorno en este país. Antes de hablar, ya el \"otro\" esta listo para preguntarme de donde vengo, de donde salí. Es claro que no soy de aquí y aunque pueda ser aceptada, se que nunca voy a pertenecer y he aceptado que eso esta bien. No pertenecer en Estados Unidos también es una parte critica de la experiencia Americana, una parte agridulce de este \"melting pot.\" Algo que cada día se siente un poquito mas como aquello que se sentía mi \"hogar.\" Aquello que poco a poco, se siente cada día mas como un sueño borroso que nunca viví. Un sueño inalcanzable.",
  "El migrar me ha enseñado lo mejor y lo peor de mi pais y como adaptarse sin perderse en una nueva cultura",
  "It's definitely bittersweet. Por una parte aliviado de escapar de un comunismo dictatorial sin ninguna luz visible al final del túnel pero sin negar la cruda verdad actual de EEUU en donde el ser inmigrante se siente como un crimen de por sí.",
  "Siento que ser immigrante en los estados unidos me ha enseñado humildad y respeto",
  "Valoro mucho de donde vengo y en este país he crecido mucho profesionalmente",
  "Ser inmigrante me ha hecho reconocer la capacidad de adaptación que tiene el ser humano y lo hermoso que es la diversidad, que todos venimos a servir de alguna manera y a recibir para seguir expandiendo nuestra búsqueda y despertar de conciencia sobre cosas que de no haber migrado no hubiera cuestionado antes.",
  "Ser inmigrante en usa me ha ayudado a darme cuenta q gracias a dios yo no me crié en usa (y q desafortunadamente los paises mas avanzados tienden a tener siempre una cultura mas individualista y solitaria)"
];

module.exports = {
  emotionColors,
  reasonsForLeaving,
  emotionsDuringImmigration,
  gratitudeResponses,
  concernResponses,
  copingMechanisms,
  phase2Data,
  identityReflections
};