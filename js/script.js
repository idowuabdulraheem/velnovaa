// VELNOVA - Main JS

let cart = JSON.parse(localStorage.getItem('velnova_cart') || '[]');

function saveCart() {
  localStorage.setItem('velnova_cart', JSON.stringify(cart));
  updateBadge();
}

function updateBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function addToCart(item) {
  const ex = cart.find(i => i.id === item.id && i.size === item.size);
  if (ex) ex.qty += item.qty || 1;
  else cart.push({ ...item, qty: item.qty || 1 });
  saveCart();
  showToast(item.name + ' added to cart');
}

function fmt(n) {
  return '₦' + Number(n).toLocaleString('en-NG');
}

function showToast(msg) {
  let t = document.getElementById('velnova-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'velnova-toast';
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#080808;color:#fff;padding:14px 22px;font-family:sans-serif;font-size:0.875rem;z-index:9999;opacity:0;transition:opacity 0.3s;min-width:220px;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

function initNav() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.style.borderBottom = scrollY > 10 ? '1px solid #e8e8e6' : '1px solid transparent';
  });
  const ham = document.querySelector('.ham');
  const mob = document.querySelector('.mob-menu');
  if (ham && mob) {
    ham.addEventListener('click', () => { mob.style.display = 'flex'; });
    document.querySelector('.mob-close') && document.querySelector('.mob-close').addEventListener('click', () => { mob.style.display = 'none'; });
  }
  fetch('/api/auth/me', { credentials: 'include' })
    .then(r => r.json())
    .then(d => {
      const btn = document.getElementById('acc-btn');
      if (!btn) return;
      if (d.success) btn.href = d.user.role === 'admin' ? '/admin.html' : '/profile.html';
      else btn.href = '/login.html';
    }).catch(() => {});
  updateBadge();
}

// BUILD ONE PRODUCT CARD
function productCard(p) {
  var imgSrc = (p.images && p.images.length > 0) ? p.images[0] : '';
  var badge = p.badge ? '<div style="position:absolute;top:12px;left:12px;background:#080808;color:#fff;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;z-index:2;">' + p.badge + '</div>' : '';
  var imgEl = imgSrc
    ? '<img src="' + imgSrc + '" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.background=\'#e8e8e6\'">'
    : '<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9a9a98;font-size:12px;">No Image</div>';

  return '<div onclick="location.href=\'product.html?id=' + p._id + '\'" style="cursor:pointer;font-family:sans-serif;">'
       + '<div style="position:relative;width:100%;height:360px;overflow:hidden;background:#f2f2f0;">'
       + imgEl + badge
       + '</div>'
       + '<div style="padding:10px 0 6px;">'
       + '<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a9a98;margin-bottom:4px;">' + p.category + '</div>'
       + '<div style="font-size:16px;margin-bottom:5px;color:#080808;">' + p.name + '</div>'
       + '<div style="font-size:14px;color:#080808;">&#8358;' + Number(p.price).toLocaleString('en-NG') + '</div>'
       + '</div>'
       + '</div>';
}

async function initHome() {
  var grid = document.getElementById('featured-grid');
  if (!grid) return;
  try {
    var res = await fetch('/api/products?limit=8');
    var data = await res.json();
    if (data.success && data.products.length > 0) {
      grid.innerHTML = data.products.map(function(p) { return productCard(p); }).join('');
    } else {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#9a9a98;padding:40px;">No products yet.</p>';
    }
  } catch(e) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#9a9a98;padding:40px;">Could not load products.</p>';
  }
}

