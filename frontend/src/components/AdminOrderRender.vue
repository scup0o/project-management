<script>
import UserService from "@/services/user.service";
import OrderService from "@/services/order.service";
import moment from 'moment';

export default {
  props: {
    orders: { type: Array, required: true },
    staff: { type: Object },
    orderTab: { type: String },
  },

  data() {
    return {
      detailorder: {},
      detailtab: "sp",
      check: false,
      quantitymessage:''
    };
  },

  watch:{
    orders(){
        console.log(this.orders)
        console.log(this.orderTab);
        this.detailorder=this.orders[0];
        console.log(this.orders[0])
        console.log(this.detailorder);
        this.$forceUpdate();
    },

    detailorder(){
        this.checkquantity()
    }
  },

  mounted() {
    console.log(this.orders)
    this.detailorder=this.orders[0];
  },

  methods: {
    getDate(date) {
                return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
            },

    async check2() {
      this.detailorder.status = "Đã xác nhận";
      this.detailorder.staffId = this.staff.id;
      this.detailorder = await OrderService.update(
        this.detailorder._id,
        this.detailorder
      );
      this.$emit('refresh2')
      /*this.$toast.open({
                                            message: "Xác nhận đơn hàng thành công",
                                            type: "success",
                                            duration: 3000 ,
                                            dismissible: true
                                        })*/
    },

    async discard(){
        if (this.detailorder.status==='Chờ xác nhận') this.detailorder.status = "Hủy";
        else this.detailorder.status='back'
      this.detailorder.staffId = this.staff.id;
      this.detailorder = await OrderService.update(
        this.detailorder._id,
        this.detailorder
      );
      this.$emit('refresh2')

      /*this.$toast.open({
                                            message: "Hủy đơn hàng thành công",
                                            type: "success",
                                            duration: 3000 ,
                                            dismissible: true
                                        })*/
        
    },

    checkquantity(){
        this.check=false;
        this.detailorder.product.forEach(product =>{
            console.log(product.productId.quantity)
            console.log(product.quantity)
            if (product.productId.quantity < (product.quantity)) { this.quantitymessage='Số lượng sản phẩm trong kho không đủ'; this.check=true;}
            else {if (this.check===false){this.check=false; this.quantitymessage=''}}
            console.log(product.productId.quantity - (product.quantity))
        })
        console.log(this.check)
        },

    async deleteorder(){

    }
  },
  computed:{
    
  }
};
</script>

