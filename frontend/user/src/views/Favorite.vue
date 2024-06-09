<script>
import FavoriteService from "@/services/favorite.service";
import ProductService from "@/services/product.service";
import ArtistService from "@/services/artist.service";
import UserService from "@/services/user.service"

import VueJwtDecode from "vue-jwt-decode";
export default {

  data() {
    return {
      checkUser: VueJwtDecode.decode(localStorage.getItem("auth")),
      user: null,
      favorite: [],
      itemList: [],
      check: false,
    };
  },

  mounted() {
      this.getFavorite();
  },

  methods: {
    async getFavorite() {
      try {
        this.favorite = await FavoriteService.get(this.checkUser.id);
        if (this.favorite.productId.length > 0){
            this.check=true;
        this.favorite.productId.forEach(async (product) =>{
            let temp = await ArtistService.get(product.artistId);
            product.artistName = temp.name
        })}
        else this.check=false
        console.log(this.favorite);
      } catch (error) {
        console.log(error);
      }
    },

    selectAll() {
      this.itemList = [];
      this.favorite.productId.forEach((product) => {
        this.itemList.push(product);
      });
    },

    deselectAll() {
      this.itemList = [];
    },

    async updateFavorite(product) {
      try {
          this.favorite = await FavoriteService.update(this.checkUser.id, product);
      } catch (error) {
        console.log(error);
      }
    },

    async removeSelected() {
      try {
        this.itemList.forEach(async (product) => {
          let index = this.favorite.productId.findIndex(
            (x) => x.name === product.name
          );
          await FavoriteService.update(this.checkUser.id, product);
        });
        this.getFavorite();
        this.itemList=[];
      } catch (error) {
        console.log(error);
      }
    },

    async refresh(){
      this.removeSelected();
      this.itemList=[]
    }
  },

  computed: {
    filterFavorite() {
      return this.favorite.productId;
    },

    filterFavoriteLength() {
      return this.filterFavorite.length;
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
          >Yêu thích</span
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
            Bỏ thích {{ itemList.length }} mục đã chọn
          </div>
          <div class="col-1"></div>
        </div>
        <div id="scrollbar"
          style="overflow-y: scroll; overflow-x: hidden; height: 750px"
          v-if="check===true"
        >
          <div v-for="(product, index) in filterFavorite" :key="product">
            <div class="row" style="padding-bottom: 10px">
              <div class="col-1 d-flex justify-content-center">
                <input
                  
                  type="checkbox"
                  v-model="itemList"
                  :value="product"
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
                  class="fa-solid fa-heart-crack hover-e"
                  style="font-size: 20px"
                  @click="
                    updateFavorite(product);
                  "
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="col text-center" style="padding: 50px">
          <div style="margin: auto">
            <img src="@/assets/img/empty-cart.png" />
            <p>Không có sản phẩm nào trong mục yêu thích</p>
            <button
              class="btn btn-dark"
              @click="this.$router.push({ name: 'vinylShop' })"
            >
              <i
                class="fa-solid fa-favorite-shopping"
                style="padding-right: 10px"
              ></i>
              Trở về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
