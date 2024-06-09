
<template>
    <div class="container-fluid" style="background-color: rgb(255, 255, 255);">
            <div class="row">
                <div class="col-7 text-center" style="padding:20px; margin:auto">
                    <img src="../assets/img/vinyl-login.jpg" style="width:800px; height: 600px; border-radius: 10px 10px 10px 10px;">
                    
                </div>
                <div class="col" style="background-color: white;">
                    <div style="padding:50px; padding-top:150px">
                        <p style="margin:auto; text-align: center; font-family: 'RalewayBlack'; font-size: 30px;">Đăng nhập</p>
                        <Form
                            @submit="loginUser"
                            :validation-schema="FormSchema"
                            style="padding:30px">
                            
                            <div class="form-group">
                                <label for="userLog" style="font-family: 'RalewayBold';">E-mail hoặc Tên đăng nhập</label>
                                <Field
                                    name="userLog"
                                    type="text"
                                    class="form-control"
                                    v-model="userNew.userLog">
                                </Field>
                                <ErrorMessage name="email" class="error-feedback" as="p"></ErrorMessage>
                            </div>
                            <div class="form-group" style="padding-top:10px">
                                <label for="password" style="font-family: 'RalewayBold';">Mật khẩu</label>
                                <div>
                                            <Field :type="type" name="password" class="input form-control" v-model="userNew.password" style="max-width:410px; display: inline;"></Field>
                                            <div class="control" style="display: inline; padding-left:10px">
                                                                        <span class=""  @click="toggleShow">
                                                                            <i class="fas" :class="{ 'fa-eye-slash': !showPassword, 'fa-eye': showPassword }"></i>
                                                                        </span></div></div>
                                <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
                            </div>
                            <p class="fg" style="text-align: right; padding-top: 10px; font-size:15px" @click="this.$router.push({name: 'forgotpassword'})">Quên mật khẩu?</p>
                            <button class="btn btn-dark form-control"
                                    style="border-radius: 25px 25px 25px 25px;">
                               Đăng nhập
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
</template>



<script>
    import * as yup from "yup";
    import { Form, Field, ErrorMessage } from "vee-validate";
    import UserService from "@/services/user.service.js";
    import CartService from "@/services/cart.service.js";
    import VueJwtDecode from 'vue-jwt-decode';

    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },

        data(){
            
            const FormSchema = yup.object({
            });

            return{
                type:'password',
                showPassword: false,
                userNew: FormSchema,
                FormSchema,
            }
        },

        methods: {
            async loginUser(data){
                try{
                    const user = await UserService.login(data);
                    //console.log(JSON.stringify(user));
                    console.log(user);
                    if(user === 'incorrected' || user === 'not verified'){
                        if (user === 'incorrected') alert("Tên đăng nhập hoặc mật khẩu sai");
                        if (user === 'not verified') alert("Tài khoản chưa được xác thực email");
                    }
                    else{
                       
                        if (!(localStorage.getItem('tempcart'))){}
                        else{
                            let tempCart = localStorage.getItem('tempcart')
                            if (tempCart){
                                tempCart = JSON.parse(tempCart);
                                console.log(tempCart)
                                tempCart.util = 'all'
                                const check = await CartService.update(VueJwtDecode.decode(user).id, tempCart);
                                if (check===true){ 
                                    localStorage.removeItem('tempcart');
                                    this.$toast.open({
                                                        message: 'Giỏ hàng đã được cập nhật',
                                                        type: 'success',
                                                        duration: 3000,
                                                        dismissible: true
                                                    })
                                }
                            }
                        }
                        localStorage.setItem("auth",user);
                        //const auth = localStorage.getItem('auth');
                        //console.log(VueJwtDecode.decode(auth).role);
                        //console.log(VueJwtDecode.decode(user).username);
                        //console.log(this.$cookies.get("jwt"))
                        location.reload();
                    }
                    
                }
                catch(error){
                    console.log(error);
                }
            },

            toggleShow() {
            this.showPassword = !this.showPassword;
            console.log(this.type)
            if (this.showPassword===true) this.type='text'
            else this.type='password'
            },

        },
    }
</script>

<style scoped>
.fg:hover{
    text-decoration: underline;
    cursor:pointer;
}
.box{

    background-color: white;
    padding: 70px;
}
</style>