<template>
    <div id='my-app'>
        <MyAppHeader
            @togleDrawer='drawer = !drawer'
        />
        <v-container class="main" :class="{ 'is-drawer': drawer }">
            <v-row>
                <v-col cols='12'>
                    <h1>Hello</h1>
                </v-col>
                <v-btn @click='test'>test</v-btn>
            </v-row>
        </v-container>
        <Footer/>
    </div>
</template>

<script>
import MyAppHeader from '@/components/common/MyAppHeader'
import Footer from '@/components/common/Footer'

import AuthService from '@/auth/AuthService'
const auth = new AuthService()

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
    	test () {
    		auth.test()
    	}
    },
}
</script>

<style lang="scss" scoped>
    .is-drawer {
        margin-left: 256px;
    }
</style>