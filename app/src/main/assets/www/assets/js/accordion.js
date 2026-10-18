document.querySelectorAll('[data-accordion-item] .acc-trigger').forEach(trigger=>{
  trigger.addEventListener('click', ()=>{
    const item = trigger.closest('.acc-item');
    const panel = item.querySelector('.acc-panel');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('[data-accordion-item]').forEach(i=>{
      i.classList.remove('open');
      i.querySelector('.acc-panel').style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});
