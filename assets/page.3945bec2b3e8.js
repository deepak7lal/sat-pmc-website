'use strict';
document.documentElement.classList.add('js-enabled');
const menu=document.querySelector('.menu-toggle');
const navigation=document.getElementById('navigation');
function closeNavigation(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');navigation.classList.remove('open');navigation.querySelectorAll('.nav-projects[open]').forEach(dropdown=>{dropdown.open=false;});}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeNavigation));
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeNavigation();});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const dropdown=navigation.querySelector('.nav-projects[open]');if(dropdown){dropdown.open=false;dropdown.querySelector('summary').focus();}else if(menu.getAttribute('aria-expanded')==='true'){closeNavigation();menu.focus();}});
navigation.querySelectorAll('.nav-projects').forEach(dropdown=>dropdown.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!dropdown.contains(document.activeElement))dropdown.open=false;})));
window.matchMedia('(min-width: 1051px)').addEventListener('change',event=>{if(event.matches)closeNavigation();});
