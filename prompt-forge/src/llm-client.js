/**
 * Multi-LLM API Client
 * Sprint 4: Real API integration with Gemini, GPT-4, and Claude
 */

// API Configuration
export const LLM_CONFIG = {
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.0-flash',
    pricing: {
      input: 0.0000001,  // $0.10 per 1M tokens
      output: 0.0000004  // $0.40 per 1M tokens
    }
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4-turbo-preview',
    pricing: {
      input: 0.00001,    // $10 per 1M tokens
      output: 0.00003    // $30 per 1M tokens
    }
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-5-sonnet-20241022',
    pricing: {
      input: 0.000003,   // $3 per 1M tokens
      output: 0.000015   // $15 per 1M tokens
    }
  }
};

/**
 * Estimate token count from text (rough approximation)
 * ~4 characters per token for English text
 */
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Calculate estimated cost for a request
 */
export function calculateCost(provider, inputTokens, outputTokens) {
  const config = LLM_CONFIG[provider];
  if (!config) return 0;
  
  return (
    (inputTokens * config.pricing.input) +
    (outputTokens * config.pricing.output)
  );
}

/**
 * Format cost as USD string
 */
export function formatCost(cost) {
  return `$${cost.toFixed(6)}`;
}

/**
 * Gemini API Client
 */
export async function callGemini(prompt, apiKey, options = {}) {
  const {
    model = LLM_CONFIG.gemini.defaultModel,
    temperature = 0.7,
    maxTokens = 2048
  } = options;

  const url = `${LLM_CONFIG.gemini.baseUrl}/models/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const inputTokens = estimateTokens(prompt);
  const outputTokens = estimateTokens(content);

  return {
    content,
    provider: 'gemini',
    model,
    usage: {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens
    },
    cost: calculateCost('gemini', inputTokens, outputTokens),
    raw: data
  };
}

/**
 * OpenAI GPT-4 API Client
 */
export async function callGPT4(prompt, apiKey, options = {}) {
  const {
    model = LLM_CONFIG.openai.defaultModel,
    temperature = 0.7,
    maxTokens = 2048
  } = options;

  const url = `${LLM_CONFIG.openai.baseUrl}/chat/completions`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  return {
    content,
    provider: 'openai',
    model,
    usage: {
      inputTokens: data.usage?.prompt_tokens || estimateTokens(prompt),
      outputTokens: data.usage?.completion_tokens || estimateTokens(content),
      totalTokens: data.usage?.total_tokens || 0
    },
    cost: calculateCost('openai', 
      data.usage?.prompt_tokens || estimateTokens(prompt),
      data.usage?.completion_tokens || estimateTokens(content)
    ),
    raw: data
  };
}

/**
 * Anthropic Claude API Client
 */
export async function callClaude(prompt, apiKey, options = {}) {
  const {
    model = LLM_CONFIG.anthropic.defaultModel,
    temperature = 0.7,
    maxTokens = 2048
  } = options;

  const url = `${LLM_CONFIG.anthropic.baseUrl}/messages`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text || '';

  return {
    content,
    provider: 'anthropic',
    model,
    usage: {
      inputTokens: data.usage?.input_tokens || estimateTokens(prompt),
      outputTokens: data.usage?.output_tokens || estimateTokens(content),
      totalTokens: (data.usage?.input_tokens || estimateTokens(prompt)) + 
                   (data.usage?.output_tokens || estimateTokens(content))
    },
    cost: calculateCost('anthropic',
      data.usage?.input_tokens || estimateTokens(prompt),
      data.usage?.output_tokens || estimateTokens(content)
    ),
    raw: data
  };
}

/**
 * Unified LLM Client - Routes to appropriate provider
 */
export async function callLLM(provider, prompt, apiKey, options = {}) {
  switch (provider) {
    case 'gemini':
      return callGemini(prompt, apiKey, options);
    case 'openai':
    case 'gpt4':
      return callGPT4(prompt, apiKey, options);
    case 'anthropic':
    case 'claude':
      return callClaude(prompt, apiKey, options);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Streaming response handler
 */
export async function* streamLLM(provider, prompt, apiKey, options = {}) {
  // Note: Full streaming implementation would require more complex setup
  // This is a simplified version that yields chunks as they arrive
  
  const response = await callLLM(provider, prompt, apiKey, options);
  
  // Simulate streaming by yielding chunks of the response
  const chunkSize = 50;
  for (let i = 0; i < response.content.length; i += chunkSize) {
    yield response.content.slice(i, i + chunkSize);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

/**
 * Get available models for a provider
 */
export function getAvailableModels(provider) {
  const models = {
    gemini: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', speed: 'fast' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', speed: 'balanced' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', speed: 'fast' }
    ],
    openai: [
      { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', speed: 'balanced' },
      { id: 'gpt-4o', name: 'GPT-4o', speed: 'fast' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', speed: 'fastest' }
    ],
    anthropic: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', speed: 'balanced' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', speed: 'slow' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', speed: 'fast' }
    ]
  };
  
  return models[provider] || [];
}

/**
 * Compare costs across providers
 */
export function compareProviderCosts(prompt, estimatedOutputLength) {
  const inputTokens = estimateTokens(prompt);
  const outputTokens = estimateTokens(estimatedOutputLength);
  
  const comparisons = {};
  
  for (const [provider, config] of Object.entries(LLM_CONFIG)) {
    comparisons[provider] = {
      inputCost: inputTokens * config.pricing.input,
      outputCost: outputTokens * config.pricing.output,
      totalCost: calculateCost(provider, inputTokens, outputTokens),
      pricing: config.pricing
    };
  }
  
  return comparisons;
}
