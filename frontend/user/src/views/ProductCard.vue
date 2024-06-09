<script>
import "@/assets/css/base.css";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

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
  },

  data() {
    return {
      editProduct: null,
      productList: [],
      product: {
        _id: null,
        name: null,
        price: null,
        description: null,
        genreId: null,
        quantity: null,
        image: [],
        discount: 0,
        tracklist: [],
        newRelease: true,
        artistId: null,
        buttonlabel:'Thêm vào yêu thích'
      },
      checkUser: localStorage.getItem("auth"),
      currentSlide: 0,
      imagecount: 0,
      autoplayDurationGenre: 2000,
      itemGenre: 4,
      itemArtist: 4,
      quantity: 1,
      favorite: {},
      breakpoints: {
        // 700px and up
        700: {
          itemsToShow: 3.5,
          snapAlign: "center",
        },
        // 1024 and up
        1024: {
          itemsToShow: 5,
          snapAlign: "start",
        },
      },
      edit: false,

      //cart
      tempCart: JSON.parse(localStorage.getItem("tempcart")),
    };
  },

  mounted() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (this.checkUser)
      this.checkUser = VueJwtDecode.decode(localStorage.getItem("auth"));
    else this.checkUser = { username: "" };
    console.log(this.checkUser);
    this.retrieveProduct();

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
  },

  methods: {
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
    async retrieveProduct() {
      const query = this.$route.query.name;
      

      console.log(query)
      this.product = await ProductService.findbyname({ name: query });  
      this.product.genreName = (
        await GenreService.get(this.product.genreId)
      ).name;
      this.product.artistName = (
        await ArtistService.get(this.product.artistId)
      ).name;
      this.product.buttonlabel = 'Thêm vào yêu thích'
      if (this.checkUser.username !=''){
                    this.favorite = await FavoriteService.get(this.checkUser.id)
                    let j = this.favorite.productId.findIndex(x => x._id === this.product._id);
                    if (j!=-1) this.product.buttonlabel='Bỏ thích';
                  }
      this.productList = await ProductService.getAll();
      this.productList.forEach(async (product) => {
        product.buttonlabel='Thêm vào yêu thích';
                        if (this.checkUser.username !=''){
                        let i = this.favorite.productId.findIndex(x => x._id === product._id);
                        if (i==-1) product.buttonlabel='Thêm vào yêu thích';
                        else product.buttonlabel='Bỏ thích';}
        product.genreName = (await GenreService.get(product.genreId)).name;
        product.artistName = (await ArtistService.get(product.artistId)).name;
      });
      console.log(this.product);
      this.imagecount = this.product.image.length;
      if (this.imagecount > 4) this.imagecount = 4;
      console.log(this.imagecount);
    },

    slideTo(val) {
      this.currentSlide = val;
    },

    async addCart(product) {
      if (this.quantity > 0) {
        //console.log(product);
        let t = "no";
        console.log(this.checkUser);
        if (this.checkUser.username === "") {
          //console.log((this.tempCart.product)[0].productId);
          console.log(this.tempCart.totalQuantity);
          const check = this.tempCart.product.findIndex(
            (x) => x.productId === product._id.toString()
          );
          console.log(check);

          if (check === -1) {
            const newProduct = {
              productId: product._id,
              quantity: this.quantity,
            };
            this.tempCart.product.push(newProduct);
            this.tempCart.totalQuantity =
              this.tempCart.totalQuantity + this.quantity;
            t = "yes";
          } else {
            if (
              this.quantity + this.tempCart.product[check].quantity >
              product.quantity
            )
              this.$toast.open({
                message: `Số lượng sản phẩm ${
                  product.name
                } có thể thêm vào giỏ hàng còn lại là ${
                  product.quantity - this.tempCart.product[check].quantity
                }`,
                type: "error",
                duration: 3000,
                dismissible: true,
              });
            else {
              this.tempCart.product[check].quantity =
                this.quantity + this.tempCart.product[check].quantity;
              this.tempCart.totalQuantity =
                this.tempCart.totalQuantity + this.quantity;
              t = "yes";
            }
          }
          /*if (product.discount > 0)
          this.tempCart.totalPrice =
            this.tempCart.totalPrice +
            (product.price - product.price * (product.discount / 100));
        else
          this.tempCart.totalPrice = product.price + this.tempCart.totalPrice;
        this.tempCart.totalQuantity++;*/

          //console.log(JSON.parse(JSON.stringify(this.tempCart)))
          if (t === "yes") {
            localStorage.setItem("tempcart", JSON.stringify(this.tempCart));
            console.log(JSON.parse(localStorage.getItem("tempcart")));
            this.$toast.open({
              message: "Thêm vào giỏ hàng thành công",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
          }
        } else {
          console.log(this.checkUser.id);
          product.util = "updateMore";
          product.cartQuantity = this.quantity;
          const check = await CartService.update(this.checkUser.id, product);
          console.log(check);
          if (check === "added") {
            this.$toast.open({
              message: "Thêm vào giỏ hàng thành công",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
          } else {
            this.$toast.open({
              message: `Số lượng sản phẩm ${product.name} có thể thêm vào giỏ hàng còn lại là ${check}`,
              type: "error",
              duration: 5000,
              dismissible: true,
            });
          }
        }
      }
    },

    async add2(product) {
      //console.log(product);
      let t = "no";
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
          t = "yes";
        } else {
          if (this.tempCart.product[check].quantity + 1 > product.quantity)
            this.$toast.open({
              message: `Số lượng sản phẩm ${product.name} có trong giỏ hàng đã bằng số lượng sản phẩm ${product.name} có trong kho hàng`,
              type: "error",
              duration: 5000,
              dismissible: true,
            });
          else {
            this.tempCart.product[check].quantity++;
            t = "yes";
          }
        }
        /*if (product.discount > 0)
          this.tempCart.totalPrice =
            this.tempCart.totalPrice +
            (product.price - product.price * (product.discount / 100));
        else
          this.tempCart.totalPrice = product.price + this.tempCart.totalPrice;*/

        //console.log(JSON.parse(JSON.stringify(this.tempCart)))
        if (t === "yes") {
          this.tempCart.totalQuantity++;
          localStorage.setItem("tempcart", JSON.stringify(this.tempCart));
          console.log(JSON.parse(localStorage.getItem("tempcart")));
          this.$toast.open({
            message: "Thêm vào giỏ hàng thành công",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
        }
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
            message: `Số lượng sản phẩm ${product.name} có trong giỏ hàng đã bằng số lượng sản phẩm ${product.name} có trong kho hàng`,
            type: "error",
            duration: 5000,
            dismissible: true,
          });
        }
      }
    },
  },

  computed: {
    filterProductGenre() {
      let tempList = [];
      this.productList.forEach((product) => {
        if (
          product.genreName === this.product.genreName &&
          product.name != this.product.name
        )
          tempList.push(product);
      });
      if (tempList.length < 3.5) this.itemGenre = tempList.length;
      return tempList;
    },

    filterProductArtist() {
      let tempList = [];
      this.productList.forEach((product) => {
        if (
          product.artistName === this.product.artistName &&
          product.name != this.product.name
        )
          tempList.push(product);
      });
      if (tempList.length < 3.5) this.itemArtist = tempList.length;
      return tempList;
    },
  },
};
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div
        class="row"
        style="padding: 10px; padding-left: 30px; padding-bottom: 5px"
      >
        <p style="font-size: 15px">{{ product.name }}</p>
      </div>
      <div class="col text-center">
        <div class="row" style="padding: 20px; padding-top: 0px">
          <div class="card-container">
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4" style="padding-top: 10px">
                <div class="row">
                  <Carousel
                    id="gallery"
                    :items-to-show="1"
                    :wrap-around="false"
                    v-model="currentSlide"
                  >
                    <Slide v-for="image in product.image" :key="image">
                      <div class="carousel__item">
                        <img
                          style="
                            width: 28vw;
                            height: 28vw;
                            border-radius: 5px 5px 5px 5px;
                          "
                          alt=""
                          :src="`../../src/assets/img/${image}`"
                        />
                      </div>
                    </Slide>
                  </Carousel>
                </div>
                <div class="row">
                  <Carousel
                    id="thumbnails"
                    :items-to-show="imagecount"
                    :wrap-around="true"
                    v-model="currentSlide"
                    ref="carousel"
                    style="padding: 0px"
                  >
                    <Slide v-for="image in product.image" :key="image">
                      <div
                        class="carousel__item"
                        style="padding: 0px"
                        @click="slideTo(image - 1)"
                      >
                        <img
                          style="border: none; width: 6vw; height: 6vw"
                          class="preview img-thumbnail"
                          alt=""
                          :src="`../../src/assets/img/${image}`"
                        />
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
              </div>
              <div class="col-1"></div>
              <div class="col" style="padding-top: 20px">
                <div class="row text-start">
                  <p style="font-family: 'RalewayBold'; font-size: 40px">
                    {{ product.name }}
                  </p>
                </div>
                <div class="row text-start">
                  <p style="color: gray">{{ product.genreName }}</p>
                </div>
                <div class="row text-start">
                  <p style="font-size: 25px">{{ product.artistName }}</p>
                </div>
                <div class="row">
                  <div
                    class="col-3 text-start d-flex"
                    v-if="product.discount > 0 || product.quantity === 0"
                    style="margin: auto"
                  >
                    <div
                      v-if="product.quantity === 0"
                      class=""
                      style="
                        display: inline;
                        background-color: rgb(21, 21, 21);
                        color: white;
                        font-family: RalewayBold;
                        padding: 6px;
                        font-size: 15px;
                      "
                    >
                      Hết hàng
                    </div>
                    <div
                      v-if="product.discount > 0 && product.quantity > 0"
                      class=""
                      style="
                        display: inline;
                        background-color: rgb(21, 21, 21);
                        color: white;
                        font-family: RalewayBold;
                        padding: 6px;
                        font-size: 15px;
                      "
                    >
                      Giảm {{ product.discount }} %
                    </div>
                  </div>
                  <div
                    v-if="product.discount > 0"
                    class="col text-start"
                    style="font-size: 17px"
                  >
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
                  <div v-else class="col text-start" style="font-size: 17px">
                    <p>
                      {{
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)
                      }}
                    </p>
                  </div>
                </div>

                <div
                  class="row text-start"
                  style="padding-top: 15px; padding-bottom: 15px"
                >
                  <p>{{ product.description }}</p>
                </div>
                <div class="row" style="padding-bottom: 10px">
                  <div class="col" style="display: inline; font-size: 20px">
                    <i
                      v-if="quantity > 1"
                      class="fa-solid fa-minus hover-e"
                      @click="quantity--"
                    ></i>
                    <input
                      type="numeric"
                      class="form-control"
                      v-model="quantity"
                      style="
                        width: 50px;
                        border-radius: 25%;
                        display: inline;
                        margin-right: 20px;
                        margin-left: 20px;
                        text-align: center;
                      "
                    />
                    <i
                      v-if="quantity < product.quantity"
                      class="fa-solid fa-plus hover-e"
                      @click="quantity++"
                    ></i>
                  </div>
                </div>
                <div class="row">
                  <p style="font-family: 'RalewayItalic'; font-size: 15px">
                    Còn {{ product.quantity }} sản phẩm
                  </p>
                </div>
                <div
                  class="row text-center"
                 
                  style=""
                >
                  <div class="col tex-center">
                    <button
                      v-if="product.quantity > 0"
                      class="btn btn-dark"
                      @click="addCart(product)"
                      style="width: 100%; font-size: 17px"
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
                      style="width: 100%; font-size: 17px"
                    >
                      Hết hàng
                    </button>
                    <button
                      class="btn btn-light"
                      style="
                        margin-top: 5px;
                        border-color: rgb(156, 156, 156);
                        width: 100%;
                        font-size: 17px;
                      "
                    @click="favoriteupdate(product);
                  if (checkUser.username != ''){if (product.buttonlabel==='Bỏ thích'){ product.buttonlabel = 'Thêm vào yêu thích'}
                          else product.buttonlabel = 'Bỏ thích'}"
                >
                  {{product.buttonlabel}}
                      <i
                        class="fa-regular fa-heart"
                        style="margin-left: 10px"
                      ></i>
                    </button>
                  </div>
                </div>
                
              </div>
              <div class="col-1"></div>
            </div>
          </div>
        </div>
        <div
          class="row"
          style="
            padding: 20px;
            padding-top: 0px;
            border-radius: 10px 10px 10px 10px;
          "
        >
          <div class="col" style="background-color: rgb(247, 247, 247)">
            <div
              class="row"
              style="
                padding: 30px;
                padding-bottom: 0px;
                font-family: 'RalewayBold';
                font-size: 20px;
              "
            >
              Track list
            </div>
            <div
              class="row"
              style="padding: 30px"
              v-if="product.tracklist.length > 0"
            >
              <div
                class="col-4 text-start"
                v-for="track in product.tracklist"
                :key="track"
              >
                <p>{{ track }}</p>
              </div>
            </div>
            <div class="row" style="padding: 30px" v-else>
              <p>Không có thông tin.</p>
            </div>
          </div>
        </div>
        <div class="row text-start" style="padding: 20px; padding-bottom: 0px">
          <p style="font-family: 'RalewayBold'; font-size: 23px">
            Sản phẩm cùng thể loại
          </p>
        </div>
        <div
          class="row mx-auto container"
          style="padding-top: 0px"
          v-if="filterProductGenre.length > 0"
        >
          <div class="col-12 text-start">
            <Carousel :items-to-show="itemGenre" :breakpoints="breakpoints">
              <Slide
                v-for="(product, index) in filterProductGenre"
                :key="product"
              >
                <div
                  class="carousel__item"
                  id="carousel-card"
                  style="padding: 10px; height: 500px; padding-bottom: 0px"
                >
                  <div class="card-container-2" id="card-parent">
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
                        @click="add2(product)"
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
                        style="
                          margin-top: 5px;
                          border-color: rgb(156, 156, 156);
                        "
                        @click="favoriteupdate(product);
                  if (checkUser.username != ''){if (product.buttonlabel==='Bỏ thích'){ product.buttonlabel = 'Thêm vào yêu thích'}
                          else product.buttonlabel = 'Bỏ thích'}"
                >
                  {{product.buttonlabel}}
                        <i
                          class="fa-regular fa-heart"
                          style="margin-left: 10px"
                        ></i>
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
        </div>
        <div class="row" style="padding: 30px" v-else>
          <p>Không có sản phẩm cùng thể loại.</p>
        </div>

        <div
          class="row text-start"
          style="padding: 20px; padding-bottom: 0px; padding-top: 0px"
        >
          <p style="font-family: 'RalewayBold'; font-size: 23px">
            Sản phẩm cùng nghệ sĩ
          </p>
        </div>
        <div
          class="row mx-auto container"
          style="padding-top: 0px; padding-bottom: 0px"
          v-if="filterProductArtist.length > 0"
        >
          <div class="col-12 text-start">
            <Carousel :items-to-show="itemArtist" :breakpoints="breakpoints">
              <Slide
                v-for="(product, index) in filterProductArtist"
                :key="product"
              >
                <div
                  class="carousel__item"
                  id="carousel-card"
                  style="padding: 10px; height: 500px"
                >
                  <div class="card-container-2" id="card-parent">
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
                        @click="add2(product)"
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
                        style="
                          margin-top: 5px;
                          border-color: rgb(156, 156, 156);
                        "
                        @click="favoriteupdate(product);
                  if (checkUser.username != ''){if (product.buttonlabel==='Bỏ thích'){ product.buttonlabel = 'Thêm vào yêu thích'}
                          else product.buttonlabel = 'Bỏ thích'}"
                >
                  {{product.buttonlabel}}
                        <i
                          class="fa-regular fa-heart"
                          style="margin-left: 10px"
                        ></i>
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
        </div>
        <div class="row" style="padding: 30px" v-else>
          <p>Không có sản phẩm cùng nghệ sĩ.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#card-parent:hover #card-child {
  visibility: visible;
  display: block;
}

#card-child {
  visibility: hidden;
  display: none;
}
.card-container {
  box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
  padding: 10px;
  border-radius: 10px 10px 10px 10px;
  background-color: white;
}

.card-container-2 {
  box-shadow: 0 2px 8px rgba(176, 176, 176, 0.33);
  padding: 10px 20px 10px 20px;
  height: 400px;
}

.card-container-2:hover {
  height: 480px;
  margin-top: -20px;
}

.hover-e:hover {
  transform: scale(1.2);
}
</style>
