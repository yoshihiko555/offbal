<template>
    <div id='home'>
        <Header/>
        <v-container class="main">
            <v-row>
                <v-col cols='12' class="text-center">
                    <h1>Welcome offbal !</h1>
                    <p>Please sign in</p>
                    <p>Hello World</p>
                </v-col>
            </v-row>
        </v-container>
        <Footer/>
    </div>
</template>

<script>
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default {
    name: 'Home',
    components: {
        Header,
        Footer,
    },
    data: () => ({
    }),
    created () {
    	console.log(process.env)
    	console.log(process.env.NODE_ENV)
    },
    computed: {
    },
    methods: {
    },
}
</script>

<style lang="scss" scoped>
</style>