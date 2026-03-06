const categoriesContainer = document.getElementById("categoriesContainer");
const treesContainer = document.getElementById("treesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const allTreesbtn = document.getElementById("allTreesbtn");
const treeDetailsModal = document.getElementById("tree-details-modal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalTitle = document.getElementById("modalTitle");
const cartContainer = document.getElementById("cartContainer");
const totalPrice = document.getElementById("total-price");
const emtyCartMessage = document.getElementById("emtyCartMessage")
let cart = [];



function showLoading() {
  loadingSpinner.classList.remove("hidden");
  treesContainer.innerHTML = "";
}

function hideLoading() {
  loadingSpinner.classList.add("hidden");
}

async function loadCategories() {
  //async await
  const res = await fetch(
    "https://openapi.programming-hero.com/api/categories",
  );
  const data = await res.json();
  // console.log(data);
  // console.log(categoriesContainer);
  data.categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline w-full";
    btn.textContent = category.category_name;
    btn.onclick = () => selectCategory(category.id, btn);
    categoriesContainer.appendChild(btn);
  });
}

async function selectCategory(categoryId, btn) {
  showLoading();

  const allButtons = document.querySelectorAll(
    "#categoriesContainer button, #allTreesbtn",
  );
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });

  btn.classList.add("btn-primary");
  btn.classList.remove("btn-outline");

  const res = await fetch(
    `https://openapi.programming-hero.com/api/category/${categoryId}`,
  );
  const data = await res.json();
  displayTrees(data.plants);
  hideLoading();
}

allTreesbtn.addEventListener("click", () => {
  const allButtons = document.querySelectorAll(
    "#categoriesContainer button, #allTreesbtn",
  );
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });

  allTreesbtn.classList.add("btn-primary");
  allTreesbtn.classList.remove("btn-outline");

  loadTrees();
});

async function loadTrees() {
  showLoading();
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  // console.log(data);
  hideLoading();
  displayTrees(data.plants);
}

function displayTrees(trees) {
  // console.log(trees);
  trees.forEach((tree) => {
    console.log(tree);

    const card = document.createElement("div");
    card.className = "card bg-white shadow-sm";
    card.innerHTML = `
        <div class="card bg-white shadow-sm">
              <figure>
                <img
                  src="${tree.image}"
                  alt="${tree.name}"
                  title="${tree.name}"
                  class="h-48 w-full object-cover cursor-pointer"
                  onclick="openTreeModal(${tree.id})"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title cursor-pointer hover:text-[#4ade80]" onclick="openTreeModal(${tree.id})">${tree.name}</h2>
                <p class="line-clamp-2">
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p>
                <div class="badge badge-success badge-outline">${tree.category}</div>
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">$${tree.price}</h2>
                  <button class="btn btn-primary" onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})">Add to Cart</button>
                </div>
              </div>
        </div>
        `;
    treesContainer.append(card);
  });
}

async function openTreeModal(treeId) {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/plant/${treeId}`,
  );
  const data = await res.json();
  const plantDetails = data.plants;
  modalTitle.textContent = plantDetails.name;
  modalImage.src = plantDetails.image;
  modalCategory.textContent = plantDetails.category;
  modalPrice.textContent = plantDetails.price;
  modalDescription.textContent = plantDetails.description;
  treeDetailsModal.showModal();
}

function addToCart(id, name, price) {
  const existingItem = cart.find(item=>item.id===id);
  if(existingItem){
    existingItem.quantity+=1;
  }
  else{
    cart.push({ 
      id,
      name, 
      price, 
      quantity:1
    });
  }
  updateCart();
}

  function updateCart() {
    cartContainer.innerHTML = "";
    if(cart.length===0){
      emtyCartMessage.classList.remove("hidden");
      totalPrice.textContent = `$${0}`
      return;
    }
    emtyCartMessage.classList.add("hidden");


    let total = 0;
    cart.forEach((item) => {
      total+=item.price * item.quantity
      const cartItem = document.createElement("div");
      cartItem.className = "card card-body bg-slate-100 font-semibold";
      cartItem.innerHTML = `
                  <div class="card card-body bg-slate-100">
                <div class="flex justify-between items-center">
                  <div>
                    <h2>${item.name}</h2>
                    <p>${item.price} x ${item.quantity}</p>
                  </div>
                  <button class="btn btn-ghost" onclick="removeFromCart(${item.id})">X</button>
                </div>
                <p class="text-right font-semibold text-xl">${item.price * item.quantity}</p>

              </div>
    
    `;
    cartContainer.appendChild(cartItem)
    });

    totalPrice.innerText = `$${total}`
  }

  function removeFromCart(treeId){
    const updatedCartElements = cart.filter(item=>item.id!=treeId);
    cart = updatedCartElements;
    updateCart();
}

loadCategories();
loadTrees();
