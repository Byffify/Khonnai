// One-time source migration. Runtime translation remains explicit React rendering, never DOM mutation.
const ts = require('typescript'), fs = require('node:fs');
const targets = {
  'src/App.tsx': ['App'],
  'src/ui.tsx': ['Button','BackButton','FormFailure','Field','EmptyState','Notice','Form'],
  'src/ConfirmDialog.tsx': ['ConfirmDialog'],
  'src/StockStatus.tsx': ['StockStatus'],
  'src/features/Catalog.tsx': ['Catalog','ProductView','VariantView','ProductForm'],
  'src/features/Transactions.tsx': ['ItemsEditor','Bills','Reservations','Returns'],
  'src/features/Settings.tsx': ['Settings'],
  'src/features/BillArchive.tsx': ['BillArchive'],
  'src/features/CashReceipt.tsx': ['CashReceipt'],
};
function cleanJsx(value) {
  const lines=value.split(/\r\n|\n|\r/);let last=0,result='';
  lines.forEach((line,i)=>{if(/[^ \t]/.test(line))last=i});
  lines.forEach((line,i)=>{let text=line.replace(/\t/g,' ');if(i!==0)text=text.replace(/^ +/,'');if(i!==lines.length-1)text=text.replace(/ +$/,'');if(text)result+=text+(i!==last?' ':'')});
  return result;
}
for (const [path,names] of Object.entries(targets)) {
  const source=fs.readFileSync(path,'utf8'),sf=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true), edits=[], owners=new Set();
  function owner(node){for(let p=node;p;p=p.parent)if(ts.isFunctionDeclaration(p)&&names.includes(p.name?.text))return p;return null}
  function imperative(node){for(let p=node.parent;p;p=p.parent){if(ts.isFunctionDeclaration(p))break;if(ts.isNewExpression(p))return true;if(ts.isCallExpression(p)){const name=p.expression.getText(sf).split('.').pop();if(/^(?:set[A-Z]|useState|useMemo|useEffect|ask$|report$)/.test(name))return true}}return false}
  function walk(node){
    const fn=owner(node);let expression;
    if(fn&&!imperative(node)) {
      if(ts.isJsxText(node)&&/[\u0e00-\u0e7f]/.test(node.text)) expression='{t('+JSON.stringify(cleanJsx(node.text))+')}';
      else if((ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))&&/[\u0e00-\u0e7f]/.test(node.text)&&!['แพ็ก','ร่าง'].includes(node.text)) {
        expression='t('+JSON.stringify(node.text)+')';if(ts.isJsxAttribute(node.parent))expression='{'+expression+'}';
      } else if(ts.isTemplateExpression(node)) {
        const key=node.head.text+node.templateSpans.map((span,i)=>'{'+i+'}'+span.literal.text).join('');
        if(/[\u0e00-\u0e7f]/.test(key))expression='t('+JSON.stringify(key)+', '+node.templateSpans.map(span=>span.expression.getText(sf)).join(', ')+')';
      }
    }
    if(expression){edits.push({start:node.getStart(sf),end:node.end,text:expression});owners.add(fn);return}
    ts.forEachChild(node,walk);
  }
  walk(sf);
  for(const fn of owners)edits.push({start:fn.body.getStart(sf)+1,end:fn.body.getStart(sf)+1,text:'\n  const { t } = useI18n()\n'});
  if(owners.size)edits.push({start:0,end:0,text:"import { useI18n } from '"+(path.includes('/features/')?'../':'./')+"languageContext'\n"});
  let output=source;for(const edit of edits.sort((a,b)=>b.start-a.start))output=output.slice(0,edit.start)+edit.text+output.slice(edit.end);
  fs.writeFileSync(path,output);
  console.log(path+': '+edits.length+' explicit render changes');
}
