<script>
import "@/assets/css/base.css"
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import VueJwtDecode from "vue-jwt-decode";

import DiscountCodeService from "@/services/discountCode.service.js";
import OrderService from "@/services/order.service.js"

    export default{
        components:{
            Form,
            Field,
            ErrorMessage,
        },

        props:{
            itemlist: {type: Array},
            totalPrice: {type: Number},
            totalDiscount: {type: Number},
            user: {type: Object}
        },

        data(){
            const FormSchema = yup.object({
            name: yup
                .string()
                .required("Tên không được để trống")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            email: yup
                    .string()
                    .required("Email không được để trống")
                    .email("Vui lòng nhập Email hợp lệ.")
                    .max(50, "E-mail tối đa 50 ký tự."),
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự.").required("Địa chỉ không được để trống"),
            phone: yup
                    .string()
                    .required("Số điện thoại không được để trống")
                    .min(10,"Số điện thoại không hợp lệ.")
                    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Số điện thoại không hợp lệ'),
        });

           return{
            FormSchema,
            orderDetail:{user:{}},
            discount: {name: {type:String}, value: 0},
            price: 0,
            discountCard:[],
            emailmessage: '',
            wait: false
           }
        },

        methods:{
            close(){
                console.log('click')
                this.$emit('close');},

            async checkdiscount(){
                if (this.discount.name != '') {
                    console.log(this.discount.name)
                let temp = await DiscountCodeService.findbyname(this.discount);
                console.log(temp)
                if (temp === 'not exist'){
                    this.$toast.open({
                        message: 'Mã giảm giá không tồn tại',
                        type: "error",
                        duration: 3000,
                        dismissible: true,
                    });
                }
                else{
                    console.log(temp)
                    if (temp === 'not active' || temp === 'expirate'){
                    this.$toast.open({
                        message: 'Mã giảm giá hết hiệu lực',
                        type: "error",
                        duration: 3000,
                        dismissible: true,
                    });
                    }
                    else{
                        if (temp === 'start day'){
                            this.$toast.open({
                                message: 'Mã giảm giá chưa có hiệu lực',
                                type: "error",
                                duration: 3000,
                                dismissible: true,
                            });
                        }
                        else{
                            this.discount.name='';
                            if (temp.value > 100) this.discount.value=this.discount.value+temp.value;
                            else {
                                this.discount.value=this.discount.value+(this.totalPrice*temp.value)/100;
                            }
                            this.discountCard.push(temp);
                            this.$toast.open({
                                message: 'Đã áp mã giảm giá',
                                type: "success",
                                duration: 3000,
                                dismissible: true,
                            });
                        }
                    }
                    
                }
                }
                
            },

            async createOrder(data){
                if (this.user) data.userid = this.user._id
                data.product = this.itemlist;
                data.totalPrice = this.totalPrice;
                data.discount = this.discount.value;
                data.totalQuantity = 0;
                this.itemlist.forEach(product =>{
                    data.totalQuantity = parseInt(product.cartQuantity)+data.totalQuantity;
                })
                console.log(data.totalQuantity)
                this.wait = true;
                const order = await OrderService.create(data);
                if (order === true){
                    if(!this.user){
                        this.$toast.open({
                                message: 'Đặt hàng thành công, thông tin đơn hàng đã được gửi vào email nhập',
                                type: "success",
                                duration: 3000,
                                dismissible: true,
                            });
                            this.$emit("refresh");
                    }
                    else
                    this.$toast.open({
                                message: 'Đặt hàng thành công',
                                type: "success",
                                duration: 3000,
                                dismissible: true,
                            });
                            this.$emit("refresh");
                }
                else{
                    this.emailmessage = 'Email đã được sử dụng'
                }
            }

            
        },

        computed:{
            getPrice(){
                this.price = this.totalPrice - this.discount.value;
                if (this.price < 0) this.price = 0
                return this.price;
            }
        },

        mounted(){
            if (this.user){
                this.orderDetail.user.name = this.user.name;
                this.orderDetail.user.email = this.user.email;
                this.orderDetail.user.address = this.user.address;
                this.orderDetail.user.phone = this.user.phone;
                this.orderDetail.user.id = this.user._id
                console.log(this.orderDetail)
            }
            this.orderDetail.paymentMethod = 'COD';
            this.price = this.totalPrice - this.discount.value;
            this.discount.name='';
            console.log(this.itemlist);
        }
    }

