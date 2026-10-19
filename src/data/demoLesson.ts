import { LessonPlan } from '../types/lesson';

export const demoLesson: LessonPlan = {
  id: 'lesson-eco-701',
  title: 'Interdependence in Ecosystems',
  subject: 'Science',
  gradeLevel: 'Grade 7',
  unit: 'Ecosystems',
  duration: '60 minutes',
  classSize: '24 students',
  learningStandard: 'Explain how organisms within an ecosystem interact and depend on each other.',
  learningGoal: 'Students will explain how organisms within an ecosystem interact and depend on each other, using evidence.',
  studentFriendlyGoal: 'I can explain how living things depend on one another in an ecosystem and provide evidence for my claim.',
  successCriteria: [
    'I can identify relationships between organisms (producer, consumer, predator, prey, decomposer).',
    'I can explain how changes to one population affect the rest of an ecosystem.',
    'I can use evidence to support my explanation and scientific reasoning.'
  ],
  priorKnowledge: 'Basic understanding of food chains and habitats.',
  assessmentMethods: 'Formative observation and summative multi-modal explanation.',
  barriers: [
    { id: 'b1', category: 'Linguistic', label: 'Language & Vocabulary', active: true },
    { id: 'b2', category: 'Cognitive', label: 'Reading Complexity', active: true },
    { id: 'b3', category: 'Affective', label: 'Attention & Engagement', active: true },
    { id: 'b4', category: 'Cognitive', label: 'Background Knowledge', active: true },
    { id: 'b5', category: 'Self-Regulation', label: 'Executive Function', active: true },
    { id: 'b6', category: 'Physical', label: 'Motor or Access Needs', active: true },
    { id: 'b7', category: 'Cultural', label: 'Cultural Relevance', active: true },
  ],
  engagementOptions: [
    {
      id: 'eng-1',
      title: 'Real-world Eco-Disaster Scenarios',
      principle: 'engagement',
      purpose: 'Connects scientific concepts to authentic, urgent real-world crises students care about.',
      barrierAddressed: 'Disconnection between abstract food webs and authentic relevance.',
      learnerPathway: 'Students choose between 3 real-world scenarios: Yellowstone Wolf Reintroduction, Coral Bleaching, or Local Urban Forest clearing.',
      teacherImplementation: 'Present 2-minute introductory hook video clips, then let students work individually or in small teams.',
      materials: ['Scenario briefing cards', '360-degree ecosystem simulation link'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Directly reinforces causal reasoning using authentic phenomena without altering cognitive rigor.'
      }
    },
    {
      id: 'eng-2',
      title: 'Student Choice of Ecosystem & Organism',
      principle: 'engagement',
      purpose: 'Empowers learner agency by allowing personal cultural or geographical connection.',
      barrierAddressed: 'Low interest caused by culturally distant or repetitive textbook examples.',
      learnerPathway: 'Learners select any biome (tundra, savannah, temperate forest, backyard pond) to investigate.',
      teacherImplementation: 'Provide a biome selection matrix with equivalent trophic level complexity.',
      materials: ['Biome choice board', 'Curated digital resource links'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 3,
        total: 19,
        status: 'READY',
        feedback: 'Ensures equal challenge across biomes while fostering genuine personal investment.'
      }
    },
    {
      id: 'eng-3',
      title: 'Culturally Relevant Local Ecology Stories',
      principle: 'engagement',
      purpose: 'Grounds ecological principles in Indigenous ecological knowledge and local community parks.',
      barrierAddressed: 'Eurocentric or disconnected framing of environmental science.',
      learnerPathway: 'Students explore how indigenous community custodians observe salmon runs or prairie grasses.',
      teacherImplementation: 'Share traditional ecological knowledge narrative alongside modern biology data.',
      materials: ['Audio story recording', 'Community ecology profile'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 3,
        total: 19,
        status: 'READY',
        feedback: 'High cultural affirmation while preserving standard scientific evidence requirements.'
      }
    },
    {
      id: 'eng-4',
      title: 'Interactive Food Web Trophic Jenga / Simulator',
      principle: 'engagement',
      purpose: 'Tactile and kinesthetic gamification of trophic collapse.',
      barrierAddressed: 'Passive sitting fatigue and abstract mental modeling hurdles.',
      learnerPathway: 'Pulling labeled blocks representing apex predators or producers to see when the tower destabilizes.',
      teacherImplementation: 'Set up station with colored labeled wooden blocks and reflection sheets.',
      materials: ['Trophic Jenga sets', 'Rules & tracking card'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 3,
        authenticEvidence: 4,
        realisticReady: 3,
        total: 18,
        status: 'READY',
        feedback: 'Very engaging; ensure motor-impaired students have digital simulator equivalent.'
      }
    },
    {
      id: 'eng-5',
      title: 'Collaborative Mystery Inquiry Roles',
      principle: 'engagement',
      purpose: 'Supports peer collaboration with structured interdependent roles.',
      barrierAddressed: 'Social isolation and intimidation when tackling complex multi-variable problems alone.',
      learnerPathway: 'Students take roles: Ecologist, Data Specialist, Wildlife Tracker, Policy Advisor.',
      teacherImplementation: 'Assign role cards with clear contribution prompts for each team member.',
      materials: ['Role lanyard cards', 'Shared mystery evidence dossier'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 3,
        total: 19,
        status: 'READY',
        feedback: 'Fosters belonging and teamwork while retaining individual accountability.'
      }
    },
    {
      id: 'eng-6',
      title: 'Self-Monitored Mastery Checkpoints',
      principle: 'engagement',
      purpose: 'Promotes metacognitive self-regulation and reduces anxiety.',
      barrierAddressed: 'Learner uncertainty about whether they are making expected progress.',
      learnerPathway: 'Self-assessing along a 3-stage progress barometer with optional hint cards.',
      teacherImplementation: 'Post progress tracker on board and provide private self-check stamps.',
      materials: ['Mastery rubric bookmark', 'Reflection journal sheet'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Builds learner agency and autonomy without lowering standards.'
      }
    }
  ],
  representationOptions: [
    {
      id: 'rep-1',
      title: 'Multi-Modal Formats (Text, Video, Audio)',
      principle: 'representation',
      purpose: 'Ensures sensory accessibility across visual, auditory, and written mediums.',
      barrierAddressed: 'Single-channel information overload and text-heavy cognitive fatigue.',
      learnerPathway: 'Choose between 3-minute captioned video animation, annotated text with read-aloud, or narrated infographic.',
      teacherImplementation: 'Provide QR codes and tablet links to the multi-format digital hub.',
      materials: ['Digital infographic', 'Captioned video', 'Audio recording'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Exemplary UDL representation: preserves identical scientific concepts across three perceptual channels.'
      }
    },
    {
      id: 'rep-2',
      title: 'Visual Food Web Diagrams with Interactive Energy Arrows',
      principle: 'representation',
      purpose: 'Clarifies relational directionality of energy flow.',
      barrierAddressed: 'Frequent student confusion between "who eats whom" vs "where the energy flows".',
      learnerPathway: 'Manipulate interactive arrows on magnetic boards or tablets to trace caloric energy transfer.',
      teacherImplementation: 'Model one trophic transfer explicitly, then prompt students to verify arrow directions.',
      materials: ['Magnetic arrow board', 'Color-coded organism cutouts'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Directly illuminates the core conceptual mechanism of ecosystem interdependence.'
      }
    },
    {
      id: 'rep-3',
      title: 'Dual-Language & Illustrated Tier-3 Vocabulary Flashcards',
      principle: 'representation',
      purpose: 'Unlocks academic science vocabulary without giving away relational conclusions.',
      barrierAddressed: 'Academic language barrier for English Language Learners and students with dyslexia.',
      learnerPathway: 'Refer to illustrated cards for: producer, consumer, apex predator, trophic cascade, biomass.',
      teacherImplementation: 'Keep cards accessible at every table and linked on digital classroom slide deck.',
      materials: ['Bilingual vocabulary ring', 'Icon-supported definition cards'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Scaffolds vocabulary decoding without answering the reasoning questions.'
      }
    },
    {
      id: 'rep-4',
      title: 'Tactile & 3D Tactile Organism Models',
      principle: 'representation',
      purpose: 'Enables tactile learners and visually impaired students to perceive trophic levels physically.',
      barrierAddressed: 'Visual-only 2D diagram limitations.',
      learnerPathway: 'Arranging physical textured figurines in a tiered trophic pyramid.',
      teacherImplementation: 'Maintain one tactile station in the science lab.',
      materials: ['Textured tactile tiles', 'Braille-labeled organism figurines'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 3,
        total: 19,
        status: 'READY',
        feedback: 'Strong perceptual accessibility that reinforces spatial trophic hierarchies.'
      }
    },
    {
      id: 'rep-5',
      title: 'Explicit Analogy: Economic Supply-Chain vs Food Web',
      principle: 'representation',
      purpose: 'Connects abstract ecological networks to familiar everyday human supply chains.',
      barrierAddressed: 'Lack of prior ecological schema to anchor new complex concepts.',
      learnerPathway: 'Comparing a missing factory chip stopping car production to a missing pollinator stopping fruit yield.',
      teacherImplementation: 'Brief 3-minute teacher think-aloud comparing the two interconnected webs.',
      materials: ['Supply chain comparison graphic organizer'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Activates prior schema effectively while maintaining scientific focus.'
      }
    },
    {
      id: 'rep-6',
      title: 'Computer Vision Real-World Object Detection & Visual Analysis',
      principle: 'representation',
      purpose: 'Transforms classroom photos, specimens, or outdoor nature into recognized labeled data.',
      barrierAddressed: 'Disconnect between textbook textbook drawings and real nature.',
      learnerPathway: 'Upload a picture of a pond, terrarium, or garden; AI labels organisms and trophic roles.',
      teacherImplementation: 'Use app vision tool to demonstrate live recognition on classroom screen.',
      materials: ['Smartphone/tablet camera', 'Universal Design Lesson Planner AI Vision Tool'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Modern visual AI integration provides instant contextualized representations.'
      }
    }
  ],
  actionExpressionOptions: [
    {
      id: 'act-1',
      title: 'Multi-Modal Expression: Video, Podcast, Poster, or Essay',
      principle: 'action_expression',
      purpose: 'Allows students to communicate their causal reasoning through their strongest medium.',
      barrierAddressed: 'Written-expression motor or linguistic bottlenecks that mask actual conceptual mastery.',
      learnerPathway: 'Learner chooses: 2-minute recorded verbal walkthrough, annotated digital poster, or written CER paragraph.',
      teacherImplementation: 'Evaluate all formats with the exact same format-neutral rubric.',
      materials: ['Format-neutral CER rubric', 'Voice recording app', 'Poster template'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 3,
        total: 19,
        status: 'READY',
        feedback: 'Exemplary UDL: Decouples the method of demonstration from the construct being assessed.'
      }
    },
    {
      id: 'act-2',
      title: 'Scaffolded Claim-Evidence-Reasoning (CER) Guide',
      principle: 'action_expression',
      purpose: 'Provides executive functioning and linguistic scaffolds for structuring scientific arguments.',
      barrierAddressed: 'Executive dysfunction in organizing thoughts into logical scientific order.',
      learnerPathway: 'Fill in guided sentence starters ("When the population of X changed, Y was affected because...").',
      teacherImplementation: 'Offer tiered versions (Version A: fully open, Version B: sentence starters).',
      materials: ['Tiered CER graphic organizer sheets'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Assists with communication structure while student still generates the core reasoning.'
      }
    },
    {
      id: 'act-3',
      title: 'Interactive Digital Simulation Walkthrough (PhET / NetLogo)',
      principle: 'action_expression',
      purpose: 'Enables dynamic hypothesis testing and screen-recording of findings.',
      barrierAddressed: 'Difficulty expressing dynamic time-based phenomena in static writing.',
      learnerPathway: 'Manipulate wolf and rabbit populations in simulator, narrating what happens to vegetation over time.',
      teacherImplementation: 'Share link to simulator with prompt sheet for independent or pair logging.',
      materials: ['Chromebook / Tablet', 'Ecosystem simulator web tool'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 3,
        total: 19,
        status: 'READY',
        feedback: 'Authentic evidence of cause-and-effect reasoning with visual data.'
      }
    },
    {
      id: 'act-4',
      title: 'Speech-to-Text & Assistive Dictation Station',
      principle: 'action_expression',
      purpose: 'Eliminates dysgraphia and typing speed barriers.',
      barrierAddressed: 'Physical fatigue or slow handwriting hiding rich oral explanations.',
      learnerPathway: 'Use Google Voice Typing / Web Speech API to dictate scientific explanations.',
      teacherImplementation: 'Provide quiet recording corner with headphones and microphone.',
      materials: ['USB headset with mic', 'Dictation software'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Pure accessibility accommodation that preserves the full rigor of the learning target.'
      }
    },
    {
      id: 'act-5',
      title: 'Student-Curated Ecosystem Diagram with Explanatory Callouts',
      principle: 'action_expression',
      purpose: 'Appeals to visual and spatial thinkers who prefer diagrammatic communication.',
      barrierAddressed: 'Paragraph-dense assessment formatting limitations.',
      learnerPathway: 'Draw or assemble a visual food web with 4 annotated callout boxes citing evidence of interdependence.',
      teacherImplementation: 'Supply icon stamps, digital templates, and color-coded pens.',
      materials: ['Butcher paper or digital drawing canvas', 'Organism stickers'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Combines visual modeling with mandatory written or recorded causal explanation.'
      }
    },
    {
      id: 'act-6',
      title: 'Peer Socratic Defense & Interview Protocol',
      principle: 'action_expression',
      purpose: 'Enables verbal social defense of scientific claims.',
      barrierAddressed: 'Students who excel at conversational scientific explanation but freeze on formal testing.',
      learnerPathway: 'Conduct a 3-minute structured interview where a peer asks 3 prepared causal questions.',
      teacherImplementation: 'Provide the peer question protocol and audio record the session for grading.',
      materials: ['Interview protocol guide cards', 'Audio recorder'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 3,
        total: 19,
        status: 'READY',
        feedback: 'Builds authentic scientific discourse skills while gathering rigorous evidence.'
      }
    }
  ],
  instructionalSequence: [
    {
      step: '1. Launch & Hook',
      title: 'The Disappearing Sea Otters Mystery',
      duration: '8 mins',
      description: 'Show 90-second clip of kelp forests and sea urchin barren. Pose challenge: Why did the kelp disappear when killer whales changed their diet?'
    },
    {
      step: '2. Activate Prior Knowledge',
      title: 'Food Web Quick Sort & Vocab Review',
      duration: '7 mins',
      description: 'Quick interactive sorting of producers, primary consumers, and apex predators using multi-modal cards.'
    },
    {
      step: '3. Mini Lesson',
      title: 'Direct Interactive Modeling of Energy Flow',
      duration: '12 mins',
      description: 'Teacher models tracing energy arrows and simulates removing one trophic node. Explicitly teach causal relationship language.'
    },
    {
      step: '4. Choice Pathway Investigation',
      title: 'UDL Multi-Pathway Ecosystem Exploration',
      duration: '18 mins',
      description: 'Students choose their investigation pathway (Yellowstone wolves, Coral Reefs, or Local Wetlands) and format of materials.'
    },
    {
      step: '5. Synthesis & Demonstration',
      title: 'Format-Neutral Argument Creation',
      duration: '10 mins',
      description: 'Students create their causal explanation via chosen mode: CER paragraph, narrated diagram, or recorded audio.'
    },
    {
      step: '6. Reflection & Exit Ticket',
      title: 'CLEAR Self-Check & Metacognitive Close',
      duration: '5 mins',
      description: 'Students rate their confidence and reflect: "Which pathway helped you understand the chain reaction best?"'
    }
  ],
  accessibilityNotes: [
    'All video materials have verified closed captions and transcripts.',
    'Color schemes in diagrams are red-green color-blind safe.',
    'Screen reader alt-text included on all visual food web diagrams.',
    'Format-neutral rubric measures scientific reasoning, not spelling or voice timbre.'
  ],
  teacherReflection: [
    'Did student choices lead to equivalent evidence of scientific reasoning?',
    'Were the Tier-3 vocabulary cards sufficient to remove language barriers without lowering standard?',
    'How effectively did the computer vision tool anchor students to real-world biodiversity?'
  ],
  clearScoreAverage: 19.3,
  status: 'ready',
  updatedAt: new Date().toISOString()
};
