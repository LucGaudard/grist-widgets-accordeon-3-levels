// Logique pure du widget « Vue groupée » : aucun accès au DOM ni à l'API Grist,
// pour que ces fonctions soient testables hors navigateur (voir test/).

export const EMPTY_GROUP_KEY = '';

export const DEFAULT_PALETTE = [
  '#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6',
  '#ec4899','#06b6d4','#84cc16','#f97316','#6366f1',
];

// Les couleurs sont interpolées dans un attribut style= construit en innerHTML :
// elles doivent être strictement validées, jamais échappées seulement.
export const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;').replace(/`/g,'&#96;');
}

export function safeColor(c, fallback = '#94a3b8') {
  return (typeof c === 'string' && HEX_COLOR.test(c)) ? c : fallback;
}

// Filtre les options stockées dans le document : seules des couleurs
// hexadécimales valides sont conservées, sur un objet sans prototype.
export function sanitizeColors(raw) {
  const out = Object.create(null);
  let obj;
  try { obj = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { return out; }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return out;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && HEX_COLOR.test(v)) out[k] = v;
  }
  return out;
}

// Regroupe les enregistrements par la colonne groupBy, puis trie les groupes.
// Le groupe des valeurs vides est toujours placé en dernier, quel que soit le tri.
export function groupRecords(records, groupBy, sortMode) {
  if (!groupBy) return [];
  const map = new Map();
  records.forEach(rec => {
    const raw = rec[groupBy];
    const key = (raw == null || raw === '') ? EMPTY_GROUP_KEY : String(raw);
    if (!map.has(key)) map.set(key, { key, label: raw, records: [] });
    map.get(key).records.push(rec);
  });
  const groups = Array.from(map.values());
  groups.sort((a, b) => {
    if (a.key === EMPTY_GROUP_KEY) return  1;
    if (b.key === EMPTY_GROUP_KEY) return -1;
    if (sortMode === 'alpha-asc')  return String(a.label).localeCompare(String(b.label), 'fr');
    if (sortMode === 'alpha-desc') return String(b.label).localeCompare(String(a.label), 'fr');
    if (sortMode === 'count-desc') return b.records.length - a.records.length;
    if (sortMode === 'count-asc')  return a.records.length - b.records.length;
    return 0;
  });
  return groups;
}

// Complète colColors : chaque groupe sans couleur reçoit une couleur de la palette.
// Modifie colColors sur place et le renvoie.
export function assignDefaultColors(groups, colColors, palette = DEFAULT_PALETTE) {
  groups.forEach((g, i) => {
    if (!colColors[g.key]) colColors[g.key] = palette[i % palette.length];
  });
  return colColors;
}
