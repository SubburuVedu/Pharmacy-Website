// Edit to match your stock: [name, category, price in rupees, picture]
const products = [
  ["Digital thermometer","Devices",199,"🌡️"],
  ["Blood pressure monitor","Devices",1499,"🩺"],
  ["Adhesive bandages","First aid",60,"🩹"],
  ["Antiseptic liquid","First aid",95,"🧴"],
  ["Hand sanitiser","Personal care",80,"🧼"],
  ["Sunscreen","Personal care",320,"☀️"],
  ["Baby wipes","Baby care",150,"🧻"],
  ["Diapers","Baby care",399,"👶"]
];
const $ = id => document.getElementById(id);
const cart = {};
let category = "All";

function showProducts() {
  const q = $("search").value.trim().toLowerCase();
  const found = products.filter(p => p[0].toLowerCase().includes(q) && (category === "All" || p[1] === category));
  $("grid").innerHTML = found.map(p =>
    `<article class="item"><div class="pic" aria-hidden="true">${p[3]}</div><strong>${p[0]}</strong><span class="price">₹${p[2]}</span><button data-add="${p[0]}">Add</button></article>`
  ).join("") || "<p>No match. Ask us at the counter.</p>";
}
function showChips() {
  $("chips").innerHTML = ["All", ...new Set(products.map(p => p[1]))].map(c =>
    `<button class="chip" aria-pressed="${c === category}" data-cat="${c}">${c}</button>`).join("");
}
function items() {
  return products.filter(p => cart[p[0]]);
}
function total() {
  return items().reduce((sum, p) => sum + p[2] * cart[p[0]], 0);
}
function showList() {
  $("list").innerHTML = items().map(p =>
    `<div class="row"><span>${p[0]} × ${cart[p[0]]}</span><button data-remove="${p[0]}" aria-label="Remove one ${p[0]}">−</button></div>`
  ).join("") || "<p>Your list is empty.</p>";
  $("total").textContent = "Total: ₹" + total();
}
$("search").oninput = showProducts;
$("chips").onclick = e => {
  if (!e.target.dataset.cat) return;
  category = e.target.dataset.cat;
  showChips(); showProducts();
};
$("grid").onclick = e => {
  const n = e.target.dataset.add;
  if (!n) return;
  cart[n] = (cart[n] || 0) + 1;
  showList();
  e.target.textContent = "Added (" + cart[n] + ")";
};
$("list").onclick = e => {
  const n = e.target.dataset.remove;
  if (!n) return;
  if (--cart[n] <= 0) delete cart[n];
  showList(); showProducts();
};
$("clear").onclick = () => { Object.keys(cart).forEach(k => delete cart[k]); showList(); showProducts(); $("status").textContent = ""; };
$("copy").onclick = () => {
  const text = items().map(p => p[0] + " x " + cart[p[0]]).join("\n") + "\nTotal: Rs " + total();
  const fail = () => { $("status").textContent = "Could not copy. Take a screenshot instead."; };
  if (!navigator.clipboard) return fail();
  navigator.clipboard.writeText(text).then(() => $("status").textContent = "Copied", fail);
};
showChips(); showProducts(); showList();
