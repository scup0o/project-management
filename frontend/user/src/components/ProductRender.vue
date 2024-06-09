<script>
    import ProductService from "@/services/product.service";
    import GenreService from "@/services/genre.service";
    import ArtistService from "@/services/artist.service";
    import CartService from "@/services/cart.service";
    import FavoriteService from "@/services/favorite.service";


    import VueJwtDecode from 'vue-jwt-decode';

    export default{
        components:{
        },

        props: {
            productsList: {
                Type: Array,
                default: []
            },
            descriptionL: {type: String},
            titleL: {type: String},
            imageL: {type: String},
        },

        data(){
            return{
                searchText: this.$route.query.search,
                filterArtist: this.$route.query.filterArtist,
                filterGenre: this.$route.query.filterGenre,
                product: this.$route.query.product,
                description: this.descriptionL,
                products: [],
                title : this.titleL,
                image: this.imageL,
                onPage: 0,
                pageNumber: 0,
                onPageTemp: 1,
                checkUser: localStorage.getItem('auth'),
                genreList: [],
                artistList: [],
                editProduct: null,
                edit: false,
                favorite: {},

                //cart
                tempCart:JSON.parse(localStorage.getItem('tempcart')),
            }
        },

        mounted(){
            try{
                if (this.checkUser) this.checkUser = VueJwtDecode.decode(localStorage.getItem('auth'));
                else this.checkUser = {username: '', role: ''}

                if (this.filterArtist === undefined) this.filterArtist = '';
                if (this.filterGenre === undefined) this.filterGenre = '';
                if (this.searchText === undefined) this.searchText = '';

                this.products = this.productsList
                
                this.retrieveGenreAndArtist()

                if (this.productsList.length === 0){
                    this.retrieveProduct();
                }

                if (this.product === 'all'){
                    this.title = 'Đĩa than'
                    this.image = 'vinyldisk.jpg'
                    this.description = 'Đĩa than hoặc Đĩa nhựa là một hình thức đồng bộ tín hiệu âm thanh vào lưu trữ dạng đĩa chất liệu Polyvinyl chloride và được ghi theo từng rãnh với độ dập nổi khác nhau. Các đường rãnh được đọc từ vòng lớn nhất cho tới tâm của chiếc đĩa.'
                }
                
                console.log(this.products);
                console.log(this.product);
                console.log(this.productsList)

                if (this.tempCart === null) {this.tempCart = {product: [{
                                                                  productId: {type: String},
                                                                  quantity: {type : Number}
                                                              }],

                                                    totalPrice: {type: Number},

                                                    totalQuantity: {type: Number}};
                                    this.tempCart.totalQuantity = 0;
                                    this.tempCart.totalPrice = 0;
                                    this.tempCart.product = []}
            }

            catch(error) {console.log(error)}
            
        },

        methods:{
            async favoriteupdate(product){
                if (this.checkUser.username !='')
      this.favorite = await FavoriteService.update(this.checkUser.id, product);
    else{
      this.$toast.open({
            message: 'Bạn cần đăng nhập để thêm sản phẩm vào mục yêu thích',
            type: "error",
            duration: 5000,
            dismissible: true,
          });
    }
            },
            async addCart(product) {
      //console.log(product);
      let t ='no';
      console.log(this.checkUser);
      if (this.checkUser.username === "") {
        //console.log((this.tempCart.product)[0].productId);
        console.log(this.tempCart.totalQuantity);
        const check = this.tempCart.product.findIndex(
          (x) => x.productId === product._id.toString()
        );
        console.log(check);
        if (check === -1) {
          const newProduct = { productId: product._id, quantity: 1 };
          this.tempCart.product.push(newProduct);
          t='yes'
        } else {
          if (this.tempCart.product[check].quantity+1 > product.quantity)
          this.$toast.open({
            message: `Số lượng sản phẩm ${product.name} có trong giỏ hàng đã bằng số lượng sản phẩm ${product.name} có trong kho hàng`,
            type: "error",
            duration: 5000,
            dismissible: true,
          });
          else{this.tempCart.product[check].quantity++; t='yes'}
          
        }
        /*if (product.discount > 0)
          this.tempCart.totalPrice =
            this.tempCart.totalPrice +
            (product.price - product.price * (product.discount / 100));
        else
          this.tempCart.totalPrice = product.price + this.tempCart.totalPrice;*/
        

        //console.log(JSON.parse(JSON.stringify(this.tempCart)))
        if (t==='yes'){this.tempCart.totalQuantity++;localStorage.setItem("tempcart", JSON.stringify(this.tempCart));
        console.log(JSON.parse(localStorage.getItem("tempcart")));
        this.$toast.open({
          message: "Thêm vào giỏ hàng thành công",
          type: "success",
          duration: 3000,
          dismissible: true,
        });}
        
      } else {
        console.log(this.checkUser.id);
        product.util = "add";
        const check = await CartService.update(this.checkUser.id, product);
        console.log(check);
        if (check === "added") {
          this.$toast.open({
            message: "Thêm vào giỏ hàng thành công",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
        }
        if (check === "quantity") {
          this.$toast.open({
            message: `Số lượng sản phẩm ${product.name} có trong giỏ hàng bằng số lượng sản phẩm ${product.name} có trong kho hàng`,
            type: "error",
            duration: 5000,
            dismissible: true,
          });
        }
      }
    },
            async retrieveGenreAndArtist(){
                this.genreList = await GenreService.getAll();
                this.artistList = await ArtistService.getAll()
            },

            async retrieveProduct(){
                try{
                    this.products = await ProductService.getAll();
                    if (this.checkUser.username !='')
                    this.favorite = await FavoriteService.get(this.checkUser.id)
                    
                    this.products.forEach(async (product, index) =>{
                        product.buttonlabel='Thêm vào yêu thích';
                        if (this.checkUser.username !=''){
                        let i = this.favorite.productId.findIndex(x => x._id === product._id);
                        if (i==-1) product.buttonlabel='Thêm vào yêu thích';
                        else product.buttonlabel='Bỏ thích';}
                        product.genreName = (await GenreService.get(product.genreId)).name
                        product.artistName = (await ArtistService.get(product.artistId)).name})
                    console.log(this.products);}
                catch (error){
                    console.log(error);
                }
            },

            uncheckGenre(){
                this.filterGenre = ''
            },

            uncheckArtist(){
                this.filterArtist = ''
            },
            
            async findArtist(){
                const artist = await ArtistService.find({ name: this.filterArtist})
                this.description = artist.description
                this.image = artist.image;
                this.title = artist.name
            },

            async findGenre(){
                const genre = await GenreService.find({ name: this.filterGenre})
                this.description = genre.description
                this.image = genre.image;
                this.title = genre.name
            }
        },

        computed:{
            filterDescription(){
                if (this.filterArtist === '' && this.filterGenre === '') return "Đĩa than hoặc Đĩa nhựa là một hình thức đồng bộ tín hiệu âm thanh vào lưu trữ dạng đĩa chất liệu Polyvinyl chloride và được ghi theo từng rãnh với độ dập nổi khác nhau. Các đường rãnh được đọc từ vòng lớn nhất cho tới tâm của chiếc đĩa.";
                if (this.filterArtist != ''){
                    this.findArtist();
                    console.log(this.description)
                    return this.description;
                }
                if (this.filterGenre != ''){
                    this.findGenre();
                    return this.description
                }
            },

            filterImage(){
                if (this.filterArtist === '' && this.filterGenre === '') return "vinyldisk.jpg";
                if (this.filterArtist != ''){
                    this.findArtist();
                    return this.image;
                }
                if (this.filterGenre != ''){
                    this.findGenre();
                    return this.image
                }
            },

            filterTitle(){
                if (this.filterArtist === '' && this.filterGenre === '') return "Đĩa than";
                if (this.filterArtist != ''){
                    this.findArtist();
                    return this.title;
                }
                if (this.filterGenre != ''){
                    this.findGenre();
                    return this.title
                }
            },

            productStrings(){
                return this.products.map((product) =>{
                    const {name, genreName, artistName } = product;
                    return [name, genreName, artistName].join("");
                });
            },

            filteredProducts(){
                if (!this.searchText && !this.filterArtist && !this.filterGenre) return this.products;
                else{
                    console.log(this.filterArtist);
                    console.log(this.filterGenre)
                    let tempProductList = this.products.filter((_product, index) => this.productStrings[index].toLowerCase().includes(this.searchText.toLowerCase()));
                    console.log(tempProductList)
                    const p = [];
                    if ((this.filterArtist!='') || (this.filterGenre!='')){
                        console.log('have')
                        if ((this.filterArtist!='') && (this.filterGenre!='')){
                            tempProductList.forEach((product, index) =>{
                                if ((product.genreName === this.filterGenre) && (product.artistName === this.filterArtist)){
                                    p.push(product)
                                    console.log(product);
                                }
                            })
                        }
                        else{
                            tempProductList.forEach((product, index) =>{
                                console.log(this.filterGenre);
                                console.log(product)
                                if ((product.genreName === this.filterGenre) || (product.artistName === this.filterArtist)){
                                    p.push(product)
                                    console.log(product);
                                }
                            })
                        }
                        return p;
                    }
                    console.log(p)
                    return tempProductList;
                }
            },

            filteredProductsCount(){
                return this.filteredProducts.length
            },

            sliceProduct(){
                //let pL = this.filteredProducts;
                let productListNumber = Math.ceil(this.filteredProducts.length / 6);
                this.pageNumber = productListNumber
                console.log(productListNumber)
                let count = 0;
                let tempProducts = []
                let i;
                for (i=0; i<productListNumber; i++){
                    tempProducts[i] = this.filteredProducts.slice(count,count+6);
                    count=count+6;
                    if (count > this.filteredProducts){

                    }
                    console.log(tempProducts);
                }
                return tempProducts;

            }
        },
    }
</script>
<template>
    <div class="container-fluid" style="overflow-x: hidden; background-color: rgb(255, 255, 255); border-radius: 10px 10px 10px 10px;">
        <div class="row" style="padding-top:20px">
            <div class="col-1"></div>
            <div class="col-2" style="padding:10px;
                                        border-radius: 10px 10px 10px 10px;">
                <div class="row">
                    <div class="col-6"><p style="font-family: 'RalewayBold';
                            font-size: 20px;">Thể loại</p></div>
                    <div class="col" style="display: inline;">
                        <button class="btn btn-outline-secondary" style="transform: scale(0.9);" @click="uncheckGenre"><i class="fa-solid fa-filter-circle-xmark"></i></button>
                    </div>
                    
                </div>
                <div style="height: 300px; overflow-y: scroll;" id="scrollbar">
                    <div  v-for="(genre) in genreList" :key="genre._id">
                        <input id="gname" type="radio" v-model="filterGenre" :value="genre.name" @click="onPage=0; onPageTemp=1">
                            {{ genre.name }}
                    </div>
                </div>
                <div class="row" style="padding-top:20px">
                    <div class="col-6"><p style="font-family: 'RalewayBold';
                            font-size: 20px;">Nghệ sĩ</p></div>
                    <div class="col" style="display: inline;">
                        <button class="btn btn-outline-secondary" style="transform: scale(0.9);" @click="uncheckArtist"><i class="fa-solid fa-filter-circle-xmark"></i></button>
                    </div>
                    
                </div>
                <div style="height: 300px; overflow-y: scroll;" id="scrollbar">
                    <div  v-for="(artist) in artistList" :key="artist._id">
                        <input id="gname" type="radio" v-model="filterArtist" :value="artist.name" @click="onPage=0; onPageTemp=1">
                            {{ artist.name }}
                    </div>
                </div>
            </div>
            <div class="col-1"></div>
            <div class="col-xl-7">
                <div class="row">
                    <div class="col-2 d-flex text-center justify-content-center" style="margin: auto">
                        <img :src="`../../src/assets/img/${filterImage}`"
                            style="width: 100px;
                                    height: 100px;
                                    border-radius: 100%;">
                    </div>
                    <div class="col-10">
                        <div class="row">
                            <p style="font-family: 'RalewayBold';
                                        font-size:18px">{{ filterTitle }}</p>
                        </div> 
                        <div class="row"
                            style="margin-top:-10px">
                            <p style="font-size:15px;
                                        line-height: 90%;"> {{ filterDescription }}</p>
                        </div>
                    </div>
                </div>
                <div class="row" style="padding-top:20px">
                    <div class="col-7" style="background-color:  rgb(246, 246, 246);"></div>
                    <div class="col-5 d-flex text-center" style="background-color:  rgb(246, 246, 246);">
                        <div class="input-group" style="margin-top:5px;
                                                        padding-bottom:5px">
                            <input
                                    type = "text"
                                    class ="form-control search-form"
                                    placeholder="Nhập thông tin cần tìm"
                                    v-model = "searchText"
                                    style="background-color: white;
                                            border-radius: 0px 0px 0px 0px;
                                            border-color: rgb(147, 147, 147);"/>
                            <button 
                                    class = "btn btn-outline-secondary search-button"
                                    type = "button">
                                    <i class="fa-solid fa-magnifying-glass search-icon"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row" style="padding-top:20px">
                    <div class="col-12" >
                        <div v-for="(products, index) in sliceProduct" :key="index" v-if="filteredProductsCount > 0">
                            <div v-if=" index===onPage"
                                        :is="products" >
                                <div class="row" v-for="(product, index) in products" :key="product" style="padding-bottom:15px;">
                                    
                                        
                                        <div class="product-container">
                                            <div class="col d-flex justify-content-start" style="margin-left:-12px">
                                            <div v-if="product.quantity === 0" class="" style="position: absolute;
                                                        background-color: rgb(21, 21, 21);
                                                        color:white;
                                                        font-family: RalewayBold;
                                                        padding:6px;
                                                        border-radius: 0px 10px 10px 0px;">Hết hàng</div>
                                            <div v-if="(product.discount > 0 && product.quantity > 0)" class="" style="position: absolute;
                                                        background-color: rgb(21, 21, 21);
                                                        color:white;
                                                        font-family: RalewayBold;
                                                        padding:6px;
                                                        border-radius: 0px 10px 10px 0px;">Giảm giá {{ product.discount }} %</div>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col d-flex text-center"
                                                @click="this.$router.push({name: 'productDetail', query: {name: product.name}})">
                                                <img style="display: inline-flex; margin:auto" class="preview img-thumbnail image" alt="" :src="`../../src/assets/img/${product.image[0]}`"/>
                                            </div>
                                            <div class="col-10">
                                                <div class="row">
                                                    <div class="col-8"
                                                        @click="this.$router.push({name: 'productDetail', query: {name: product.name}})">
                                                        <div class="row">
                                                            <p style="font-family: 'RalewayBold';
                                                                        font-size: 18px;">{{ product.name }}</p>
                                                        </div>
                                                        <div class="row" style="margin-top:-15px;
                                                                                font-size:15px;
                                                                                color:gray;">
                                                            <p>{{ product.genreName }}</p>
                                                        </div>
                                                        <div class="row" style="margin-top:-15px">
                                                            <p>{{ product.artistName }}</p>
                                                        </div>
                                                        <div class="row" style="margin-top:-15px;
                                                                                font-size:15px;
                                                                                font-family: 'RalewayItalic';">
                                                            <p v-snip="2">{{ product.description }}</p>
                                                        </div>
                                                    </div>
                                                    <div class="col text-center" style="">
                                                        <div class="row">
                                                            <div v-if="product.discount > 0">
                                                                <div class="row">
                                                                    <p>{{ new Intl.NumberFormat('vi-VN', {
                                                                                        style: 'currency',
                                                                                        currency: 'VND'
                                                                                    }).format((product.price)-(product.price)*(product.discount/100)) }}</p>
                                                                </div>
                                                                <div class="row" style="text-decoration-line: line-through;
                                                                                        margin-top:-20px;
                                                                                        color:gray">
                                                                    <p>({{ new Intl.NumberFormat('vi-VN', {
                                                                                        style: 'currency',
                                                                                        currency: 'VND'
                                                                                    }).format(product.price) }})</p>
                                                                </div>
                                                            </div>
                                                            <div v-else class="row" style="">
                                                                    <p>{{ new Intl.NumberFormat('vi-VN', {
                                                                                        style: 'currency',
                                                                                        currency: 'VND'
                                                                                    }).format(product.price) }}</p>
                                                            </div>
                                                        </div>
                                                        <div class="row" id="card-button" style="margin:auto">
                                                            <div class="col text-center">
                                                                <button v-if="(product.quantity > 0)"
                                                                        class="btn btn-dark"
                                                                        @click="addCart(product)"
                                                                        >
                                                                Thêm vào giỏ hàng
                                                                <i class="fa-solid fa-bag-shopping" style="margin-left:10px"></i>
                                                                </button>
                                                                <button v-if="(product.quantity === 0)"
                                                                        class="btn btn-dark"
                                                                        @click="this.$toast.open({
                                                                        message: 'Sản phẩm đã hết hàng',
                                                                        type: 'error',
                                                                        duration: 3000,
                                                                        dismissible: true
                                                                        })">
                                                                Hết hàng
                                                                </button>
                                                                <button class="btn btn-light"
                                                                        style="margin-top:5px;
                                                                                border-color:rgb(156, 156, 156);"
                                                                                @click="favoriteupdate(product);
                  if (checkUser.username != ''){if (product.buttonlabel==='Bỏ thích'){ product.buttonlabel = 'Thêm vào yêu thích'}
                          else product.buttonlabel = 'Bỏ thích'}"
                >
                  {{product.buttonlabel}}
                                                                <i class="fa-regular fa-heart" style="margin-left:10px;"></i>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p v-else>Không có sản phẩm nào.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row text-center d-flex" v-if="filteredProductsCount > 0" style="padding-bottom:20px">
                <div >
                    <button v-if="onPage!=0" 
                            @click="onPage--, onPageTemp--" 
                            class="btn btn-info" 
                            style=" margin-right:10px; background-color: white; border-color: black; border-width: 0cap;" 
                            title="Trang trước"><i class="fa-solid fa-caret-left"></i></button>
                    <div style="display:inline"><input class="form-control" style="width:50px; display: inline;" type="number" v-model="onPageTemp" @keyup.enter="onPage=(onPageTemp-1), onPageTemp=(onPage+1)">/ {{ pageNumber }}</div>
                    <button v-if="onPageTemp <pageNumber" 
                            @click="onPage++, onPageTemp=(onPage+1)" 
                            class="btn btn-info" 
                            style=" margin-left:10px; background-color: white; border-color: black; border-width: 0cap;" 
                            title="Trang sau"><i class="fa-solid fa-caret-right"></i></button>
                </div>
        </div>
    </div>
    <ProductForm v-if="edit === true"
                :product="editProduct"
                :e="true"
                @close="edit = false"
                @refresh="this.$emit('refresh'); this.retrieveProduct()">
        
  </ProductForm>
</template>
<style scoped>
.product-container{
    box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
    padding: 10px;
    border-radius: 10px 10px 10px 10px;
    background-color: white;
} 

.product-container:hover{
    transform: scale(1.05);
    transition: transform 100ms ease-in-out;
}

#scrollbar::-webkit-scrollbar
{
	width: 10px;
	background-color: #18181800;
}

#scrollbar::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #9f9f9f;
}

div#card-button button{
    width:100%;
    font-size: 15px;

}
</style>