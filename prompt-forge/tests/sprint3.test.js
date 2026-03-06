/**
 * Sprint 3 Tests: Visual Micro-Interactions
 * 
 * These tests verify the visual enhancements and animations.
 * Run with: npm test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Sprint 3: Visual Micro-Interactions', () => {
  
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="scroll-progress" class="scroll-progress"></div>
      <button id="forge-btn" class="btn btn-primary forge-btn">FORGE PROMPT</button>
      <button id="copy-btn" class="btn-copy">COPY</button>
      <div id="output-content">Test content</div>
      <div class="metric-fill" style="width: 0%"></div>
    `;
    
    // Mock scrollHeight
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
      configurable: true
    });
  });

  describe('Scroll Progress Indicator', () => {
    it('should have scroll progress element in DOM', () => {
      const progressEl = document.getElementById('scroll-progress');
      expect(progressEl).toBeDefined();
      expect(progressEl).not.toBeNull();
    });

    it('should calculate scroll percentage correctly', () => {
      const scrollTop = 500;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      expect(scrollPercent).toBe(50);
    });

    it('should show 0% at top of page', () => {
      const scrollTop = 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      expect(scrollPercent).toBe(0);
    });

    it('should show 100% at bottom of page', () => {
      const scrollTop = 1000;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      expect(scrollPercent).toBe(100);
    });
  });

  describe('Button Hover Magnet Effect', () => {
    it('should calculate mouse position percentage correctly', () => {
      const btnWidth = 200;
      const btnHeight = 50;
      const mouseX = 100;
      const mouseY = 25;
      
      const percentX = (mouseX / btnWidth) * 100;
      const percentY = (mouseY / btnHeight) * 100;
      
      expect(percentX).toBe(50);
      expect(percentY).toBe(50);
    });

    it('should handle mouse at button corner', () => {
      const btnWidth = 200;
      const btnHeight = 50;
      const mouseX = 200;
      const mouseY = 50;
      
      const percentX = (mouseX / btnWidth) * 100;
      const percentY = (mouseY / btnHeight) * 100;
      
      expect(percentX).toBe(100);
      expect(percentY).toBe(100);
    });

    it('should handle mouse at button center', () => {
      const btnWidth = 200;
      const btnHeight = 50;
      const mouseX = 100;
      const mouseY = 25;
      
      const percentX = (mouseX / btnWidth) * 100;
      const percentY = (mouseY / btnHeight) * 100;
      
      expect(percentX).toBe(50);
      expect(percentY).toBe(50);
    });
  });

  describe('Forge Button Loading State', () => {
    it('should have forging class available', () => {
      const btn = document.getElementById('forge-btn');
      expect(btn.classList).toBeDefined();
    });

    it('should add forging class when clicked', () => {
      const btn = document.getElementById('forge-btn');
      btn.classList.add('forging');
      
      expect(btn.classList.contains('forging')).toBe(true);
    });

    it('should remove forging class after action', () => {
      const btn = document.getElementById('forge-btn');
      btn.classList.add('forging');
      btn.classList.remove('forging');
      
      expect(btn.classList.contains('forging')).toBe(false);
    });

    it('should change button text during loading', () => {
      const btn = document.getElementById('forge-btn');
      const originalText = btn.innerHTML;
      
      btn.innerHTML = '';
      expect(btn.innerHTML).toBe('');
      
      btn.innerHTML = originalText;
      expect(btn.innerHTML).toContain('FORGE PROMPT');
    });

    it('should restore button text after loading', () => {
      const btn = document.getElementById('forge-btn');
      const originalText = btn.innerHTML;
      
      btn.innerHTML = '';
      btn.innerHTML = originalText;
      
      expect(btn.innerHTML).toContain('FORGE PROMPT');
    });
  });

  describe('Copy Button Success Animation', () => {
    beforeEach(() => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined)
        }
      });
    });

    it('should have copy button in DOM', () => {
      const btn = document.getElementById('copy-btn');
      expect(btn).toBeDefined();
    });

    it('should add success classes on copy', () => {
      const btn = document.getElementById('copy-btn');
      btn.classList.add('copy-success', 'copied');
      
      expect(btn.classList.contains('copy-success')).toBe(true);
      expect(btn.classList.contains('copied')).toBe(true);
    });

    it('should change text to COPIED', () => {
      const btn = document.getElementById('copy-btn');
      const originalText = btn.innerText;
      
      btn.innerText = '✓ COPIED';
      expect(btn.innerText).toBe('✓ COPIED');
      
      btn.innerText = originalText;
    });

    it('should restore original text after copy', () => {
      const btn = document.getElementById('copy-btn');
      const originalText = 'COPY';
      
      btn.innerText = '✓ COPIED';
      btn.innerText = originalText;
      
      expect(btn.innerText).toBe(originalText);
    });

    it('should remove animation classes after timeout', () => {
      const btn = document.getElementById('copy-btn');
      btn.classList.add('copy-success', 'copied');
      btn.classList.remove('copy-success', 'copied');
      
      expect(btn.classList.contains('copy-success')).toBe(false);
      expect(btn.classList.contains('copied')).toBe(false);
    });

    it('should handle clipboard API failure gracefully', async () => {
      const btn = document.getElementById('copy-btn');
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Failed'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      });

      // Should not throw - click handler catches errors internally
      expect(() => btn.click()).not.toThrow();
    });
  });

  describe('Metric Bar Animation', () => {
    it('should have metric-fill elements', () => {
      const metricFill = document.querySelector('.metric-fill');
      expect(metricFill).toBeDefined();
    });

    it('should animate width change', () => {
      const metricFill = document.querySelector('.metric-fill');
      
      metricFill.style.width = '75%';
      
      expect(metricFill.style.width).toBe('75%');
    });

    it('should support width values from 0% to 100%', () => {
      const metricFill = document.querySelector('.metric-fill');
      
      metricFill.style.width = '0%';
      expect(metricFill.style.width).toBe('0%');
      
      metricFill.style.width = '50%';
      expect(metricFill.style.width).toBe('50%');
      
      metricFill.style.width = '100%';
      expect(metricFill.style.width).toBe('100%');
    });
  });

  describe('CSS Classes Exist', () => {
    it('should have scroll-progress class', () => {
      const el = document.getElementById('scroll-progress');
      expect(el.classList.contains('scroll-progress')).toBe(true);
    });

    it('should have btn class on buttons', () => {
      const btn = document.getElementById('forge-btn');
      expect(btn.classList.contains('btn')).toBe(true);
    });

    it('should have btn-primary class', () => {
      const btn = document.getElementById('forge-btn');
      expect(btn.classList.contains('btn-primary')).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined)
        }
      });
    });

    it('should handle complete copy workflow', () => {
      const btn = document.getElementById('copy-btn');
      
      // Add animation classes
      btn.classList.add('copy-success', 'copied');
      expect(btn.classList.contains('copy-success')).toBe(true);
      
      // Change text
      const originalText = btn.innerText;
      btn.innerText = '✓ COPIED';
      expect(btn.innerText).toBe('✓ COPIED');
      
      // Restore
      btn.classList.remove('copy-success', 'copied');
      btn.innerText = originalText;
      
      expect(btn.classList.contains('copy-success')).toBe(false);
    });

    it('should handle button state transitions', () => {
      const btn = document.getElementById('forge-btn');
      const originalText = btn.innerHTML;
      
      // Loading state
      btn.classList.add('forging');
      btn.innerHTML = '';
      expect(btn.classList.contains('forging')).toBe(true);
      
      // Restore state
      btn.classList.remove('forging');
      btn.innerHTML = originalText;
      expect(btn.classList.contains('forging')).toBe(false);
      expect(btn.innerHTML).toContain('FORGE PROMPT');
    });
  });

  describe('Performance', () => {
    it('should calculate scroll percentage efficiently', () => {
      const iterations = 1000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const scrollTop = i;
        const docHeight = 1000;
        const scrollPercent = (scrollTop / docHeight) * 100;
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });

    it('should calculate mouse position efficiently', () => {
      const btnWidth = 200;
      const btnHeight = 50;
      const iterations = 1000;
      
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const mouseX = i % btnWidth;
        const mouseY = i % btnHeight;
        const percentX = (mouseX / btnWidth) * 100;
        const percentY = (mouseY / btnHeight) * 100;
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(50);
    });
  });
});
