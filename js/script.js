
// Helpers code start here
let isNull = null, isEmpty;

isNull = function(data) {
    if (data === null) {
        return true;
    }
    else {
        return false;
    }
}

// Helpers code ends here

/**
 * <li>
        <i class="is-required" required="true"></i>
        <label>Manjal</label>
        <i class="delete">X</i>
    </li>
 */

// getJson = async function() {
//     let url = 'https://api.jsonserve.com/O1rztJ', response;

//     response = fetch(url);
//     sampleListData = await response;

// }();

/* Fresh code starts here */

// declarations

let localApiUrl = 'http://localhost:3000/api/',
    liveApiUrl = 'https://todo-list-plyq.onrender.com/api/',
    hostname = window.location.hostname, getProducts, allProducts = [],
    submitItem, validateInput, listObject, showInvalidInput, listTemplate = null, showList = null, itemData = null,
    addItem = null, getJson, addProduct, showNotification, deleteProduct, modifyProduct, updateProduct, isEnableEdit = true, enableEdit;

const domain = (hostname === '127.0.0.1') ? localApiUrl : liveApiUrl,
      addButton = document.querySelector('.todo-list-input-container form button'),
      notificationContainer = document.querySelector('#notification');

showNotification = (message, notificationClass) => {
    notificationContainer.style.display = 'block';
    notificationContainer.classList.add(notificationClass);
    notificationContainer.firstElementChild.innerText = message;

    setTimeout(() => {
        location.reload();
        // notificationContainer.classList.remove(notificationClass);
        // notificationContainer.style.display = 'none';
    }, 500);
};

//  GET products
getProducts = async function getData() {
    const url = `${domain}products`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`getProduct response status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error(error.message);
    }
}

addItem = function (data) {
    let todoListViewContainer = document.querySelector('.todo-list-view ul'),
        listTemplate = `<li list-id=${data.productid}><i onclick='modifyProduct(${data.productid},${!data.isactive})'id='is-required' class="${(data.isactive) ? 'list-required' : 'list-not-required'}" required="${data.isactive}"></i><label contentEditable='false'>${data.productname}</label><i class="productEdit" onclick='((isEnableEdit) ? enableEdit(${data.productid}) : modifyProduct(${data.productid},${data.isactive}))'>Edit</i><i class="delete" onclick='removeItemFromList(${data.productid})'>X</i></li>`,
        tempDiv = document.createElement("div");
        tempDiv.innerHTML = listTemplate;
        while (tempDiv.firstChild) {
            todoListViewContainer.appendChild(tempDiv.firstChild);
        }
        
}

enableEdit = (id) => {
    let currentProduct = document.querySelector(`[list-id='${id}']`);

    currentProduct.querySelector('label').setAttribute('contentEditable', true);
    currentProduct.querySelector('.productEdit').innerText = 'Save';
    currentProduct.querySelector('.productEdit').style.textDecoration = 'underline'
    isEnableEdit = false;
}

showList = function() {
    getProducts().then((productsData) => {
        productsData.forEach(data => {
            addItem(data);
        });
    });
}

// POST product
addProduct = async (product) => {
    try {
      
        const response = await fetch(`${domain}products`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'productname': product,
                'isactive': true,
                'price': 0,
                'quantity': 0,
            }),
        });
        return await response.json();
    } catch (error) {
        showNotification(error, 'notification-danger');
    }
};

// Delete a product
deleteProduct = async (id) => {
    try {
      const response = await fetch(`${domain}products/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        showNotification('Deleted Successfully', 'notification-success');
      } else {
        showNotification('Failed to delete', 'notification-danger');
      }
    } catch (error) {
        throw new Error(`Error deleting data: ${error}`);
    }
};

// PUT for product
updateProduct = async (currentProductObj) => {
    try {
      const response = await fetch(`${domain}products/${currentProductObj.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'productname': currentProductObj.productname,
            'isactive': currentProductObj.isactive,
            'price': 0,
            'quantity': 0,
          
        }),
      });
  
      return await response.json();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  modifyProduct = (id,isactive) => {
    let currentProductObj = {}, currentProduct = document.querySelector(`[list-id='${id}']`);

    currentProductObj.id = id;
    currentProductObj.productname = currentProduct.querySelector('label').innerText;
    currentProductObj.isactive = isactive;
 
    updateProduct(currentProductObj).then((value) => {
        showNotification(value.message, 'notification-success');
    });
}

listObject = function(productname, isactive) {
    return {
        'productname': productname,
        'isactive': isactive,
        'price': 0,
        'quantity': 0
    }
}

validateInput = function(input) {
    if (isNull(input) === false) {
        return true;
    }
    else {
        return false;
    }
}

showInvalidInput = function() {
    // let document.
    alert('invalid input');
}

let addItemToList = function(data) {
    addProduct(data).then((value) => {
        showNotification(value.message, 'notification-success');
        console.log('Data added to list', value);
        // addItem(value);
    });
}

let removeItemFromList = function(id) {
    let i = 0, currentItem = document.querySelector(`[list-id='${id}']`);

    if (confirm(`Are sure you want to delete: ${currentItem.children[1].innerText}`) == true) {
        deleteProduct(id);
    }
}

submitItem = function(e) {
    let isValid, input;

    input = document.querySelector('#input');
    isValid = validateInput(input);

    if (isValid) {
        addItemToList(input.value);
        input.value = '';
    }
    else {
        showInvalidInput();
    }

    //Preventing page refresh
    e.preventDefault();
}

showList();
addButton.addEventListener("click", submitItem);



