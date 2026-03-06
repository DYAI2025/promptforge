/**
 * Sprint 2 Tests: Dynamic Variable Injection & Intent Recognition
 * 
 * These tests verify the core functionality of the dynamic prompt generation system.
 * Run with: npm test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  detectIntent,
  INTENT_PATTERNS,
  VARIABLE_TEMPLATES,
  generateDynamicPrompt,
  extractVariables,
  fillVariables,
  LLM_PROFILES,
  adaptPromptForModel
} from '../src/dynamic-prompt.js';

describe('Sprint 2: Dynamic Variable Injection', () => {
  
  describe('detectIntent', () => {
    it('should detect coding intent with high confidence', () => {
      const input = 'Create a React component with proper state management';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('coding');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
    
    it('should detect writing intent', () => {
      const input = 'Write a blog post about sustainable technology';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('writing');
      expect(result.confidence).toBeGreaterThan(0.3);
    });
    
    it('should detect analysis intent', () => {
      const input = 'Analyze the market trends and compare Q1 vs Q2 performance';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('analysis');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
    
    it('should detect creative intent', () => {
      const input = 'Brainstorm innovative ideas for a new mobile app';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('creative');
      expect(result.confidence).toBeGreaterThan(0.3);
    });
    
    it('should detect business intent', () => {
      const input = 'Create a marketing strategy with KPIs and timeline';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('business');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
    
    it('should detect learning intent', () => {
      const input = 'Explain quantum computing for beginners with examples';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('learning');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
    
    it('should return general intent for ambiguous input', () => {
      const input = 'Do something';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('general');
      expect(result.confidence).toBe(0);
    });
    
    it('should provide scores for all categories', () => {
      const input = 'Write code for a function';
      const result = detectIntent(input);
      
      expect(result.allScores).toBeDefined();
      expect(Object.keys(result.allScores).length).toBe(Object.keys(INTENT_PATTERNS).length);
    });
    
    it('should handle empty input gracefully', () => {
      const result = detectIntent('');
      
      expect(result.intent).toBe('general');
      expect(result.confidence).toBe(0);
    });
    
    it('should handle case-insensitive matching', () => {
      const input = 'CREATE A FUNCTION';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('coding');
    });
  });
  
  describe('VARIABLE_TEMPLATES', () => {
    it('should have templates for all intent categories', () => {
      const intentCategories = Object.keys(INTENT_PATTERNS);
      const templateCategories = Object.keys(VARIABLE_TEMPLATES);
      
      intentCategories.forEach(category => {
        expect(templateCategories).toContain(category);
      });
    });
    
    it('should have required properties in each template', () => {
      Object.values(VARIABLE_TEMPLATES).forEach(template => {
        expect(template).toHaveProperty('role');
        expect(template).toHaveProperty('constraints');
        expect(template).toHaveProperty('outputFormat');
        expect(template).toHaveProperty('examples');
        expect(Array.isArray(template.constraints)).toBe(true);
        expect(Array.isArray(template.examples)).toBe(true);
      });
    });
    
    it('should have non-empty roles', () => {
      Object.values(VARIABLE_TEMPLATES).forEach(template => {
        expect(template.role.length).toBeGreaterThan(20);
      });
    });
  });
  
  describe('generateDynamicPrompt', () => {
    it('should generate a prompt with detected intent', () => {
      const input = 'Build a Python API endpoint';
      const result = generateDynamicPrompt(input, 'spec');
      
      expect(result.prompt).toBeDefined();
      expect(result.prompt).toContain('CODING');
      expect(result.prompt).toContain(input);
    });
    
    it('should include metadata', () => {
      const input = 'Write an article';
      const result = generateDynamicPrompt(input, 'spec');
      
      expect(result.metadata).toBeDefined();
      expect(result.metadata.intent).toBe('writing');
      expect(result.metadata.confidence).toBeDefined();
      expect(result.metadata.mode).toBe('spec');
      expect(result.metadata.timestamp).toBeDefined();
    });
    
    it('should generate lite mode prompt', () => {
      const input = 'Create a function';
      const result = generateDynamicPrompt(input, 'lite');
      
      expect(result.prompt).toContain('### SYSTEM:');
      expect(result.prompt).toContain('### TASK:');
      expect(result.prompt).toContain('### FORMAT:');
      expect(result.metadata.mode).toBe('lite');
    });
    
    it('should generate strict mode prompt with security tags', () => {
      const input = 'Analyze this data';
      const result = generateDynamicPrompt(input, 'strict');
      
      expect(result.prompt).toContain('<!-- SYSTEM: SECURE_ENCLAVE_v1');
      expect(result.prompt).toContain('<meta>');
      expect(result.prompt).toContain('<security_level>HIGH</security_level>');
      expect(result.metadata.mode).toBe('strict');
    });
    
    it('should use provided detectedIntent if given', () => {
      const input = 'Some text';
      const preDetected = { intent: 'creative', confidence: 0.9 };
      const result = generateDynamicPrompt(input, 'spec', preDetected);
      
      expect(result.metadata.intent).toBe('creative');
      expect(result.metadata.confidence).toBe(0.9);
    });
    
    it('should handle empty input', () => {
      const result = generateDynamicPrompt('', 'spec');
      
      expect(result.prompt).toBeDefined();
      expect(result.metadata.intent).toBeDefined();
    });
  });
  
  describe('extractVariables', () => {
    it('should extract single variable', () => {
      const text = 'Hello {{NAME}}, how are you?';
      const result = extractVariables(text);
      
      expect(result).toEqual(['NAME']);
    });
    
    it('should extract multiple variables', () => {
      const text = '{{ROLE}}: {{TASK}} with {{CONSTRAINT}}';
      const result = extractVariables(text);
      
      expect(result).toEqual(['ROLE', 'TASK', 'CONSTRAINT']);
    });
    
    it('should return unique variables only', () => {
      const text = '{{VAR}} and {{VAR}} again';
      const result = extractVariables(text);
      
      expect(result).toEqual(['VAR']);
      expect(result.length).toBe(1);
    });
    
    it('should return empty array for no variables', () => {
      const text = 'No variables here';
      const result = extractVariables(text);
      
      expect(result).toEqual([]);
    });
    
    it('should handle variables with underscores', () => {
      const text = 'Use {{USER_INPUT}} and {{OUTPUT_FORMAT}}';
      const result = extractVariables(text);
      
      expect(result).toEqual(['USER_INPUT', 'OUTPUT_FORMAT']);
    });
  });
  
  describe('fillVariables', () => {
    it('should fill single variable', () => {
      const template = 'Hello {{NAME}}!';
      const values = { NAME: 'World' };
      const result = fillVariables(template, values);
      
      expect(result).toBe('Hello World!');
    });
    
    it('should fill multiple variables', () => {
      const template = '{{GREETING}} {{NAME}}, you are {{ROLE}}';
      const values = { GREETING: 'Hello', NAME: 'John', ROLE: 'awesome' };
      const result = fillVariables(template, values);
      
      expect(result).toBe('Hello John, you are awesome');
    });
    
    it('should fill all occurrences of a variable', () => {
      const template = '{{VAR}} - {{VAR}} - {{VAR}}';
      const values = { VAR: 'test' };
      const result = fillVariables(template, values);
      
      expect(result).toBe('test - test - test');
    });
    
    it('should leave undefined variables unchanged', () => {
      const template = '{{DEFINED}} and {{UNDEFINED}}';
      const values = { DEFINED: 'value' };
      const result = fillVariables(template, values);
      
      expect(result).toBe('value and {{UNDEFINED}}');
    });
    
    it('should handle empty values object', () => {
      const template = '{{VAR}}';
      const result = fillVariables(template, {});
      
      expect(result).toBe('{{VAR}}');
    });
  });
  
  describe('LLM_PROFILES', () => {
    it('should have profiles for gemini, gpt4, and claude', () => {
      expect(LLM_PROFILES).toHaveProperty('gemini');
      expect(LLM_PROFILES).toHaveProperty('gpt4');
      expect(LLM_PROFILES).toHaveProperty('claude');
    });
    
    it('should have required properties in each profile', () => {
      Object.values(LLM_PROFILES).forEach(profile => {
        expect(profile).toHaveProperty('name');
        expect(profile).toHaveProperty('strengths');
        expect(profile).toHaveProperty('optimalFor');
        expect(profile).toHaveProperty('promptStyle');
        expect(Array.isArray(profile.strengths)).toBe(true);
        expect(Array.isArray(profile.optimalFor)).toBe(true);
      });
    });
  });
  
  describe('adaptPromptForModel', () => {
    it('should return original prompt for unknown model', () => {
      const prompt = '### Test Prompt';
      const result = adaptPromptForModel(prompt, 'unknown');
      
      expect(result).toBe(prompt);
    });
    
    it('should adapt prompt for Claude with XML tags', () => {
      const prompt = `### SYSTEM CONTEXT
Test content
### ROLE DEFINITION
Role content
### OUTPUT
[Awaiting Generation...]`;
      
      const result = adaptPromptForModel(prompt, 'claude');
      
      expect(result).toContain('<system_context>');
      expect(result).toContain('<role_definition>');
      expect(result).toContain('<output>');
    });
    
    it('should add conversational prefix for GPT-4', () => {
      const prompt = '### Test Prompt';
      const result = adaptPromptForModel(prompt, 'gpt4');
      
      expect(result).toContain("Here's a task for you:");
    });
    
    it('should not modify Gemini prompts', () => {
      const prompt = '### Test Prompt for Gemini';
      const result = adaptPromptForModel(prompt, 'gemini');
      
      expect(result).toBe(prompt);
    });
  });
  
  describe('Integration Tests', () => {
    it('should complete full workflow: detect -> generate -> adapt', () => {
      const input = 'Create a React component with useState hook';
      
      // Step 1: Detect intent
      const intent = detectIntent(input);
      expect(intent.intent).toBe('coding');
      
      // Step 2: Generate prompt
      const generated = generateDynamicPrompt(input, 'spec', intent);
      expect(generated.prompt).toContain('CODING');
      expect(generated.metadata.intent).toBe('coding');
      
      // Step 3: Adapt for model
      const adapted = adaptPromptForModel(generated.prompt, 'claude');
      expect(adapted).toContain('<system_context>');
    });
    
    it('should handle variable extraction and filling in workflow', () => {
      const template = 'Role: {{ROLE}}, Task: {{TASK}}';
      const variables = extractVariables(template);
      
      expect(variables).toEqual(['ROLE', 'TASK']);
      
      const filled = fillVariables(template, {
        ROLE: 'Developer',
        TASK: 'Build app'
      });
      
      expect(filled).toBe('Role: Developer, Task: Build app');
    });
    
    it('should maintain consistency across different modes', () => {
      const input = 'Write a research paper on AI ethics';
      
      const lite = generateDynamicPrompt(input, 'lite');
      const spec = generateDynamicPrompt(input, 'spec');
      const strict = generateDynamicPrompt(input, 'strict');
      
      // All should detect writing intent
      expect(lite.metadata.intent).toBe('writing');
      expect(spec.metadata.intent).toBe('writing');
      expect(strict.metadata.intent).toBe('writing');
      
      // All should contain the input
      expect(lite.prompt).toContain(input);
      expect(spec.prompt).toContain(input);
      expect(strict.prompt).toContain(input);
      
      // Lengths should differ
      expect(strict.prompt.length).toBeGreaterThan(lite.prompt.length);
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle very long input', () => {
      const input = 'Create '.repeat(100) + 'function';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('coding');
    });
    
    it('should handle special characters', () => {
      const input = 'Create function with @decorator and $variable!';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('coding');
    });
    
    it('should handle non-English input gracefully', () => {
      const input = 'Erstelle eine Funktion für die Datenbank';
      const result = detectIntent(input);
      
      // Should still detect some intent (might be general or coding)
      expect(result.intent).toBeDefined();
    });
    
    it('should handle numbers in input', () => {
      const input = 'Create 3 functions with 5 parameters each';
      const result = detectIntent(input);
      
      expect(result.intent).toBe('coding');
    });
  });
  
  describe('Performance', () => {
    it('should detect intent within 10ms', () => {
      const input = 'Create a complex function with multiple parameters';
      const start = performance.now();
      detectIntent(input);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(10);
    });
    
    it('should generate prompt within 50ms', () => {
      const input = 'Build a full-stack application';
      const start = performance.now();
      generateDynamicPrompt(input, 'spec');
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50);
    });
  });
});
