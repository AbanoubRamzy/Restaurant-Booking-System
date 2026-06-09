// Menu data
const menuData = [
  { id:1,name:"Margherita Pizza",category:"pizza",price:14,img:"./assets/images/margarita.jpg" },
  { id:2,name:"Pepperoni Pizza",category:"pizza",price:17,img:"./assets/images/pepperoni.jpg" },
  { id:3,name:"Hawaiian Pizza",category:"pizza",price:22,img:"./assets/images/hawaiian.jpg" },
  { id:4,name:"Four Cheese Pizza",category:"pizza",price:19,img:"./assets/images/four-cheese.jpg" },
  { id:5,name:"Marinara Pizza",category:"pizza",price:15,img:"./assets/images/marinara.jpg" },

  { id:6,name:"Cheese Burger",category:"burger",price:10,img:"./assets/images/cheese-burger.jpg" },
  { id:7,name:"Chicken Burger",category:"burger",price:11,img:"./assets/images/chickenburger.jpg" },
  { id:8,name:"Fries",category:"burger",price:4,img:"./assets/images/fries.jpg" },

  { id:9,name:"Coca Cola",category:"drinks",price:3,img:"./assets/images/cocacola.jpg" },
  { id:10,name:"Orange Juice",category:"drinks",price:5,img:"./assets/images/orange.jpg" },
  { id:11,name:"Lemon & Mint Juice",category:"drinks",price:5,img:"./assets/images/lemon&mint.jpg" },  
  { id:12,name:"Sprite",category:"drinks",price:3,img:"./assets/images/sprite.jpg" }
];

// State
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Save functions
function saveCart(){ localStorage.setItem("cart", JSON.stringify(cart)); }
function saveBooking(data){ bookings.push(data); localStorage.setItem("bookings", JSON.stringify(bookings)); }

// Toast
function showToast(msg){ 
  const toast = document.getElementById("toast"); 
  toast.textContent = msg; 
  toast.classList.add("show"); 
  setTimeout(()=>toast.classList.remove("show"),2000); 
}

// Render Menu
function renderMenu(items){
  const menu = document.getElementById("menu");
  menu.innerHTML="";
  items.forEach(item=>{
    const div=document.createElement("div");
    div.classList.add("card");
    div.innerHTML=`
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p class="price">$${item.price}</p>
      <button onclick="addToCart(${item.id})">Add</button>
    `;
    menu.appendChild(div);
  });
}

// Filter
function filterMenu(cat){ renderMenu(cat==="all"?menuData:menuData.filter(i=>i.category===cat)); }

// Cart
function addToCart(id){
  const item = menuData.find(i=>i.id===id);
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty+=1; } else { cart.push({...item,qty:1}); }
  saveCart(); 
  renderCart();
  
  showToast(`${item.name} Added to cart 🛒`);
}

function changeQty(index, delta){
  cart[index].qty+=delta;
  if(cart[index].qty<=0) cart.splice(index,1);
  saveCart(); renderCart();
}

function removeItem(index){ cart.splice(index,1); saveCart(); renderCart(); showToast("Removed item ❌"); }

function renderCart(){
  const cartDiv = document.getElementById("cart");
  const totalSpan = document.getElementById("total");
  if(cart.length===0){ cartDiv.innerHTML="<p>Your cart is empty 🛒</p>"; totalSpan.textContent=0; return; }
  cartDiv.innerHTML=""; let total=0;
  cart.forEach((item,index)=>{
    total+=item.price*item.qty;
    cartDiv.innerHTML+=`
      <div class="cart-item">
        <div>
          ${item.name} ($${item.price})
          <br>
          <button onclick="changeQty(${index},-1)">-</button>
          ${item.qty}
          <button onclick="changeQty(${index},1)">+</button>
        </div>
        <button onclick="removeItem(${index})">✖</button>
      </div>
    `;
  });
  totalSpan.textContent=total;
}

// Cart sidebar
function toggleCart(){ document.getElementById("cartSidebar").classList.toggle("active"); }

// Booking
document.getElementById("bookingForm").addEventListener("submit", function(e){
  e.preventDefault();
  const data={
    name:document.getElementById("name").value,
    date:document.getElementById("date").value,
    time:document.getElementById("time").value
  };
  saveBooking(data);
  showToast("Booking saved 📅");
  this.reset();
});

// Init
renderMenu(menuData);
renderCart();