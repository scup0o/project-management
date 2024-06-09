<template>
  <div class="container-fluid">
    <Carousel :items-to-show="1" :wrap-around="true" :autoplay="3000">
      <Slide v-for="image in images" :key="image">
        <div class="carousel__item">
          <img
            style="
              border: none;
              width: 110%;
              height: 450px;
              justify-content: center;
              margin-right: 300px;
            "
            alt=""
            :src="image.source"
          />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
    <div class="row">
      <div
        class="col text-center"
        style="padding-top: 30px; padding-bottom: 30px"
      >
        <span>SẢN PHẨM MỚI</span>
      </div>
    </div>
    <div class="row container mx-auto" v-if="filterProductNew.length>0">
      <Carousel
        :autoplay="autoplayDurationNew"
        :items-to-show="5"
        :wrap-around="true"
        :transition="500"
      >
        <Slide
          @mouseover="autoplayDurationNew = 100000000"
          @mouseleave="autoplayDurationNew = 2000"
          v-for="(product, index) in filterProductNew"
          :key="product"
        >
          <div
            class="carousel__item"
            id="carousel-card"
            style="padding: 10px; height: 500px"
          >
            <div class="card-container" id="card-parent">
              <div class="col d-flex justify-content-end">
                <div
                  v-if="product.quantity === 0"
                  class=""
                  style="
                    position: absolute;
                    background-color: rgb(21, 21, 21);
                    color: white;
                    font-family: RalewayBold;
                    padding: 6px;
                    border-radius: 10px 0px 0px 10px;
                  "
                >
                  Hết hàng
                </div>
                <div
                  v-if="product.discount > 0 && product.quantity > 0"
                  class=""
                  style="
                    position: absolute;
                    background-color: rgb(21, 21, 21);
                    color: white;
                    font-family: RalewayBold;
                    padding: 6px;
                    border-radius: 10px 0px 0px 10px;
                  "
                >
                  Giảm giá {{ product.discount }} %
                </div>
              </div>
              <div
                class="row"
                @click="
                  this.$router.push({
                    name: 'productDetail',
                    query: { name: product.name },
                  })
                "
              >
                <div class="col text-center">
                  <img
                    style="
                      display: inline-flex;
                      border: none;
                      width: 200px;
                      height: 200px;
                    "
                    class="preview img-thumbnail image"
                    alt=""
                    :src="`../../src/assets/img/${product.image[0]}`"
                  />
                </div>
              </div>
              <div
                class="row"
                @click="
                  this.$router.push({
                    name: 'productDetail',
                    query: { name: product.name },
                  })
                "
              >
                <div
                  class="col text-start"
                  style="
                    font-family: 'RalewayBold';
                    font-size: 16px;
                    padding-top: 10px;
                  "
                >
                  {{ product.name }}
                </div>
              </div>
              <div
                class="row"
                @click="
                  this.$router.push({
                    name: 'productDetail',
                    query: { name: product.name },
                  })
                "
              >
                <div
                  class="col text-start"
                  style="color: gray; padding-top: 5px"
                >
                  {{ product.genreName }}
                </div>
              </div>
              <div
                class="row"
                @click="
                  this.$router.push({
                    name: 'productDetail',
                    query: { name: product.name },
                  })
                "
              >
                <div
                  class="col text-start"
                  style="font-size: 13px; padding-top: 5px"
                >
                  {{ product.artistName }}
                </div>
              </div>
              <div
                class="row"
                @click="
                  this.$router.push({
                    name: 'productDetail',
                    query: { name: product.name },
                  })
                "
              >
                <div
                  class="col text-start"
                  style="padding-top: 10px; font-size: 17px"
                >
                  <div v-if="product.discount > 0">
                    <div class="row">
                      <p>
                        {{
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            product.price -
                              product.price * (product.discount / 100)
                          )
                        }}
                      </p>
                    </div>
                    <div
                      class="row"
                      style="
                        text-decoration-line: line-through;
                        margin-top: -20px;
                        color: gray;
                      "
                    >
                      <p>
                        ({{
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)
                        }})
                      </p>
                    </div>
                  </div>
                  <div v-else class="row" style="">
                    <p>
                      {{
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)
                      }}
                    </p>
                  </div>
                  <div class="row"><p></p></div>
                </div>
              </div>
              <div
                class="row"
                id="card-child"
               
              >
                <button
                  v-if="product.quantity > 0"
                  class="btn btn-dark"
                  @click="addCart(product)"
                >
                  Thêm vào giỏ hàng
                  <i
                    class="fa-solid fa-bag-shopping"
                    style="margin-left: 10px"
                  ></i>
                </button>
                <button
                  v-if="product.quantity === 0"
                  class="btn btn-dark"
                  @click="
                    this.$toast.open({
                      message: 'Sản phẩm đã hết hàng',
                      type: 'error',
                      duration: 3000,
                      dismissible: true,
                    })
                  "
                >
                  Hết hàng
                </button>
                <button
                  class="btn btn-light"
                  style="margin-top: 5px; border-color: rgb(156, 156, 156)"
                  @click="favoriteupdate(product);
                  if (checkUser.username != ''){if (product.buttonlabel==='Bỏ thích'){ product.buttonlabel = 'Thêm vào yêu thích'}
                          else product.buttonlabel = 'Bỏ thích'}"
                >
                  {{product.buttonlabel}}
                  <i class="fa-regular fa-heart" style="margin-left: 10px"></i>
                </button>
              </div>

              
            </div>
          </div>
        </Slide>

        <template #addons>
          <Navigation>
            <template #next>
              <span class="nav-icon" style="margin-left: 100px">
                <i class="fa-solid fa-chevron-right"></i>
              </span>
            </template>
            <template #prev>
              <span class="nav-icon" style="margin-right: 100px"
                ><i class="fa-solid fa-chevron-left"></i>
              </span>
            </template>
          </Navigation>
        </template>
      </Carousel>
    </div>
    <div v-else class="col container mx-auto" style="padding-bottom:10px; text-align: center;">Không có sản phẩm nào</div>    <div class="row">
      <div
        class="col text-center"
        style="padding-top: 10px; padding-bottom: 30px"
      >
        <span>SẢN PHẨM GIẢM GIÁ</span>
      </div>
    </div>
    <div class="row container mx-auto" v-if="filterProductSale.length>0">
      <div class="col-9">
        <Carousel
          :autoplay="autoplayDurationSale"
          :items-to-show="3.5"
          :wrap-around="true"
          :transition="500"
        >
          <Slide
            @mouseover="autoplayDurationSale = 100000000"
            @mouseleave="autoplayDurationSale = 2000"
            v-for="(product, index) in filterProductSale"
            :key="product"
          >
            <div
              class="carousel__item"
              id="carousel-card"
              style="padding: 10px; height: 500px"
            >
              <div class="card-container" id="card-parent">
                <div class="col d-flex justify-content-end">
                  <div
                    v-if="product.quantity === 0"
                    class=""
                    style="
                      position: absolute;
                      background-color: rgb(21, 21, 21);
                      color: white;
                      font-family: RalewayBold;
                      padding: 6px;
                      border-radius: 10px 0px 0px 10px;
                    "
                  >
                    Hết hàng
                  </div>
                  <div
                    v-else
                    class=""
                    style="
                      position: absolute;
                      background-color: rgb(21, 21, 21);
                      color: white;
                      font-family: RalewayBold;
                      padding: 6px;
                      border-radius: 10px 0px 0px 10px;
                    "
                  >
                    Giảm giá {{ product.discount }} %
                  </div>
                </div>
                <div
                  class="row"
                  @click="
                    this.$router.push({
                      name: 'productDetail',
                      query: { name: product.name },
                    })
                  "
                >
                  <div class="col text-center">
                    <img
                      style="
                        display: inline-flex;
                        border: none;
                        width: 200px;
                        height: 200px;
                      "
                      class="preview img-thumbnail image"
                      alt=""
                      :src="`../../src/assets/img/${product.image[0]}`"
                    />
                  </div>
                </div>
                <div
                  class="row"
                  @click="
                    this.$router.push({
                      name: 'productDetail',
                      query: { name: product.name },
                    })
                  "
                >
                  <div
                    class="col text-start"
                    style="
                      font-family: 'RalewayBold';
                      font-size: 16px;
                      padding-top: 10px;
                    "
                  >
                    {{ product.name }}
                  </div>
                </div>
                <div
                  class="row"
                  @click="
                    this.$router.push({
                      name: 'productDetail',
                      query: { name: product.name },
                    })
                  "
                >
                  <div
                    class="col text-start"
                    style="color: gray; padding-top: 5px"
                  >
                    {{ product.genreName }}
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col text-start"
                    style="font-size: 13px; padding-top: 5px"
                  >
                    {{ product.artistName }}
                  </div>
                </div>
                <div
                  class="row"
                  @click="
                    this.$router.push({
                      name: 'productDetail',
                      query: { name: product.name },
                    })
                  "
                >
                  <div
                    class="col text-start"
                    style="padding-top: 10px; font-size: 17px"
                  >
                    <div v-if="product.discount > 0">
                      <div class="row">
                        <p>
                          {{
                            new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              product.price -
                                product.price * (product.discount / 100)
                            )
                          }}
                        </p>
                      </div>
                      <div
                        class="row"
                        style="
                          text-decoration-line: line-through;
                          margin-top: -20px;
                          color: gray;
                        "
                      >
                        <p>
                          ({{
                            new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.price)
                          }})
                        </p>
                      </div>
                    </div>
                    <div v-else class="row" style="">
                      <p>
                        {{
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)
                        }}
                      </p>
                    </div>
                    <div class="row"><p></p></div>
                  </div>
                </div>
                <div
                  class="row"
                  id="card-child"
                  
                >
                  <button
                    v-if="product.quantity > 0"
                    class="btn btn-dark"
                    @click="addCart(product);"
                  >
                    Thêm vào giỏ hàng
                    <i
                      class="fa-solid fa-bag-shopping"
                      style="margin-left: 10px"
                    ></i>
                  </button>
                  <button
                    v-if="product.quantity === 0"
                    class="btn btn-dark"
                    @click="
                      this.$toast.open({
                        message: 'Sản phẩm đã hết hàng',
                        type: 'error',
                        duration: 3000,
                        dismissible: true,
                      })
                    "
                  >
                    Hết hàng
                  </button>
                  <button
                  class="btn btn-light"
                  style="margin-top: 5px; border-color: rgb(156, 156, 156)"
                  @click="favoriteupdate(product);
                          if (checkUser.username != ''){if (product.buttonlabel==='Bỏ thích'){ product.buttonlabel = 'Thêm vào yêu thích'}
                          else product.buttonlabel = 'Bỏ thích'}"
                >
                  {{product.buttonlabel}}
                  <i class="fa-regular fa-heart" style="margin-left: 10px"></i>
                </button>
                </div>

                
              </div>
            </div>
          </Slide>

          <template #addons>
            <Navigation>
              <template #next>
                <span class="nav-icon" style="margin-left: 100px">
                  <i class="fa-solid fa-chevron-right"></i>
                </span>
              </template>
              <template #prev>
                <span class="nav-icon" style="margin-right: 100px"
                  ><i class="fa-solid fa-chevron-left"></i>
                </span>
              </template>
            </Navigation>
          </template>
        </Carousel>
      </div>
      
      <div class="col-3 text-center">
        <img
          src="../assets/img/vinyldisk-banner-2.webp"
          style="
            width: 300px;
            height: 420px;
            margin-left: 60px;
            border-radius: 10px 10px 10px 10px;
          "
        />
      </div>
    </div>
    <div v-else class="col container mx-auto" style="padding-bottom:10px; text-align: center;">Không có sản phẩm nào</div>

    <Carousel :items-to-show="1" :wrap-around="true" :autoplay="3000">
      <Slide v-for="image in images2" :key="image">
        <div class="carousel__item">
          <img
            style="
              border: none;
              width: 110%;
              height: 450px;
              justify-content: center;
              margin-right: 300px;
            "
            alt=""
            :src="image.source"
          />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
    
    <div class="row">
      <div
        class="col text-center"
        style="padding-top: 30px; padding-bottom: 30px"
      >
        <span>TẤT CẢ SẢN PHẨM</span>
      </div>
    </div>
    <ProductRender
      :productsList="filterProduct"
      :titleL="'Đĩa than'"
      :imageL="'vinyldisk.jpg'"
      :descriptionL="'Đĩa than hoặc Đĩa nhựa là một hình thức đồng bộ tín hiệu âm thanh vào lưu trữ dạng đĩa chất liệu Polyvinyl chloride và được ghi theo từng rãnh với độ dập nổi khác nhau. Các đường rãnh được đọc từ vòng lớn nhất cho tới tâm của chiếc đĩa.'"
    >
    </ProductRender>
    <!--<div class="row">
      <div
        class="col text-center"
        style="padding-top: 30px; padding-bottom: 30px"
      >
        <span>DANH MỤC SẢN PHẨM</span>
      </div>
    </div>
    <div class="row">
      <div
        class="col-12 text-center d-flex justify-content-center"
        style="padding: 10px"
      >
        <div class="box">
          <div class="col-12">
            <div class="row">
              <p style="font-family: 'RalewayBlack'; font-size: 20px">
                THỂ LOẠI
              </p>
            </div>
            <div class="row">
              <div class="col">
                <button
                  class=""
                  style="
                    border-radius: 100%;
                    width: 120px;
                    height: 120px;
                    background-color: var(--main-color);
                    border: none;
                    font-size: 80px;
                  "
                >
                  <i class="fa-solid fa-guitar" style="color: white"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>-->
  </div>
