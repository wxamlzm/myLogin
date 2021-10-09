<template>
    <div>
        index
    </div>
</template>

<script>
export default {
    beforeMount(){
        this.$axios.get('/').then( res => {
            console.log(res.data)
        })
    }
    
}
</script>

<style lang="scss">

</style>