//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
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
         });
      });
   }
}

class Storage {
   static saveProducts(products){
      localStorage.setItem("products", JSON.stringify(products));
   }
}

document.addEventListener('DOMContentLoaded', () => {
   const ui = new UI();
   const products = new Products();

   products.getProducts().then(products => {
      ui.dispayProducts(products)
      Storage.saveProducts(products);
   }).then(() => {
      ui.getBagButtons();
   })
});