const cart = [];
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const existingProduct = cart.find((item) => item.name === name);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    updateCart();
    Swal.fire("Added to Cart", `${name} has been added to your cart.`, "success");
  });
});
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    `;
    cartItems.appendChild(row);
    total += item.price * item.quantity;
  });
  document.getElementById("cart-total").textContent = total.toFixed(2);
}
document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.length === 0) {
    Swal.fire("Cart is Empty", "Please add some products to your cart!", "warning");
    return;
  }
  const message = cart
    .map((item) => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`)
    .join("%0A");
  const total = document.getElementById("cart-total").textContent;
  const whatsappLink = `https://wa.me/6289542567224?text=order%20produk:%0A${message}%0A%0ATotal:%20$${total}`;
  window.open(whatsappLink, "_blank");
});