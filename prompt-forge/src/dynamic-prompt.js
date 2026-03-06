/**
 * Dynamic Variable Injection & Intent Recognition
 * Sprint 2: Automatic context-sensitive prompt enhancement
 */

// Intent-Kategorien mit Erkennungsmustern
export const INTENT_PATTERNS = {
  coding: {
    id: 'coding',
    label: 'Coding & Development',
    patterns: [
      /\b(code|function|class|api|endpoint|database|algorithm|component|module|service)\b/i,
      /\b(react|vue|angular|node|python|javascript|typescript|java|go|rust)\b/i,
      /\b(implement|develop|build|create|refactor|debug|optimize|test|deploy)\b/i,
      /\b(controller|model|view|route|query|mutation|repository|factory)\b/i
    ],
    weight: 1.0
  },
  writing: {
    id: 'writing',
    label: 'Content & Writing',
    patterns: [
      /\b(write|article|blog|email|letter|story|poem|script|copy|content)\b/i,
      /\b(edit|proofread|rewrite|summarize|translate|paraphrase)\b/i,
      /\b(tone|style|voice|audience|reader|engagement)\b/i
    ],
    weight: 1.0
  },
  analysis: {
    id: 'analysis',
    label: 'Analysis & Research',
    patterns: [
      /\b(analyze|compare|evaluate|assess|review|examine|investigate)\b/i,
      /\b(data|research|study|report|findings|insights|trends|metrics)\b/i,
      /\b(swot|pestle|porter|framework|methodology|hypothesis)\b/i
    ],
    weight: 1.0
  },
  creative: {
    id: 'creative',
    label: 'Creative & Brainstorming',
    patterns: [
      /\b(idea|brainstorm|creative|imagine|invent|design|concept)\b/i,
      /\b(story|poem|art|music|visual|character|plot|narrative)\b/i,
      /\b(innovative|unique|original|fresh|novel|experimental)\b/i
    ],
    weight: 1.0
  },
  business: {
    id: 'business',
    label: 'Business & Strategy',
    patterns: [
      /\b(strategy|plan|roadmap|timeline|budget|forecast|projection)\b/i,
      /\b(marketing|sales|revenue|growth|kpi|okr|metrics|analytics)\b/i,
      /\b(pitch|proposal|presentation|stakeholder|client|customer)\b/i
    ],
    weight: 1.0
  },
  learning: {
    id: 'learning',
    label: 'Learning & Education',
    patterns: [
      /\b(explain|teach|learn|understand|study|course|tutorial|guide)\b/i,
      /\b(beginner|intermediate|advanced|expert|fundamentals|concepts)\b/i,
      /\b(exercise|practice|quiz|exam|assignment|curriculum)\b/i
    ],
    weight: 1.0
  }
};

/**
 * Erkennt die Intent-Kategorie eines Inputs
 * @param {string} input - Der User-Input
 * @returns {{ intent: string, confidence: number, allScores: Object }}
 */
export function detectIntent(input) {
  const text = input.trim();
  const scores = {};
  
  // Jede Kategorie durchgehen und Score berechnen
  for (const [category, config] of Object.entries(INTENT_PATTERNS)) {
    let matchCount = 0;
    let totalPatterns = config.patterns.length;
    
    for (const pattern of config.patterns) {
      if (pattern.test(text)) {
        matchCount++;
      }
    }
    
    // Score = Anteil der gematchten Patterns * Gewicht
    scores[category] = (matchCount / totalPatterns) * config.weight;
  }
  
  // Beste Kategorie finden
  let bestIntent = 'general';
  let bestScore = 0;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = category;
    }
  }
  
  // Confidence normalisieren (0-1)
  const confidence = Math.min(1, bestScore * 2);
  
  return {
    intent: bestIntent,
    confidence,
    allScores: scores
  };
}

/**
 * Dynamische Variablen für Templates
 */
