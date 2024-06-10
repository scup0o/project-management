<template>
    <div class="container-fluid">
        <div class="row" style="padding-bottom: 20px;">
            <div class="col-5">
                <span>Danh sách thể loại</span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-outline-secondary" 
                        @click="createForm = true"
                        data-aos="fade-up"
                        style="margin-right:10px">
                    Thêm thể loại
                    <i class="fa-solid fa-square-plus"
                        id="util-icon"
                       ></i>
                </button>
                <button class = "btn btn-outline-secondary" 
                        data-aos="fade-up" data-aos-duration="500"
                        @click="deleteAll()">
                    Xóa tất cả
                   <i class="fa-solid fa-trash" id="util-icon"></i> 
                </button>
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
            <GenreForm v-if="createForm === true" 
                        @close="createForm = false"
                        @refresh="retrieveGenre()"
                        :e="false"
                        :genre="{
                            name: null,
                            description: null,
                            image:null,
                        }">

            </GenreForm>
        </div>
        <div class="row" style="padding-top:20px" >
            <div v-for="(genre, index) in sliceGenre" :key="index" v-if="filteredGenresCount > 0">
                <AdminGenreRender v-if=" index===onPage"
                                    :genres="genre"
                                    :is="genre"
                                    @refresh="retrieveGenre()">
                </AdminGenreRender>
                
            </div>
            <p v-else>Không có thể loại nào.</p>
        </div>
        <div class="row text-center d-flex" v-if="filteredGenresCount > 0">
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
                    style=" margin-left:10px; border-color: none" 
                    title="Trang sau"><i class="fa-solid fa-caret-right"></i></button>
            </div>
        </div>
    </div>
</template>
<script>
    import '@/assets/css/base.css'
    import GenreForm from "@/components/GenreForm.vue"
    import GenreService from "@/services/genre.service"
    import AdminGenreRender from "@/components/AdminGenreRender.vue"

    export default{
        components:{
            GenreForm,
            AdminGenreRender,
        },

        

        data(){
            return{
                genres: [],
                genresList: [],
                createForm: false,
                searchText: '',
                onPage: 0,
                pageNumber: 0,
                onPageTemp: 1,
            }
        },

        mounted(){
            this.retrieveGenre();
        },

        computed:{
            genreStrings(){
                return this.genres.map((genre) =>{
                    const {name} = genre;
                    return [name].join("");
                });
            },

            filteredGenres(){
                if (!this.searchText) return this.genres;
                return this.genres.filter((_genre, index) => this.genreStrings[index].toLowerCase().includes(this.searchText.toLowerCase()));
                
            },

            filteredGenresCount(){
                //console.log(this.filteredGenres.length);
                return this.filteredGenres.length
            },

            sliceGenre(){
                let genreListNumber = Math.ceil(this.filteredGenres.length / 8);
                this.pageNumber = genreListNumber
                let count = 0;
                let tempGenres = []
                let i;
                for (i=0; i<genreListNumber; i++){
                    tempGenres[i] = this.filteredGenres.slice(count,count+8);
                    count=count+8;
                }
                this.genresList = tempGenres;
                return tempGenres;

            }
        },

        methods:{
            async deleteAll(){
                if (confirm("Bạn muốn xóa tất cả Thể loại?")){
                    try{
                        const deleteCount = await GenreService.deleteAll()
                        if (deleteCount.deletedCount!=0){
                            this.$toast.open({
                                    message: `Xóa ${deleteCount.deletedCount} thể loại thành công`,
                                    type: "success",
                                    duration: 3000 ,
                                    dismissible: true
                                })
                            this.retrieveGenre()
                        }
                        
                    }
                    catch(error){
                        console.log(error)
                    }
                }
            },
            
            async retrieveGenre(){
                try{
                    this.genres = await GenreService.getAll();
                    console.log(this.genres)
                }
                catch(error){
                    console.log(error);
                }
            }   
        },
    }
</script>
<style scoped>
span{
    font-family: 'RalewayBold';
    font-size: 25px;
}
</style>