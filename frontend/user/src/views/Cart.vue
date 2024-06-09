<script>
import CartService from "@/services/cart.service";
import ProductService from "@/services/product.service";
import ArtistService from "@/services/artist.service";
import UserService from "@/services/user.service"

import CheckOut from '@/components/CheckOut.vue';

import VueJwtDecode from "vue-jwt-decode";
export default {
  components:{
    CheckOut,
  },

  data() {
    return {
      checkUser: localStorage.getItem("auth"),
      user: null,
      cart: JSON.parse(localStorage.getItem("tempcart")),
      itemList: [],
      productList: [],
      checkout : false,
    };
  },

  mounted() {
    if (this.checkUser) {
      this.checkUser = VueJwtDecode.decode(localStorage.getItem("auth"));
      this.getCart();
    } else {
      this.checkUser = { username: "" };
      this.getProduct();
    }

    
    //console.log(this.cart);
  },

  methods: {
    async checkOut(){
      this.checkout = true;
    },

    async getCart() {
      try {
        this.cart = await CartService.get(this.checkUser.id);
        this.cart.product.forEach(async (product, index) => {
          let tempproduct = await ProductService.get(product.productId);
          tempproduct.artistName = (
            await ArtistService.get(tempproduct.artistId)
          ).name;
          tempproduct.cartQuantity = product.quantity;
          this.productList.push(tempproduct);
        });
        this.user = await UserService.get(this.checkUser.id);
        console.log(this.cart)
      } catch (error) {
        console.log(error);
      }
    },

    async getProduct() {
      this.cart.product.forEach(async (product, index) => {
        let tempproduct = await ProductService.get(product.productId);
        tempproduct.artistName = (
          await ArtistService.get(tempproduct.artistId)
        ).name;
        tempproduct.cartQuantity = product.quantity;
        this.productList.push(tempproduct);
      });
    },

    selectAll() {
      this.itemList = [];
      this.productList.forEach((product) => {
        if (product.quantity > 0) this.itemList.push(product);
      });
    },

    deselectAll() {
      this.itemList = [];
    },

    async updateCart(util, product) {
      try {
        product.util = util;
        if (this.checkUser.username != "") {
          await CartService.update(this.checkUser.id, product);
          this.cart = await CartService.get(this.checkUser.id);
        } else {
          console.log(this.cart.product)
          if (util == 'add'){
            this.cart.totalQuantity++
          }
          if (util == 'minus'){
            let index = this.cart.product.findIndex(x => x.productId === product._id);
            if (product.cartQuantity == 0) {this.cart.totalQuantity = this.cart.totalQuantity - this.cart.product[index].quantity+1; this.cart.product.splice(index,1); }
            this.cart.totalQuantity--
          }
          if (util == 'update'){
            let index = this.cart.product.findIndex(x => x.productId === product._id);
            if (this.cart.product[index].quantity + product.cartQuantity > product.quantity){}
            else this.cart.product[index].quantity = product.cartQuantity
          }

          localStorage.setItem('tempcart', JSON.stringify(this.cart))
        }
        console.log(this.cart);
      } catch (error) {
        console.log(error);
      }
    },

    async removeSelected() {
      try {
        this.itemList.forEach((product) => {
          let index = this.productList.findIndex(
            (x) => x.name === product.name
          );
          this.cart.totalQuantity= this.cart.totalQuantity - product.cartQuantity
          this.productList.splice(index, 1);
          this.cart.product.splice(index, 1);
          
        });

        this.cart.util = "updateAll";
        if (this.checkUser.username != "") {
          await CartService.update(this.checkUser.id, this.cart);
          this.cart = await CartService.get(this.checkUser.id);
        } else {
          localStorage.setItem("tempcart", JSON.stringify(this.cart));
        }
        console.log(this.cart);
        this.itemList=[]
      } catch (error) {
        console.log(error);
      }
    },

    async refresh(){
      this.checkout = false;
      this.removeSelected();
      this.itemList=[]
    }
  },

  computed: {
    totalPrice() {
      let tempPrice = 0;
      this.itemList.forEach((product) => {
        if (product.discount > 0)
          tempPrice =
            (product.price - product.price * (product.discount / 100)) *
              product.cartQuantity +
            tempPrice;
        else tempPrice = product.price * product.cartQuantity + tempPrice;
      });
      return tempPrice;
    },

    totalDiscount() {
      let tempDiscount = 0;
      this.itemList.forEach((product) => {
        tempDiscount = product.price * product.cartQuantity + tempDiscount;
      });
      return tempDiscount;
    },

    filterCart() {
      return this.productList;
    },
  },
};
</script>

