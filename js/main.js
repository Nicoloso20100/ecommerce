
const productContainer = document.querySelector('.shop-items')
const cartContainer = document.querySelector('.cart-items')
const totalElement = document.querySelector('.cart-total-title')
const buttonModal = document.querySelector('.button-modal')
const cartSection = document.querySelector('.cart-section')
const buttonPurchase = document.querySelector('.btn-purchase')
const buttonRemove = document.querySelector('.btn-remove-all')
const circleIcon = document.querySelector('.circle-icon')
const buttonSwitch = document.querySelector('.switch')



let shoppingCartArray = []
let total = 0


//peticion de productos al servidor
let res = await fetch('https://api.escuelajs.co/api/v1/products')
let data = await res.json()

//se limitan los productos
const productsArray = data.slice(39, 51)
console.log(productsArray);

//se imprimen los productos

productsArray.forEach(product => {
    productContainer.innerHTML += `
    <div class="shop-item" id="${product.id}">
        <img class="shop-item-image" src="${product.images[0]}">
        <span class="shop-item-title">${product.title}</span>
        <div class="shop-item-details">
            <span class="shop-item-price">$${product.price}</span>
            <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
        </div>
    </div>`
})

//escucha evento de add
let addBtns = document.querySelectorAll('.shop-item-button')
addBtns = [...addBtns]
addBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        console.log('click');
        //se agrega productos al arrego carrito

        //buscar id del producto
        console.log(e.target.parentNode.parentNode.id);
        let actualID = parseInt(e.target.parentNode.parentNode.id)
        console.log(typeof (actualID));

        //con el id encontrar el objeto
        let actualProduct = productsArray.find(item => item.id === actualID)

        if (actualProduct.quantity === undefined) {
            actualProduct.quantity = 1
        }

        //condicion si producto existe
        let exist = false
        shoppingCartArray.forEach(product => {
            if (actualID == product.id) {
                exist = true
            }
        })

        if (exist) {
            actualProduct.quantity++
        } else {
            shoppingCartArray.push(actualProduct)
        }

        Toastify({
            text: 'Producto añadido al carrito',
            duration: 1500,
            style: {
                color: 'white',
                width: '20vw',
                height: 80,
                background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,121,212,1) 0%, rgba(0,212,255,1) 100%), rgb(2,0,36)',
            },
            gravity: 'bottom',

        }).showToast()

        //dibujar en el dom el carrito actualizado
        drawItems()
        // Actualizar valor total
        getTotal()
        //Actualizar valor total input
        putAEventListenerInNumbericInput()
        //remover producto
        putAEventListenerInRemoveItems()
        //icono
        circleCartIcon()
    })
})

//imprimir valor total en carrito

function getTotal() {
    let sumTotal
    let total = shoppingCartArray.reduce((sum, item) => {
        return sumTotal = sum + item.quantity * item.price
    }, 0)
    totalElement.innerHTML = `$${total}`

}

function drawItems() {
    cartContainer.innerHTML = ``
    shoppingCartArray.forEach(item => {
        cartContainer.innerHTML += `
        <div class="cart-row" id="${item.id}">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${item.images}" width="100" height="100">
                <span class="cart-item-title">${item.title} </span>
            </div>
            <span class="cart-price cart-column">$${item.price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" min="1" type="number" value="${item.quantity}">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>
        </div>`
    })
    putAEventListenerInRemoveItems()

}

function putAEventListenerInNumbericInput() {
    let inputNumber = document.querySelectorAll('.cart-quantity-input')
    inputNumber = [...inputNumber]
    inputNumber.forEach(item => {
        item.addEventListener('click', e => {
            //conseguir id producto
            let actualProductId = parseInt(e.target.parentNode.parentNode.id)
            let actualProductQuantity = parseInt(e.target.value)

            //buscar objeto id
            let actualProductObject = shoppingCartArray.find(item => item.id == actualProductId)
            console.log(actualProductObject);

            //actualizar numero quantity
            actualProductObject.quantity = actualProductQuantity
            //actualizar precio total
            getTotal()

        })
    });
}

function putAEventListenerInRemoveItems() {
    let removeBtns = document.querySelectorAll('.btn-danger')
    removeBtns = [...removeBtns]
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {

            //conseguir id producto
            let actualProductIdRemove = parseInt(e.target.parentNode.parentNode.id)

            //buscar objeto id
            let actualProductObjectRemove = shoppingCartArray.find(item => item.id == actualProductIdRemove)

            //remover del array cart

            shoppingCartArray = shoppingCartArray.filter(item => item !== actualProductObjectRemove)
            console.log(shoppingCartArray);

            //actualizar precio total
            drawItems()
            getTotal()
            putAEventListenerInNumbericInput()
            circleCartIcon()

        })
    });
}

//estilo ayuda de carrito
function circleCartIcon() {
    console.log(shoppingCartArray.length);
    if (shoppingCartArray.length === 0) {
        console.log('vacio');
        circleIcon.style.display = "none"
    } else {
        console.log('hay algo');
        circleIcon.style.display = "block"
    }
}

//Cambiar modo
buttonSwitch.addEventListener('click', () => {
    document.body.classList.toggle('light')
    buttonSwitch.classList.toggle('active')

    //Se guarda en tema en el localstorage
    if (document.body.classList.contains('light')) {
        localStorage.setItem('light-theme', 'true')

    } else {
        localStorage.setItem('light-theme', 'false')
    }
})

//obtenemos el modo actual
if (localStorage.getItem('light-theme') === 'true') {
    buttonSwitch.classList.add('active')
    document.body.classList.add('light')
} else {
    document.body.classList.remove('light')
    buttonSwitch.classList.remove('active')
}

//boton mostrar seccion de carrito
buttonModal.addEventListener('click', () => {
    cartSection.classList.toggle("modal") ?
        document.body.style.overflow = "hidden" :
        document.body.style.overflow = "visible"
})

//boton comprar (mercadopago)
buttonPurchase.addEventListener('click', () => {
    if (shoppingCartArray.length == 0) {
        console.log('vacio');
    } else if (shoppingCartArray.length != 0) {
        buttonPurchase.setAttribute('href', 'https://mpago.la/2jpRzd9')
        buttonPurchase.setAttribute('target', '_blank')
        buttonPurchase.setAttribute('rel', 'noopener noreferrer')
    }

})

//boton vaciar carrito
buttonRemove.addEventListener('click', () => {
    if (shoppingCartArray != 0) {
        shoppingCartArray = []
        Toastify({
            text: 'Carrito vaciado',
            duration: 1500,
            style: {
                color: 'white',
                width: '20vw',
                height: 80,
                background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,0,0,1) 0%, rgba(238,0,105,1) 100%), rgb(2,0,36)',
            },
            gravity: 'bottom',

        }).showToast()

        drawItems()
        getTotal()
        putAEventListenerInNumbericInput()
        circleCartIcon()
    }

})



window.addEventListener('load', circleCartIcon())

