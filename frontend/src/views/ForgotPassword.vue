<template>
    <div class="container-fluid" style="" >
    
        <img src="../assets/img/VinylMePlease_Paul-Miller.jpg" style="position: absolute; z-index:-1; margin:auto; width:100%; margin-top:-30px; margin-left:-30px; height:800px">

            <div class="row mx-auto" style="max-width: 650px; padding:40px;"   v-if="!id">
                <div class="col" style="background-color: white;  border-radius: 10px 10px 10px 10px;">
                    <div style="padding:50px">
                        <p style="margin:auto; text-align: center; font-family: 'RalewayBlack'; font-size: 27px;">Quên mật khẩu</p>
                        <Form
                            @submit="getPassword"
                            :validation-schema="FormSchema"
                            style="padding:30px">
                            
                            <div class="form-group">
                                <label for="email" style="font-family: 'RalewayBold';">Nhập E-mail hoặc Tên đăng nhập</label>
                                <Field
                                    name="email"
                                    type="text"
                                    class="form-control">
                                </Field>
                                <ErrorMessage name="email" class="error-feedback" as="p"></ErrorMessage>
                                <p style="color:red">{{ emailMes }}</p>
                            </div>
                            <button class="btn btn-dark form-control"
                                    style="border-radius: 25px 25px 25px 25px; margin-top: 20px;">
                               Gửi Email
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
            <div v-else class="row mx-auto" style="max-width: 650px; padding:40px;">
                <div class="col" style="background-color: white;  border-radius: 10px 10px 10px 10px;">
                    <div style="padding:50px">
                        <p style="margin:auto; text-align: center; font-family: 'RalewayBlack'; font-size: 27px;">Đổi mật khẩu</p>
                        <Form
                            @submit="changePassword"
                            :validation-schema="FormSchema2"
                            style="padding:30px">
                            
                            <div class="row">
                                <div class="form-group">
                                    <label for="newpassword">Mật khẩu mới: </label>
                                    <div>
                                        <Field :type="typenew" name="newpassword" class="input form-control" v-model="newpassword" style="max-width:350px; display: inline;"></Field>
                                        <div class="control" style="display: inline; padding-left:10px">
                                                                    <span class=""  @click="toggleShownew">
                                                                        <i class="fas" :class="{ 'fa-eye-slash': !shownewPassword, 'fa-eye': shownewPassword }"></i>
                                                                    </span></div></div>
                                        
                                    <ErrorMessage name="newpassword" style="color:red"></ErrorMessage>
                            </div></div>
                            <div class="row" style="padding-top:10px">
                                <div class="form-group">
                                    <label for="newpassword">Xác nhận mật khẩu mới: </label>
                                    <div>
                                        <Field :type="typeconfirm" name="confirmpassword" class="input form-control" v-model="confirmpassword" style="max-width:350px; display: inline;"></Field>
                                        <div class="control" style="display: inline; padding-left:10px">
                                                                    <span class=""  @click="toggleShowconfirm">
                                                                        <i class="fas" :class="{ 'fa-eye-slash': !showconfirmPassword, 'fa-eye': showconfirmPassword }"></i>
                                                                    </span></div></div>
                                        
                                    <ErrorMessage name="confirmpassword" style="color:red"></ErrorMessage>
                                    <p style="color:red">{{ confirmMessage }}</p>
                            </div></div>
                            <button class="btn btn-dark form-control"
                                    style="border-radius: 25px 25px 25px 25px; margin-top: 20px;">
                               Đổi mật khẩu
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

    import UserService from "@/services/user.service.js"

    export default {
        components: {
            Form,
            Field,
            ErrorMessage,
        },
        watch:{
            email(){
                this.emailMes = ''
            }
        },

        data(){
            const FormSchema = yup.object({
            });

            const FormSchema2 = yup.object({
                    newpassword: yup
                    .string()
                    .required("Mật khẩu không được để trống")
                    .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
                    confirmpassword: yup
                    .string()
                    .required("Mật khẩu không được để trống")
                    .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
            })
            return{
                newpassword:'',
                confirmpassword:'',
                id: this.$route.params.id,
                email:'',
                type:'password',
                showPassword: false,
                userNew: FormSchema,
                FormSchema,
                FormSchema2,
                showPassword: false,
                emailMes:'',
      typenew: "password",
      shownewPassword:false,
      typeconfirm: "password",
      showconfirmPassword:false,
      confirmMessage: '',
      passwordMessage: ''
            }
        },

        methods: {
            async getPassword(data){
                try{
                    const check = await UserService.forgotPassword(data);
                    console.log(check);
                    if (check===false) this.emailMes='Không tìm thấy tài khoản'
                    else{
                        alert('Link đổi mật khẩu đã được gửi vào email');
                    }
                }
                catch(error){
                    console.log(error);
                }
            },

            toggleShow() {
      this.showPassword = !this.showPassword;
      console.log(this.type);
      if (this.showPassword === true) this.type = "text";
      else this.type = "password";
    },

    toggleShownew() {
      this.shownewPassword = !this.shownewPassword;
      console.log(this.type);
      if (this.shownewPassword === true) this.typenew = "text";
      else this.typenew = "password";
    },

    toggleShowconfirm() {
      this.showconfirmPassword = !this.showconfirmPassword;
      console.log(this.type);
      if (this.showconfirmPassword === true) this.typeconfirm = "text";
      else this.typeconfirm = "password";
    },

    async changePassword(data){
        console.log(data)
        this.confirmMessage=''
        this.passwordMessage=''
        data.util='forgot';
        let check = await UserService.changePassword(this.id, data);
            if (check==='wrong') this.confirmMessage='Mật khẩu xác nhận không trùng khớp mật khẩu hiện tại'
            else{
                this.$toast.open({
                                message: "Đổi mật khẩu thành công",
                                type: "success",
                                duration: 3000 ,
                                dismissible: true
                            });
                            localStorage.setItem("auth",check);

                            location.reload()
            }
        
    }

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