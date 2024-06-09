<script setup>
/*import { useCartCounter } from '@/stores/storage'
import { onMounted } from 'vue'

const counter = useCartCounter()
let check;
let cart;

onMounted(() => {
    check = localStorage.getItem('auth');
    if (check){
        check= VueJwtDecode.decode(localStorage.getItem('auth'));
        getCart();
    }
    console.log('mounted!')
})

async function getCart(){
    cart = await CartService.get(check.id);
    console.log(cart)
    counter.$patch({ count: cart.totalQuantity });
    console.log()
}*/

</script>

<script>
import "@/assets/css/base.css"
import "@/assets/css/header.css"
import userService from "@/services/user.service.js"
import genreService from "@/services/genre.service.js"
import ArtistServicce from "@/services/artist.service"
import CartService from "@/services/cart.service"
import VueJwtDecode from 'vue-jwt-decode';


export default {
    
    components:{
    },

    data() {
            return {
                genres: [],
                artists: [],
                searchText: '',
                numEs: [1,2,3,4,5,6],
                mem:0,
                checkUser: localStorage.getItem('auth'),
                data: null
            }
    },

    watch:{
    },

    computed: {
        filteredGenresCount(){
            return this.genres.length
        },

        filteredArtistCount(){
            return this.artists.length
        },

        getCartNumber(){
           if (this.checkUser){}
           else return (JSON.parse(localStorage.getItem('tempcart')).totalQuantity)
        },

        checkCartNumber(){
            const stored = localStorage.getItem("tempcart");
            if (stored === null) {
				console.log("Nothing stored; default to `true`");
				return 0;
			} else {
				console.log("Using stored value " + stored);
				return JSON.parse(stored).totalQuantity;
			}
        },
    },
    
    mounted(){
        /*if (localStorage.tempcart){
            this.cartNumber = JSON.parse((localStorage.tempcart)).totalQuantity;
        }*/

        try{
        if (this.checkUser)
            this.checkUser = VueJwtDecode.decode(localStorage.getItem('auth'))
        //console.log(checkUser);
        this.refreshList();}
        catch(error){
            console.log(error);
        }
    },

    methods: {
        
        submit(){
            console.log(this.searchText)
            this.$router.push({name: 'products', query:{search: this.searchText}})
            this.searchText='';
        },

        async retrieveGenres(){
            try {
                this.genres = await genreService.getAll();
            }
            catch(error){
                console.log(error);
            }
        },

        async retrieveArtist(){
            try{
                this.artists = await ArtistServicce.getAll()
            }
            catch(error){
                console.log(error);
            }
        },

        logout(){
            userService.logout();
            localStorage.removeItem('auth');
            
            location.reload();
        },

        refreshList(){
            this.retrieveGenres();
            this.retrieveArtist()
        },
    },
};
</script>

