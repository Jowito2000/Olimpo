import type { Character, CategoryInfo } from '../../types';

/* ─── Explicit imports (replaces Vite import.meta.glob) ───────────── */

import afrodita from './afrodita.json';
import alcmena from './alcmena.json';
import andromeda from './andromeda.json';
import anfitrite from './anfitrite.json';
import apolo from './apolo.json';
import ares from './ares.json';
import ariadna from './ariadna.json';
import artemisa from './artemisa.json';
import asclepio from './asclepio.json';
import asteria from './asteria.json';
import atamante from './atamante.json';
import atenea from './atenea.json';
import atlas from './atlas.json';
import belerofonte from './belerofonte.json';
import cadmo from './cadmo.json';
import calipso from './calipso.json';
import caos from './caos.json';
import ceo from './ceo.json';
import climene from './climene.json';
import creontiades from './creontiades.json';
import creteo from './creteo.json';
import crio from './crio.json';
import cronos from './cronos.json';
import danae from './danae.json';
import deicoonte from './deicoonte.json';
import deimos from './deimos.json';
import demeter from './demeter.json';
import deucalion from './deucalion.json';
import deyanira from './deyanira.json';
import dioniso from './dioniso.json';
import electrion from './electrion.json';
import eneas from './eneas.json';
import eolo from './eolo.json';
import eos from './eos.json';
import epimeteo from './epimeteo.json';
import erebo from './erebo.json';
import eros from './eros.json';
import eros_primordial from './eros-primordial.json';
import eson from './eson.json';
import estigia from './estigia.json';
import eter from './eter.json';
import febe from './febe.json';
import fobos from './fobos.json';
import gea from './gea.json';
import glauco_corinto from './glauco-corinto.json';
import hades from './hades.json';
import hebe from './hebe.json';
import hecate from './hecate.json';
import hefesto from './hefesto.json';
import helena from './helena.json';
import helios from './helios.json';
import hemera from './hemera.json';
import hera from './hera.json';
import heracles from './heracles.json';
import hermes from './hermes.json';
import hestia from './hestia.json';
import hilo from './hilo.json';
import hiperion from './hiperion.json';
import hipnos from './hipnos.json';
import ilitia from './ilitia.json';
import japeto from './japeto.json';
import jason from './jason.json';
import leda from './leda.json';
import leto from './leto.json';
import macaria from './macaria.json';
import maia from './maia.json';
import megara from './megara.json';
import merope from './merope.json';
import metis from './metis.json';
import mnemosine from './mnemosine.json';
import musas from './musas.json';
import nereo from './nereo.json';
import nix from './nix.json';
import oceano from './oceano.json';
import pan from './pan.json';
import pandora from './pandora.json';
import persefone from './persefone.json';
import perseo from './perseo.json';
import pirra from './pirra.json';
import ponto from './ponto.json';
import poseidon from './poseidon.json';
import prometeo from './prometeo.json';
import rea from './rea.json';
import salmoneo from './salmoneo.json';
import selene from './selene.json';
import semele from './semele.json';
import sisifo from './sisifo.json';
import tanatos from './tanatos.json';
import tartaro from './tartaro.json';
import tea from './tea.json';
import temis from './temis.json';
import terimaco from './terimaco.json';
import teseo from './teseo.json';
import tetis from './tetis.json';
import tifon from './tifon.json';
import triton from './triton.json';
import urano from './urano.json';
import zeus from './zeus.json';

const allModules: Character[] = [
  afrodita, alcmena, andromeda, anfitrite, apolo, ares, ariadna, artemisa,
  asclepio, asteria, atamante, atenea, atlas, belerofonte, cadmo, calipso,
  caos, ceo, climene, creontiades, creteo, crio, cronos, danae, deicoonte,
  deimos, demeter, deucalion, deyanira, dioniso, electrion, eneas, eolo, eos,
  epimeteo, erebo, eros, eros_primordial, eson, estigia, eter, febe, fobos,
  gea, glauco_corinto, hades, hebe, hecate, hefesto, helena, helios, hemera,
  hera, heracles, hermes, hestia, hilo, hiperion, hipnos, ilitia, japeto,
  jason, leda, leto, macaria, maia, megara, merope, metis, mnemosine, musas,
  nereo, nix, oceano, pan, pandora, persefone, perseo, pirra, ponto, poseidon,
  prometeo, rea, salmoneo, selene, semele, sisifo, tanatos, tartaro, tea,
  temis, terimaco, teseo, tetis, tifon, triton, urano, zeus,
] as Character[];

const characters: Record<string, Character> = {};
for (const mod of allModules) {
  characters[mod.id] = mod;
}

/* ─── Category metadata ─────────────────────────────────────────────── */

export const categories: CategoryInfo[] = [
  { id: 'primordial', name: 'Primordiales', color: '#6b21a8' },
  { id: 'titan', name: 'Titanes', color: '#b45309' },
  { id: 'olimpico', name: 'Olímpicos', color: '#ca8a04' },
  { id: 'heroe', name: 'Héroes', color: '#0891b2' },
  { id: 'mortal', name: 'Mortales', color: '#65a30d' },
  { id: 'ninfa', name: 'Ninfas', color: '#db2777' },
  { id: 'monstruo', name: 'Monstruos', color: '#dc2626' },
];

/* ─── Query helpers ─────────────────────────────────────────────────── */

export function getCharacter(id: string): Character | null {
  return characters[id] ?? null;
}

export function getAllCharacters(): Character[] {
  return Object.values(characters);
}