</template>


<script>
import "@/assets/css/base.css";
import "vue3-carousel/dist/carousel.css";
import "@/assets/css/form.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import ProductRender from "@/components/ProductRender.vue";

import ProductService from "@/services/product.service";
import GenreService from "@/services/genre.service";
import ArtistService from "@/services/artist.service";
import CartService from "@/services/cart.service";
import FavoriteService from "@/services/favorite.service";


import VueJwtDecode from "vue-jwt-decode";

export default {
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    ProductRender,
  },

  data() {
    return {
      images: [
        {
          source: "../../src/assets/img/vinyldisk-banner.jpg",
        },
        {
          source: "../../src/assets/img/vinyldisk-banner-1.jpg",
        },
        {
          source: "../../src/assets/img/vinyldisk-banner-3.webp",
        },
      ],
      images2: [
        {
          source: "../../src/assets/img/vinyldisk-banner-5.webp",
        },
        {
          source: "../../src/assets/img/vinyldisk-banner-6.webp",
        },
        {
          source: "../../src/assets/img/vinyldisk-banner-4.webp",
        },
      ],
      products: [],
      productsSale: [],
      productsNew: [],
      autoplayDurationNew: 2000,
      autoplayDurationSale: 2000,
      checkUser: localStorage.getItem("auth"),
      edit: false,
      editProduct: null,
      productList: [],
      genreList: [],
      count: 0,
      check: false,
      c: false,
      favorite: {},

      //cart
      tempCart: JSON.parse(localStorage.getItem("tempcart")),
    };
  },

  mounted() {
    try {
      //console.log(this.tempCartCount);
      //console.log(this.tempCart);
      if (this.tempCart === null) {
        this.tempCart = {
          product: [
            {
              productId: { type: String },
              quantity: { type: Number },
            },
          ],
            
          totalPrice: { type: Number },

          totalQuantity: { type: Number },
        };
        this.tempCart.totalQuantity = 0;
        this.tempCart.totalPrice = 0;
        this.tempCart.product = [];
      }
      console.log(this.tempCart);
      this.retrieveProduct();
      if (this.checkUser)
        this.checkUser = VueJwtDecode.decode(localStorage.getItem("auth"));
      else this.checkUser = { username: "", role: "" };
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    async changestate(index){
      this.productList[index].favorite = !this.productList[index].favorite;
    },

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

    async retrieveGenreAndArtist() {},

    async retrieveProduct() {
      try {
        this.products = await ProductService.getAll();
        if (this.checkUser.username != '')
          this.favorite = await FavoriteService.get(this.checkUser.id)
        console.log(this.favorite)
        this.products.forEach(async (product, index) => {
          product.buttonlabel='Thêm vào yêu thích';
          if (this.checkUser.username != ''){
            let i = this.favorite.productId.findIndex(x => x._id === product._id);
            if (i==-1) product.buttonlabel='Thêm vào yêu thích';
            else product.buttonlabel='Bỏ thích';}
          product.genreName = (await GenreService.get(product.genreId)).name;
          product.artistName = (await ArtistService.get(product.artistId)).name;
          if (product.newRelease === true) this.productsNew.push(product);
          if (product.discount > 0) this.productsSale.push(product);
          this.productList.push(product);
        });
        console.log(this.productList);
      } catch (error) {
        console.log(error);
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
        });
      this.c = true}
        
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
          this.c = true
        }
        if (check === "quantity") {
          this.$toast.open({
            message: `Số lượng sản phẩm ${product.name} có trong giỏ hàng đã bằng số lượng sản phẩm ${product.name} có trong kho hàng`,
            type: "error",
            duration: 5000,
            dismissible: true,
          });
        }
      }
      console.log(this.c)
    },
  },

  computed: {
    filterProductNew() {
      return this.productsNew;
    },

    filterProductSale() {
      return this.productsSale;
    },

    filterProduct() {
      return this.productList;
    },

    productsNewCount() {
      return this.productsNew.length;
    },

    productsSaleCount() {
      return this.productsSale.length;
    },
  },
};
</script>
<style scoped>
span {
  font-family: "RalewayBold";
  font-size: 28px;
  margin: auto;
}

#card-parent:hover #card-child {
  visibility: visible;
  display: block;
}

#card-child {
  visibility: hidden;
  display: none;
}
.card-container {
  box-shadow: 0 2px 8px rgba(176, 176, 176, 0.33);
  padding: 10px 20px 10px 20px;
  height: 400px;
}

.card-container:hover {
  height: 480px;
  margin-top: -20px;
}

.box {
  width: 200px;
  height: 200px;
  border-color: rgb(198, 198, 198);
  border-width: 1px;
  border-style: solid;
}

.box:hover {
  transform: scale(1.1);
}
</style>
