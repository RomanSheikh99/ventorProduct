const app = Vue.createApp({
    data(){
        return{
            openCart: false,
            rate: 1,
            maxPrice: 0,
            minPrice: 0,
            searchText: '',
            isActive: 'products',
            navAc: 'all',
            msg: "hello world",
            cart: [],
            products: [],
            displayProducts: [],
            category: [
                {id: 1, cat: 'all'},
                {id: 2, cat: "men's clothing"},
                {id: 3, cat: "women's clothing"},
                {id: 4, cat: 'jewelery'},
                {id: 5, cat: 'electronics'}
            ],
        }
    },
    mounted(){
        this.handleProduct();
        // this.displayProducts = this.products;
    },
    methods: {
        handleProduct(){
            fetch("https://fakestoreapi.com/products")
            .then(res => res.json())
            .then(data => {
                let min = data[0].price;
                let max = data[0].price;
                data.map(item => {
                    if(item.price < min){
                        min = item.price;
                    }
                    if(item.price > max){
                        max = item.price;
                    }
                })
                this.maxPrice = max;
                this.minPrice = min;
                this.products = data;
                this.displayProducts = data;
            });
        },
        clicked(name){
            this.isActive = name;
        },
        handleCategory(cat){
            this.navAc = cat;
            if(cat === 'all'){
                this.displayProducts = this.products;
            }
            else{
                let catProducts = this.products.filter(item => item.category === cat);
                this.displayProducts = catProducts;
            }
        },
        handleAddToCart(id){
            let addedItem = this.cart.find(item => item.id === id);
            if(addedItem){
                let confirmation = confirm("This Product Is Already Added To The Cart. <br/> Do You Want To Update The Quantity?");
                if(confirmation){
                    addedItem.quanty++;
                }
            }
            else{
                let item = this.products.find(item => item.id === id);
                item.quanty = 1;
                this.cart.push(item);
                alert("Product Added To Cart");
            }
        },
        handleOpenCart(value){
            this.openCart = value;
        },
        quantyUP(i){
            this.cart[i].quanty++;
        },
        quantyDown(i){
            if(this.cart[i].quanty > 1){
                this.cart[i].quanty--;
            }
        },
        deleteCart(i){
            this.cart.splice(i, 1);
        }
    },
    watch:{
        rate(nv, ov){
            if(nv < 1 || nv > 5){
                this.rate = ov;
                alert('Rating Only 1 to 5')
            }
            let rateProducts = this.products.filter(item => item.rating.rate >= nv);
            this.displayProducts = rateProducts;
        },
        minPrice(nv){
            let priceProducts = this.products.filter(item => item.price >= nv && item.price <= this.maxPrice);
            this.displayProducts = priceProducts;
        },
        maxPrice(nv){
            let priceProducts = this.products.filter(item => item.price <= nv && item.price >= this.minPrice);
            this.displayProducts = priceProducts;
        },
        searchText(nv){
            let searchItems = this.products.filter(item => item.title.toLowerCase().indexOf(nv.toLowerCase()) > 0);
            this.displayProducts = searchItems;
        }
    }
})

app.mount("#app");