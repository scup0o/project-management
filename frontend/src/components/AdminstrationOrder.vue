<script>
import OrderService from "@/services/order.service.js"
import AdminOrderRender from "@/components/AdminOrderRender.vue"
import UserService from "@/services/user.service.js"

import VueJwtDecode from "vue-jwt-decode";

    export default{
        props:{
            orderTab:{type: String, required: true}
        },

        components:{
            AdminOrderRender,
        },

        data(){
            return{
                allorder:[],
                orderlist:[],
                onPage: 0,
                pageNumber: 0,
                onPageTemp: 1,
                searchText:'',
                tempuser: null,
                staff: VueJwtDecode.decode(localStorage.getItem('auth')),
                u: null,
            }
        },

        watch:{
            orderTab(){
                this.getOrder();
            }
        },

        mounted(){
            this.getOrder();
            console.log(this.orderTab)
        },

        methods:{
            async getOrder(){
                try{
                    this.onPage= 0;
                    this.pageNumber= 0;
                    this.onPageTemp= 1;
                    this.searchText='';
                    this.tempuser= null;
                    this.allorder=[];
                    this.allorder = await OrderService.getAll();
                    console.log(this.allorder);
                    this.orderlist=[];
                    console.log(this.orderTab);
                    if (this.orderTab === 'all') this.orderlist=this.allorder;
                    if (this.orderTab === 'wait'){
                        this.allorder.forEach(order =>{
                            if (order.status ==='Chờ xác nhận') this.orderlist.push(order);
                        })
                    }
                    if (this.orderTab === 'check'){
                        this.allorder.forEach(order =>{
                            if (order.status ==='Đã xác nhận') this.orderlist.push(order);
                        })
                    }
                    if (this.orderTab === 'done'){
                        this.allorder.forEach(order =>{
                            if (order.status ==='Hoàn thành') this.orderlist.push(order);
                        })
                    }
                    if (this.orderTab === 'discard'){
                        this.allorder.forEach(order =>{
                            if (order.status ==='Hủy') this.orderlist.push(order);
                        })
                    }

                    this.orderlist.forEach(async(order, index) =>{
                    if (order.customer.id)
                    order.customer = await UserService.get(order.customer.id);
                })
                }
                catch(error){   
                    console.log(error);
                }
            },

            async getOrder2(){
                try{
                    this.tempuser= null;
                    this.allorder=[];
                    this.allorder = await OrderService.getAll();
                    console.log(this.allorder);
                    this.orderlist=[];
                    console.log(this.orderTab);
                    if (this.orderTab === 'all') this.orderlist=this.allorder;
                    if (this.orderTab === 'wait'){
                        this.allorder.forEach(order =>{
                            if (order.status ==='Chờ xác nhận') this.orderlist.push(order);
                        })
                    }
                    if (this.orderTab === 'check'){
                        this.allorder.forEach(order =>{
                            if (order.status ==='Đã xác nhận') this.orderlist.push(order);
                        })
                    }
                    if (this.orderTab === 'done'){
                        this.allorder.forEach(order =>{
                            if (order.status ==='Hoàn thành') this.orderlist.push(order);
                        })
                    }
                    if (this.orderTab === 'discard'){
                        this.allorder.forEach(order =>{
                            if (order.status ==='Hủy') this.orderlist.push(order);
                        })
                    }

                    this.orderlist.forEach(async(order, index) =>{
                    if (order.customer.id)
                    order.customer = await UserService.get(order.customer.id);
                })
                }
                catch(error){   
                    console.log(error);
                }
            },

            async getUser(order){
                this.u = await UserService.find(order.customer.id);
            }
        },

        computed:{
            filterorderTab(){
                return this.orderTab;
            },

            filteredOrders(){
                if (!this.searchText) return this.orderlist;
                else{
                    console.log(this.searchText)
                    this.onPage = 0;
                    this.onPageTemp = 1;
                    let temp = [];
                    this.orderlist.forEach((order, index) => {
                        
                        if (order.customer.id!=null){
                        }
                        if( order.orderID.toString().includes(this.searchText) || order.customer.name.includes(this.searchText)){
                            temp.push(order);
                        }
                    })
                    return temp;
                }
            },

            filteredOrdersCount(){
                return this.filteredOrders.length
            },

            sliceOrder(){
                //let pL = this.filteredOrders;
                let orderListNumber = Math.ceil(this.filteredOrders.length / 7);
                this.pageNumber = orderListNumber
                console.log(orderListNumber)
                let count = 0;
                let tempOrders = []
                let i;
                for (i=0; i<orderListNumber; i++){
                    tempOrders[i] = this.filteredOrders.slice(count,count+7);
                    count=count+7;
                    console.log(tempOrders);
                }
                return tempOrders;

            }
        }

    }
</script>

<template>
    <div class="container-fluid">  
        <div class="row" style="padding-bottom: 20px;">
            <div class="col-5">
                <span>Danh sách đơn đặt hàng</span>
            </div>
        </div>
        <div class="row">
            <div class="col">
            </div>
            <div class="col text-end" >     
                    
            </div>
            <div class="col-4">
                <div class="input-group" style="">
                    <input
                            type = "text"
                            class ="form-control search-form"
                            placeholder="Nhập thông tin cần tìm"
                            v-model = "searchText"/>
                    <button 
                            class = "btn btn-outline-secondary search-button"
                            type = "button">
                            <i class="fa-solid fa-magnifying-glass search-icon"></i>
                    </button>
                </div>

            </div>
        </div>
        
        <div class="row" style="padding-top:20px" >
            <div v-for="(orders, index) in sliceOrder" :key="index" v-if="filteredOrdersCount > 0">
                <AdminOrderRender v-if=" index===onPage"
                                    :orders="orders"
                                    :staff="staff"
                                    :orderTab="filterorderTab"
                                    :is="orders"
                                    @refresh="getOrder()"
                                    @refresh2="getOrder2()">
                </AdminOrderRender>
                
            </div>
            <p v-else>Không có đơn hàng nào.</p>
        </div>
        <div class="row text-center d-flex" v-if="filteredOrdersCount > 0" style="padding-top:10px">
            <div >
            <button v-if="onPage!=0" 
                    @click="onPage--, onPageTemp--" 
                    class="btn" 
                    style=" margin-right:10px; border-color: none" 
                    title="Trang trước"><i class="fa-solid fa-caret-left"></i></button>
            <div style="display:inline"><input class="form-control" style="width:50px; display: inline;" type="number" v-model="onPageTemp" @keyup.enter="onPage=(onPageTemp-1), onPageTemp=(onPage+1)">/ {{ pageNumber }}</div>
            <button v-if="onPageTemp <pageNumber" 
                    @click="onPage++, onPageTemp=(onPage+1)" 
                    class="btn" 
                    style=" margin-left:10px;border-color:none" 
                    title="Trang sau"><i class="fa-solid fa-caret-right"></i></button>
            </div>
        </div>
    </div>
</template>
<style scoped>
span{
    font-family: 'RalewayBold';
    font-size: 25px;
}

#util-icon{
    margin-left: 10px;
}

</style>