import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute immediately when skip function returns true', () => {
    const skipFunc = vi.fn(() => true);
    const doneFunc = vi.fn();
    const debounced = debounce<[string]>(skipFunc, doneFunc, 250);

    debounced('test');

    expect(doneFunc).toHaveBeenCalledWith('test');
    expect(doneFunc).toHaveBeenCalledTimes(1);
  });

  it('should debounce when skip function returns false', () => {
    const skipFunc = vi.fn(() => false);
    const doneFunc = vi.fn();
    const debounced = debounce<[string]>(skipFunc, doneFunc, 250);

    debounced('test');

    expect(doneFunc).not.toHaveBeenCalled();

    vi.advanceTimersByTime(250);

    expect(doneFunc).toHaveBeenCalledWith('test');
    expect(doneFunc).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous timeout when called multiple times', () => {
    const skipFunc = vi.fn(() => false);
    const doneFunc = vi.fn();
    const debounced = debounce<[string]>(skipFunc, doneFunc, 250);

    debounced('first');
    vi.advanceTimersByTime(100);
    debounced('second');
    vi.advanceTimersByTime(100);
    debounced('third');

    expect(doneFunc).not.toHaveBeenCalled();

    vi.advanceTimersByTime(250);

    expect(doneFunc).toHaveBeenCalledWith('third');
    expect(doneFunc).toHaveBeenCalledTimes(1);
  });

  it('should use custom timeout value', () => {
    const skipFunc = vi.fn(() => false);
    const doneFunc = vi.fn();
    const debounced = debounce<[string]>(skipFunc, doneFunc, 500);

    debounced('test');

    vi.advanceTimersByTime(250);
    expect(doneFunc).not.toHaveBeenCalled();

    vi.advanceTimersByTime(250);
    expect(doneFunc).toHaveBeenCalledTimes(1);
  });
});