<template>
  <div class="row">
    <div class="col-8">
      <div
        class="row"
        style="
          padding-left: 10px;
          padding-bottom: 10px;
          font-family: 'RalewayBold';
          font-size: 17px;
        "
      >
        <div class="col-3">Mã đơn hàng</div>
        <div class="col-2 text-end">Khách hàng</div>
        <div class="col-4 text-end" style="margin-left: 10px">Tổng giá trị</div>
        <div class="col-2" style="margin-left: 57px">Trạng thái</div>
      </div>
      <div
        v-for="(order, index) in orders"
        :key="order"
        style="padding-bottom: 10px"
      >
        <div
          class="row"
          :class="{
            box: detailorder.orderID != order.orderID,
            active: detailorder.orderID === order.orderID,
          }"
          @click="detailorder = order"
        >
          <div
            class="col-1 text-end d-flex"
            style="margin: auto; font-family: 'RalewayBold'"
          >
            {{ order.orderID }}
          </div>
          <div class="col-6">
            <div v-if="order.customer._id != null" class="row">
              <div class="col-4 text-end">
                <img
                  :src="`../../src/assets/img/${order.customer.img}`"
                  style="
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                    display: inline;
                  "
                />
              </div>

              <div class="col-8 text-start">
                <div>{{ order.customer.username }}</div>
                <div style="font-family: 'RalewayItalic'; font-size: 15px">
                  {{ order.customer.email }}
                </div>
              </div>
            </div>
            <div v-else class="row">
              <div class="col-4 text-end">
                <img
                  src="../../src/assets/img/user-img.jpg"
                  style="width: 40px; height: 40px; border-radius: 100%"
                />
              </div>
              <div class="col-8 text-start" style="margin-top: 10px">
                Khách chưa đăng nhập
              </div>
            </div>
          </div>
          <div class="col-3 text-center">
            <div>
              {{
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.totalPrice)
              }}
            </div>
            <div style="font-family: 'RalewayItalic'; font-size: 15px">
              (Gồm {{ order.totalQuantity }} sản phẩm)
            </div>
          </div>
          <div
            class="col-2 text-center d-flex justify-content-center"
            style="margin: auto"
          >
            <div
              :class="{
                check: order.status === 'Đã xác nhận',
                wait: order.status === 'Chờ xác nhận',
                done: order.status === 'Hoàn thành',
                discard: order.status === 'Hủy',
              }"
              class="status"
            >
              {{ order.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-4 detail" style="">
      <div class="row" style="font-family: 'RalewayBold'; font-size: 18px">
        Chi tiết đơn hàng
      </div>
      <div
        class="row"
        style="
          font-size: 15px;
          font-family: 'RalewayBold';
          padding-top: 10px;
          color: gray;
        "
      >
        <div class="col-4" @click="detailtab = 'sp'">
          <p :class="{ underline: detailtab === 'sp' }">Sản phẩm</p>
        </div>
        <div class="col text-start" @click="detailtab = 'vc'">
          <p :class="{ underline1: detailtab === 'vc' }">Thông tin chi tiết</p>
        </div>
      </div>
      <div
        v-if="detailtab === 'sp'"
        class=""
        style="overflow-y: scroll; height: 400px; overflow-x: hidden"
        id="scrollbar"
      >
        <div
          v-for="product in detailorder.product"
          :key="product"
          style="padding-top: 15px; border-bottom:1px solid rgb(179, 179, 179)"
        >
          <div class="product-render">
            <div class="row">
              <div class="col-2">
                <img
                  :src="`../../src/assets/img/${product.productId.image[0]}`"
                  style="
                    width: 50px;
                    height: 50px;
                    border-radius: 10px 10px 10px 10px;
                  "
                />
              </div>
              <div class="col-6">
                <div
                  class="row"
                  style="
                    font-family: 'RalewayBold';
                    font-size: 14px;
                    padding-left: 10px;
                  "
                  v-snip="{ line: 1 }"
                >
                  {{ product.productId.name }}
                </div>
                <div class="col">
                <div
                  v-if="product.productId.discount > 0"
                  class="row"
                  style="font-size: 14px"
                >
                  <div class="col-5">
                    <div class="row">
                      <p>
                        {{
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            product.productId.price -
                              product.productId.price *
                                (product.productId.discount / 100)
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
                        font-size: 12px;
                      "
                    >
                      <p>
                        ({{
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.productId.price)
                        }})
                      </p>
                    </div>
                    
                  </div>
                  <div class="col">
                    <p style="display: inline;">x{{product.quantity  }}</p>
                  </div>
                </div>
                <div v-else class="col" style="font-size: 14px; padding-bottom: 25px;">
                  <p style="display: inline;">
                    {{
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.productId.price)
                    }}
                    <p style="display: inline; padding-left: 40px;">x{{ product.quantity }}</p>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-2 text-end" style="font-size: 14px; margin-left:20px">
                <p v-if="product.productId.discount===0">{{
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.productId.price*product.quantity)
                    }}</p>
                <p v-else>{{ new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            (product.productId.price -
                              product.productId.price *
                                (product.productId.discount / 100))*product.quantity
                          ) }}</p>
            </div>
            <div class="col text-center" v-if="(product.productId.quantity < (product.quantity)) && detailorder.status==='Chờ xác nhận'" style="margin-top:-10px; font-size: 14px; font-family: 'RalewayItalic'; color:red">(Còn {{ product.productId.quantity }} sản phẩm trong kho)</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="detailtab === 'vc'"
        class="row"
        style="overflow-y: scroll; height: 400px; overflow-x: hidden;"
        id="scrollbar"
      >
      <div>
        <div class="row">
            <div class="col text-start" style="font-family: 'RalewayBold'; font-size: 17px;">
                Mã đơn hàng:
            </div>
            <div class="col text-end">
                {{ detailorder.orderID }}
            </div>
        </div>
        <div class="row">
            <div class="col" style="font-family: 'RalewayBold'; font-size: 17px;padding-top:10px;">
                Thông tin liên hệ:
            </div>
            <div class="row" style="margin-left:10px; padding-top:10px;">
                <div class="col">
                    Họ và tên:
                </div>
                <div class="col text-end">
                    {{ detailorder.customer.name }}
                </div>
            </div>
            <div class="row" style="margin-left:10px">
                <div class="col">
                    Email:
                </div>
                <div class="col text-end">
                    {{ detailorder.customer.email }}
                </div>
            </div>
            <div class="row" style="margin-left:10px">
                <div class="col">
                    Số điện thoại:
                </div>
                <div class="col text-end">
                    {{ detailorder.customer.phone }}
                </div>
            </div>
            
        </div>
        <div class="row" style="padding-bottom:5px">
            <div class="col" style="font-family: 'RalewayBold'; font-size: 17px; padding-top:10px; padding-bottom:10px">
                Thông tin vận chuyển:
            </div>
            <div class="row" style="margin-left:10px;padding-bottom:10px">
                <div class="col">
                    Địa chỉ:
                </div>
                <div class="col text-end">
                    {{ detailorder.customer.address }}
                </div>
            </div>
        </div>
        <div class="row" style="border-top:1px solid rgb(179, 179, 179); ">
            <div class="row" style="padding-top:5px; padding-bottom:5px">
                <div class="col text-start" style="font-family: 'RalewayBold'; font-size: 17px;">
                Ngày tạo đơn:
            </div>
            <div class="col text-end" style="margin-right:-24px">
                {{ getDate(detailorder.createdDate) }}
            </div>
            </div>
            <div class="row" v-if="detailorder.status==='Hoàn thành'" style="">
                <div class="col text-start" style="font-family: 'RalewayBold'; font-size: 17px;">
                Ngày giao hàng:
            </div>
            <div class="col text-end" style="margin-right:-24px">
                {{ getDate(detailorder.delieveryDate) }}
            </div>
            </div>
        </div>
        
        <div v-if="detailorder.status==='Đã xác nhận'" class="row" style="border-top:1px solid rgb(179, 179, 179);">
            <div class="col text-start" style="padding-top:5px; padding-bottom:5px;font-family: 'RalewayBold';">
              <div class="row">
                Nhân viên xác nhận:
            <div v-if="detailorder.staffId!==null " class="col text-end" style="font-family: 'Raleway';">
            <div  style=" padding-bottom:5px">
                <div class="">
                    {{ detailorder.staffId.name }}
                </div>
                <div class="">
                    ({{ detailorder.staffId.staffId }})
                </div>
                </div></div>
              <div v-else class="col text-end"  style=" padding-bottom:5px; font-family: 'Raleway';">Đã xóa khỏi CSDL</div></div>
            </div>
        </div>
        <div v-if="detailorder.status==='Hủy'" class="row" style="border-top:1px solid rgb(179, 179, 179);">
            <div class="col text-start" style="padding-top:5px; padding-bottom:5px;font-family: 'RalewayBold';">
              <div class="row" v-if="detailorder.staffId">
                  Nhân viên hủy:
              <div v-if="detailorder.staffId!==null" class="col text-end" style="font-family: 'Raleway';">
              <div class="col text-end" style=" padding-bottom:5px">
                  <div class="">
                      {{ detailorder.staffId.name }}
                  </div>
                  <div class="">
                      ({{ detailorder.staffId.staffId }})
                  </div>
              </div>
            </div>
            <div v-else class="col text-end"  style=" padding-bottom:5px; font-family: 'Raleway';">Đã xóa khỏi CSDL</div>
