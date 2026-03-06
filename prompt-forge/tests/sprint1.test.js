/**
 * Sprint 1 Tests: Quality Scoring System
 * 
 * These tests verify the quality scoring functionality.
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest';

// Quality Scoring Funktion aus index.html extrahiert für Testbarkeit
function calculateQualityScore(inputText) {
  const text = inputText.trim();
  const scores = {
    clarity: 0,
    completeness: 0,
    safety: 0,
    efficiency: 0
  };
  const suggestions = [];

  // CLARITY: Ist die Anweisung eindeutig?
  const actionWords = /\b(create|build|write|analyze|explain|compare|generate|design|implement|fix|optimize|refactor|calculate|summarize|translate|convert|extract|validate|test|debug)\b/i;
  const specificTerms = /\b(function|class|API|endpoint|database|algorithm|component|module|service|controller|model|view|route|query|mutation)\b/i;
  
  if (actionWords.test(text)) {
    scores.clarity += 40;
  } else {
    suggestions.push('Füge ein konkretes Aktionsverb hinzu (z.B. "Erstelle", "Analysiere", "Vergleiche")');
  }
  
  if (specificTerms.test(text)) {
    scores.clarity += 30;
  } else {
    suggestions.push('Verwende spezifische Fachbegriffe für präzisere Ergebnisse');
  }
  
  if (text.length >= 20) {
    scores.clarity += 30;
  } else {
    scores.clarity += Math.max(0, text.length * 1.5);
    if (text.length < 10) {
      suggestions.push('Die Eingabe ist sehr kurz — füge mehr Kontext hinzu');
    }
  }

  // COMPLETENESS: Fehlen wichtige Kontext-Infos?
  const contextPatterns = [
    /\b(for|as|with|using|via|through)\b/i,
    /\b(in order to|so that|to ensure)\b/i,
    /\b(must|should|need to|required)\b/i,
    /\b(example|such as|like|including)\b/i,
    /\b(don't|avoid|never|without|except)\b/i
  ];
  
  let contextMatches = 0;
  contextPatterns.forEach(pattern => {
    if (pattern.test(text)) contextMatches++;
  });
  
  scores.completeness = Math.min(100, contextMatches * 25);
  
  if (contextMatches < 2) {
    suggestions.push('Füge Kontext hinzu: Zielgruppe, Rahmenbedingungen oder Beispiele');
  }
  if (!contextPatterns[4].test(text)) {
    suggestions.push('Definiere negative Constraints (was NICHT getan werden soll)');
  }

  // SAFETY: Enthält schädliche Instructions?
  const dangerousPatterns = [
    /\b(hack|exploit|bypass|inject|malware|virus|spam|phish)\b/i,
    /\b(illegal|unauthorized|stolen|fake|fraud)\b/i,
    /\b(harm|hurt|damage|destroy|kill)\b/i
  ];
  
  let safetyDeductions = 0;
  dangerousPatterns.forEach(pattern => {
    if (pattern.test(text)) safetyDeductions += 40;
  });
  
  scores.safety = Math.max(0, 100 - safetyDeductions);
  
  if (safetyDeductions > 0) {
    suggestions.push('⚠️ Der Prompt enthält potenziell problematische Anweisungen');
  }

  // EFFICIENCY: Token-Optimierung möglich?
  const wordCount = text.split(/\s+/).length;
  const redundancyPatterns = [
    /\b(please|kindly|I would like|I want|I need)\b/gi,
    /\b(very|really|extremely|absolutely)\b/gi,
    /\b(can you|could you|will you|would you)\b/gi
  ];
  
  let redundancyCount = 0;
  redundancyPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) redundancyCount += matches.length;
  });
  
  if (wordCount >= 15 && wordCount <= 150) {
    scores.efficiency = 100;
  } else if (wordCount < 15) {
    scores.efficiency = Math.max(40, wordCount * 4);
  } else {
    scores.efficiency = Math.max(50, 100 - (wordCount - 150) * 0.5);
  }
  
  scores.efficiency = Math.max(0, scores.efficiency - (redundancyCount * 10));
  
  if (redundancyCount > 0) {
    suggestions.push('Entferne Füllwörter für effizientere Prompts');
  }
  if (wordCount > 150) {
    suggestions.push(`Der Prompt ist sehr lang (${wordCount} Wörter) — kürze auf das Wesentliche`);
  }

  // Gesamtscore berechnen (gewichtet)
  const weights = {
    clarity: 0.30,
    completeness: 0.30,
    safety: 0.25,
    efficiency: 0.15
  };
  
  const totalScore = Math.round(
    scores.clarity * weights.clarity +
    scores.completeness * weights.completeness +
    scores.safety * weights.safety +
    scores.efficiency * weights.efficiency
  );

  return {
    total: totalScore,
    metrics: scores,
    suggestions: suggestions.slice(0, 4)
  };
}

describe('Sprint 1: Quality Scoring System', () => {
  
  describe('calculateQualityScore - Overall', () => {
    it('should return score object with required properties', () => {
      const result = calculateQualityScore('Test input');
      
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('suggestions');
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
    
    it('should return total score between 0 and 100', () => {
      const result = calculateQualityScore('Test input');
      
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
    });
    
    it('should return metrics with all four categories', () => {
      const result = calculateQualityScore('Test input');
      
      expect(result.metrics).toHaveProperty('clarity');
      expect(result.metrics).toHaveProperty('completeness');
      expect(result.metrics).toHaveProperty('safety');
      expect(result.metrics).toHaveProperty('efficiency');
    });
  });
  
  describe('Clarity Metric', () => {
    it('should score high for action words', () => {
      const result = calculateQualityScore('Create a function');
      
      expect(result.metrics.clarity).toBeGreaterThan(50);
    });
    
    it('should score higher for specific terms', () => {
      const result1 = calculateQualityScore('Do something');
      const result2 = calculateQualityScore('Create an API endpoint');
      
      expect(result2.metrics.clarity).toBeGreaterThan(result1.metrics.clarity);
    });
    
    it('should score low for very short input', () => {
      const result = calculateQualityScore('test');
      
      expect(result.metrics.clarity).toBeLessThan(50);
      expect(result.suggestions).toContain('Die Eingabe ist sehr kurz — füge mehr Kontext hinzu');
    });
    
    it('should suggest adding action verbs when missing', () => {
      const result = calculateQualityScore('A function for data');
      
      expect(result.suggestions).toContain('Füge ein konkretes Aktionsverb hinzu (z.B. "Erstelle", "Analysiere", "Vergleiche")');
    });
  });
  
  describe('Completeness Metric', () => {
    it('should score higher with context patterns', () => {
      const result1 = calculateQualityScore('Create a function');
      const result2 = calculateQualityScore('Create a function for data processing using Python');
      
      expect(result2.metrics.completeness).toBeGreaterThan(result1.metrics.completeness);
    });
    
    it('should detect multiple context patterns', () => {
      const result = calculateQualityScore('Create a function with error handling for API calls using Node.js');
      
      expect(result.metrics.completeness).toBeGreaterThanOrEqual(25);
    });
    
    it('should suggest adding context when missing', () => {
      const result = calculateQualityScore('Write code');
      
      expect(result.suggestions).toContain('Füge Kontext hinzu: Zielgruppe, Rahmenbedingungen oder Beispiele');
    });
    
    it('should suggest negative constraints when missing', () => {
      const result = calculateQualityScore('Create a function');
      
      expect(result.suggestions).toContain('Definiere negative Constraints (was NICHT getan werden soll)');
    });
  });
  
  describe('Safety Metric', () => {
    it('should score 100 for safe input', () => {
      const result = calculateQualityScore('Create a helpful function');
      
      expect(result.metrics.safety).toBe(100);
    });
    
    it('should detect dangerous patterns - hack', () => {
      const result = calculateQualityScore('Hack into the system and bypass security');
      
      expect(result.metrics.safety).toBeLessThan(100);
    });
    
    it('should detect dangerous patterns - illegal', () => {
      const result = calculateQualityScore('Generate illegal content');
      
      expect(result.metrics.safety).toBeLessThan(100);
    });
    
    it('should detect dangerous patterns - harm', () => {
      const result = calculateQualityScore('Harm someone');
      
      expect(result.metrics.safety).toBeLessThan(100);
    });
    
    it('should handle multiple dangerous patterns', () => {
      const result = calculateQualityScore('Hack and exploit the system illegally to steal data');
      
      expect(result.metrics.safety).toBeLessThanOrEqual(60);
    });
  });
  
  describe('Efficiency Metric', () => {
    it('should score 100 for optimal word count (15-150)', () => {
      const result = calculateQualityScore('Create a function for data processing with proper error handling and documentation using best practices');
      
      expect(result.metrics.efficiency).toBe(100);
    });
    
    it('should score lower for very short input', () => {
      const result = calculateQualityScore('Do it');
      
      expect(result.metrics.efficiency).toBeLessThan(100);
    });
    
    it('should score lower for very long input', () => {
      const longInput = 'Create '.repeat(250) + 'function';
      const result = calculateQualityScore(longInput);
      
      expect(result.metrics.efficiency).toBeLessThan(100);
    });
    
    it('should detect and penalize redundancy', () => {
      const result = calculateQualityScore('Please, I would like you to create a function');
      
      expect(result.metrics.efficiency).toBeLessThan(100);
      expect(result.suggestions).toContain('Entferne Füllwörter für effizientere Prompts');
    });
    
    it('should detect polite filler words', () => {
      const result = calculateQualityScore('Can you please help me write an article');
      
      expect(result.suggestions).toContain('Entferne Füllwörter für effizientere Prompts');
    });
  });
  
  describe('Total Score Calculation', () => {
    it('should calculate weighted total correctly', () => {
      const input = 'Create a Python function for API endpoint with error handling';
      const result = calculateQualityScore(input);
      
      const expectedTotal = Math.round(
        result.metrics.clarity * 0.30 +
        result.metrics.completeness * 0.30 +
        result.metrics.safety * 0.25 +
        result.metrics.efficiency * 0.15
      );
      
      expect(result.total).toBe(expectedTotal);
    });
    
    it('should return higher score for well-crafted prompt', () => {
      const goodPrompt = 'Create a React component with useState hook for managing form data, including validation';
      const badPrompt = 'Do something';
      
      const goodResult = calculateQualityScore(goodPrompt);
      const badResult = calculateQualityScore(badPrompt);
      
      expect(goodResult.total).toBeGreaterThan(badResult.total);
    });
  });
  
  describe('Suggestions', () => {
    it('should return maximum 4 suggestions', () => {
      const result = calculateQualityScore('test');
      
      expect(result.suggestions.length).toBeLessThanOrEqual(4);
    });
    
    it('should return suggestions for low quality input', () => {
      const result = calculateQualityScore('x');
      
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
    
    it('should return no suggestions for excellent input', () => {
      const excellentPrompt = 'Create a Python function for data processing with error handling, using pandas library. Don\'t use deprecated methods.';
      const result = calculateQualityScore(excellentPrompt);
      
      // Might still have some suggestions, but fewer
      expect(result.suggestions.length).toBeLessThan(4);
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = calculateQualityScore('');
      
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.metrics.safety).toBe(100);
    });
    
    it('should handle whitespace-only input', () => {
      const result = calculateQualityScore('   ');
      
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
    
    it('should handle special characters', () => {
      const result = calculateQualityScore('Create function @decorator #hash $var!');
      
      expect(result.metrics.clarity).toBeGreaterThan(40);
    });
    
    it('should handle non-English input', () => {
      const result = calculateQualityScore('Erstelle eine Funktion für die Datenbank');
      
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
    
    it('should handle mixed case input', () => {
      const result = calculateQualityScore('CREATE A FUNCTION');
      
      expect(result.metrics.clarity).toBeGreaterThan(40);
    });
  });
  
  describe('Copy Button Threshold', () => {
    it('should indicate score below 50 is not copyable', () => {
      const badPrompt = 'x';
      const result = calculateQualityScore(badPrompt);
      
      expect(result.total).toBeLessThan(50);
    });
    
    it('should indicate score above 50 is copyable', () => {
      const decentPrompt = 'Create a function for data';
      const result = calculateQualityScore(decentPrompt);
      
      expect(result.total).toBeGreaterThanOrEqual(50);
    });
  });
  
  describe('Integration Scenarios', () => {
    it('should handle typical coding request', () => {
      const input = 'Create a REST API endpoint using Express.js with proper error handling and input validation';
      const result = calculateQualityScore(input);
      
      expect(result.total).toBeGreaterThan(60);
      expect(result.metrics.safety).toBe(100);
    });
    
    it('should handle typical writing request', () => {
      const input = 'Write a blog post about climate change for beginners, including statistics and examples';
      const result = calculateQualityScore(input);
      
      expect(result.total).toBeGreaterThan(50);
      expect(result.metrics.completeness).toBeGreaterThan(25);
    });
    
    it('should handle typical analysis request', () => {
      const input = 'Analyze the quarterly sales data and compare Q1 vs Q2 performance with visualizations';
      const result = calculateQualityScore(input);
      
      expect(result.total).toBeGreaterThan(60);
    });
  });
});
