// ----------------- SHOW PAGE -----------------
function showpage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.style.display = 'none');
  const target = document.getElementById(pageId);
  if (target) target.style.display = 'block';

  if (pageId === 'home') fetchProducts();
  if (pageId === 'cart') fetchCart();

  updateNavbar();
}

// ----------------- UPDATE NAVBAR -----------------
function updateNavbar() {
  fetch('http://localhost:5000/api/users/check-auth', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      const navLinks = document.querySelectorAll('.nav a');
      navLinks.forEach(link => {
        const page = link.getAttribute('onclick');
        if (page.includes("'signup'") || page.includes("'login'")) {
          link.style.display = data.loggedIn ? 'none' : 'inline-block';
        } else {
          link.style.display = data.loggedIn ? 'inline-block' : 'none';
        }
      });

      const logoutLink = document.getElementById('logout-link');
      if (logoutLink) logoutLink.style.display = data.loggedIn ? 'inline-block' : 'none';
    });
}

// ----------------- SIGNUP -----------------
document.getElementById('signup-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const res = await fetch('http://localhost:5000/api/users/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Signup successful');
      showpage('home');
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (err) {
    alert('Signup error');
    console.error(err);
  }
});

// ----------------- LOGIN -----------------
document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Login successful');
      showpage('home');
    } else {
      document.getElementById('login-status').innerText = data.message || 'Login failed';
    }
  } catch (err) {
    alert('Login error');
    console.error(err);
  }
});

// ----------------- LOGOUT -----------------
function logoutUser() {
  fetch('http://localhost:5000/api/users/logout', {
    method: 'POST',
    credentials: 'include'
  })
    .then(() => {
      alert('Logged out');
      showpage('signup');
    });
}

// ----------------- FETCH PRODUCTS -----------------
async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error('Product fetch error:', err);
    document.getElementById('product-list').innerHTML = '<p>Failed to load products.</p>';
  }
}

// ----------------- RENDER PRODUCTS -----------------
function renderProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  if (!products.length) {
    productList.innerHTML = '<p>No products available.</p>';
    return;
  }

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button>Add to Cart</button>
    `;

    const button = div.querySelector('button');
    button.addEventListener('click', () => addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image
    }));

    productList.appendChild(div);
  });
}

// ----------------- ADD TO CART -----------------
function addToCart(product) {
  fetch('http://localhost:5000/api/cart', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
    .then(res => res.json())
    .then(data => alert(`${data.name || product.name} added to cart!`))
    .catch(err => console.error('Cart error:', err));
}

// ----------------- FETCH CART -----------------
async function fetchCart() {
  try {
    const res = await fetch('http://localhost:5000/api/cart', {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    const cartItems = await res.json();
    renderCart(cartItems);
  } catch (err) {
    console.error('Cart fetch error:', err);
    document.getElementById('cart-items').innerHTML = '<p>Failed to load cart.</p>';
  }
}

// ----------------- RENDER CART -----------------
function renderCart(cartItems) {
  const cartList = document.getElementById('cart-items');
  cartList.innerHTML = '';
  if (!cartItems.length) {
    cartList.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cartItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <button class="remove-btn" data-id="${item.productId}">Remove</button>
    `;
    cartList.appendChild(div);
  });

  // Attach click handlers for all remove buttons
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.dataset.id;
      await removeFromCart(productId);
      fetchCart(); // Refresh cart
    });
  });
}

// ----------------------Remove from Cart ----------------------

async function removeFromCart(productId) {
  try {
    const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    alert(data.message || 'Item removed');
  } catch (err) {
    console.error('Remove error:', err);
    alert('Failed to remove item');
  }
}







// ----------------- INIT -----------------
window.onload = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/users/check', { credentials: 'include' });
    const data = await res.json();
    if (data.loggedIn) {
      showpage('home');
    } else {
      showpage('login');
    }
  } catch (err) {
    console.error('Session check failed:', err);
    showpage('login');
  }

  const logoutLink = document.createElement('a');
  logoutLink.id = 'logout-link';
  logoutLink.innerText = 'Logout';
  logoutLink.style.cursor = 'pointer';
  logoutLink.onclick = logoutUser;
  document.querySelector('.nav').appendChild(logoutLink);
};
