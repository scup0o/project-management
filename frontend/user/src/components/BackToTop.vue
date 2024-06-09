<template>
    <button class="to-top"
        @click="toTop"><i class="fa-solid fa-arrow-up"></i></button>
</template>
<script>
    export default{
        methods:{
            toTop(){
                window.scrollTo({
                    top:0,
                    behavior: 'smooth'
                })
            }
        }
    }
</script>
<style scoped>
.to-top{
    font-size: 20px;
    position: fixed;
    right: 10px;
    bottom: 10px;
    border-radius: 100%;
    width: 50px;
    height: 50px;
    z-index: 999;
    background-color: white;
    border-width: 2px;
    border-color: black;
    opacity: 50%;
}

.to-top:hover{
    opacity: 100%;
}
</style>