async function initShop() {
  var grid = document.getElementById('shop-grid');
  if (!grid) return;
  var cat = new URLSearchParams(location.search).get('cat') || 'all';

  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    if (btn.dataset.cat === cat) btn.classList.add('active');
    btn.addEventListener('click', function() {
      cat = btn.dataset.cat;
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      load();
    });
  });

  async function load() {
    grid.innerHTML = '<p style="grid-column:1/-1;color:#9a9a98;padding:20px;">Loading...</p>';
    var url = cat === 'all' ? '/api/products' : '/api/products?cat=' + cat;
    try {
      var res = await fetch(url);
      var data = await res.json();
      var countEl = document.getElementById('prod-count');
      if (countEl) countEl.textContent = (data.products ? data.products.length : 0) + ' Products';
      if (data.success && data.products.length > 0) {
        grid.innerHTML = data.products.map(function(p) { return productCard(p); }).join('');
      } else {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#9a9a98;padding:60px;">No products found.</p>';
      }
    } catch(e) {
      grid.innerHTML = '<p style="grid-column:1/-1;color:#9a9a98;padding:20px;">Error loading products.</p>';
    }
  }
  load();
}

async function initProduct() {
  if (!document.getElementById('pd-name')) return;
  var id = new URLSearchParams(location.search).get('id');
  if (!id) return;
  try {
    var res = await fetch('/api/products/' + id);
    var data = await res.json();
    if (!data.success) return;
    var p = data.product;
    document.title = p.name + ' — VELNOVA';
    document.getElementById('pd-name').textContent = p.name;
    document.getElementById('pd-cat').textContent = p.category;
    document.getElementById('pd-price').textContent = '₦' + Number(p.price).toLocaleString('en-NG');
    document.getElementById('pd-desc').textContent = p.description;
    var bc = document.getElementById('pd-bc');
    if (bc) bc.textContent = p.name;

    var imgs = (p.images && p.images.length) ? p.images : [];
    var mainImg = document.getElementById('pd-main-img');
    if (mainImg && imgs.length) mainImg.src = imgs[0];

    var thumbsEl = document.getElementById('pd-thumbs');
    if (thumbsEl && imgs.length > 1) {
      thumbsEl.innerHTML = imgs.map(function(src, i) {
        return '<img src="' + src + '" onclick="document.getElementById(\'pd-main-img\').src=\'' + src + '\'" style="width:68px;height:86px;object-fit:cover;cursor:pointer;border:2px solid ' + (i===0?'#080808':'#e8e8e6') + ';">';
      }).join('');
    }

    var sizesEl = document.getElementById('pd-sizes');
    if (sizesEl && p.sizes && p.sizes.length) {
      sizesEl.innerHTML = p.sizes.map(function(s) {
        return '<button onclick="selectSize(this,\'' + s + '\')" style="min-width:44px;height:44px;border:1px solid #d4d4d2;background:white;cursor:pointer;font-size:13px;padding:0 10px;margin:0 4px 4px 0;">' + s + '</button>';
      }).join('');
    }

    var qty = 1;
    var qtyEl = document.getElementById('qty-num');
    if (qtyEl) qtyEl.textContent = qty;
    var plusBtn = document.getElementById('qty-plus');
    var minusBtn = document.getElementById('qty-minus');
    if (plusBtn) plusBtn.onclick = function() { qty = Math.min(10, qty+1); if(qtyEl) qtyEl.textContent = qty; };
    if (minusBtn) minusBtn.onclick = function() { qty = Math.max(1, qty-1); if(qtyEl) qtyEl.textContent = qty; };

    var addBtn = document.getElementById('add-cart-btn');
    if (addBtn) addBtn.onclick = function() {
      var active = document.querySelector('.sz-active');
      if (!active) { showToast('Please select a size'); return; }
      addToCart({ id: p._id, name: p.name, price: p.price, size: active.dataset.size, image: imgs[0] || '', category: p.category, qty: qty });
    };
  } catch(e) { console.error(e); }
}

window.selectSize = function(el, size) {
  document.querySelectorAll('#pd-sizes button').forEach(function(b) {
    b.style.background = 'white'; b.style.borderColor = '#d4d4d2'; b.style.color = '#080808';
    b.classList.remove('sz-active');
  });
  el.style.background = '#080808'; el.style.color = 'white'; el.style.borderColor = '#080808';
  el.classList.add('sz-active'); el.dataset.size = size;
};

