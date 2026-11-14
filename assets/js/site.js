/* GRANIQ site interactions: nav, reveal, collection filter + stone detail, enquiry form */
(function(){
  var d=document, b=d.body;
  // header shadow + mobile nav
  var hdr=d.querySelector('.hdr'), burger=d.querySelector('.burger');
  var onScroll=function(){hdr&&hdr.classList.toggle('scrolled',window.scrollY>8)}; onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
  if(burger){burger.addEventListener('click',function(){var o=b.classList.toggle('nav-open');burger.setAttribute('aria-expanded',o)});}
  // reveal on scroll
  var rv=d.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});rv.forEach(function(el){io.observe(el)});}
  else rv.forEach(function(el){el.classList.add('in')});
  // collection
  var grid=d.getElementById('grid');
  if(grid&&window.STONES){
    var btns=d.querySelectorAll('.filters button');
    var setF=function(f){btns.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.filter===f)});
      grid.querySelectorAll('.card').forEach(function(c){c.hidden=!(f==='all'||c.dataset.fam===f)})};
    btns.forEach(function(x){x.addEventListener('click',function(){setF(x.dataset.filter)})});
    var dlg=d.getElementById('stoneDlg'), inner=d.getElementById('sdInner');
    var esc=function(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
    var chips=function(a){return '<div class="chips">'+a.map(function(x){return '<span class="chip">'+esc(x)+'</span>'}).join('')+'</div>'};
    var open=function(id,push){var s=window.STONES[id]; if(!s) return;
      var apps=s.appk.map(function(k,i){return '<span class="chip"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">'+window.ICONS[k]+'</svg>'+esc(s.app[i])+'</span>'}).join('');
      inner.innerHTML='<div class="sd-media"><img class="main" src="'+s.img_s+'" srcset="'+s.img_s+' 900w, '+s.img+' 1600w" sizes="(max-width:900px) 94vw, 650px" alt="'+esc(s.name)+' granite slab, polished"><img class="cu" src="'+s.cu+'" alt="'+esc(s.name)+' close-up" loading="lazy">'+(s.own?'<span class="badge lbl">Our slab · polished</span>':'<span class="badge lbl">Polished</span>')+'</div>'+
       '<div class="sd-body"><div class="eyebrow">'+esc(s.family)+'</div><h2 id="sdName">'+esc(s.name)+'</h2><div class="fam">'+esc(s.fam)+'</div><p class="line">'+esc(s.line)+'</p>'+
       '<div class="kv"><span>Finishes</span>'+chips(s.fin)+'</div>'+
       '<div class="kv"><span>Formats</span>'+chips(s.prod)+'</div>'+
       '<div class="kv"><span>Sizes</span><div>Slabs: '+esc(window.SLAB_SIZE)+'<br>Thickness: '+esc(window.THICK)+(s.slab?'<br><small style="color:#8a8174">Photographed slab: '+esc(s.slab)+'</small>':'')+'<br><a class="link" style="font-size:10.5px" href="collection.html#sizes" data-close>All sizes &amp; formats</a></div></div>'+
       '<div class="kv"><span>Applications</span><div class="chips">'+apps+'</div></div>'+
       (s.app_img?'<div class="sd-app"><img src="'+s.app_img+'" alt="'+esc(s.name)+' in use" loading="lazy"></div>':'')+
       '<div class="sd-actions"><a class="btn solid" href="contact.html?stone='+encodeURIComponent(s.name)+'">Enquire about '+esc(s.name)+'</a><button class="btn" type="button" data-close>Back to collection</button></div>'+
       (s.cred?'<p class="sd-cred">'+esc(s.cred)+'</p>':'')+'</div>';
      if(dlg.showModal){dlg.showModal()}else{dlg.setAttribute('open','')}
      if(push!==false) history.replaceState(null,'','#'+id);
    };
    var close=function(){dlg.close?dlg.close():dlg.removeAttribute('open')};
    grid.addEventListener('click',function(e){var c=e.target.closest('.card'); if(c) open(c.dataset.stone)});
    dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.closest('[data-close]')||e.target.closest('.sd-close')){if(e.target.closest('a[href*="#sizes"]')){close();return}close()}});
    dlg.addEventListener('close',function(){history.replaceState(null,'',location.pathname+location.search)});
    var h=location.hash.slice(1); if(h&&window.STONES[h]) open(h,false);
  }
  // enquiry form: prefill stone; mailto fallback until an endpoint is wired up
  var f=d.getElementById('enq');
  if(f){
    var q=new URLSearchParams(location.search).get('stone'), sel=d.getElementById('f-stone');
    if(q&&sel){for(var i=0;i<sel.options.length;i++){if(sel.options[i].text===q){sel.selectedIndex=i}}}
    f.addEventListener('submit',function(e){
      if(!f.checkValidity()){e.preventDefault();f.reportValidity();return}
      if(f.dataset.endpoint){return} // [Placeholder] once data-endpoint is set, post to it instead
      e.preventDefault();
      var lines=[];Array.prototype.forEach.call(f.elements,function(el){if(el.name&&el.value&&el.type!=='checkbox')lines.push(el.name+': '+el.value)});
      var subj='Enquiry'+(sel&&sel.value?' – '+sel.value:'')+' (website)';
      location.href='mailto:'+f.action.replace('mailto:','')+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(lines.join('\n'));
    });
  }
})();
