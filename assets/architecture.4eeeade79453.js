/* A self-contained orthographic 3D architectural scene. No external assets or libraries. */
(()=>{
  'use strict';
  const canvas=document.getElementById('architecture-model');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const explodeButton=document.getElementById('model-explode');
  const pauseButton=document.getElementById('model-pause');
  const resetButton=document.getElementById('model-reset');
  const status=document.getElementById('model-view');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,scale=1,rotation=-.65,elevation=.53;
  let exploded=false,expansion=0,paused=motion.matches,visible=true;
  let dragging=false,lastX=0,lastY=0,pointerId=null,frame=0,previousTime=0;
  let projectionAngle=rotation,drawables=[],layer=0;
  const palette={top:'#c2dfcc',front:'#5c9b91',side:'#39716f',glassTop:'#629b94',glassFront:'#285764',glassSide:'#1c424f',edge:'#9ac8b166'};

  function project(point){
    const [x,y,z]=point;
    const rx=x*Math.cos(projectionAngle)+z*Math.sin(projectionAngle);
    const rz=-x*Math.sin(projectionAngle)+z*Math.cos(projectionAngle);
    return {x:width*.51+rx*scale,y:height*.69+(-y*Math.cos(elevation)+rz*Math.sin(elevation))*scale,depth:rz*Math.cos(elevation)+y*Math.sin(elevation)};
  }
  function polygon(points,fill,stroke=palette.edge,lineWidth=.65){
    const projected=points.map(project);
    drawables.push({points:projected,depth:projected.reduce((sum,p)=>sum+p.depth,0)/projected.length,fill,stroke,lineWidth,layer});
  }
  function line(points,color,lineWidth=1){polygon(points,null,color,lineWidth);}
  function box(x,y,z,w,h,d,colors=palette){
    const left=x-w/2,right=x+w/2,back=z-d/2,front=z+d/2,top=y+h;
    polygon([[left,y,front],[right,y,front],[right,top,front],[left,top,front]],colors.front);
    polygon([[right,y,back],[left,y,back],[left,top,back],[right,top,back]],colors.side);
    polygon([[left,y,back],[left,y,front],[left,top,front],[left,top,back]],colors.side);
    polygon([[right,y,front],[right,y,back],[right,top,back],[right,top,front]],colors.side);
    polygon([[left,top,front],[right,top,front],[right,top,back],[left,top,back]],colors.top);
  }
  function tower(x,z,w,d,levels,floorHeight){
    const gap=expansion*9;
    for(let level=0;level<levels;level++){
      const y=level*(floorHeight+gap)+4;
      box(x,y,z,w-5,floorHeight-4,d-5,{top:palette.glassTop,front:level%3===1?'#346773':palette.glassFront,side:palette.glassSide});
      box(x,y+floorHeight-4,z,w+5,3.5,d+5);
      for(let index=0;index<=4;index++){
        const cx=x-w/2+index*w/4;
        for(const cz of [z-d/2-.1,z+d/2+.1]){
          line([[cx,y,cz],[cx,y+floorHeight-4,cz]],'#93c1ad',.75);
        }
      }
      for(const cz of [z-d/4,z,z+d/4]){
        for(const cx of [x-w/2-.1,x+w/2+.1])line([[cx,y,cz],[cx,y+floorHeight-4,cz]],'#75a698',.6);
      }
    }
    const roofY=levels*(floorHeight+gap)+2-gap;
    box(x+8,roofY,z-6,w*.4,8,d*.38,{top:'#bad8c4',front:'#4c8379',side:'#37685f'});
  }
  function tree(x,z){
    box(x,0,z,3,12,3,{top:'#8eb79e',front:'#527b65',side:'#315f53'});
    box(x,12,z,13,16,13,{top:'#98c29a',front:'#598b70',side:'#3f715e'});
    box(x,28,z,9,4,9,{top:'#b2d2a9',front:'#83af8d',side:'#59876a'});
  }
  function buildScene(){
    drawables=[];layer=0;
    // A fine drafting grid anchors the model without becoming a background image.
    for(let n=-240;n<=240;n+=30)line([[n,-14,-165],[n,-14,165]],'#8cbba21c',.55);
    for(let n=-165;n<=165;n+=30)line([[-240,-14,n],[240,-14,n]],'#8cbba21c',.55);
    line([[-205,-13,-145],[205,-13,-145],[205,-13,145],[-205,-13,145],[-205,-13,-145]],'#94c3aa4d',.7);
    box(0,-12,0,360,12,245,{top:'#214b4f',front:'#1b4047',side:'#173841'});
    // Paving, planting strips and entrance steps.
    box(0,.2,101,245,1,32,{top:'#72988a',front:'#456e63',side:'#35594f'});
    box(-137,.2,-8,25,1,180,{top:'#527d63',front:'#355b4b',side:'#315447'});
    box(137,.2,-8,25,1,180,{top:'#527d63',front:'#355b4b',side:'#315447'});
    for(let i=0;i<3;i++)box(0,-9+i*3,134-i*5,86,3,20,{top:'#6f9988',front:'#365f59',side:'#2a514d'});
    layer=1;
    tower(-65,-35,86,82,9,23);
    tower(65,-39,76,74,7,24);
    // The connecting bridge and lower entrance pavilion make one coherent campus.
    const bridgeY=77+expansion*27;
    box(2,bridgeY,0,54,14,25,{top:'#b9dbc4',front:'#6d9f93',side:'#3c756f'});
    for(let i=0;i<5;i++)line([[-20+i*11,bridgeY,12.6],[-20+i*11,bridgeY+14,12.6]],'#c5dfc8',.7);
    tower(-7,77,196,52,2,22);
    for(const [x,z] of [[-137,-84],[-137,-28],[-137,35],[137,-86],[137,-29],[137,35],[-115,105],[112,105]])tree(x,z);
    // Small perimeter lighting gives the site plan scale.
    for(const x of [-170,170])for(const z of [-105,90]){
      line([[x,0,z],[x,30,z]],'#8bb6a5',1);
      box(x,30,z,5,2,5,{top:'#e1ecd0',front:'#b7ceab',side:'#92b391'});
    }
  }
  function render(){
    ctx.clearRect(0,0,width,height);
    projectionAngle=rotation;
    scale=Math.min(width/530,height/(430+expansion*60));
    const glow=ctx.createRadialGradient(width*.5,height*.6,10,width*.5,height*.6,width*.46);
    glow.addColorStop(0,'#81baa312');glow.addColorStop(1,'#81baa300');
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    buildScene();
    drawables.sort((a,b)=>a.layer-b.layer||a.depth-b.depth);
    for(const face of drawables){
      ctx.beginPath();face.points.forEach((p,index)=>{if(index===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});
      if(face.fill){ctx.closePath();ctx.fillStyle=face.fill;ctx.fill();}
      if(face.stroke){ctx.strokeStyle=face.stroke;ctx.lineWidth=face.lineWidth;ctx.lineJoin='round';ctx.stroke();}
    }
  }
  function tick(now){
    frame=0;
    // Keep the architectural orbit smooth without redrawing at a display's full refresh rate.
    if(previousTime&&now-previousTime<32&&visible&&!document.hidden){frame=requestAnimationFrame(tick);return;}
    const delta=previousTime?Math.min(now-previousTime,50):16;
    previousTime=now;
    // A constant angular speed gives a seamless full orbit, without reversal or dwell.
    if(!paused&&!dragging)rotation=(rotation+delta*.00014)%(Math.PI*2);
    const target=exploded?1:0;
    if(motion.matches)expansion=target;
    else expansion+=(target-expansion)*Math.min(1,delta/135);
    if(Math.abs(target-expansion)<.001)expansion=target;
    render();
    if(visible&&!document.hidden&&(!paused||expansion!==target))frame=requestAnimationFrame(tick);
  }
  function requestRender(){if(!frame){previousTime=0;frame=requestAnimationFrame(tick);}}
  function resize(){
    const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);requestRender();
  }
  function updatePauseButton(){
    pauseButton.setAttribute('aria-pressed',String(paused));
    pauseButton.setAttribute('aria-label',paused?'Play model animation':'Pause model animation');
    pauseButton.innerHTML=`<span aria-hidden="true">${paused?'▷':'Ⅱ'}</span>`;
  }
  function togglePause(){paused=!paused;updatePauseButton();requestRender();}
  function reset(){
    rotation=-.65;elevation=.53;exploded=false;paused=motion.matches;
    updatePauseButton();
    explodeButton.setAttribute('aria-pressed','false');
    explodeButton.innerHTML='<span aria-hidden="true">▱</span> Explore the structure';
    status.textContent='Assembled view';requestRender();
  }
  explodeButton.addEventListener('click',()=>{
    exploded=!exploded;explodeButton.setAttribute('aria-pressed',String(exploded));
    explodeButton.innerHTML=`<span aria-hidden="true">▱</span> ${exploded?'Reassemble the design':'Explore the structure'}`;
    status.textContent=exploded?'Exploded view':'Assembled view';requestRender();
  });
  pauseButton.addEventListener('click',togglePause);resetButton.addEventListener('click',reset);
  canvas.addEventListener('pointerdown',event=>{
    if(event.button!==0||!event.isPrimary)return;
    dragging=true;pointerId=event.pointerId;lastX=event.clientX;lastY=event.clientY;
    canvas.setPointerCapture(event.pointerId);requestRender();
  });
  canvas.addEventListener('pointermove',event=>{
    if(!dragging||event.pointerId!==pointerId)return;
    rotation+=(event.clientX-lastX)*.009;
    if(event.pointerType!=='touch')elevation=Math.max(.3,Math.min(.85,elevation+(event.clientY-lastY)*.004));
    lastX=event.clientX;lastY=event.clientY;requestRender();
  });
  function releasePointer(event){if(event.pointerId===pointerId){dragging=false;pointerId=null;requestRender();}}
  canvas.addEventListener('pointerup',releasePointer);canvas.addEventListener('pointercancel',releasePointer);canvas.addEventListener('lostpointercapture',releasePointer);
  canvas.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home',' '].includes(event.key))return;
    event.preventDefault();
    if(event.key==='ArrowLeft')rotation-=.15;
    if(event.key==='ArrowRight')rotation+=.15;
    if(event.key==='ArrowUp')elevation=Math.min(.85,elevation+.06);
    if(event.key==='ArrowDown')elevation=Math.max(.3,elevation-.06);
    if(event.key==='Home')reset();
    if(event.key===' ')togglePause();
    requestRender();
  });
  motion.addEventListener('change',event=>{paused=event.matches;updatePauseButton();requestRender();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else requestRender();});
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas.parentElement);
  else window.addEventListener('resize',resize);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible)requestRender();else {cancelAnimationFrame(frame);frame=0;}
  }).observe(canvas);
  updatePauseButton();resize();
})();
