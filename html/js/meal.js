/****************************取餐時間*********************************************************** */
function generateClosestTimeOptions() {
    const selectElement = document.getElementById('time-select');
    selectElement.innerHTML = ''; // 清空之前的選項

    let now = new Date();
    now.setSeconds(0, 0);  // 將秒數和毫秒數設置為0，避免干擾

    // 設定最早開始時間為 05:30
    let earliestTime = new Date();
    earliestTime.setHours(5);
    earliestTime.setMinutes(30);
    earliestTime.setSeconds(0, 0);

    // 如果當前時間早於 05:30，則從 05:30 開始
    let nextTime = (now > earliestTime) ? new Date(now) : new Date(earliestTime);
    nextTime.setMinutes(Math.ceil(nextTime.getMinutes() / 15) * 15);  // 計算下個 15 分鐘的時間點

    // 從 nextTime 開始生成接下來 5 個時間選項
    for (let i = 0; i < 5; i++) {
        let hours = nextTime.getHours().toString().padStart(2, '0');
        let minutes = nextTime.getMinutes().toString().padStart(2, '0');
        let timeString = `${hours}:${minutes}`;

        // 創建一個 option 元素
        const option = document.createElement('option');
        option.value = timeString;
        option.textContent = timeString;
        selectElement.appendChild(option);

        // 增加 15 分鐘
        nextTime.setMinutes(nextTime.getMinutes() + 15);
    }
}





/******************************秀出會員點數******************************************************** */
async function loadPoints() {
    try {
      // 假設 members.json 是你的 JSON 文件路徑
      const response = await fetch('/html/json/members.json');
      const data = await response.json();

      // 假設只顯示第一個會員的點數
      const points = data.members[0].points;

      // 更新輸入框中的值
      document.getElementById('points-display').value = points;
    } catch (error) {
      console.error('載入 JSON 時發生錯誤: ', error);
    }
  }
  
  