</div>
            </div>
        </div>
    </div>
    </div>
      <div class="row" style="padding-top:10px; font-size: 15px;">
        <div class="row">
          <div class="col text-start">Tổng tiền:</div>
          <div class="col text-end">{{  new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detailorder.totalPrice) }}</div>
        </div>
        <div class="row" style="padding-bottom: 5px;">
            <div class="col text-start">Giảm giá:</div>
          <div class="col text-end">- {{  new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detailorder.discount) }}</div>
        </div>
        <div class="row" style="border-top:1px solid rgb(179, 179, 179); padding-top:5px">
            <div class="col text-start" style="font-family: 'RalewayBold';">Tổng giá trị:</div>
          <div class="col text-end">{{  new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detailorder.totalPrice - detailorder.discount) }}</div>
        </div>
      </div>
      <div class="row" style="padding-top:10px">
        <div class="col text-center">
          <button
          style="margin-right: 10px;"
            class="btn btn-dark button-check"
            @click="check2(), this.$toast.open({
                                            message: 'Xác nhận đơn hàng thành công',
                                            type: 'success',
                                            duration: 3000 ,
                                            dismissible: true
                                        })"
            v-if="detailorder.status === 'Chờ xác nhận' && check===false"
          >
            Xác nhận đơn hàng
          </button>
          <button
          style="margin-right: 10px;"
            class="btn btn-dark button-check"
            disabled
            v-if="detailorder.status === 'Chờ xác nhận' && check===true"
          >
            Xác nhận đơn hàng
          </button>
          <button
            class="btn btn-dark button-discard"
            @click="discard(), this.$toast.open({
                                            message: 'Hủy đơn hàng thành công',
                                            type: 'success',
                                            duration: 3000 ,
                                            dismissible: true
                                        })"
            v-if="
              detailorder.status === 'Chờ xác nhận' ||
              detailorder.status === 'Đã xác nhận'
            "
          >
            Hủy đơn hàng
          </button>
        </div>
        <div class="col-12 text-center" v-if="check===true && detailorder.status==='Chờ xác nhận'" style="margin-top:0px; font-size: 14px; font-family: 'RalewayItalic'; color:red">{{quantitymessage}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#scrollbar::-webkit-scrollbar {
  width: 10px;
  background-color: #18181800;
}

#scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #464646;
}

.button-check:hover{
    background-color: green;
    border:none;
}

.button-discard:hover{
    background-color: red;
    border:none;
}
.underline {
  width: 72px;
  border-bottom: 2px solid;
  color: black;
}

.underline1 {
  width: 123px;
  border-bottom: 2px solid;
  color: black;
}

.detail {
  background-color: rgb(228, 228, 236);
  min-height: 600px;
  border-radius: 10px 10px 10px 10px;
  padding: 15px;
  padding-left: 40px;
  margin-top: -15px;
}
.box {
  box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
  background-color: white;
  border-radius: 10px 10px 10px 10px;
  padding: 10px;
  max-width: 815px;
}

.active {
  box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
  background-color: rgb(228, 228, 236);
  border-radius: 10px 10px 10px 10px;
  padding: 10px;
  max-width: 815px;
}

.active:hover {
  transform: scale(1.05);
  transition: transform 100ms ease-in-out;
}

.box:hover {
  transform: scale(1.05);
  transition: transform 100ms ease-in-out;
}

.status {
  padding: 4px;
  border-radius: 10px 10px 10px 10px;
  font-family: "RalewayBold";
  font-size: 15.5px;
  width: 110px;
}
.check {
  background-color: rgb(78, 202, 78);
}

.wait {
  background-color: rgb(200, 109, 109);
  color: rgb(39, 19, 19);
}

.done {
  background-color: gray;
}

.discard {
  background-color: black;
  color: white;
}
</style>
