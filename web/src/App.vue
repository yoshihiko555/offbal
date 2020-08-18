<template>
  <v-app>
        <Header/>
            <router-view/>
        <Footer/>
  </v-app>
</template>

<script>
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
export default {
    name: 'App',
    components: {
        Header,
        Footer,
    },
    data: () => ({
    })
}
</script>

<style lang="scss">
</style>