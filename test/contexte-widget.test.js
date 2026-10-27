import test from 'node:test';
import assert from 'node:assert/strict';
import {loadContext, uiPermissions} from '../contexte-widget.js';
test('chaque instance lit puis supprime uniquement sa ligne temporaire', async () => {
  let next=0; const actions=[], rows=new Map();
  const api={async applyUserActions(a){actions.push(a[0]); if(a[0][0]==='AddRecord'){const id=++next;rows.set(id,{id,Email_Contexte:`u${id}@test.fr`,Acces_Contexte:'editors'});return {retValues:[id]};} rows.delete(a[0][2]);return {retValues:[null]};},async fetchTable(name){return name==='_grist_Tables' ? [{id:99,tableId:'Contexte_Widget'}] : [...rows.values()];}};
  const [a,b]=await Promise.all([loadContext(api),loadContext(api)]);
  assert.equal(a.email,'u1@test.fr');assert.equal(b.email,'u2@test.fr');assert.equal(rows.size,0);assert.equal(actions[0][1],'Contexte_Widget');
  assert.deepEqual(actions.filter(x=>x[0]==='RemoveRecord').map(x=>x[2]).sort(),[1,2]);
});
test('supprime la ligne si la lecture échoue',async()=>{const calls=[];const api={async applyUserActions(a){calls.push(a[0]);return {retValues:[7]};},async fetchTable(name){if(name==='_grist_Tables')return [{id:1,tableId:'Contexte_widget'}];throw Error('accès refusé');}};await assert.rejects(loadContext(api));assert.deepEqual(calls[1],['RemoveRecord','Contexte_widget',7]);});
test('droits séparés : créatrice NFS sans propriété et lecteur',()=>{
 const res={Cree_par:'pen@test.fr',Email_proprietaire:'jac@test.fr'};const diff={Cree_par:'pen@test.fr',Email_proprietaire_ressource:'jac@test.fr'};
 assert.deepEqual(uiPermissions({email:'pen@test.fr',access:'editors'},{Roles:['L','NFS']},res,diff),{resource:true,expiry:false});
 assert.deepEqual(uiPermissions({email:'pen@test.fr',access:'viewers'},{Roles:['L','NFS']},res,diff),{resource:false,expiry:false});
 assert.deepEqual(uiPermissions({email:'jac@test.fr',access:'editors'},{Roles:['L','Intervenant']},res,diff),{resource:true,expiry:true});
 assert.deepEqual(uiPermissions({email:'luc@test.fr',access:'owners'},null,res,diff),{resource:true,expiry:true});
 assert.deepEqual(uiPermissions({email:'pen@test.fr',access:'editors'},{Roles:['L','NFS']},null,diff),{resource:false,expiry:false});
});
