import type { GameConfig } from '@/types/netkan';

export const ksp: GameConfig = {
  id: 'ksp',
  name: 'KSP',
  status: '/status/netkan.json',
  netkan: (ident: string, frozen?: boolean) =>
    frozen
      ? `https://github.com/KSP-CKAN/NetKAN/tree/master/NetKAN/${ident}.frozen`
      : `https://github.com/KSP-CKAN/NetKAN/tree/master/NetKAN/${ident}.netkan`,
  history: (ident: string, frozen?: boolean) =>
    frozen
      ? `https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/${ident}.frozen`
      : `https://github.com/KSP-CKAN/NetKAN/commits/master/NetKAN/${ident}.netkan`,
  metadata: (ident: string) =>
    `https://github.com/KSP-CKAN/CKAN-meta/tree/master/${ident}`,
};

export const ksp2: GameConfig = {
  id: 'ksp2',
  name: 'KSP2',
  status: '/status/netkan-ksp2.json',
  netkan: (ident: string, frozen?: boolean) =>
    frozen
      ? `https://github.com/KSP-CKAN/KSP2-NetKAN/tree/main/NetKAN/${ident}.frozen`
      : `https://github.com/KSP-CKAN/KSP2-NetKAN/tree/main/NetKAN/${ident}.netkan`,
  history: (ident: string, frozen?: boolean) =>
    frozen
      ? `https://github.com/KSP-CKAN/KSP2-NetKAN/commits/main/NetKAN/${ident}.frozen`
      : `https://github.com/KSP-CKAN/KSP2-NetKAN/commits/main/NetKAN/${ident}.netkan`,
  metadata: (ident: string) =>
    `https://github.com/KSP-CKAN/KSP2-CKAN-meta/tree/main/${ident}`,
};

export const games: GameConfig[] = [ksp, ksp2];
