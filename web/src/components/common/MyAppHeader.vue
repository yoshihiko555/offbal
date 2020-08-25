<template>
    <div id="header">
        <v-app-bar
            app
            flat
            dense
            color='white'
        >
            <!-- ハンバーガーメニュー設定 -->
            <v-app-bar-nav-icon @click="togleDrawer" small class="mx-2"/>
            <v-spacer/>
            <v-btn
                icon
                small
                class="mx-2"
            >
                <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
                icon
                small
                class="mx-2"
            >
                <v-icon>mdi-bell-ring</v-icon>
            </v-btn>
            <v-btn
                icon
                small
                class="mx-2"
            >
                <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer
            v-model='drawer'
            :permanent='drawer'
            hide-overlay
            fixed
            class="main"
        >
            <v-list
                nav
                dense
            >
                <v-list-item
                    v-for='(menu, i) in menus'
                    :key='i'
                    @click="menu.call"
                >
                    <v-list-item-title>{{ menu.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import AuthService from '@/auth/AuthService'
const auth = new AuthService()

export default {
    name: 'MyAppHeader',
    data () {
        return {
            drawer: true,
            menus: [
                {
                    title: 'Inbox',
                    call: this.test,
                },
                {
                    title: 'Today',
                    call: this.test,
                },
                {
                    title: 'Coming soon',
                    call: this.test,
                },
                {
                    title: 'Favorite',
                    call: this.test,
                },
                {
                    title: 'Project',
                    call: this.test,
                },
                {
                    title: 'Label',
                    call: this.test,
                },
                {
                    title: 'Filter',
                    call: this.test,
                },
                {
                    title: 'Signout',
                    call: this.signout,
                },
            ],
        }
    },
	created () {
	},
    methods: {
        togleDrawer () {
            this.drawer = !this.drawer
            this.$emit('togleDrawer')
        },
    	signout () {
            auth.logout()
        },
        test () {
            console.log('test')
        }
    }
}
</script>

<style lang="scss">
</style>