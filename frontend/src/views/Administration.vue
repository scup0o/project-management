<template>
    <div class="container-fluid" style="background-color: var(--bg-color);">
    <div class="row flex-nowrap" id="sidebar">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style="background-color: var(--main-color)">
            <div class="d-flex flex-column align-items-sm-start px-3 pt-2 text-white min-vh-100" >
                <div class=" row" style=" margin-top:10px; margin-bottom: 10px; width:250px;">
                    <!--<div class="row">
                    <div class="col-3">
                        <img :src="`../../src/assets/img/${user.img}`" alt="hugenerd" width="30" height="30" class="rounded-circle"></div>
                       <div class="col-9 text-start"    > 
                        <div class="row"><div class="col-12" style=" margin-top:-5px; font-size:17px">{{ user.name }}</div></div>
                        <div class="row"><div class="col" style=" margin-top:0px; font-size: 14px; font-family: 'RalewayItalic';">{{ user.userId }}</div></div></div></div>
                -->
                <div style="width: 10px; color:white; font-family: Lobster; font-size: 20px;">
                                <div>APPNAME</div>
                            </div>
            
            </div>
                <div class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span class="fs-5 d-none d-sm-inline" style="margin-top:20px; margin-bottom:0px">Menu</span>
                </div>
                <ul class="nav nav-pills flex-column mb-0 align-items-start align-items-sm-start" id="menu" style="margin-top:-10px">
                    
                    <li id="parent-tab" v-if="user.role!='admin'">
                        <button
                                @click="show=true;orderTab='all'; this.activeTab='all'; show1=false"
                                class="nav-link px-0">
                                <i class="fa-regular fa-file-lines"></i> <span class="ms-1 d-none d-sm-inline">Đơn đặt hàng</span>
                        </button>
                            <div class="col text-start" :class="{show: show===true, child: show===false}">
                                <button class="a"
                                            :class=" {active1: activeTab==='all', b:activeTab !='all' }"
                                            @click="this.activeTab='all'; orderTab='all'">
                                            <span class="ms-1 d-none d-sm-inline">Tất cả đơn đặt hàng</span></button>
                                <button class="a"
                                        :class=" {active1: activeTab==='wait', b:activeTab !='wait' }"
                                        @click="this.activeTab='wait'; orderTab='wait'"><span class="ms-1 d-none d-sm-inline">Đơn chờ duyệt</span></button>
                                <button class="a"
                                        :class=" {active1: activeTab==='check', b:activeTab !='check' }"
                                        @click="this.activeTab='check'; orderTab='check'"><span class="ms-1 d-none d-sm-inline">Đơn đã duyệt</span></button>
                                <button class="a"
                                        :class=" {active1: activeTab==='done', b:activeTab !='done' }"
                                        @click="this.activeTab='done'; orderTab='done'"><span class="ms-1 d-none d-sm-inline">Đơn đã hoàn thành</span></button>
                                <button class="a"
                                        :class=" {active1: activeTab==='discard', b:activeTab !='discard' }"
                                        @click="this.activeTab='discard'; orderTab='discard'"> <span class="ms-1 d-none d-sm-inline">Đơn đã hủy</span></button>
                            </div>
                    </li>
                                <li>
                                <button class="nav-link px-0 align-middle"
                                        @click="this.activeTab='genre';show=false; show1=false"
                                        :class=" {active1: activeTab==='genre' }">
                                        <i class="fa-solid fa-icons"></i> <span class="ms-1 d-none d-sm-inline">Danh sách Thể loại</span> </button>
                                </li>
                    
                    <li>
                        <button v-if="user.role==='admin'" class="nav-link px-0 align-middle"
                                        @click="this.activeTab='user'; show1=true; show=false; filterTittle='Danh sách tài khoản'">
                            <i class="fa-solid fa-users"></i> <span class="ms-1 d-none d-sm-inline">Tài khoản</span> </button>
                    </li>
                    <li>
                        <button class="nav-link px-0 align-middle"
                        @click="this.$router.push({name:'account'}), show1=true; show=false; filterTittle='Thông tin tài khoản'">
                            <i class="fa-solid fa-users"></i> <span class="ms-1 d-none d-sm-inline">Cài đặt</span> </button>
                    </li>
                </ul>
                <hr>
            </div>
        </div>
        <div class="col py-3">
            <div class="row" style="margin-top: -16px;">
                <Header :title="filterTittle" ></Header>
            </div>
            <div class="row" >

                <AdministrationGenre v-if="activeTab==='genre'"></AdministrationGenre>
            
            <AdministrationAccount v-if="(activeTab==='user')"></AdministrationAccount>
            </div>
            
        </div>
    </div>
</div>
</template>
<script>
    import AdministrationGenre from "@/components/AdministrationGenre.vue";
    import AdministrationAccount from "@/components/AdministrationAccount.vue";
    import Header from "@/components/header.vue";

    import VueJwtDecode from "vue-jwt-decode";


    export default{
        components:{
            AdministrationGenre,
            AdministrationAccount,
            Header,
        },

        data(){
            return{
                show1: false,
                activeTab: 'product',
                orderTab:'',
                accountTab:'',
                activeChild:'all',
                show:false,
                user: VueJwtDecode.decode(localStorage.getItem('auth')),
                filterTittle:"",
            }
        },

        mounted(){
            console.log(this.user)
            //this.getUser();
        },

        methods: {
           /* async getUser(){
                this.user = await UserService.get(this.user.id);
                console.log(this.user)
            }*/
        },

        computed:{
            filterTab(){
                console.log(this.orderTab)
                return this.orderTab
            },

            filterAccount(){
                return this.accountTab
            }

        }
    }

</script>
<style scoped>

button{
    padding:15px
}

div#sidebar button:hover{
    background-color: white;
    color:black
    
}

div#sidebar button{
    padding-right: 20px;
    width: 13vw;
    color:white;
}

#parent-tab:hover #child-tab{
    visibility:visible;
    display: block;
}

.child{
    visibility: hidden;
    display: none;
}

.active2{
    background-color: rgb(24, 0, 76);
}

.active1{
    background-color: var(--secondary-color);
}

.show{
    visibility: visible;
    display: block;
}

.a{
    border-radius: 5px 5px 5px 5px;
    border: none;
    padding:10px;
}
.b{
    background-color: var(--main-color);

}
</style>