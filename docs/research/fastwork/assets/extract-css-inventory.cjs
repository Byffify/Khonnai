const fs = require('node:fs');
const path = require('node:path');
function parse(text, context=[], out=[]) {
 let i=0;
 while(i<text.length) {
  let start=i, quote='', round=0;
  for(;i<text.length;i++) { const c=text[i]; if(quote){if(c===quote&&text[i-1]!=='\\')quote='';continue;} if(c==='"'||c==="'"){quote=c;continue;} if(c==='(')round++; if(c===')')round--; if(c==='{'&&!round)break; }
  if(i>=text.length)break;
  const selector=text.slice(start,i).trim(); const b=++i; let depth=1;quote='';
  for(;i<text.length&&depth;i++){const c=text[i];if(quote){if(c===quote&&text[i-1]!=='\\')quote='';continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='{')depth++;if(c==='}')depth--;}
  const body=text.slice(b,i-1);
  if(selector.startsWith('@media')||selector.startsWith('@supports')||selector.startsWith('@layer'))parse(body,[...context,selector],out);
  else out.push({selector,context,body});
 }
 return out;
}
const files=['selling.css','global.css','controls.css'];
const result={};
for(const file of files){const text=fs.readFileSync(path.join(__dirname,file),'utf8');const rules=parse(text);result[file]={rules:rules.length,keyframes:rules.filter(r=>r.selector.startsWith('@keyframes')),motion:rules.filter(r=>/(?:^|;)(?:animation|transition)(?:-[a-z-]+)?:/.test(r.body)),media:[...new Set(rules.flatMap(r=>r.context).filter(s=>s.startsWith('@media')))],tokens:rules.filter(r=>r.selector.includes(':root')).map(r=>({selector:r.selector,context:r.context,tokens:[...r.body.matchAll(/(--[\w-]+):([^;]+)(?:;|$)/g)].map(m=>({name:m[1],value:m[2]}))}))};}
fs.writeFileSync(path.join(__dirname,'css-inventory.json'),JSON.stringify(result,null,2)+'\n');
for(const [file,data] of Object.entries(result))console.log(file,JSON.stringify({rules:data.rules,keyframes:data.keyframes.length,motionRules:data.motion.length,media:data.media}));
let appendix='\n';
for(const [file,data] of Object.entries(result)){
 appendix+=`\n### ${file}\n\n| Keyframe | Properties ที่เปลี่ยน | Static animation bindings |\n|---|---|---|\n`;
 for(const k of data.keyframes){
  const name=k.selector.replace('@keyframes ','');
  const props=[...new Set([...k.body.matchAll(/(?:\{|;)([\w-]+):/g)].map(m=>m[1]))].join(', ');
  const bind=[];
  for(const r of data.motion){if(r.context.some(c=>c.includes('prefers-reduced-motion:reduce')))continue; for(const m of r.body.matchAll(/(?:^|;)animation:([^;]+)/g)){if(m[1].split(/[\s,]+/).includes(name))bind.push('`'+m[1]+'`'+(r.context.length?' ('+r.context.join('; ')+')':''));}}
  appendix+=`| \`${name}\` | ${props} | ${[...new Set(bind)].join('<br>')||'ไม่พบ binding ใน CSS'} |\n`;
 }
}
fs.writeFileSync(path.join(__dirname,'keyframe-appendix.md'),appendix);