export const VARIABLE_TEMPLATES = {
  coding: {
    role: "You are an expert software engineer with deep knowledge of best practices, design patterns, and clean code principles.",
    constraints: [
      "Write production-ready code with proper error handling",
      "Include comments for complex logic",
      "Follow language-specific conventions and style guides",
      "Consider edge cases and input validation"
    ],
    outputFormat: "Code block with explanation",
    examples: []
  },
  writing: {
    role: "You are a professional content writer with expertise in engaging, clear, and audience-appropriate communication.",
    constraints: [
      "Match the requested tone and style",
      "Ensure proper grammar and spelling",
      "Structure content for readability",
      "Avoid jargon unless specifically requested"
    ],
    outputFormat: "Well-formatted text with headings if appropriate",
    examples: []
  },
  analysis: {
    role: "You are an analytical expert skilled at breaking down complex topics, identifying patterns, and providing evidence-based insights.",
    constraints: [
      "Support claims with reasoning or data",
      "Acknowledge uncertainties or limitations",
      "Present multiple perspectives when relevant",
      "Structure findings logically"
    ],
    outputFormat: "Structured analysis with clear sections",
    examples: []
  },
  creative: {
    role: "You are a creative thinker with expertise in generating original, innovative ideas and compelling narratives.",
    constraints: [
      "Think outside conventional boundaries",
      "Provide multiple options or variations",
      "Build on the provided context creatively",
      "Maintain internal consistency"
    ],
    outputFormat: "Creative output with explanatory notes",
    examples: []
  },
  business: {
    role: "You are a strategic business advisor with expertise in planning, execution, and measurable outcomes.",
    constraints: [
      "Focus on actionable recommendations",
      "Consider ROI and resource constraints",
      "Include timelines and milestones where relevant",
      "Align with business objectives"
    ],
    outputFormat: "Executive summary with detailed sections",
    examples: []
  },
  learning: {
    role: "You are an expert educator skilled at explaining complex concepts in accessible, age-appropriate ways.",
    constraints: [
      "Use analogies and examples for clarity",
      "Build from fundamentals to advanced concepts",
      "Check for understanding with questions or exercises",
      "Adapt complexity to the learner's level"
    ],
    outputFormat: "Educational content with examples and exercises",
    examples: []
  }
};

/**
 * Generiert ein vollständiges Prompt-Template mit dynamischen Variablen
 * @param {string} input - Der User-Input
 * @param {string} mode - Der Modus (spec, lite, strict)
 * @param {string} detectedIntent - Optional: Vor-erkannte Intent
 * @returns {{ prompt: string, metadata: Object }}
 */
export function generateDynamicPrompt(input, mode = 'spec', detectedIntent = null) {
  const intentResult = detectedIntent || detectIntent(input);
  const intent = intentResult.intent;
  const template = VARIABLE_TEMPLATES[intent] || VARIABLE_TEMPLATES.coding;
  
  const timestamp = new Date().toISOString();
  const cleanInput = input.trim();
  
  // Lite-Modus: Minimalistisch
  if (mode === 'lite') {
    return {
      prompt: `### SYSTEM: ${intent.toUpperCase()}\n### ROLE: ${template.role}\n### TASK: ${cleanInput}\n### FORMAT: ${template.outputFormat}`,
      metadata: {
        intent,
        confidence: intentResult.confidence,
        mode: 'lite',
        timestamp
      }
    };
  }
  
  // Strict-Modus: Mit Sicherheits-Constraints
  if (mode === 'strict') {
    return {
      prompt: `<!-- SYSTEM: SECURE_ENCLAVE_v1 | Intent: ${intent.toUpperCase()} -->
<meta>
  <timestamp>${timestamp}</timestamp>
  <intent>${intent}</intent>
  <confidence>${(intentResult.confidence * 100).toFixed(0)}%</confidence>
  <security_level>HIGH</security_level>
</meta>

<instruction_set>
  <role>${template.role}</role>
  <constraints>
    ${template.constraints.map(c => `- ${c}`).join('\n    ')}
    - No hallucination permitted.
    - If answer is unknown, state "UNKNOWN".
  </constraints>
  <task>
    ${cleanInput}
  </task>
</instruction_set>

<output_format>${template.outputFormat}</output_format>`,
      metadata: {
        intent,
        confidence: intentResult.confidence,
        mode: 'strict',
        timestamp
      }
    };
  }
  
  // Default: Specification-Modus (vollständig)
  return {
    prompt: `### SYSTEM CONTEXT
You are Prompt Forge Unit 7, an expert system designed for high-precision outputs.

**Detected Intent:** ${intent.toUpperCase()} (${(intentResult.confidence * 100).toFixed(0)}% confidence)

### ROLE DEFINITION
${template.role}

### ARCHITECTURAL GUIDELINES
1. Break down the user request into logical components.
2. Apply chain-of-thought reasoning before generating the final answer.
3. Maintain a professional, technical tone.

### CONSTRAINTS
${template.constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

### USER INPUT
"${cleanInput}"

### RESPONSE PROTOCOL
- Step 1: Analyze Intent
- Step 2: Formulate Solution
- Step 3: Verify Constraints

### OUTPUT FORMAT
${template.outputFormat}

### OUTPUT
[Awaiting Generation...]`,
    metadata: {
      intent,
      confidence: intentResult.confidence,
      allScores: intentResult.allScores,
      mode: 'spec',
      timestamp,
      appliedConstraints: template.constraints.length
    }
  };
}

