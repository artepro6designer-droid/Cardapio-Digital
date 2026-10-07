(()=>{"use strict";
const WA="5517997653073",KEY="docesLuaCartPremiumV2";
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const state={cart:[],filter:"todos",pendingProduct:null};
const el={grid:$("#productsGrid"),count:$("#cartCount"),total:$("#cartTotal"),items:$("#cartItems"),drawer:$("#cartDrawer"),overlay:$("#cartOverlay"),checkout:$("#checkoutButton"),toast:$("#toast"),menuSummary:$("#menuCartSummary"),clearMenu:$("#clearCartMenuButton"),clearDrawer:$("#clearCartDrawerButton"),optionModal:$("#optionModal"),optionTitle:$("#optionModalTitle"),optionSubtitle:$("#optionModalSubtitle"),optionChoices:$("#optionChoices"),optionClose:$("#optionModalClose"),optionCancel:$("#optionModalCancel")};
const money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n),prod=id=>PRODUCTS.find(p=>p.id===id),total=()=>state.cart.reduce((n,x)=>n+((prod(x.id)?.price||0)*x.qty),0),productQty=id=>state.cart.filter(x=>x.id===id).reduce((n,x)=>n+x.qty,0);
function load(){try{const a=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(a)?a.filter(x=>prod(x.id)&&Number.isInteger(x.qty)&&x.qty>0&&prod(x.id).price!=null).map(x=>({...x,option:x.option||null})):[]}catch{return[]}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state.cart))}catch{}}
function renderProducts(){
 const a=PRODUCTS.filter(p=>state.filter==="todos"||p.category===state.filter);
 el.grid.innerHTML=a.map(p=>{const q=productQty(p.id);return `<article class="product-card"><div class="product-card__image"><img src="${p.image}" alt="${p.name} artesanal" loading="lazy"><span class="product-card__tag">${p.tag}</span></div><div class="product-card__body"><span class="product-card__category">${p.categoryLabel}</span><h3>${p.name}</h3><p>${p.description}</p><div class="product-card__bottom"><div><span class="price">${money(p.price)}</span><small class="unit-label">por unidade</small></div><div class="product-action"><button class="add-product-button ${p.options?'has-options':''}" type="button" data-add="${p.id}">${p.options?'Escolher recheio':'Adicionar'}${q?` <span class="mini-qty">${q}</span>`:''}</button></div></div></div></article>`}).join("");
 $$('[data-add]',el.grid).forEach(b=>b.addEventListener('click',()=>{const p=prod(b.dataset.add);p.options?openOptionModal(p):add(b.dataset.add)}));
}
function renderCart(){
 const n=state.cart.reduce((s,x)=>s+x.qty,0),t=total();
 el.count.textContent=n;el.total.textContent=money(t);el.checkout.disabled=!n;el.clearDrawer.disabled=!n;el.clearMenu.disabled=!n;
 if(el.menuSummary)el.menuSummary.textContent=`${n} ${n===1?'item':'itens'} · ${money(t)}`;
 if(!n){el.items.innerHTML='<div class="cart-empty">Sua sacola ainda está vazia.<br><span>Escolha uma delícia para começar ♡</span></div>';return}
 el.items.innerHTML=state.cart.map((x,i)=>{const p=prod(x.id), opt=x.option?`<div class="cart-item__option">Recheio: <strong>${x.option}</strong></div>`:"";return `<article class="cart-item"><img class="cart-item__image" src="${p.image}" alt=""><div><h4>${p.name}</h4>${opt}<div class="cart-item__price">${money(p.price)} cada</div><div class="qty-control"><button type="button" data-c="minus" data-i="${i}" aria-label="Diminuir ${p.name}">−</button><span>${x.qty}</span><button type="button" data-c="plus" data-i="${i}" aria-label="Aumentar ${p.name}">+</button></div><button type="button" class="remove-link" data-c="remove" data-i="${i}">Remover</button></div><strong class="cart-item__subtotal">${money(p.price*x.qty)}</strong></article>`}).join("");
 $$('[data-c]',el.items).forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.i);const a=b.dataset.c;a==='plus'?changeIndex(i,1):a==='minus'?changeIndex(i,-1):removeIndex(i)}));
}
function sync(){save();renderProducts();renderCart()}
function add(id,option=null){const p=prod(id);if(!p)return;const x=state.cart.find(x=>x.id===id&&(x.option||null)===(option||null));if(x)x.qty++;else state.cart.push({id,qty:1,option:option||null});sync();toast(option?`${p.name} · ${option} adicionado ♡`:'Adicionado ao seu pedido ♡')}
function changeIndex(i,n){const x=state.cart[i];if(!x)return;x.qty+=n;if(x.qty<=0)state.cart.splice(i,1);sync()}
function removeIndex(i){if(!state.cart[i])return;state.cart.splice(i,1);sync();toast('Item removido')}
function clearCart(){if(!state.cart.length)return;state.cart=[];sync();toast('Carrinho esvaziado')}
function openOptionModal(p){state.pendingProduct=p;el.optionTitle.textContent=p.name;el.optionSubtitle.textContent=`Escolha o recheio · ${money(p.price)} por unidade`;el.optionChoices.innerHTML=p.options.map(o=>`<button type="button" class="option-choice" data-option="${o}"><span>${o}</span><b>+</b></button>`).join("");el.optionModal.classList.add('is-open');el.optionModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>el.optionChoices.querySelector('button')?.focus(),30);$$('.option-choice',el.optionChoices).forEach(b=>b.addEventListener('click',()=>{const option=b.dataset.option;closeOptionModal();add(p.id,option)}))}
function closeOptionModal(){el.optionModal.classList.remove('is-open');el.optionModal.setAttribute('aria-hidden','true');state.pendingProduct=null;if(!el.drawer.classList.contains('is-open'))document.body.style.overflow=''}
function openCart(){el.drawer.classList.add('is-open');el.overlay.classList.add('is-open');el.drawer.setAttribute('aria-hidden','false');el.overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$("#closeCartButton").focus()}
function closeCart(){el.drawer.classList.remove('is-open');el.overlay.classList.remove('is-open');el.drawer.setAttribute('aria-hidden','true');el.overlay.setAttribute('aria-hidden','true');if(!el.optionModal.classList.contains('is-open'))document.body.style.overflow='';$("#openCartButton").focus()}
function checkout(){if(!state.cart.length)return;const lines=state.cart.map(x=>`• ${x.qty}x ${prod(x.id).name}${x.option?` — Recheio: ${x.option}`:''} — ${money(prod(x.id).price*x.qty)}`);const msg=['Olá, Doces da Lua! 🌙','','Gostaria de realizar o seguinte pedido:','',...lines,'',`Subtotal: ${money(total())}`,'','Podemos confirmar a disponibilidade e combinar a entrega/retirada? ♡'].join('\n');const url=`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,w=window.open(url,'_blank','noopener,noreferrer');if(!w)location.href=url}
let timer;function toast(s){el.toast.textContent=s;el.toast.classList.add('is-visible');clearTimeout(timer);timer=setTimeout(()=>el.toast.classList.remove('is-visible'),2100)}
function init(){
 state.cart=load();$("#currentYear").textContent=new Date().getFullYear();renderProducts();renderCart();
 $("#openCartButton").addEventListener('click',openCart);$("#closeCartButton").addEventListener('click',closeCart);el.overlay.addEventListener('click',closeCart);el.checkout.addEventListener('click',checkout);
 $("#emptyCartButton").addEventListener('click',closeCart);el.clearMenu?.addEventListener('click',clearCart);el.clearDrawer?.addEventListener('click',clearCart);
 el.optionClose?.addEventListener('click',closeOptionModal);el.optionCancel?.addEventListener('click',closeOptionModal);el.optionModal?.addEventListener('click',e=>{if(e.target===el.optionModal)closeOptionModal()});
 $$(".category-pill").forEach(b=>b.addEventListener('click',()=>{$$(".category-pill").forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');state.filter=b.dataset.filter;renderProducts()}));
 let t=$("#menuToggle"),nav=$("#mainNav");function closeMenu(){nav.classList.remove('is-open');t.setAttribute('aria-expanded','false');t.setAttribute('aria-label','Abrir menu')}t.addEventListener('click',()=>{let o=nav.classList.toggle('is-open');t.setAttribute('aria-expanded',String(o));t.setAttribute('aria-label',o?'Fechar menu':'Abrir menu')});$$('a',nav).forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(el.optionModal.classList.contains('is-open'))closeOptionModal();else if(el.drawer.classList.contains('is-open'))closeCart();closeMenu()}});window.addEventListener('resize',()=>{if(innerWidth>1000)closeMenu()})
}
init();
})();
