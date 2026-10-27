// Le contexte pilote uniquement l'interface. Les ACL Grist restent autoritaires.
export function tableRows(data) {
  if (Array.isArray(data)) return data;
  if (!data || !Array.isArray(data.id)) throw new Error('Format de table inattendu');
  return data.id.map((id, i) => Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? value[i] : value]).concat([['id', id]])
  ));
}
export async function loadContext(docApi) {
  let id;
  const tables = tableRows(await docApi.fetchTable('_grist_Tables'));
  const matches = tables.filter(t => String(t.tableId || '').replace(/[^a-z0-9]/gi, '').toLowerCase() === 'contextewidget');
  if (matches.length !== 1) throw new Error('Table Contexte Widget introuvable ou ambiguë.');
  const tableId = matches[0].tableId;
  try {
    const result = await docApi.applyUserActions([['AddRecord', tableId, null, {}]]);
    const values = result?.retValues ?? (Array.isArray(result) ? result : null);
    id = Number(values?.[0]);
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Identifiant de contexte non retourné par Grist.');
    const rows = tableRows(await docApi.fetchTable(tableId));
    const row = rows.find(r => Number(r.id) === id);
    if (!row || typeof row.Email_Contexte !== 'string' || !row.Email_Contexte ||
        !['owners', 'editors', 'viewers'].includes(row.Acces_Contexte)) {
      throw new Error('Contexte utilisateur incomplet ou inaccessible.');
    }
    return {email: row.Email_Contexte, access: row.Acces_Contexte};
  } finally {
    if (Number.isSafeInteger(id) && id > 0) {
      try { await docApi.applyUserActions([['RemoveRecord', tableId, id]]); }
      catch (error) { console.warn('La ligne de contexte temporaire n’a pas pu être supprimée.', error); }
    }
  }
}
export function uiPermissions(context, user, resource, diffusion) {
  const denied = {resource: false, expiry: false};
  if (!context || !resource || !diffusion || context.access === 'viewers') return denied;
  const owner = context.access === 'owners';
  if (!owner && !user) return denied;
  const rawRoles = user?.Roles;
  const roles = Array.isArray(rawRoles) ? rawRoles.filter(x => x !== 'L') : [];
  const admin = roles.includes('Admin');
  const email = String(context.email || '').toLowerCase();
  const same = value => !!value && String(value).toLowerCase() === email;
  const ownResource = same(resource.Cree_par) || same(resource.Email_proprietaire);
  const resourceEdit = owner || admin || ownResource;
  const expiryEdit = owner || admin ||
    (roles.includes('Intervenant') && same(diffusion.Email_proprietaire_ressource)) ||
    (roles.includes('NFS admin') && same(diffusion.Cree_par)) ||
    (roles.includes('NFS') && same(diffusion.Cree_par) && same(diffusion.Email_proprietaire_ressource));
  return {resource: resourceEdit, expiry: expiryEdit};
}
