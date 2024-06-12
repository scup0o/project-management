<script>
    import AccountForm from './AccountForm.vue';
    import UserService from '../services/user.service';
    export default{
        components:{
            AccountForm
        },  

        props:{
            accounts:{type: Array, required: true},
        },

        data(){
            return{
                editAccount: null,
                edit: false,
            }
        },

        mounted(){
            
        },

        methods:{
            async deleteAccount(data){
                if (confirm('Bạn có chắc muốn xóa tài khoản?')){
                    let check;
                    console.log(data)
                    check = await UserService.delete(data.id)
                if (check===true){
                    this.$toast.open({
                                message: "Xóa tài khoản thành công",
                                type: "success",
                                duration: 3000 ,
                                dismissible: true
                            })
                    this.$emit('refresh')
                }
                
                }
            }
        }
    }
</script>
<template>
        <div v-for="account in accounts" :key="account" style="padding-bottom: 10px;">
            <div class="box row">
                <div class="col-2 d-flex" style="margin: auto;">
                    <img :src="`../../src/assets/img/${account.anhdaidien}`" style="width: 50px; height: 50px; border-radius: 100%; display: inline;">
                    <p style="display: inline; margin-left:-10px; margin: auto">{{ account.manhanvien }}</p>
                </div>
                <div class="col d-flex" style="margin: auto;">
                    {{ account.username }}
                </div>
                <div class="col-2" style="margin: auto;">
                    {{ account.hoten }}
                </div>
                <div class="col-2" style="margin: auto;">
                    <div>{{ account.email }}</div>
                </div>
                <div class="col-3 text-center"  style="margin: auto; text-align: center;">
                    <p style="margin: auto;" v-if="account.chucvu === 'admin'">Quản trị</p>
                    <p style="margin: auto;" v-if="account.chucvu === 'hc'">Nhân viên hành chính</p>
                    <p style="margin: auto;" v-if="account.chucvu === 'kt'">Nhân viên ký thuật</p>
                </div>
                <div class="col text-end" style="margin: auto">
                            <button  class="btn btn-outline-secondary" 
                                    @click="editAccount = account; edit = true"
                                    style="margin-right:10px; border:none">
                                    <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline-secondary delete-icon"
                            style="border:none"
                                    @click="deleteAccount(account)">
                                    <i class="fa-solid fa-trash-can"></i>
                            </button>
                            
                        </div>
            </div>
        </div>
        <AccountForm :account="editAccount" :e="true" v-if="edit===true" @close="edit=false" @refresh="this.$emit('refresh')"></AccountForm>
</template>
<style scoped>
.box{
    box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
    background-color: white;
    border-radius: 10px 10px 10px 10px;
    padding: 10px;
}

.box:hover{
    transform: scale(1.01);
    transition: transform 100ms ease-in-out;
}
</style>