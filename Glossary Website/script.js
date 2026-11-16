
const products = [
 {id:1,name:"Organic Avocados",category:"vegetables",price:2.49,oldPrice:3.2,unit:"2 pcs",rating:4.9,tag:"BESTSELLER",image:"photo-1523049673857-eb18f1d7b578"},
 {id:2,name:"Sweet Strawberries",category:"fruits",price:4.2,oldPrice:5.5,unit:"250 g",rating:4.8,tag:"FRESH PICK",image:"photo-1464965911861-746a04b4bca6"},
 {id:3,name:"Farm Fresh Milk",category:"dairy",price:3.1,oldPrice:null,unit:"1 litre",rating:4.9,tag:"",image:"photo-1563636619-e9143da7973b"},
 {id:4,name:"Sourdough Bread",category:"bakery",price:4.75,oldPrice:null,unit:"1 loaf",rating:4.7,tag:"ARTISAN",image:"photo-1585478259715-876acc5be8eb"},
 {id:5,name:"Garden Tomatoes",category:"vegetables",price:2.2,oldPrice:2.8,unit:"500 g",rating:4.8,tag:"SAVE 20%",image:"photo-1546094096-0df4bcaaa337"},
 {id:6,name:"Sweet Bananas",category:"fruits",price:1.8,oldPrice:null,unit:"bunch",rating:4.8,tag:"",image:"photo-1571771894821-ce9b6c11b08e"},
 {id:7,name:"Free Range Eggs",category:"dairy",price:3.6,oldPrice:4.1,unit:"6 pack",rating:4.9,tag:"FARM FRESH",image:"photo-1506976785307-8732e854ad03"},
 {id:8,name:"Baby Spinach",category:"vegetables",price:2.75,oldPrice:null,unit:"150 g",rating:4.7,tag:"ORGANIC",image:"photo-1576045057995-568f588f82fb"},
 {id:9,name:"Juicy Oranges",category:"fruits",price:3.25,oldPrice:null,unit:"1 kg",rating:4.8,tag:"",image:"photo-1547514701-42782101795e"},
 {id:10,name:"Creamy Greek Yogurt",category:"dairy",price:3.95,oldPrice:null,unit:"400 g",rating:4.8,tag:"",image:"photo-1488477181946-6428a0291777"},
 {id:11,name:"Fresh Chicken Breast",category:"meat",price:7.9,oldPrice:9.5,unit:"500 g",rating:4.9,tag:"SAVE 15%",image:"photo-1604503468506-a8da13d82791"},
 {id:12,name:"Butter Croissants",category:"bakery",price:3.4,oldPrice:null,unit:"2 pcs",rating:4.8,tag:"BAKED TODAY",image:"photo-1555507036-ab1f4038808a"}
];
const categories = [
 {id:"vegetables",name:"Vegetables",count:"Garden fresh",image:"photo-1540420773420-3366772f4999"},
 {id:"fruits",name:"Fruits",count:"Naturally sweet",image:"photo-1610832958506-aa56368176cf"},
 {id:"dairy",name:"Dairy & eggs",count:"Everyday essentials",image:"photo-1628088062854-d1870b4553da"},
 {id:"bakery",name:"Bakery",count:"Freshly baked",image:"photo-1509440159596-0249088772ff"},
 {id:"meat",name:"Meat & poultry",count:"Quality cuts",image:"photo-1607623814075-e51df1bdc82f"}
];
const reviews = [
 {name:"Emily Parker",city:"Happy customer",text:"The produce is always beautiful and fresh. Ordering my weekly groceries has become the easiest part of my week.",image:"photo-1534528741775-53994a69daeb"},
 {name:"James Wilson",city:"Customer since 2022",text:"Really thoughtful packaging, lovely quality, and delivery is always smooth. The strawberries are a family favorite!",image:"photo-1500648767791-00dcc994a43e"},
 {name:"Sofia Bennett",city:"Happy customer",text:"I love finding seasonal products here. The prices are fair and everything feels carefully selected. Highly recommend.",image:"photo-1531123897727-8f129e1688ce"}
];
const imageUrl = (id,w=600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const money = n => `$${n.toFixed(2)}`;
let activeCategory = "all", searchTerm = "", shownCount = 8, cart = {}, wishlist = new Set(), toastTimer;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function renderCategories(){
 $("#categoriesGrid").innerHTML = categories.map(c=>`<button class="category-card" data-category="${c.id}"><div class="category-art"><img loading="lazy" src="${imageUrl(c.image,300)}" alt="${c.name}"></div><h3>${c.name}</h3><p>${c.count}</p></button>`).join("");
}
function filteredProducts(){
 let list = products.filter(p=>(activeCategory==="all"||p.category===activeCategory) && (p.name.toLowerCase().includes(searchTerm)||p.category.includes(searchTerm)));
 const sort=$("#sortProducts").value;
 if(sort==="price-low") list.sort((a,b)=>a.price-b.price);
 if(sort==="price-high") list.sort((a,b)=>b.price-a.price);
 if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
 return list;
}
function productCard(p){
 return `<article class="product-card"><div class="product-image"><img loading="lazy" src="${imageUrl(p.image,500)}" alt="${p.name}">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<button class="wish-btn ${wishlist.has(p.id)?"active":""}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist"><i class="${wishlist.has(p.id)?"fa-solid":"fa-regular"} fa-heart"></i></button></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating} <span>(${Math.floor(24+p.id*7)} reviews)</span></div><div class="product-bottom"><div><span class="price">${money(p.price)}</span>${p.oldPrice?` <del>${money(p.oldPrice)}</del>`:""}<div style="font-size:9px;color:#89948b">${p.unit}</div></div><button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart"><i class="fa-solid fa-plus"></i></button></div></div></article>`;
}
function renderProducts(){
 const list=filteredProducts(), visible=list.slice(0,shownCount);
 $("#productsGrid").innerHTML=visible.map(productCard).join("");
 $("#emptyState").hidden=list.length>0;
 $("#loadMoreBtn").style.display=list.length>shownCount?"inline-flex":"none";
}
function renderReviews(){
 const compact=window.innerWidth<=760;
 $("#reviewsGrid").innerHTML=reviews.map((r,i)=>`<article class="review-card" data-review="${i}"><div class="review-stars">★★★★★</div><blockquote>“${r.text}”</blockquote><div class="review-person"><img loading="lazy" src="${imageUrl(r.image,100)}" alt=""><div><strong>${r.name}</strong><small>${r.city}</small></div></div></article>`).join("");
 if(compact){const cards=$$("#reviewsGrid .review-card");cards.forEach((c,i)=>c.style.display=i===reviewIndex?"block":"none");}
}
let reviewIndex=0;
function changeReview(dir){reviewIndex=(reviewIndex+dir+reviews.length)%reviews.length;renderReviews();}
function updateFilters(){
 $$(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.category===activeCategory));
}
function setCategory(cat){activeCategory=cat;shownCount=8;updateFilters();renderProducts();$("#products").scrollIntoView({behavior:"smooth",block:"start"});}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2400);}
function addToCart(id){cart[id]=(cart[id]||0)+1;renderCart();toast(`${products.find(p=>p.id===id).name} added to your basket`);}
function changeQuantity(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];renderCart();}
function cartCount(){return Object.values(cart).reduce((sum,n)=>sum+n,0);}
function renderCart(){
 const entries=Object.entries(cart).map(([id,qty])=>({product:products.find(p=>p.id===Number(id)),qty})).filter(x=>x.product);
 const count=cartCount(),total=entries.reduce((s,e)=>s+e.product.price*e.qty,0);
 $("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;$("#cartTotal").textContent=money(total);
 $("#cartItems").innerHTML=entries.map(({product:p,qty})=>`<div class="cart-item"><img src="${imageUrl(p.image,180)}" alt="${p.name}"><div><h4>${p.name}</h4><span class="item-price">${money(p.price)} / ${p.unit}</span><div class="quantity-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}"><i class="fa-regular fa-trash-can"></i></button></div>`).join("");
 $("#cartEmpty").style.display=count?"none":"block";$("#drawerFoot").style.display=count?"block":"none";
 const progress=Math.min(100,total/50*100);$("#shippingBar").style.width=`${progress}%`;
 $("#shippingMessage").textContent=total>=50?"You've unlocked free delivery!":`Add ${money(50-total)} more for free delivery.`;
}
function openCart(){$("#cartDrawer").classList.add("open");$("#cartOverlay").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#cartOverlay").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow="";}
function runSearch(){
 searchTerm=$("#searchInput").value.trim().toLowerCase();
 const cat=$("#searchCategory").value;if(cat!=="all")activeCategory=cat;
 shownCount=products.length;updateFilters();renderProducts();$("#products").scrollIntoView({behavior:"smooth"});
}
function initReveal(){
 const sections=$$("section:not(.hero) .section-heading, .benefits-grid article, .category-card, .product-card, .story-image, .story-copy, .review-card");
 if(!("IntersectionObserver" in window)){sections.forEach(el=>el.classList.add("visible"));return;}
 const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target)}}),{threshold:.08});
 sections.forEach(el=>{el.classList.add("reveal");io.observe(el)});
}
renderCategories();renderProducts();renderReviews();renderCart();$("#year").textContent=new Date().getFullYear();

