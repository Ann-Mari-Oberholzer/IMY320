const fs = require('fs');

// Read the database file
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Remove product with id 8801 from products array
const productsBefore = db.products.length;
db.products = db.products.filter(product => product.id !== 8801);
const productsAfter = db.products.length;

console.log(`Products before: ${productsBefore}`);
console.log(`Products after: ${productsAfter}`);
console.log(`Removed ${productsBefore - productsAfter} product(s) with id 8801`);

// Remove product 8801 from cart items (if it exists in any cart)
db.cart.forEach(cartItem => {
  if (cartItem.products) {
    const beforeLength = cartItem.products.length;
    cartItem.products = cartItem.products.filter(p => p.productId !== 8801 && p.id !== 8801);
    const afterLength = cartItem.products.length;
    if (beforeLength !== afterLength) {
      console.log(`Removed product 8801 from cart ${cartItem.id}`);
    }
  }
});

// Write back to database
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('✓ Database updated successfully');
