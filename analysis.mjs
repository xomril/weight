export const DAY=86400000;
export const stamp=d=>Date.parse(d+'T00:00:00Z');
export const date=x=>new Date(x).toISOString().slice(0,10);
export const shift=(d,n)=>date(stamp(d)+n*DAY);
export const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
export const median=a=>{if(!a.length)return null;let x=[...a].sort((a,b)=>a-b),i=Math.floor(x.length/2);return x.length%2?x[i]:(x[i-1]+x[i])/2};
export const signed=n=>n==null?'אין מספיק נתונים':(n>0?'+':'')+n.toFixed(2);
export const fmt=d=>d.split('-').reverse().join('.');
export function getDaily(obs,morning=false){let g={};obs.filter(o=>!morning||(o.hour>=4&&o.hour<11)).forEach(o=>(g[o.date]??=[]).push(o.weight));return Object.entries(g).sort(([a],[b])=>a.localeCompare(b)).map(([d,a])=>({date:d,value:median(a),n:a.length}));}
export function windowStats(daily,a,b){let x=daily.filter(d=>a<=d.date&&d.date<=b);return {n:x.length,value:mean(x.map(d=>d.value))};}
export function eventStats(daily,e,n=7){let before=windowStats(daily,shift(e.start,-n),shift(e.start,-1)),during=windowStats(daily,e.start,e.end),after=windowStats(daily,shift(e.end,1),shift(e.end,n));return {before,during,after,delta:before.n>=2&&after.n>=2?after.value-before.value:null};}
export function weekendStats(daily){let g=Object.fromEntries(daily.map(d=>[d.date,d.value]));let pairs=daily.filter(d=>new Date(stamp(d.date)).getUTCDay()===4&&g[shift(d.date,3)]!=null).map(d=>({date:d.date,delta:g[shift(d.date,3)]-d.value}));return {pairs,n:pairs.length,delta:mean(pairs.map(p=>p.delta)),median:median(pairs.map(p=>p.delta)),positive:pairs.filter(p=>p.delta>0).length};}
export function chartData(daily,a,b,rolling=false){let vals=[];for(let t=stamp(a);t<=stamp(b);t+=DAY){let d=date(t),v=daily.find(x=>x.date===d),win=windowStats(daily,shift(d,-6),d);vals.push({x:t,label:fmt(d),value:rolling?(win.n>=3?win.value:null):(v?.value??null),valueLabel:rolling?(win.n>=3?win.value.toFixed(2):'ללא נתונים'):(v?.value.toFixed(2)??'ללא שקילה')});}return vals;}