function initCart() {
  var wrap = document.getElementById('cart-wrap');
  if (!wrap) return;
  function render() {
    if (!cart.length) {
      wrap.innerHTML = '<div style="text-align:center;padding:80px 20px;"><div style="font-size:1.8rem;margin-bottom:10px;">Your cart is empty</div><p style="color:#9a9a98;margin-bottom:24px;">Browse our collections.</p><a href="shop.html" style="display:inline-block;padding:14px 36px;background:#080808;color:#fff;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">Shop Now</a></div>';
      return;
    }
    var sub = cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
    var ship = sub > 50000 ? 0 : 2500;
    var total = sub + ship;
    var rows = cart.map(function(item) {
      return '<div style="display:flex;gap:14px;align-items:center;padding:16px 0;border-bottom:1px solid #f2f2f0;">'
        + '<div style="width:70px;height:88px;background:#f2f2f0;flex-shrink:0;overflow:hidden;">' + (item.image ? '<img src="' + item.image + '" style="width:100%;height:100%;object-fit:cover;">' : '') + '</div>'
        + '<div style="flex:1;"><div style="font-size:15px;margin-bottom:3px;">' + item.name + '</div><div style="font-size:12px;color:#9a9a98;margin-bottom:8px;">Size: ' + item.size + '</div>'
        + '<div style="display:flex;border:1px solid #e8e8e6;width:fit-content;">'
        + '<button onclick="changeQty(\'' + item.id + '\',\'' + item.size + '\',-1)" style="width:30px;height:30px;border:none;background:none;cursor:pointer;font-size:16px;">-</button>'
        + '<span style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:13px;border-left:1px solid #e8e8e6;border-right:1px solid #e8e8e6;">' + item.qty + '</span>'
        + '<button onclick="changeQty(\'' + item.id + '\',\'' + item.size + '\',1)" style="width:30px;height:30px;border:none;background:none;cursor:pointer;font-size:16px;">+</button>'
        + '</div></div>'
        + '<div style="text-align:right;"><div style="font-size:14px;margin-bottom:8px;">&#8358;' + Number(item.price * item.qty).toLocaleString('en-NG') + '</div>'
        + '<button onclick="removeItem(\'' + item.id + '\',\'' + item.size + '\')" style="border:none;background:none;cursor:pointer;font-size:12px;color:#9a9a98;text-decoration:underline;">Remove</button></div>'
        + '</div>';
    }).join('');
    wrap.innerHTML = '<div style="display:grid;grid-template-columns:1fr 300px;gap:36px;align-items:start;">'
      + '<div><div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#9a9a98;padding-bottom:10px;border-bottom:2px solid #e8e8e6;margin-bottom:4px;">Your Items</div>' + rows + '</div>'
      + '<div style="background:#f8f8f6;padding:24px;position:sticky;top:80px;">'
      + '<div style="font-size:18px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #e8e8e6;">Order Summary</div>'
      + '<div style="display:flex;justify-content:space-between;font-size:14px;color:#5a5a58;margin-bottom:8px;"><span>Subtotal</span><span>&#8358;' + Number(sub).toLocaleString('en-NG') + '</span></div>'
      + '<div style="display:flex;justify-content:space-between;font-size:14px;color:#5a5a58;margin-bottom:8px;"><span>Shipping</span><span>' + (ship===0?'Free':'&#8358;'+Number(ship).toLocaleString('en-NG')) + '</span></div>'
      + '<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:600;padding-top:12px;border-top:1px solid #e8e8e6;margin-top:4px;margin-bottom:20px;"><span>Total</span><span>&#8358;' + Number(total).toLocaleString('en-NG') + '</span></div>'
      + '<a href="checkout.html" style="display:block;text-align:center;padding:15px;background:#080808;color:#fff;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;margin-bottom:10px;">Checkout</a>'
      + '<a href="shop.html" style="display:block;text-align:center;padding:11px;border:1px solid #e8e8e6;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#5a5a58;text-decoration:none;">Continue Shopping</a>'
      + '</div></div>';
  }
  render();
}

