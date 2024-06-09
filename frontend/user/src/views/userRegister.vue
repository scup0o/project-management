<template>
    <div class="container-fluid" style=" padding: 30px; background-image: url('../assets/img/vinyl-login-3.webp') ;">
        <img src="../assets/img/VinylMePlease_Paul-Miller.jpg" style="position: absolute; z-index:-1; margin:auto; width:100%; margin-top:-30px; margin-left:-30px">
        <div class="box" style="z-index: 100;">
            <div class="row mx-auto" >
                
                <div class="col" style="z-index: 100;">
                    <div class="row">
                        <div class="col text-center" style="font-family: 'RalewayBlack'; font-size: 25px; padding-top: 10px; padding-bottom:20px">Tạo tài khoản mới</div>
                    </div>
                    <Form
                        @submit="createUser"
                        :validation-schema="FormSchema">
                        <div class="row">
                            
                            <label style="font-family: 'RalewayBold'; font-size: 18px; padding-bottom: 10px;">Thông tin tài khoản</label>
                            <div class="col"><div class="form-group">
                                <label for="username">Tên đăng nhập:</label>
                                <Field
                                    name="username"
                                    type="text"
                                    class="form-control"
                                    v-model="userNew.username">
                                </Field>
                                <ErrorMessage name="username" style="color:red"></ErrorMessage>
                                <div class="error-feedback">{{ usernameMessage }}</div>
                            </div></div>
                            <div class="col">
                                <div class="form-group">
                                <label for="password">Mật khẩu</label>
                                <div>
                                        <Field :type="type" name="password" class="input form-control" v-model="userNew.password" style="max-width:240px; display: inline;"></Field>
                                        <div class="control" style="display: inline; padding-left:15px">
                                                                    <span class=""  @click="toggleShow">
                                                                        <i class="fas" :class="{ 'fa-eye-slash': !showPassword, 'fa-eye': showPassword }"></i>
                                                                    </span></div></div>
                                <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
                                </div>
                            </div>
                            
                        </div>
                        <div>
                            <label style="font-family: 'RalewayBold'; font-size: 18px; padding-bottom: 10px; padding-top:10px">Thông tin cá nhân</label>
                            <div class="form-group">
                                <label for="name">Họ và tên:</label>
                                <Field
                                    name="name"
                                    type="text"
                                    class="form-control"
                                    v-model="userNew.name">
                                </Field>
                                <ErrorMessage name="name" style="color:red"></ErrorMessage>
                            </div>
                            <div class="form-group">
                                <label for="email">E-mail</label>
                                <Field
                                    name="email"
                                    type="email"
                                    class="form-control"
                                    v-model="userNew.email">
                                </Field>
                                <ErrorMessage name="email" class="error-feedback"></ErrorMessage>
                                <p style="color:red">{{ emailMessage }}</p>
                            </div>
                            <div class="form-group">
                            <label for="phone">Điện thoại</label>
                            <Field
                                name="phone"
                                type="tel"
                                class="form-control"
                                v-model="userNew.phone">
                            </Field>
                            <ErrorMessage name="phone" class="error-feedback"></ErrorMessage>
                        </div>
                            <div class="form-group">
                            <label for="address">Địa chỉ</label>
                            <Field
                                as="textarea"
                                name="address"
                                type="text"
                                class="form-control"
                                v-model="userNew.address">
                            </Field>
                            <ErrorMessage name="address" class="error-feedback"></ErrorMessage>
                        </div>
                        </div>
                        <div class="row">
                            <div class="col text-center">
                                <button class="btn btn-dark" style="padding:10px; width: 150px; margin-top: 10px;">
                                                            Đăng ký
                                                        </button>
                            </div>
                        </div>
                        
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as yup from "yup";
    import { Form, Field, ErrorMessage } from "vee-validate"
    import UserService from "@/services/user.service.js"

    export default{
        components: {
            Form,
            Field,
            ErrorMessage,
        },

        data(){
            
            const FormSchema = yup.object({
                name: yup
                    .string()
                    .required("Tên phải có giá trị.")
                    .min(2, "Tên phải ít nhất 2 ký tự.")
                    .max(50, "Tên có nhiều nhất 50 ký tự."),
                username: yup
                    .string()
                    .required('Tên đăng nhập không được để trống'),
                password: yup
                    .string()
                    .required('Mật khẩu không được để trống')
                    .min(6, "Mật khẩu phải >= 6 ký tự"),
                email: yup
                    .string()
                    .required("Email không được để trống")
                    .email("Vui lòng nhập email hợp lệ.")
                    .max(50, "E-mail tối đa 50 ký tự."),
                address: yup.string().required("Địa chỉ không được để trống").max(100, "Địa chỉ tối đa 100 ký tự."),
                phone: yup
                    .string()
                    .required("Số điện thoại không được để trống")
                    .min(10,"Số điện thoại không hợp lệ.")
                    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Số điện thoại không hợp lệ'),
            });

            return{
                type:'password',
                showPassword: false,
                userNew: FormSchema,
                FormSchema,
                usernameMessage: "",
                emailMessage: '',
            }
        },

        methods: {
            async createUser(data){
                try{
                    this.usernameMessage=''
                    this.emailMessage = ''
                    const check = await UserService.register(data);
                    //console.log(check);
                    if (check){
                        if (check.username === data.username){
                            this.usernameMessage = 'Tên đăng nhập đã tồn tại'
                        }
                        if (check.email === data.email){
                            this.emailMessage = 'Email đã tồn tại';
                        }}
                    else{
                        alert("Link xác thực tài khoản đã được gửi đến email.")
                        //console.log( data);
                        this.$router.push({name: 'user.login'})}
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

.form-control{
    border-width: 1.55px;
    border-color: var(--secondary-color);
    box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
}
.error-feedback{
    color: red;
}

.box{
    z-index: 100;
    max-width: 650px;
    margin: auto;
    background-color: white;
    padding: 20px;
    border-radius: 10px 10px 10px 10px;
}
</style>