</script>

<template>
<div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container" >

                <Form @submit="createOrder" :validation-schema="FormSchema">
                        <div class="row">
                            <div class="col-6">
                                <div>
                                    <div class="row"> 
                                        <label style="font-family: 'RalewayBold'; font-size:20px; padding-bottom:10px">Thông tin liên hệ: </label>
                                    </div>
                                    <div class="form-group">
                                        <Field name="name" type="text" class="form-control" placeholder="Họ tên" v-model="orderDetail.user.name">
                                        </Field>
                                        <ErrorMessage name="name" style="color:red"></ErrorMessage>
                                    </div>
                                    <div class="form-group">
                                        <Field name="email" type="text" class="form-control" placeholder="Email" v-model="orderDetail.user.email">
                                        </Field>
                                        <ErrorMessage name="email" style="color:red"></ErrorMessage>
                                        <p class="" style="color:red">{{ emailmessage }}</p>
                                    </div>
                                    <div class="form-group">
                                        <Field name="phone" type="tel" class="form-control" placeholder="Số điện thoại" v-model="orderDetail.user.phone">
                                        </Field>
                                        <ErrorMessage name="phone" style="color:red"></ErrorMessage>
                                    </div>
                                    <div class="row" style="padding-top:20px"> 
                                        <label style="font-family: 'RalewayBold'; font-size:20px; padding-bottom:10px">Thông tin giao hàng: </label>
                                    </div>
                                    <div class="form-group">
                                        <Field style="height:100px" as="textarea" name="address" type="text" class="form-control" placeholder="Địa chỉ" v-model="orderDetail.user.address">
                                        </Field>
                                        <ErrorMessage name="address" style="color:red"></ErrorMessage>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-family: 'RalewayBold'; font-size:20px; padding-bottom:10px">Phương thức thanh toán</label>
                                        <div style="margin:auto;">
                                            <Field name="paymentMethod" type="radio" value="COD" v-model="orderDetail.paymentMethod" style="margin-left:30px">
                                            </Field> Thanh toán khi nhận hàng (COD)
                                        </div>
                                    </div>
                                </div>
                                    <div>
                                    <div class="text-center" style="padding-top:100px">
                                    <button v-if="this.wait===false" type="submit" class="btn btn-dark form-button" style="margin-right: 10px; width: 150px;"  >
                                            Đặt hàng
                                    </button>
                                    <button disabled v-if="this.wait===true" type="button" class="btn btn-dark form-button" style="margin-right: 10px; width: 150px;"  >
                                            Đặt hàng
                                    </button>
                                    <button @click="close"
                                            type="button"
                                            class="btn btn-dark form-button"
                                            style="width: 150px;"
                                            >
                                            Hủy
                                    </button>
                                    </div>
                                </div>
                                    
                                
                            </div>
                            <div class="col-6" style="background-color: rgb(243, 243, 243); margin-top: -20px; margin-bottom:-20px; padding-right:0px; border-radius:10px 10px 10px 10px">
                                <div class="" style="overflow-y: scroll;
                                                    overflow-x: hidden; height: 400px;" id="scrollbar">
                                <div v-for="item in itemlist" :key="item" style=" padding-left:30px; padding-right: 30px;">
                                    <div class="productContainer">
                                        <div class="row">
                                            <div class="col-3">
                                                <img
                                                style="
                                                display: inline-flex;
                                                margin: auto;
                                                width: 70px;
                                                height: 70px;
                                                "
                                                class="preview img-thumbnail image"
                                                alt=""
                                                :src="`../../src/assets/img/${item.image[0]}`"
                                                />
                                            </div>
                                            <div class="col-4 text-start" style="margin:auto">
                                                <div class="row" style="font-family:'RalewayBold'"  v-snip="{ lines: 1 }">
                                                   {{ item.name }}
                                                </div>
                                                <div class="row">
                                                    <div v-if="item.discount > 0" class="col-9">
                                                        <div class="row">
                                                            <p>
                                                            {{
                                                                new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                                }).format(
                                                                item.price -
                                                                item.price * (item.discount / 100)
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
                                                                }).format(item.price)
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
                                                            }).format(item.price)
                                                            }}
                                                        </p>
                                                        </div>
                                                </div>
                                            </div>
                                            <div class="col d-flex justify-content-start" style="margin:auto; font-family: 'RalewayBold'; font-size:17px">
                                                x {{ item.cartQuantity }}
                                            </div>
                                            <div class="col d-flex justify-content-start" style="margin:auto;">
                                                <div v-if="item.discount > 0" class="col-10">
                                                        <div class="row">
                                                        <p>
                                                            {{
                                                            new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(
                                                                (item.price -
                                                                item.price *
                                                                    (item.discount / 100)) *
                                                                item.cartQuantity
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
                                                                item.price * item.cartQuantity
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
                                                            }).format(item.price * item.cartQuantity)
                                                        }}
                                                        </p>
                                                    </div>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                                </div>
                                <div class="row" style="padding-top:20px; padding-left:40px; padding-right:40px;">
                                    <div class="col-9">
                                        <input class="form-control" placeholder="Mã giảm giá" v-model = discount.name>
                                    </div>
                                    <div class="col-3 text-center">
                                        <button class="btn btn-dark" type="button" style="display:inline; width:100px" @click="checkdiscount">
                                            Áp mã
                                        </button>
                                    </div>
                                </div>
                                <div class="row" style="padding-top:20px; padding-left:30px; padding-right:30px; font-size:15px">
                                    <div class="col text-start">
                                        Tổng tiền:
                                    </div>
                                    <div class="col text-end">
                                        <div>{{  new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                            }).format(totalPrice) }}</div>
                                        <div v-if="totalDiscount != totalPrice" 
                                            style="text-decoration:line-through; 
                                            color: gray;">({{  new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                            }).format(totalDiscount) }})</div>
                                    </div>
                                </div>
                                <div class="row" style="padding-top:5px; padding-left:30px; padding-right:30px; font-size:15px">
                                    <div class="col text-start">
                                        Giảm giá: 
                                    </div>
                                    <div class="col text-end">
                                        - {{ new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                            }).format(discount.value) }} 
                                    </div>
                                </div>
                                <div class="col-12 text-end d-flex justify-content-end" style="padding-top:5px">
                                    <div v-for="discount in discountCard" :key="discount" style="">
                                        <div class="col-1">
                                            <div style="background-color: black; color:white; font-size: 11px; text-align: center; width: 50px; padding:0 5px 0 5px; margin-right:10px">{{ discount.name }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" style="margin-top:5px; margin-left:18px; padding-top: 20px; padding-bottom:20px; padding-right:0px; width: 530px;  border-top:1px solid rgb(179, 179, 179)">
                                    <div class="col-6 text-start" style="font-family: 'RalewayBold';">
                                        Tổng giá trị:
                                    </div>
                                    <div class="col-6 text-end" style="font-size:20px">
                                        {{ new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                            }).format(getPrice) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    
                </Form>

                
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
  padding: 10px;    
  padding-top:20px; 
  border-bottom: 1px solid rgb(207, 207, 207);
}

.form-group{
    padding-bottom:15px;
    background-color: white;
}

.preview{
		  display: inline-flex;
		  justify-content: center;
		  align-items: center;
		  height: 100px;
		  width: 100px;}
.modal-mask {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;

}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 1200px;
    margin: 0px auto;
    padding: 30px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    
    /*background-color: rgb(196, 219, 219);*/
    
}

.modal-header h3 {
    margin-top: 0;
}

.modal-body {
    overflow-y: hidden;
    margin: 20px 0;
    height:650px;
    background-color: white;
    padding:20px
}
</style>