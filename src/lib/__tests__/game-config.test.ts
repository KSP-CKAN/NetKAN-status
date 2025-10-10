import { describe, it, expect } from 'vitest';
import { ksp, ksp2, games } from '../game-config';

describe('ksp config', () => {
  it('should have correct id and name', () => {
    expect(ksp.id).toBe('ksp');
    expect(ksp.name).toBe('KSP');
  });

  it('should have correct status URL', () => {
    expect(ksp.status).toBe('/status/netkan.json');
  });

  it('should generate netkan URL for active mod', () => {
    const url = ksp.netkan('TestMod', false);
    expect(url).toBe('https://github.com/KSP-CKAN/NetKAN/tree/master/NetKAN/TestMod.netkan');
  });

  it('should generate netkan URL for frozen mod', () => {
    const url = ksp.netkan('TestMod', true);
    expect(url).toBe('https://github.com/KSP-CKAN/NetKAN/tree/master/NetKAN/TestMod.frozen');
  });

  it('should generate netkan URL without frozen parameter (defaults to active)', () => {
    const url = ksp.netkan('TestMod');
    expect(url).toBe('https://github.com/KSP-CKAN/NetKAN/tree/master/NetKAN/TestMod.netkan');
  });

  it('should generate history URL for active mod', () => {
    const url = ksp.history('TestMod', false);
    expect(url).toBe('https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/TestMod.netkan');
  });

  it('should generate history URL for frozen mod', () => {
    const url = ksp.history('TestMod', true);
    expect(url).toBe('https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/TestMod.frozen');
  });

  it('should generate metadata URL', () => {
    const url = ksp.metadata('TestMod');
    expect(url).toBe('https://github.com/KSP-CKAN/CKAN-meta/tree/master/TestMod');
  });
});

describe('ksp2 config', () => {
  it('should have correct id and name', () => {
    expect(ksp2.id).toBe('ksp2');
    expect(ksp2.name).toBe('KSP2');
  });

  it('should have correct status URL', () => {
    expect(ksp2.status).toBe('/status/netkan-ksp2.json');
  });

  it('should generate netkan URL for active mod', () => {
    const url = ksp2.netkan('TestMod', false);
    expect(url).toBe('https://github.com/KSP-CKAN/KSP2-NetKAN/tree/main/NetKAN/TestMod.netkan');
  });

  it('should generate netkan URL for frozen mod', () => {
    const url = ksp2.netkan('TestMod', true);
    expect(url).toBe('https://github.com/KSP-CKAN/KSP2-NetKAN/tree/main/NetKAN/TestMod.frozen');
  });

  it('should generate history URL for active mod', () => {
    const url = ksp2.history('TestMod', false);
    expect(url).toBe('https://github.com/KSP-CKAN/KSP2-NetKAN/commits/main/NetKAN/TestMod.netkan');
  });

  it('should generate history URL for frozen mod', () => {
    const url = ksp2.history('TestMod', true);
    expect(url).toBe('https://github.com/KSP-CKAN/KSP2-NetKAN/commits/main/NetKAN/TestMod.frozen');
  });

  it('should generate metadata URL', () => {
    const url = ksp2.metadata('TestMod');
    expect(url).toBe('https://github.com/KSP-CKAN/KSP2-CKAN-meta/tree/main/TestMod');
  });
});

describe('games array', () => {
  it('should contain both ksp and ksp2', () => {
    expect(games).toHaveLength(2);
    expect(games).toContain(ksp);
    expect(games).toContain(ksp2);
  });

  it('should have ksp as first element', () => {
    expect(games[0]).toBe(ksp);
  });

  it('should have ksp2 as second element', () => {
    expect(games[1]).toBe(ksp2);
  });
});