window.changeQty = function(id, size, d) {
  var item = cart.find(function(i){ return i.id===id && i.size===size; });
  if (item) { item.qty = Math.max(1, item.qty + d); saveCart(); initCart(); }
};
window.removeItem = function(id, size) {
  cart = cart.filter(function(i){ return !(i.id===id && i.size===size); });
  saveCart(); initCart();
};

async function initCheckout() {
  if (!document.getElementById('co-items')) return;
  try {
    var r = await fetch('/api/auth/me', { credentials: 'include' });
    var d = await r.json();
    if (!d.success) { showToast('Please log in first'); setTimeout(function(){ location.href='/login.html'; }, 1500); return; }
  } catch { return; }
  if (!cart.length) { showToast('Cart is empty'); setTimeout(function(){ location.href='/cart.html'; }, 1500); return; }
  var sub = cart.reduce(function(s,i){ return s+i.price*i.qty; }, 0);
  var ship = sub > 50000 ? 0 : 2500;
  var total = sub + ship;
  document.getElementById('co-items').innerHTML = cart.map(function(i){
    return '<div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;">'
      + '<div style="width:50px;height:64px;background:#f2f2f0;flex-shrink:0;overflow:hidden;">' + (i.image?'<img src="'+i.image+'" style="width:100%;height:100%;object-fit:cover;">':'') + '</div>'
      + '<div style="flex:1;font-size:13px;"><div style="margin-bottom:2px;">' + i.name + '</div><div style="color:#9a9a98;">Size: '+i.size+' · Qty: '+i.qty+'</div></div>'
      + '<div style="font-size:13px;">&#8358;' + Number(i.price*i.qty).toLocaleString('en-NG') + '</div></div>';
  }).join('');
  document.getElementById('co-sub').textContent = '₦'+Number(sub).toLocaleString('en-NG');
  document.getElementById('co-ship').textContent = ship===0?'Free':'₦'+Number(ship).toLocaleString('en-NG');
  document.getElementById('co-total').textContent = '₦'+Number(total).toLocaleString('en-NG');
  try {
    var rb = await fetch('/api/settings/bank');
    var db = await rb.json();
    if (db.success && db.bank) {
      document.getElementById('bank-name').textContent = db.bank.bankName||'—';
      document.getElementById('bank-acct').textContent = db.bank.accountNo||'—';
      document.getElementById('bank-holder').textContent = db.bank.accountName||'—';
    }
  } catch {}
  document.getElementById('place-order').onclick = async function() {
    var fields = ['co-fullname','co-phone','co-address','co-city','co-state'];
    var ok = true;
    fields.forEach(function(id){ if (!document.getElementById(id)?.value.trim()) ok=false; });
    if (!ok) { showToast('Please fill all fields'); return; }
    var btn = document.getElementById('place-order');
    btn.textContent = 'Placing...'; btn.disabled = true;
    try {
      var r = await fetch('/api/orders', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items: cart.map(function(i){ return {productId:i.id,name:i.name,price:i.price,qty:i.qty,size:i.size}; }), shippingAddress:{ fullName:document.getElementById('co-fullname').value, phone:document.getElementById('co-phone').value, address:document.getElementById('co-address').value, city:document.getElementById('co-city').value, state:document.getElementById('co-state').value }, subtotal:sub, shipping:ship, total:total }) });
      var d = await r.json();
      if (d.success) { localStorage.removeItem('velnova_cart'); location.href='/order-confirm.html?id='+d.orderId; }
      else { showToast(d.message); btn.textContent='Confirm Order'; btn.disabled=false; }
    } catch { showToast('Error. Try again.'); btn.textContent='Confirm Order'; btn.disabled=false; }
  };
}

