// Replace the image paths below with YOUR OWN images in the images/ folder.
const projects = [
  {title:'Equality — Poster Series',category:'Graphic Design / Human Rights',image:'images/equality.svg'},
  {title:'Home Ownership — Poster',category:'Illustration / Campaign',image:'images/housing.svg'},
  {title:'Downtime — Right to Rest',category:'Graphic Design / Poster',image:'images/rest.svg'},
  {title:'Digital Experiences',category:'UX/UI / Web Design',image:'images/ux.svg'}
];
document.querySelector('#project-grid').innerHTML=projects.map(p=>`<article class="project"><img src="${p.image}" alt="${p.title}" loading="lazy"><div class="info"><h3>${p.title}</h3><p>${p.category}</p></div></article>`).join('');
document.querySelector('#year').textContent=new Date().getFullYear();
const canvas=document.querySelector('#aurora'),ctx=canvas.getContext('2d',{alpha:false});let w,h,dpr,time=0,last=0,speed=.4,paused=false;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){dpr=Math.min(window.devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',resize);resize();
const rand=(i)=>{let x=Math.sin(i*127.1+41.7)*43758.5453;return x-Math.floor(x)};
function render(){ctx.fillStyle='#050b17';ctx.fillRect(0,0,w,h);
// Tiny stars behind the translucent moving curtains.
for(let i=0;i<110;i++){let x=rand(i+11)*w,y=rand(i+400)*h*.82;ctx.fillStyle=`rgba(225,243,255,${.12+rand(i+700)*.42})`;ctx.beginPath();ctx.arc(x,y,.3+rand(i+900)*.8,0,Math.PI*2);ctx.fill()}
ctx.save();ctx.globalCompositeOperation='screen';
// Layered flowing aurora curtains. Each is a group of translucent gradient ribbons.
const colors=[[61,244,161],[32,210,216],[108,108,246],[171,82,231]];
for(let layer=0;layer<4;layer++){
 const [r,g,b]=colors[layer];
 for(let band=0;band<18;band++){
  const shift=layer*.65+band*.045;const y0=h*(.10+layer*.045+band*.008);
  ctx.beginPath();
  for(let x=-30;x<=w+30;x+=12){let xx=x/w;let wave=Math.sin(xx*5.8+time*.32+shift)*h*.095+Math.sin(xx*12.1-time*.18+layer)*h*.024;let yy=y0+wave+Math.sin(time*.2+layer)*h*.025;if(x===-30)ctx.moveTo(x,yy);else ctx.lineTo(x,yy)}
  for(let x=w+30;x>=-30;x-=12){let xx=x/w;let wave=Math.sin(xx*5.8+time*.32+shift)*h*.095+Math.sin(xx*12.1-time*.18+layer)*h*.024;let yy=y0+wave+Math.sin(time*.2+layer)*h*.025+h*(.20+Math.sin(xx*6+time*.25+band*.2)*.045);ctx.lineTo(x,yy)}
  ctx.closePath();let gradient=ctx.createLinearGradient(0,y0-h*.06,0,y0+h*.32);gradient.addColorStop(0,`rgba(${r},${g},${b},0)`);gradient.addColorStop(.28,`rgba(${r},${g},${b},${.022+Math.sin(time*.55+band*.2+layer)*.008})`);gradient.addColorStop(.65,`rgba(${r},${g},${b},.012)`);gradient.addColorStop(1,`rgba(${r},${g},${b},0)`);ctx.fillStyle=gradient;ctx.fill();
 }
}
ctx.restore();let fade=ctx.createLinearGradient(0,0,0,h);fade.addColorStop(0,'rgba(5,11,23,.03)');fade.addColorStop(.6,'rgba(5,11,23,.15)');fade.addColorStop(1,'rgba(5,11,23,.8)');ctx.fillStyle=fade;ctx.fillRect(0,0,w,h);
}
function tick(now){if(!last)last=now;let delta=Math.min((now-last)/1000,.05);last=now;if(!paused&&!reduced)time+=delta*speed;render();requestAnimationFrame(tick)}requestAnimationFrame(tick);
const slider=document.querySelector('#speed');slider.addEventListener('input',()=>{speed=Number(slider.value);document.querySelector('#speedValue').textContent=speed.toFixed(1)});document.querySelector('#toggle').addEventListener('click',e=>{paused=!paused;e.currentTarget.textContent=paused?'Play':'Pause';e.currentTarget.setAttribute('aria-pressed',String(paused))});
