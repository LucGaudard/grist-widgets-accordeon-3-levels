import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPTY_GROUP_KEY, DEFAULT_PALETTE,
  esc, safeColor, sanitizeColors, groupRecords, assignDefaultColors,
} from '../groupes.logic.js';

const recs = [
  { id: 1, Nom: 'a', Niveau: '3e' },
  { id: 2, Nom: 'b', Niveau: '4e' },
  { id: 3, Nom: 'c', Niveau: '3e' },
  { id: 4, Nom: 'd', Niveau: '' },
  { id: 5, Nom: 'e', Niveau: null },
];

test('esc neutralise les caractères dangereux en HTML', () => {
  assert.equal(esc('<script>'), '&lt;script&gt;');
  assert.equal(esc(`"'&\``), '&quot;&#39;&amp;&#96;');
  assert.equal(esc(42), '42');
  assert.equal(esc(null), 'null');
});

test('safeColor n’accepte que des hexadécimaux à 6 chiffres', () => {
  assert.equal(safeColor('#3b82f6'), '#3b82f6');
  assert.equal(safeColor('#ABCDEF'), '#ABCDEF');
  assert.equal(safeColor('#abc'), '#94a3b8');
  assert.equal(safeColor('red'), '#94a3b8');
  assert.equal(safeColor('#3b82f6; background:url(x)'), '#94a3b8');
  assert.equal(safeColor(undefined), '#94a3b8');
  assert.equal(safeColor('#000000', '#ffffff'), '#000000');
  assert.equal(safeColor('nope', '#ffffff'), '#ffffff');
});

test('sanitizeColors ne garde que les couleurs valides', () => {
  const out = sanitizeColors({ a: '#3b82f6', b: 'red', c: 42 });
  assert.deepEqual({ ...out }, { a: '#3b82f6' });
});

test('sanitizeColors accepte une chaîne JSON et rejette le reste', () => {
  assert.deepEqual({ ...sanitizeColors('{"a":"#3b82f6"}') }, { a: '#3b82f6' });
  assert.deepEqual({ ...sanitizeColors('pas du json') }, {});
  assert.deepEqual({ ...sanitizeColors(['#3b82f6']) }, {});
  assert.deepEqual({ ...sanitizeColors(null) }, {});
});

test('sanitizeColors renvoie un objet sans prototype', () => {
  const out = sanitizeColors('{"__proto__":{"pollue":true},"a":"#3b82f6"}');
  assert.equal(Object.getPrototypeOf(out), null);
  assert.equal({}.pollue, undefined);
});

test('groupRecords regroupe et compte correctement', () => {
  const g = groupRecords(recs, 'Niveau', 'alpha-asc');
  assert.deepEqual(g.map(x => x.key), ['3e', '4e', EMPTY_GROUP_KEY]);
  assert.deepEqual(g.map(x => x.records.length), [2, 1, 2]);
});

test('groupRecords : valeurs vides et nulles dans le même groupe', () => {
  const g = groupRecords(recs, 'Niveau', 'alpha-asc');
  const vide = g.find(x => x.key === EMPTY_GROUP_KEY);
  assert.deepEqual(vide.records.map(r => r.id), [4, 5]);
});

test('groupRecords : le groupe vide reste en dernier quel que soit le tri', () => {
  for (const mode of ['alpha-asc', 'alpha-desc', 'count-asc', 'count-desc', 'none']) {
    const g = groupRecords(recs, 'Niveau', mode);
    assert.equal(g.at(-1).key, EMPTY_GROUP_KEY, `tri ${mode}`);
  }
});

test('groupRecords : tris alphabétiques et par effectif', () => {
  const sans = recs.filter(r => r.Niveau);
  assert.deepEqual(groupRecords(sans, 'Niveau', 'alpha-desc').map(x => x.key), ['4e', '3e']);
  assert.deepEqual(groupRecords(sans, 'Niveau', 'count-desc').map(x => x.key), ['3e', '4e']);
  assert.deepEqual(groupRecords(sans, 'Niveau', 'count-asc').map(x => x.key), ['4e', '3e']);
});

test('groupRecords sans colonne de groupement renvoie une liste vide', () => {
  assert.deepEqual(groupRecords(recs, '', 'alpha-asc'), []);
  assert.deepEqual(groupRecords([], 'Niveau', 'alpha-asc'), []);
});

test('assignDefaultColors complète sans écraser les couleurs existantes', () => {
  const g = groupRecords(recs, 'Niveau', 'alpha-asc');
  const cols = assignDefaultColors(g, { '3e': '#000000' });
  assert.equal(cols['3e'], '#000000');
  assert.equal(cols['4e'], DEFAULT_PALETTE[1]);
  assert.equal(cols[EMPTY_GROUP_KEY], DEFAULT_PALETTE[2]);
});
