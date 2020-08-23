<template>
    <div id='my-app'>
        <MyAppHeader
            @togleDrawer='drawer = !drawer'
        />
        <v-container class="main" :class="{ 'is-drawer': drawer }">
            <v-row>
                <v-col cols='12'>
                    <h1>MyApp</h1>
                </v-col>
            </v-row>
        </v-container>
        <Footer/>
    </div>
</template>

<script>
import MyAppHeader from '@/components/common/MyAppHeader'
import Footer from '@/components/common/Footer'

export default {
    name: 'MyApp',
    components: {
        MyAppHeader,
        Footer,
    },
    data: () => ({
        drawer: true,
    }),
    created () {

    },
    computed: {
    },
    methods: {
    },
}
</script>

<style lang="scss" scoped>
    .is-drawer {
        margin-left: 256px;
    }
</style>