/**
 * Sprint 4 Tests: Multi-LLM API Integration
 * 
 * These tests verify the LLM client functionality.
 * Run with: npm test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  LLM_CONFIG,
  estimateTokens,
  calculateCost,
  formatCost,
  callLLM,
  getAvailableModels,
  compareProviderCosts
} from '../src/llm-client.js';

describe('Sprint 4: Multi-LLM API Integration', () => {
  
  describe('LLM_CONFIG', () => {
    it('should have configuration for all providers', () => {
      expect(LLM_CONFIG).toHaveProperty('gemini');
      expect(LLM_CONFIG).toHaveProperty('openai');
      expect(LLM_CONFIG).toHaveProperty('anthropic');
    });

    it('should have required properties for each provider', () => {
      Object.values(LLM_CONFIG).forEach(config => {
        expect(config).toHaveProperty('baseUrl');
        expect(config).toHaveProperty('defaultModel');
        expect(config).toHaveProperty('pricing');
        expect(config.pricing).toHaveProperty('input');
        expect(config.pricing).toHaveProperty('output');
      });
    });

    it('should have valid pricing (positive numbers)', () => {
      Object.values(LLM_CONFIG).forEach(config => {
        expect(config.pricing.input).toBeGreaterThan(0);
        expect(config.pricing.output).toBeGreaterThan(0);
      });
    });
  });

  describe('estimateTokens', () => {
    it('should estimate tokens from text length', () => {
      const text = 'Hello, this is a test message.';
      const tokens = estimateTokens(text);
      
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThanOrEqual(text.length);
    });

    it('should return 0 for empty string', () => {
      expect(estimateTokens('')).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(estimateTokens(null)).toBe(0);
      expect(estimateTokens(undefined)).toBe(0);
    });

    it('should estimate ~4 chars per token', () => {
      const text = 'a'.repeat(100);
      const tokens = estimateTokens(text);
      
      // Should be approximately 25 tokens (100/4)
      expect(tokens).toBeGreaterThanOrEqual(20);
      expect(tokens).toBeLessThanOrEqual(30);
    });

    it('should handle longer text', () => {
      const longText = 'This is a much longer text that should result in more tokens being estimated for the input.';
      const tokens = estimateTokens(longText);
      
      expect(tokens).toBeGreaterThan(10);
    });
  });

  describe('calculateCost', () => {
    it('should calculate cost for gemini', () => {
      const cost = calculateCost('gemini', 1000, 500);
      
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeLessThan(1); // Should be very small
    });

    it('should calculate cost for openai', () => {
      const cost = calculateCost('openai', 1000, 500);
      
      expect(cost).toBeGreaterThan(0);
    });

    it('should calculate cost for anthropic', () => {
      const cost = calculateCost('anthropic', 1000, 500);
      
      expect(cost).toBeGreaterThan(0);
    });

    it('should return 0 for unknown provider', () => {
      const cost = calculateCost('unknown', 1000, 500);
      
      expect(cost).toBe(0);
    });

    it('should scale with token count', () => {
      const cost1 = calculateCost('gemini', 1000, 500);
      const cost2 = calculateCost('gemini', 2000, 1000);
      
      expect(cost2).toBeGreaterThan(cost1);
      expect(cost2).toBeCloseTo(cost1 * 2, 1);
    });

    it('should handle zero tokens', () => {
      const cost = calculateCost('gemini', 0, 0);
      
      expect(cost).toBe(0);
    });
  });

  describe('formatCost', () => {
    it('should format cost as USD string', () => {
      expect(formatCost(0.000123)).toBe('$0.000123');
    });

    it('should handle very small costs', () => {
      expect(formatCost(0.0000001)).toBe('$0.000000');
    });

    it('should handle larger costs', () => {
      expect(formatCost(1.5)).toBe('$1.500000');
    });
  });

  describe('getAvailableModels', () => {
    it('should return models for gemini', () => {
      const models = getAvailableModels('gemini');
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      expect(models[0]).toHaveProperty('id');
      expect(models[0]).toHaveProperty('name');
    });

    it('should return models for openai', () => {
      const models = getAvailableModels('openai');
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should return models for anthropic', () => {
      const models = getAvailableModels('anthropic');
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown provider', () => {
      const models = getAvailableModels('unknown');
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBe(0);
    });

    it('should have speed indicator for each model', () => {
      const providers = ['gemini', 'openai', 'anthropic'];
      
      providers.forEach(provider => {
        const models = getAvailableModels(provider);
        models.forEach(model => {
          expect(model).toHaveProperty('speed');
          expect(['fast', 'faster', 'fastest', 'balanced', 'slow']).toContain(model.speed);
        });
      });
    });
  });

  describe('compareProviderCosts', () => {
    it('should compare costs for all providers', () => {
      const prompt = 'Write a function to sort an array';
      const output = 'Here is the sorted array function...';
      
      const comparison = compareProviderCosts(prompt, output);
      
      expect(comparison).toHaveProperty('gemini');
      expect(comparison).toHaveProperty('openai');
      expect(comparison).toHaveProperty('anthropic');
    });

    it('should include input and output costs', () => {
      const comparison = compareProviderCosts('test', 'output');
      
      Object.values(comparison).forEach(provider => {
        expect(provider).toHaveProperty('inputCost');
        expect(provider).toHaveProperty('outputCost');
        expect(provider).toHaveProperty('totalCost');
      });
    });

    it('should show different costs per provider', () => {
      const comparison = compareProviderCosts('test prompt', 'test output');
      
      const costs = Object.values(comparison).map(p => p.totalCost);
      
      // Costs should differ between providers
      expect(new Set(costs).size).toBeGreaterThan(1);
    });

    it('should identify cheapest provider', () => {
      const comparison = compareProviderCosts('test', 'output');
      
      const costs = Object.entries(comparison).map(([k, v]) => [k, v.totalCost]);
      const cheapest = costs.reduce((a, b) => a[1] < b[1] ? a : b);
      
      // Gemini is typically cheapest
      expect(['gemini', 'anthropic']).toContain(cheapest[0]);
    });
  });

  describe('callLLM (Mocked)', () => {
    beforeEach(() => {
      // Mock fetch globally
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should throw error for unknown provider', async () => {
      await expect(callLLM('unknown', 'prompt', 'fake-key'))
        .rejects.toThrow('Unknown provider');
    });

    it('should call Gemini with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          candidates: [{
            content: {
              parts: [{ text: 'Test response' }]
            }
          }]
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await callLLM('gemini', 'Test prompt', 'fake-key');
      
      expect(global.fetch).toHaveBeenCalled();
      expect(result.provider).toBe('gemini');
      expect(result.content).toBe('Test response');
    });

    it('should call GPT-4 with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          choices: [{
            message: { content: 'Test response' }
          }],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 5,
            total_tokens: 15
          }
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await callLLM('openai', 'Test prompt', 'fake-key');
      
      expect(global.fetch).toHaveBeenCalled();
      expect(result.provider).toBe('openai');
      expect(result.content).toBe('Test response');
    });

    it('should call Claude with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          content: [{ text: 'Test response' }],
          usage: {
            input_tokens: 10,
            output_tokens: 5
          }
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await callLLM('anthropic', 'Test prompt', 'fake-key');
      
      expect(global.fetch).toHaveBeenCalled();
      expect(result.provider).toBe('anthropic');
      expect(result.content).toBe('Test response');
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({
          error: { message: 'Invalid API key' }
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      await expect(callLLM('gemini', 'prompt', 'invalid-key'))
        .rejects.toThrow('Invalid API key');
    });

    it('should include usage information', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          candidates: [{
            content: {
              parts: [{ text: 'Response text' }]
            }
          }]
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await callLLM('gemini', 'Test prompt', 'fake-key');
      
      expect(result.usage).toBeDefined();
      expect(result.usage.inputTokens).toBeGreaterThan(0);
      expect(result.usage.outputTokens).toBeGreaterThan(0);
    });

    it('should include cost information', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          candidates: [{
            content: {
              parts: [{ text: 'Response' }]
            }
          }]
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await callLLM('gemini', 'Test prompt', 'fake-key');
      
      expect(result.cost).toBeGreaterThan(0);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete workflow: estimate -> call -> track', async () => {
      const prompt = 'Create a React component';
      
      // Estimate tokens
      const estimatedInput = estimateTokens(prompt);
      expect(estimatedInput).toBeGreaterThan(0);
      
      // Estimate cost
      const estimatedCost = calculateCost('gemini', estimatedInput, 100);
      expect(estimatedCost).toBeGreaterThan(0);
      
      // Compare providers
      const comparison = compareProviderCosts(prompt, 'Component code here');
      expect(Object.keys(comparison).length).toBe(3);
    });

    it('should select model based on requirements', () => {
      const requirements = {
        speed: 'fast',
        budget: 'low'
      };
      
      const allModels = [];
      ['gemini', 'openai', 'anthropic'].forEach(provider => {
        const models = getAvailableModels(provider);
        allModels.push(...models.map(m => ({ ...m, provider })));
      });
      
      // Find fast models
      const fastModels = allModels.filter(m => m.speed === 'fast');
      expect(fastModels.length).toBeGreaterThan(0);
    });

    it('should track cumulative costs', () => {
      const requests = [
        { input: 100, output: 50 },
        { input: 200, output: 100 },
        { input: 150, output: 75 }
      ];
      
      let totalCost = 0;
      requests.forEach(req => {
        totalCost += calculateCost('gemini', req.input, req.output);
      });
      
      expect(totalCost).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long prompts', () => {
      const longPrompt = 'a'.repeat(10000);
      const tokens = estimateTokens(longPrompt);
      
      expect(tokens).toBeGreaterThan(1000);
      expect(tokens).toBeLessThan(5000);
    });

    it('should handle special characters', () => {
      const prompt = 'Create function with @decorator #hash $var 中文 🚀';
      const tokens = estimateTokens(prompt);
      
      expect(tokens).toBeGreaterThan(0);
    });

    it('should handle code snippets', () => {
      const code = `function sort(arr) {
  return arr.sort((a, b) => a - b);
}`;
      const tokens = estimateTokens(code);
      
      expect(tokens).toBeGreaterThan(5);
    });
  });

  describe('Performance', () => {
    it('should estimate tokens quickly', () => {
      const text = 'a'.repeat(10000);
      
      const start = performance.now();
      estimateTokens(text);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(10);
    });

    it('should calculate cost quickly', () => {
      const start = performance.now();
      calculateCost('gemini', 1000, 500);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(5);
    });

    it('should compare providers quickly', () => {
      const prompt = 'a'.repeat(1000);
      
      const start = performance.now();
      compareProviderCosts(prompt, 'output');
      const end = performance.now();
      
      expect(end - start).toBeLessThan(10);
    });
  });
});