/****************************************秀出商品類別***********************************************/
async function loadCards() {
    try {
        // 假設 meal.json 是你的 JSON 文件
        const response = await fetch('/html/json/meal.json');
        const data = await response.json();
        
        const categories = data.Categories;
        const products = data.Products;

        const categoryContainer = document.getElementById('cardContainer');
        const productContainer = document.getElementById('customCardContainer');

        // 清空容器，避免重複生成卡片
        categoryContainer.innerHTML = '';
        productContainer.innerHTML = '';

        let defaultCategory = '漢堡';  // 設定預設顯示的分類

        // 生成 Categories 的卡片
        categories.forEach((category, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';  // 使用你定義的 .card class
            cardElement.setAttribute('data-category', category.alt);

            const imgElement = document.createElement('img');
            imgElement.src = category.image;
            imgElement.alt = category.alt;
            imgElement.className = 'card-image';  // 使用你定義的 .card-image class

            const textElement = document.createElement('p');
            textElement.textContent = category.text;
            textElement.className = 'card-text';  // 使用你定義的 .card-text class

            cardElement.appendChild(imgElement);
            cardElement.appendChild(textElement);
            categoryContainer.appendChild(cardElement);

            // 設置分類卡片的樣式
            cardElement.style.display = 'flex';
            cardElement.style.flexDirection = 'row';

            // 點擊分類卡片後顯示對應的產品
            cardElement.addEventListener('click', function() {
                displayProducts(category.alt, products);
            });

            // 預設將「漢堡」卡片設為懸停狀態
            if (category.text === defaultCategory) {
                cardElement.classList.add('card-hover');  // 添加懸停狀態的 class
                displayProducts(category.alt, products); // 顯示預設分類的產品
            }
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
}



/******************************按下分類按鈕跑出相對應的商品**************************************/

function displayProducts(categoryAlt, products) {
    const productContainer = document.getElementById('customCardContainer');
    productContainer.innerHTML = ''; // 清空之前顯示的產品

    // 過濾出符合分類的產品
    const filteredProducts = products.filter(product => product.alt === categoryAlt);

    // 生成符合條件的產品卡片
    filteredProducts.forEach((product, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'custom-card';  // 使用你定義的 .custom-card class

        const imgElement = document.createElement('img');
        imgElement.src = product.image;
        imgElement.alt = product.alt;
        imgElement.className = 'custom-card-img';  // 使用你定義的 .custom-card-img class

        const cardBody = document.createElement('div');
        cardBody.className = 'custom-card-body';

        const titleElement = document.createElement('h3');
        titleElement.textContent = product.text;
        titleElement.className = 'custom-card-title';  // 使用你定義的 .custom-card-title class

        // 新增價格元素
        const priceElement = document.createElement('p');
        priceElement.textContent = `${product.currency}${product.price}`;
        priceElement.className = 'custom-card-price';  // 可以自定義樣式 .custom-card-price

        const detailsElement = document.createElement('p');
        detailsElement.textContent = product.details;
        detailsElement.className = 'custom-card-text';  // 使用你定義的 .custom-card-text class

        // 創建按鈕
        const buttonElement = document.createElement('a');
        buttonElement.href = '#';  // 按鈕點擊後可以設置跳轉鏈接
        buttonElement.textContent = '查看詳情';  // 按鈕文字
        buttonElement.className = 'custom-btn';  // 使用你定義的 .custom-btn class

        // 添加按鈕的點擊事件，觸發顯示 mealModal
        buttonElement.addEventListener('click', function (event) {
            event.preventDefault();
            openMealModal(index, product);  // 在點擊時調用 openMealModal 並傳遞當前的產品索引和資料
        });

        cardBody.appendChild(titleElement);
        cardBody.appendChild(priceElement);  // 新增價格到卡片
        cardBody.appendChild(detailsElement);
        cardBody.appendChild(buttonElement);  // 將按鈕添加到卡片內部

        cardElement.appendChild(imgElement);
        cardElement.appendChild(cardBody);

        productContainer.appendChild(cardElement);
    });
}





/**********************************打開 mealModal 並顯示對應的資料***************************************************/

// 綁定 "叉叉" 的點擊事件
document.querySelector('.close-btn').addEventListener('click', closeModal);



function openMealModal(index, product) {


    const modal = document.getElementById('mealModal');
    modal.classList.add('show'); // 添加 show class 觸發動畫效果
    modal.style.display = 'block'; // 顯示模態視窗



    // 設置模態視窗中的基本資訊
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-image').alt = product.alt;
    document.getElementById('modal-title').textContent = product.text;
    document.getElementById('modal-price').textContent = `NT$ ${product.price}`;

    // 清空加選類別和選項的容器
    const optionsContainer = document.querySelector('.modal-options');
    optionsContainer.innerHTML = ''; // 確保每次打開模態視窗都清空之前的選項

    // 檢查產品是否有加選選項
    if (product.options && product.options.length > 0) {
        product.options.forEach(optionCategory => {
            // 創建一個新的 div 來包含每個加選類別
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('modal-options-categories');

            // 創建類別標題
            const categoryTitle = document.createElement('p');
            categoryTitle.textContent = optionCategory.category;
            categoryDiv.appendChild(categoryTitle);

            // 創建每個選項的 checkbox
            optionCategory.items.forEach(item => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = optionCategory.category === '飲料溫度' ? 'radio' : 'checkbox'; // 根据类别选择 radio 或 checkbox
                input.name = optionCategory.category; // 设置相同 name 以便选择一项
                input.value = item.value;

                // 显示选项的名称和价格
                label.textContent = `${item.label} (+NT$${item.price}) `;
                label.prepend(input);

                // 把 label 加入到該類別的 div 中
                categoryDiv.appendChild(label);
                categoryDiv.appendChild(document.createElement('br')); // 換行
            });

            // 將該類別加入到 optionsContainer 中
            optionsContainer.appendChild(categoryDiv);
        });
    } else {
        // 如果沒有加選選項，顯示提示文字
        const noOptionsMessage = document.createElement('p');
        noOptionsMessage.textContent = "無可選的加選項目";
        optionsContainer.appendChild(noOptionsMessage);
    }

    // 顯示模態視窗
    document.getElementById('mealModal').style.display = 'block';
}


// 關閉 modal
function closeModal() {
    document.querySelector('.close-btn').addEventListener('click', function() {
        const modal = document.getElementById('mealModal');
        modal.classList.remove('show'); // 移除 show class
        modal.style.display = 'none'; // 隱藏模態視窗
    });
}





/**********************************************************訂單******************************************************* */
document.getElementById('add-to-cart').addEventListener('click', function() {
    // 從模態窗口中獲取商品資訊
    const productName = document.getElementById('modal-title').textContent;
    const productPrice = parseFloat(document.getElementById('modal-price').textContent.replace('NT$', '').trim());

    // 獲取已選的加選項目
    const selectedOptions = [];
    document.querySelectorAll('.modal-options input:checked').forEach(input => {
        const label = input.nextSibling.textContent.trim();
        const price = parseFloat(label.match(/\+NT\$([0-9]+)/)[1]); // 解析加選價格
        selectedOptions.push({ name: input.value, price });
    });

    // 建立一個商品項目 div
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item'); // cart-item 設置為 Flexbox

    // 創建 item-name div 並添加商品名稱
    const itemNameDiv = document.createElement('div');
    itemNameDiv.classList.add('item-name');
    const itemName = document.createElement('p');
    itemName.textContent = productName;
    itemNameDiv.appendChild(itemName);

    // 創建 add-ons div 並添加加選項目
    const addOnsDiv = document.createElement('div');
    addOnsDiv.classList.add('add-ons');
    if (selectedOptions.length > 0) {
        const optionsList = document.createElement('ul');
        selectedOptions.forEach(option => {
            const optionItem = document.createElement('li');
            optionItem.textContent = `${option.name} (+NT$${option.price})`;
            optionsList.appendChild(optionItem);
        });
        addOnsDiv.appendChild(optionsList);
    }

    // 創建 total-price div 並計算總價
    const totalPriceDiv = document.createElement('div');
    totalPriceDiv.classList.add('total-price');
    let totalPrice = productPrice + selectedOptions.reduce((total, option) => total + option.price, 0);
    const totalPriceElement = document.createElement('p');
    totalPriceElement.textContent = `NT$ ${totalPrice}`;
    totalPriceDiv.appendChild(totalPriceElement);

    // 創建數量控制區域
    const quantityDiv = document.createElement('div');
    quantityDiv.classList.add('quantity-control');

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = 1; // 默認數量為 1
    quantityInput.readOnly = true;

    // 增加數量的事件
    increaseButton.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        quantity += 1;
        quantityInput.value = quantity;
        updateTotalPrice();
    });

    // 減少數量的事件
    decreaseButton.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantity -= 1;
            quantityInput.value = quantity;
            updateTotalPrice();
        }
    });

    // 更新總價
    function updateTotalPrice() {
        const quantity = parseInt(quantityInput.value);
        const updatedTotalPrice = (productPrice + selectedOptions.reduce((total, option) => total + option.price, 0)) * quantity;
        totalPriceElement.textContent = `NT$ ${updatedTotalPrice}`;
        
        // 更新總金額和點數
        updateTotalAmount();
    }

    // 將數量控制按鈕加入數量控制區域
    quantityDiv.appendChild(decreaseButton);
    quantityDiv.appendChild(quantityInput);
    quantityDiv.appendChild(increaseButton);

    // 添加刪除按鈕 (垃圾桶圖標)
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>';
    
    // 刪除功能
    deleteButton.addEventListener('click', function() {
        // 在刪除購物車項目之前，將折抵點數返回到用戶點數中
        const discountPoints = parseInt(document.getElementById('discount-points').value) || 0;
        if (discountPoints > 0) {
            const pointsDisplay = document.getElementById('points-display');
            let currentPoints = parseInt(pointsDisplay.value) || 0;
            pointsDisplay.value = currentPoints + discountPoints;
        }
        cartItem.remove();
        // 更新總金額和點數
        updateTotalAmount();
    });

    // 將每個部分加入 cart-item
    cartItem.appendChild(itemNameDiv);
    cartItem.appendChild(addOnsDiv);
    cartItem.appendChild(totalPriceDiv);
    cartItem.appendChild(quantityDiv); // 將數量控制加入 cart-item
    cartItem.appendChild(deleteButton);

    // 將商品項目加入到訂單區
    document.getElementById('cart-items').appendChild(cartItem);

    // 隱藏模態視窗
    document.getElementById('mealModal').style.display = 'none';

    // 更新總金額和點數
    updateTotalAmount();
});

