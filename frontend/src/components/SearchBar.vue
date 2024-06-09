<script>
export default {
    props: {
        searchValue: {type: String, default: ""},
    },
    emits: ["submit", "update:searchValue"],
    methods: {
        updatesearchValue(e){
            this.$emit("update:searchValue", e.target.value);
        },

        submit(){
            this.$emit("sumbit");
        },
    },
};
</script>

<template>
    <div class = "input-group">
        <input
            type = "text"
            class ="form-control"
            placeholder="Nhập thông tin cần tìm"
            :value = "searchValue"
            @input = "updatesearchValue"
            @keyup.enter = "submit"
        />
        <div class = "input-group-append">
            <button class = "btn btn-outline-secondary"
                    type = "button"
                    @click = "submit">
                <i class = "fas fa-search"></i> Tìm kiếm
            </button>
        </div>
    </div>
</template>