$("#filterTabs").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b){activeCategory=b.dataset.category;searchTerm="";$("#searchInput").value="";shownCount=8;updateFilters();renderProducts();}});
$("#categoriesGrid").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b)setCategory(b.dataset.category);});
$("#productsGrid").addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addToCart(Number(add.dataset.add));
 const wish=e.target.closest("[data-wish]");if(wish){const id=Number(wish.dataset.wish);wishlist.has(id)?wishlist.delete(id):wishlist.add(id);$("#wishCount").textContent=wishlist.size;renderProducts();toast(wishlist.has(id)?"Saved to your wishlist":"Removed from wishlist");}
});
$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q)changeQuantity(Number(q.dataset.qty),Number(q.dataset.delta));if(r)changeQuantity(Number(r.dataset.remove),-(cart[Number(r.dataset.remove)]||0));});
$("#sortProducts").addEventListener("change",renderProducts);
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();runSearch();});
$("#searchInput").addEventListener("input",()=>{searchTerm=$("#searchInput").value.trim().toLowerCase();shownCount=products.length;renderProducts();});
$("#searchCategory").addEventListener("change",()=>{const cat=$("#searchCategory").value;if(cat!=="all")activeCategory=cat;else activeCategory="all";updateFilters();renderProducts();});
$("#loadMoreBtn").addEventListener("click",()=>{shownCount+=4;renderProducts();});
$("#cartIcon").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#cartOverlay").addEventListener("click",closeCart);
$("#continueShopping").addEventListener("click",()=>{closeCart();$("#products").scrollIntoView({behavior:"smooth"});});
$("#checkoutBtn").addEventListener("click",()=>toast("Demo checkout: connect a payment provider to accept orders."));
$("#reviewPrev").addEventListener("click",()=>changeReview(-1));$("#reviewNext").addEventListener("click",()=>changeReview(1));
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();$("#newsletterMessage").textContent="You're on the list — thanks for joining!";e.target.reset();});
$("#menuToggle").addEventListener("click",()=>{const open=$("#navMenu").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));$("#menuToggle").setAttribute("aria-label",open?"Close navigation":"Open navigation");});
$("#navMenu").addEventListener("click",e=>{if(e.target.closest("a")){$("#navMenu").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}});
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>{$$(".nav-links a").forEach(x=>x.classList.remove("active"));a.classList.add("active")}));
$("#backToTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
window.addEventListener("scroll",()=>$("#backToTop").classList.toggle("show",window.scrollY>500),{passive:true});
window.addEventListener("resize",renderReviews);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
initReveal();