// 計算所有購物車商品的總金額和點數
function updateTotalAmount() {
    let totalAmount = 0;

    // 從購物車中獲取所有商品項目，計算每個商品的總價並相加
    document.querySelectorAll('.cart-item').forEach(cartItem => {
        const itemTotalPrice = parseFloat(cartItem.querySelector('.total-price p').textContent.replace('NT$', '').trim());
        totalAmount += itemTotalPrice;
    });

    // 更新總金額顯示
    document.getElementById('total-amount').value = `NT$ ${Math.round(totalAmount)}`;

    // 計算獲得的點數，每 60 元獲得 1 點，無條件捨去
    const pointsEarned = Math.floor(totalAmount / 60);
    document.getElementById('points-earned').value = pointsEarned;

    // 更新點數折抵功能
    updateDiscountPoints(totalAmount);
}

/************************************************更新點數折抵功能******************************************/
function updateDiscountPoints(totalAmount) {
    const discountPointsInput = document.getElementById('discount-points');
    
    if (totalAmount >= 60) {
        discountPointsInput.disabled = false;
    } else {
        discountPointsInput.disabled = true;
        discountPointsInput.value = '';
    }

    // 當輸入框內容改變時，更新總金額
    discountPointsInput.addEventListener('input', function() {
        let discountPoints = parseInt(discountPointsInput.value) || 0;
        if (discountPoints > 10) 
        {
            discountPoints = 10;
            // alert('每張訂單最多折抵10點');
        }
        if (discountPoints < 0) discountPoints = 0;

        // 計算最終價格
        const finalAmount = Math.max(totalAmount - discountPoints, 0);
        document.getElementById('total-amount').value = `NT$ ${Math.round(finalAmount)}`;
    });
}


/***********************************************頁面加載時獲取用戶點數*********************************************/
async function loadPoints() {
    try {
      // 假設 API 請求
      const response = await fetch('/html/json/members.json');
      const data = await response.json();

      // 假設只顯示第一個會員的點數
      const points = data.members[0].points;

      // 更新輸入框中的值
      document.getElementById('points-display').value = points;
    } catch (error) {
      console.error('載入 JSON 時發生錯誤: ', error);
    }
}



/********************************************網頁打開就要執行的方法************************************************ */
// 頁面加載時調用 loadCards 函數
window.onload = function() {
    loadPoints();
    loadCards();
    generateClosestTimeOptions()
};






