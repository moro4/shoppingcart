//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartBadgeCounter = document.querySelector('.cart-badge-counter');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

let cart = [];
let buttonsDOM = [];

// fetching the Products
class Products {
   async getProducts() {
      try {
         let result = await fetch('products.json');
         let data = await result.json();
         let products = data.items;
         products = products.map(item => {
            const {title, price} = item.fields;
            const id = item.sys.id;
            const image = item.fields.image.fields.file.url;
            return {id, title, price, image};
         })
         return products;
      } catch (error) {
         console.log(error);
      }
   }
}

class UI {
   dispayProducts(products) {
      let result = '';
      products.forEach(product => {
         result += `
            <article class="product">
               <div class="img-container">
                  <img src=${product.image} alt="product"
                     class='product-img'
                  >
                  <button class="bag-btn" data-id=${product.id}>
                     <i class="fas fa-shopping-cart">
                        <span class='btn-text'>Add to Bag</span>
                     </i>
                  </button>
               </div>
               <h3>${product.title}</h3>
               <h4>$ ${product.price}</h4>
            </article>
         `;
      });

      productsDOM.innerHTML = result;
   }

   getBagButtons(){
      const buttons = Array.from(document.querySelectorAll('.bag-btn'));
      buttons.forEach(button => {
         let id = button.dataset.id;
         let inCart = cart.find(item => item.id === id);
         if(inCart) {
            button.textContent = 'Added';
            button.disabled = true;
         }
         button.addEventListener('click', event => {
            button.textContent = 'Added';
            button.disabled = true;
            let cartItem = {...Storage.getProduct(id), amount: 1};
            cart.push(cartItem);
            Storage.saveCart(cart);
            this.setCartBadgeAndCartTotalDOM(cart);
            this.appendCartItemToCartDOM(cartItem);
            this.showCart();
         });
      });
   }

   setCartBadgeAndCartTotalDOM(cart) {
      let totalPaymentSum = 0;
      let totalNumberOfItemsInCart = 0;
      cart.forEach(item => {
         totalPaymentSum += item.price * item.amount;
         totalNumberOfItemsInCart += item.amount
      });
      cartBadgeCounter.innerText = totalNumberOfItemsInCart;
      cartTotal.innerText = parseFloat(totalPaymentSum.toFixed(2));
   }

   appendCartItemToCartDOM(item){
      cartContent.innerHTML += `
         <div class="cart-item">
            <img src=${item.image} alt="product">
            <div>
               <h4>${item.title}</h4>
               <h5>$ ${item.price}</h5>
               <span class='remove-item' data-id=${item.id}>remove</span>
            </div>
            <div>
               <i class="fas fa-chevron-up" data-id=${item.id}></i>
               <p class='item-amount'>${item.amount}</p>
               <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
         </div>
      `;
   }

   showCart(){
      cartDOM.classList.add('showCart');
      cartOverlay.classList.add('transparentBcg');
   }

   populateCartDOM(cart){
      cart.forEach(item => this.appendCartItemToCartDOM(item));
   }

   setupAPP(){
      cart = Storage.getCart();
      this.setCartBadgeAndCartTotalDOM(cart);
      this.populateCartDOM(cart);
   }
}

class Storage {
   static saveProducts(products){
      localStorage.setItem("products", JSON.stringify(products));
   }
   static getProduct(id){
      let products = JSON.parse(localStorage.getItem('products'));
      return products.find(product => product.id === id);
   }
   static saveCart(cart){
      localStorage.setItem("cart", JSON.stringify(cart));
   }
   static getCart(){
      return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
   }
}

document.addEventListener('DOMContentLoaded', () => {
   const ui = new UI();
   const products = new Products();

   ui.setupAPP();

   products.getProducts().then(products => {
      ui.dispayProducts(products)
      Storage.saveProducts(products);
   }).then(() => {
      ui.getBagButtons();
   })
});