/**
 * Extrahiert Variablen-Platzhalter aus Text
 * @param {string} text - Text mit {{VARIABLE}} Platzhaltern
 * @returns {string[]} Array der gefundenen Variablen
 */
export function extractVariables(text) {
  const matches = text.match(/\{\{([A-Z_]+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
}

/**
 * Füllt Variablen-Platzhalter mit Werten
 * @param {string} template - Template mit {{VARIABLE}} Platzhaltern
 * @param {Object} values - Key-Value-Paare der Variablen
 * @returns {string} Gefülltes Template
 */
export function fillVariables(template, values) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

/**
 * LLM-Profile für modell-spezifische Optimierung
 */
export const LLM_PROFILES = {
  gemini: {
    name: 'Google Gemini',
    strengths: ['Reasoning', 'Multimodal', 'Long context'],
    optimalFor: ['Complex tasks', 'Image analysis', 'Code understanding'],
    promptStyle: 'direct',
    prefersStructuredInput: true
  },
  gpt4: {
    name: 'OpenAI GPT-4',
    strengths: ['Creative writing', 'Code generation', 'General knowledge'],
    optimalFor: ['Content creation', 'Programming', 'Brainstorming'],
    promptStyle: 'conversational',
    prefersStructuredInput: false
  },
  claude: {
    name: 'Anthropic Claude',
    strengths: ['Long context', 'Nuanced responses', 'Safety'],
    optimalFor: ['Document analysis', 'Research', 'Sensitive topics'],
    promptStyle: 'structured',
    prefersStructuredInput: true,
    prefersXmlTags: true
  }
};

/**
 * Passt Prompt für spezifisches LLM-Modell an
 * @param {string} prompt - Der generierte Prompt
 * @param {string} model - Modell-ID (gemini, gpt4, claude)
 * @returns {string} Modell-optimierter Prompt
 */
export function adaptPromptForModel(prompt, model = 'gemini') {
  const profile = LLM_PROFILES[model];
  if (!profile) return prompt;
  
  let adapted = prompt;
  
  // Claude bevorzugt XML-Tags
  if (profile.prefersXmlTags) {
    adapted = adapted
      .replace(/### SYSTEM CONTEXT/g, '<system_context>')
      .replace(/### ROLE DEFINITION/g, '</system_context>\n<role_definition>')
      .replace(/### ARCHITECTURAL GUIDELINES/g, '</role_definition>\n<architectural_guidelines>')
      .replace(/### CONSTRAINTS/g, '</architectural_guidelines>\n<constraints>')
      .replace(/### USER INPUT/g, '</constraints>\n<user_input>')
      .replace(/### RESPONSE PROTOCOL/g, '</user_input>\n<response_protocol>')
      .replace(/### OUTPUT FORMAT/g, '</response_protocol>\n<output_format>')
      .replace(/### OUTPUT/g, '</output_format>\n<output>')
      .replace(/\[Awaiting Generation...\]/g, '[Awaiting Generation...]</output>');
  }
  
  // GPT-4 bevorzugt konversationellen Stil
  if (profile.promptStyle === 'conversational') {
    adapted = `Here's a task for you:\n\n${adapted}`;
  }
  
  return adapted;
}
