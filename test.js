require('./engine.js');const H=globalThis.Holdem;let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}};
const C=s=>s.split(' ').map(x=>H.RANKS.indexOf(x[0])+13*H.SUITS.indexOf(x[1]));
const nm=s=>H.best(C(s)).name;
ok(nm('As Ks Qs Js Ts 2d 3c')==='straight flush','royal');ok(nm('Ah 2d 3c 4s 5h Kd Qc')==='straight','wheel');
ok(nm('Ah Ad Ac Kd Kh 2c 3d')==='full house','boat');ok(nm('2h 4h 6h 8h Th Ad Ac')==='flush','flush');
ok(H.best(C('Ah Ad Kc Qd 9h 3c 2d')).v>H.best(C('Ah Ad Kc Jd 9h 3c 2d')).v,'kicker');
ok(H.best(C('5h 4d 3c 2s Ah 9d 9c')).v<H.best(C('6h 5d 4c 3s 2h 9d 8c')).v,'wheel<6high');
let seed=7;const rng=()=>((seed=seed*16807%2147483647)-1)/2147483646;let hands=0;
for(let t=0;t<40;t++){const G=H.newTable({code:'T',sb:1,bb:2,buyin:200},'h');const n=2+t%8;for(let k=0;k<n;k++)H.sit(G,{uid:'u'+k,name:'p'+k,seat:(k*2+t)%9});
 for(let h=0;h<60;h++){G.seats.forEach(p=>{if(p&&p.stack===0)H.rebuy(G,p.uid)});const tot=()=>G.seats.reduce((a,p)=>a+(p?p.stack:0),0);const before=tot();
  if(H.startHand(G,rng))break;hands++;let guard=0;while(H.inBetting(G)&&guard++<200){const p=G.seats[G.toAct];const r=rng(),toCall=G.curBet-p.bet;
   let e;if(r<.15)e=H.act(G,p.uid,'fold');else if(r<.6)e=H.act(G,p.uid,toCall?'call':'check');else if(r<.9)e=H.act(G,p.uid,'raise',G.curBet+G.minRaise+Math.floor(rng()*20));else e=H.act(G,p.uid,'raise',p.bet+p.stack);
   if(e)e=H.act(G,p.uid,toCall?'call':'check');ok(!e,'act err '+e)}
  ok(G.phase==='showdown','hand ended '+G.phase);ok(tot()===before,`chips ${before}->${tot()} t${t}h${h}`);
  ok(G.seats.every(p=>!p||p.stack>=0),'neg stack');if(fails>5)break}}
const G=H.newTable({code:'X',sb:1,bb:2,buyin:100},'h');H.sit(G,{uid:'a',name:'A',seat:0});H.sit(G,{uid:'b',name:'B',seat:4});H.startHand(G,rng);
ok(H.timeout(G,Date.now()+99999),'timeout');ok(G.phase==='showdown','timeout fold ends hand');
// bote lateral: A all-in 50, B y C 200
const S=H.newTable({code:'S',sb:1,bb:2,buyin:200},'h');['a','b','c'].forEach((u,k)=>H.sit(S,{uid:u,name:u,seat:k}));S.seats[0].stack=50;H.startHand(S,rng);
while(H.inBetting(S)){const p=S.seats[S.toAct];H.act(S,p.uid,'raise',p.bet+p.stack)||0}
ok(S.results.pots.length>=2,'side pot created: '+S.results.pots.map(p=>p.amount));ok(S.seats.reduce((a,p)=>a+(p?p.stack:0),0)===450,'side pot chips');
console.log(hands+' hands simulated; '+(fails?fails+' failures':'all engine tests passed'));
