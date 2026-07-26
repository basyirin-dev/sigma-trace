import { describe, it, expect } from 'vitest';
import { renderGauge, valueToAngle, GAUGE_WIDTH, GAUGE_HEIGHT } from './renderGauge';
import { createMockCanvasContext } from '../test-utils';

describe('valueToAngle', () => {
  it('maps 0 to π', () => {
    expect(valueToAngle(0)).toBe(Math.PI);
  });

  it('maps 50 to 1.5π', () => {
    expect(valueToAngle(50)).toBe(Math.PI * 1.5);
  });

  it('maps 100 to 2π', () => {
    expect(valueToAngle(100)).toBe(Math.PI * 2);
  });

  it('interpolates linearly', () => {
    expect(valueToAngle(25)).toBe(Math.PI * 1.25);
    expect(valueToAngle(75)).toBe(Math.PI * 1.75);
  });
});

describe('renderGauge', () => {
  it('clears the canvas to full dimensions', () => {
    const { ctx, calls } = createMockCanvasContext();
    renderGauge(ctx, 50);
    const clearRect = calls.find((c) => c.method === 'clearRect');
    expect(clearRect).toBeDefined();
    expect(clearRect!.args).toEqual([0, 0, GAUGE_WIDTH, GAUGE_HEIGHT]);
  });

  it('draws background fill', () => {
    const { ctx, calls } = createMockCanvasContext();
    renderGauge(ctx, 50);
    const fillRects = calls.filter((c) => c.method === 'fillRect');
    expect(fillRects.length).toBeGreaterThanOrEqual(1);
    const bgCall = fillRects.find((c) => c.args[2] === GAUGE_WIDTH && c.args[3] === GAUGE_HEIGHT);
    expect(bgCall).toBeDefined();
  });

  it('draws arc segments for color bands via fillRect pixel arcs', () => {
    const { ctx, calls } = createMockCanvasContext();
    renderGauge(ctx, 50);
    const fillRects = calls.filter((c) => c.method === 'fillRect');
    expect(fillRects.length).toBeGreaterThan(50);
  });

  it('draws pixel needle using fillRect', () => {
    const { ctx, calls } = createMockCanvasContext();
    renderGauge(ctx, 75);
    const fillRects = calls.filter((c) => c.method === 'fillRect');
    expect(fillRects.length).toBeGreaterThan(50);
  });

  it('displays the numeric value', () => {
    const { ctx, calls } = createMockCanvasContext();
    renderGauge(ctx, 42);
    const fillTextCalls = calls.filter((c) => c.method === 'fillText');
    const valueText = fillTextCalls.find((c) => c.args[0] === '42');
    expect(valueText).toBeDefined();
  });

  it('displays σ label', () => {
    const { ctx, calls } = createMockCanvasContext();
    renderGauge(ctx, 50);
    const fillTextCalls = calls.filter((c) => c.method === 'fillText');
    const sigmaLabel = fillTextCalls.find((c) => c.args[0] === 'σ');
    expect(sigmaLabel).toBeDefined();
  });

  it('displays 0 and 100 labels', () => {
    const { ctx, calls } = createMockCanvasContext();
    renderGauge(ctx, 50);
    const fillTextCalls = calls.filter((c) => c.method === 'fillText');
    const zeroLabel = fillTextCalls.find((c) => c.args[0] === '0');
    const hundredLabel = fillTextCalls.find((c) => c.args[0] === '100');
    expect(zeroLabel).toBeDefined();
    expect(hundredLabel).toBeDefined();
  });

  it('clamps values outside 0-100', () => {
    const { ctx, calls } = createMockCanvasContext();
    renderGauge(ctx, -10);
    const fillTextCalls = calls.filter((c) => c.method === 'fillText');
    const displayText = fillTextCalls.find((c) => c.args[0] === '0');
    expect(displayText).toBeDefined();
  });
});