<template>
     <nav class="navbar navbar-expand navbar-dark">
        <div class="container-fluid">
            <div class="container">
                <div class="row" style="padding:10px" >
                    
                    <div class="col-sm d-flex justify-content-start" style="margin: auto;">
                        <div style="display: inline-flex;">
                            <img src="../assets/img/logo-vinyldisk.png" class="logo-img">
                            <div style="width: 10px; margin-left: 10px; color:white; font-family: Lobster; font-size: 20px;">
                                <div>ĐĨA THAN</div>
                            </div>
                        </div>
                    </div>

                    
                    <div class="col-sm-5 d-flex justify-content-center"  style="margin: auto;">
                        <div class="input-group">
                            <input
                                type = "text"
                                class ="form-control search-form"
                                placeholder="Nhập thông tin cần tìm"
                                v-model="searchText"
                                style="height: 40px;"
                                @keyup.enter = "submit"
                            />
                            <button 
                                class = "btn btn-outline-secondary search-button"
                                type = "button"
                                @click = "submit">
                                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                            </button>
                        </div>
                    </div>

                    
                    <div class="col-sm text-end d-flex justify-content-end" style="margin: auto;">
                        <div v-if="!checkUser" class="center-1" id="header-button header-icon">
                                    <i class="fa-solid fa-cart-shopping cart-icon"
                                    @click="this.$router.push({name: 'userCart'});"
                                    title="Giỏ hàng"></i>
                            <button 
                                type="button" 
                                class="btn btn-outline-dark signup-button"
                                @click="this.$router.push({ name: 'user.register' });"
                                style="margin-left:20px">Đăng ký</button>
                            <button 
                                type="button" 
                                class="btn btn-outline-dark login-button"
                                @click="this.$router.push({ name: 'user.login' })"
                                style="margin-left:10px">Đăng nhập</button>
                        </div>
                        <div v-else>
                            <div  id="header-icon" class="center-1" style="display: inline;">
                                <div style="display: inline;">
                                <i class="fa-regular fa-heart"
                                    title="Yêu thích"
                                    @click="this.$router.push({name: 'favorite'})"></i>
                                
                                    <i class="fa-solid fa-cart-shopping"
                                    @click="this.$router.push({name: 'userCart'})"
                                    title="Giỏ hàng"></i>
                                
                                <i class="fa-solid fa-user"
                                    title="Tài khoản"
                                    @click="this.$router.push({name:'account'})"></i>
                                </div>
                            </div>
                            
                            <button 
                                type="button" 
                                class="btn signout-button"
                                @click="(logout)">Đăng xuất</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="" style=" background-color: rgb(182, 182, 182)">
            <div class="container d-flex justify-content-center">
                <div style="background-color:rgb(182, 182, 182)">
                    <div id="menu" class="">
                        <button
                            @click="this.$router.push({ name: 'vinylShop' })">Trang chủ</button>
                        <div style="display: inline;">
                            <button id="dropdown-parent"
                                @click=""
                                @mouseover="retrieveGenres()">
                                Thể loại
                                <div id="dropdown-child" style="overflow-x: hidden; color:black; margin-top:10px; z-index: 9999;">
                                <div class="row">
                                    <div class="col-3" id="dis">
                                        <img src="../assets/img/vinyldisk-pic-2.webp" alt="" class="pic">
                                    </div>
                                    <div class="col-9 text-start">
                                        <div class="row"
                                            style="padding-top:15px;
                                                    font-family: 'RalewayBold';
                                                    font-size:20px">Thể loại</div>
                                        <div  v-if="filteredGenresCount > 0">
                                            <div v-if="filteredGenresCount <=20">
                                                <div  class="row" style="padding-top:20px">
                                                    <div class="col-3" id="item-render"
                                                                    v-for="(genre) in genres"
                                                                    :key="genre._id"
                                                                    @click="this.$router.push({name: 'products', query: {filterGenre: genre.name}})"
                                                                    style="padding-bottom:15px">
                                                                        {{ genre.name }}
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-else class="col">
                                                <div  class="row" style="padding-top:30px">
                                                    <div class="col-3" id="item-render"
                                                                    v-for="index in 20"
                                                                    :key="index"
                                                                    @click="goTo"
                                                                    style="padding-bottom:15px">
                                                                        {{ genres[index].name }}
                                                    </div>
                                                </div>
                                                <div class="row"
                                                    style="font-family: 'RalewayBold';
                                                            font-size:17px;
                                                            padding-top:30px"
                                                    @click="">
                                                    <p>Xem tất cả thể loại
                                                    <i class="fa-solid fa-angles-right" style="display: inline;"></i></p></div>
                                            </div>
                                        </div>
                                    <p v-else>Không có thể loại nào.</p>
                                </div>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-down" style="padding-left: 5px; font-size: 0.6em;"></i>
                            </button>
                    </div>
                        <button id="dropdown-parent"
                                @mouseover="retrieveArtist()">
                            Nghệ sĩ
                            <div id="dropdown-child" style="overflow-x: hidden; color:black; margin-top:10px; z-index: 9999; ">
                                <div class="row">
                                    <div class="col-3" id="dis">
                                        <img src="../assets/img/vinyldisk-pic-1.jpg" alt="" class="pic">
                                    </div>
                                    <div class="col-9 text-start">
                                        <div class="row"
                                            style="padding-top:15px;
                                                    font-family: 'RalewayBold';
                                                    font-size:20px">Nghệ sĩ</div>
                                        <div  v-if="filteredArtistCount > 0">
                                            <div v-if="filteredArtistCount <=20">
                                                <div  class="row" style="padding-top:20px">
                                                    <div class="col-3" id="item-render"
                                                                    v-for="(artist) in artists"
                                                                    :key="artist._id"
                                                                    @click="this.$router.push({name: 'products', query: {filterArtist: artist.name}})"
                                                                    style="padding-bottom:15px">
                                                                        {{ artist.name }}
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-else class="col">
                                                <div  class="row" style="padding-top:30px">
                                                    <div class="col-3" id="item-render"
                                                                    v-for="index in 20"
                                                                    :key="index"
                                                                    @click=""
                                                                    style="padding-bottom:15px">
                                                                        {{ items[index].name }}
                                                    </div>
                                                </div>
                                                <div class="row"
                                                    style="font-family: 'RalewayBold';
                                                            font-size:17px;
                                                            padding-top:30px"
                                                    @click="">
                                                    <p>Xem tất cả nghệ sĩ
                                                    <i class="fa-solid fa-angles-right" style="display: inline;"></i></p></div>
                                            </div>
                                        </div>
                                    <p v-else>Không có thể loại nào.</p>
                                </div>
                                </div>
                            </div>
                            <i class="fa-solid fa-chevron-down" style="padding-left: 5px; font-size: 0.6em;"></i>
                        </button>
                        <button
                            @click="this.$router.push({name: 'products', query: {product: 'all'}})">Tất cả sản phẩm</button>
                    </div>
                </div>
            </div>
        </div>
    
    
</template>