<template>
  <div class="container-fluid" style="">
    <div style="padding: 40px; padding-top: 30px">
      <div class="row">
        <span
          style="
            font-family: 'RalewayBlack';
            font-size: 40px;
            padding-bottom: 20px;
          "
          >Giỏ hàng</span
        >
      </div>
      <div class="row">
        <div class="row" style="padding-bottom: 20px">
          <div class="col-1"></div>
          <div class="col justify-content-start d-flex" style="">
            <p
              style="display: inline; margin-right: 20px"
              @click="selectAll()"
              class="text-hover"
            >
              Chọn tất cả
            </p>
            <p
              style="display: inline"
              @click="deselectAll()"
              class="text-hover"
            >
              Bỏ chọn tất cả
            </p>
          </div>
          <div
            class="col justify-content-end d-flex text-hover"
            @click="removeSelected()"
          >
            Xóa {{ itemList.length }} mục đã chọn
          </div>
          <div class="col-1"></div>
        </div>
        <div id="scrollbar"
          style="overflow-y: scroll; overflow-x: hidden; height: 750px"
          v-if="this.cart != null && this.cart.product.length"
        >
          <div v-for="(product, index) in filterCart" :key="product">
            <div class="row" style="padding-bottom: 10px">
              <div class="col-1 d-flex justify-content-center">
                <input
                  v-if="product.quantity > 0"
                  type="checkbox"
                  v-model="itemList"
                  :value="product"
                />
                <input
                  v-else
                  type="checkbox"
                  onclick="return false;"
                  @click="
                    this.$toast.open({
                      message: 'Sản phẩm đã hết hàng',
                      type: 'error',
                      duration: 3000,
                      dismissible: true,
                    })
                  "
                />
              </div>
              <div class="col-10">
                <div
                  :class="{
                    notAvailable: product.quantity == 0,
                    productContainer: product.quantity > 0,
                  }"
                >
                  <div class="row">
                    <div
                      class="col d-flex text-center"
                      @click="
                        this.$router.push({
                          name: 'productDetail',
                          query: { name: product.name },
                        })
                      "
                    >
                      <img
                        style="
                          display: inline-flex;
                          margin: auto;
                          width: 100px;
                          height: 100px;
                        "
                        class="preview img-thumbnail image"
                        alt=""
                        :src="`../../src/assets/img/${product.image[0]}`"
                      />
                    </div>
                    <div class="col-10">
                      <div class="row" style="margin-top: 10px">
                        <div
                          class="col-6"
                          @click="
                            this.$router.push({
                              name: 'productDetail',
                              query: { name: product.name },
                            })
                          "
                        >
                          <div class="row">
                            <p
                              style="
                                font-family: 'RalewayBold';
                                font-size: 18px;
                              "
                            >
                              {{ product.name }}
                            </p>
                          </div>
                          <div class="row" style="margin-top: -15px">
                            <p>{{ product.artistName }}</p>
                          </div>
                          <div class="row" style="margin-top: -10px">
                            <div
                              class="col-1"
                              v-if="product.quantity === 0"
                              style="
                                background-color: rgb(21, 21, 21);
                                color: white;
                                font-family: RalewayBold;
                                padding: 6px;
                                opacity: 100% !important;
                                width: fit-content;
                                height: fit-content;
                              "
                            >
                              Hết hàng
                            </div>
                            <div
                              v-if="
                                product.discount > 0 && product.quantity > 0
                              "
                              class="col-1"
                              style="
                                background-color: rgb(21, 21, 21);
                                color: white;
                                font-family: RalewayBold;
                                padding: 6px;
                                width: fit-content;
                                height: fit-content;
                              "
                            >
                              Giảm {{ product.discount }} %
                            </div>
                            <div v-if="product.discount > 0" class="col-9">
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
                            <div v-else class="row col-10" style="">
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
                        </div>
                        <div
                          v-if="product.quantity > 0"
                          class="col-4 row text-center d-flex justify-content-center"
                          style="margin: auto"
                        >
                          <div class="col-2">
                            <input
                              type="numeric"
                              class="form-control"
                              v-model="product.cartQuantity"
                              style="width: 50px; border-radius: 25%"
                            />
                          </div>
                          <div
                            v-if="product.quantity > 0"
                            class="col-1"
                            style="margin-top: -10px; margin-left: 10px"
                          >
                            <div style="font-size: 20px">
                              <i
                                class="fa-solid fa-circle-plus hover-e"
                                @click="
                                  if (
                                    product.cartQuantity == product.quantity
                                  ) {
                                    this.$toast.open({
                                      message:
                                        'Số lượng sản phẩm đã bằng số lượng sản phẩm trong kho',
                                      type: 'error',
                                      duration: 3000,
                                      dismissible: true,
                                    });
                                  } else {
                                    product.cartQuantity++;
                                    cart.product[index].quantity++;
                                    updateCart('add', product);
                                  }
                                "
                              ></i>
                              <i
                                class="fa-solid fa-circle-minus hover-e"
                                @click="
                                  if (product.cartQuantity == 1)
                                    productList.splice(index, 1);
                                  else cart.product[index].quantity--;
                                  product.cartQuantity--;
                                  updateCart('minus', product);
                                "
                              ></i>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-12">
                              <p
                                style="
                                  font-family: 'RalewayItalic';
                                  font-size: 15px;
                                "
                              >
                                Còn {{ product.quantity }} sản phẩm
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          class="col d-flex text-center"
                          style="margin: auto; font-size: 20px"
                          v-if="product.quantity > 0"
                        >
                          <div v-if="product.discount > 0" class="col-10">
                            <div class="row">
                              <p>
                                {{
                                  new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(
                                    (product.price -
                                      product.price *
                                        (product.discount / 100)) *
                                      product.cartQuantity
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
                                  }).format(
                                    product.price * product.cartQuantity
                                  )
                                }})
                              </p>
                            </div>
                          </div>
                          <div v-else class="row col-10" style="">
                            <p>
                              {{
                                new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.price * product.cartQuantity)
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="col-1 d-flex text-end justify-content-center"
                style="margin: auto"
              >
                <i
                  class="fa-solid fa-xmark hover-e"
                  style="font-size: 20px"
                  @click="
                    productList.splice(index, 1);
                    product.cartQuantity = 0;
                    updateCart('minus', product);
                  "
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="col text-center" style="padding: 50px">
          <div style="margin: auto">
            <img src="@/assets/img/empty-cart.png" />
            <p>Giỏ hàng trống</p>
            <button
              class="btn btn-dark"
              @click="this.$router.push({ name: 'vinylShop' })"
            >
              <i
                class="fa-solid fa-cart-shopping"
                style="padding-right: 10px"
              ></i>
              Trở về trang chủ
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-end">
          <p style="display: inline">Tổng tiền:</p>
          <p style="display: inline">
            {{
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice)
            }}
          </p>
          <p style="text-decoration: line-through; color: gray">
            {{
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalDiscount)
            }}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-end">
          <button class="btn btn-dark" disabled v-if="itemList.length == 0">
            Thanh toán
          </button>
          <button class="btn btn-dark" v-else @click="checkOut()">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
  <CheckOut v-if="checkout === true"
            :itemlist = this.itemList
            :totalDiscount = totalDiscount
            :totalPrice = totalPrice
            :user = user
            @close="checkout = false"
            @refresh="refresh()">

  </CheckOut>
</template>

<style scoped>

#scrollbar::-webkit-scrollbar
{
	width: 10px;
	background-color: #18181800;
}

#scrollbar::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #464646;
}
.productContainer {
  box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
  padding: 10px;
  border-radius: 10px 10px 10px 10px;
  background-color: white;
}

.notAvailable {
  box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
  padding: 10px;
  border-radius: 10px 10px 10px 10px;
  opacity: 70%;
  background-color: rgba(40, 40, 40, 0.11);
}

.hover-e:hover {
  transform: scale(1.15);
  transition: transform 100ms ease-in-out;
}

.text-hover:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
