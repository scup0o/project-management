<template>
    <div class="row">
        <div class="col-3" v-for="(doctype, index) in doctypes" :key="doctype" style="padding-bottom:25px" >
            <div class="card" data-aos="fade-up" :data-aos-duration="(index+1)*200">
                <div class="row">
                    <div class="col text-center"><img style="display: inline-flex; border:none; width: 200px; height: 200px;" class="preview img-thumbnail image" alt="" :src="`../../src/assets/img/${doctype.image}`"/>
                </div>
                </div>
                <div class="row">
                    <div class="col text-center"><label v-snip="{ lines: 1 }">{{ doctype.name }}</label></div>
                </div>
                <div class="row" id="description-box">
                    <div class="col text-center"><p v-snip="{ lines: 2 }">{{ doctype.description }}</p></div>
                </div>
                <div class="row" id="util-button">
                    <div class="col text-center" style="">
                        <button class="btn btn-outline-secondary" 
                                @click="editDoctype = doctype, edit = true"
                                style="margin-right:10px;">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-outline-secondary delete-icon"
                                @click="deleteDoctype(doctype)">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <DoctypeForm v-if="edit === true"
                :doctype="editDoctype"
                :e="true"
                @close="edit = false"
                @refresh="this.$emit('refresh')">
    </DoctypeForm>
</template>
<script>
    import DoctypeForm from "@/components/DoctypeForm.vue";
    import DoctypeService from "@/services/doctype.service"

    export default{
        components:{
            DoctypeForm
        },
        emits: ["refresh"],

        props:{
            doctypes:{
                type:Array, default: []
            }
        },

        data(){
            return{
                editDoctype: null,
                edit: false,
            }
        },

        methods:{
            async deleteDoctype(data){
                try{
                    if (confirm(`Bạn có chắc muốn xóa thể loại ${data.name}?`)){
                    const check = await DoctypeService.delete(data._id)
                    if (check===false){
                        this.$toast.open({
                                message: "Xóa thể loại thất bại",
                                type: "error",
                                duration: 3000 ,
                                dismissible: true
                            })
                    }
                    else{
                        this.$toast.open({
                            message: "Xóa thành công",
                            type: "success",
                            duration: 3000,
                            dismissible: true
                        })
                        this.$emit('refresh')
                    }}
                }
                catch(error){
                    console.log(error)
                }
            }
        }
    }
</script>

<style scoped>

label{
    font-family: 'RalewayBold';
}
.card{
    background-color: white;
    padding:15px;
    border:none;
    box-shadow: 0 2px 8px rgba(176, 176, 176, 0.33);
}

.card:hover{
    transform: scale(1.05);
    z-index: 999;
}

.card:hover #util-button{
    visibility: visible;
}

.card:hover #description-box{
    height:90px;
}

#description-box{
    height: 50px;
}

#util-button{
    visibility: hidden;
}

</style>