function initAuth() {
  document.querySelectorAll('.auth-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.auth-tab').forEach(function(t){ t.classList.remove('on'); });
      document.querySelectorAll('.auth-form').forEach(function(f){ f.style.display='none'; });
      tab.classList.add('on');
      var el = document.getElementById(tab.dataset.form);
      if (el) el.style.display = 'block';
    });
  });
  var loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn = e.target.querySelector('button[type=submit]');
    btn.textContent='Signing in...'; btn.disabled=true;
    var email = e.target.querySelector('input[type=email]').value;
    var password = e.target.querySelector('input[type=password]').value;
    try {
      var r = await fetch('/api/auth/login',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      var d = await r.json();
      if (d.success) { showToast('Welcome back!'); setTimeout(function(){ location.href=d.redirect; },1000); }
      else { showToast(d.message); btn.textContent='Sign In'; btn.disabled=false; }
    } catch { showToast('Error.'); btn.textContent='Sign In'; btn.disabled=false; }
  });
  var regForm = document.getElementById('register-form');
  if (regForm) regForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var pws = e.target.querySelectorAll('input[type=password]');
    if (pws[0].value !== pws[1].value) { showToast('Passwords do not match'); return; }
    var btn = e.target.querySelector('button[type=submit]');
    btn.textContent='Creating...'; btn.disabled=true;
    try {
      var r = await fetch('/api/auth/signup',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:e.target.querySelector('input[name=name]').value,email:e.target.querySelector('input[type=email]').value,password:pws[0].value})});
      var d = await r.json();
      if (d.success) { showToast('Account created!'); setTimeout(function(){ location.href=d.redirect; },1000); }
      else { showToast(d.message); btn.textContent='Create Account'; btn.disabled=false; }
    } catch { showToast('Error.'); btn.textContent='Create Account'; btn.disabled=false; }
  });
}

async function initProfile() {
  if (!document.getElementById('profile-name')) return;
  try {
    var r = await fetch('/api/auth/me',{credentials:'include'});
    var d = await r.json();
    if (!d.success) { location.href='/login.html'; return; }
    document.getElementById('profile-name').textContent = d.user.name;
    document.getElementById('profile-email').textContent = d.user.email;
  } catch { location.href='/login.html'; }
  try {
    var r2 = await fetch('/api/orders/my',{credentials:'include'});
    var d2 = await r2.json();
    var el = document.getElementById('my-orders');
    if (!el) return;
    if (!d2.orders||!d2.orders.length) { el.innerHTML='<p style="color:#9a9a98;padding:20px 0;">No orders yet.</p>'; return; }
    el.innerHTML = d2.orders.map(function(o){
      return '<div style="border:1px solid #e8e8e6;margin-bottom:14px;">'
        + '<div style="background:#f8f8f6;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">'
        + '<strong>#'+String(o._id).slice(-6).toUpperCase()+'</strong>'
        + '<span>'+new Date(o.placedAt).toLocaleDateString('en-NG')+'</span>'
        + '<strong>₦'+Number(o.total).toLocaleString('en-NG')+'</strong>'
        + '<span style="text-transform:uppercase;font-size:11px;letter-spacing:1px;">'+o.status+'</span>'
        + '</div>'
        + '<div style="padding:12px 16px;">'
        + o.items.map(function(i){ return '<div style="font-size:13px;padding:5px 0;border-bottom:1px solid #f2f2f0;">'+i.name+' × '+i.qty+' ('+i.size+') — ₦'+Number(i.price*i.qty).toLocaleString('en-NG')+'</div>'; }).join('')
        + '</div></div>';
    }).join('');
  } catch {}
}

window.doLogout = async function() {
  await fetch('/api/auth/logout',{method:'POST',credentials:'include'});
  localStorage.removeItem('velnova_cart');
  location.href='/login.html';
};

document.addEventListener('DOMContentLoaded', function() {
  initNav();
  initHome();
  initShop();
  initProduct();
  initCart();
  initCheckout();
  initAuth();
  initProfile();
});

// Form validation helper used by admin and checkout
function validateForm(form) {
  var ok = true;
  form.querySelectorAll('[required]').forEach(function(f) {
    var err = f.parentElement.querySelector('.form-err');
    var bad = !f.value.trim() || (f.type === 'email' && !/\S+@\S+\.\S+/.test(f.value));
    f.style.borderColor = bad ? '#c0392b' : '';
    if (err) err.style.display = bad ? 'block' : 'none';
    if (bad) ok = false;
  });
  return ok;
}