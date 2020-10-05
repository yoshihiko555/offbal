<template>
    <div>
        <v-menu
            offset-y
            transition="slide-y-transition"
            rounded='lg'
            min-width=200
        >
            <template #activator='{ attrs, on }'>
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on.stop='on'
                >
                    <v-icon color="grey">mdi-cog-outline</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for='(menu, i) in menus'
                    :key='i'
                    @click="menu.call(menu.url)"
                >
                    <v-list-item-icon class="mr-0">
                        <v-icon small v-text='menu.icon'/>
                    </v-list-item-icon>
                    <v-list-item-title>{{ menu.name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import AuthService from '@/auth/AuthService'
    const auth = new AuthService()

	export default {
        name: 'SettingMenuBtn',
        components: {
        },
        data () {
            return {
                menus: [
                    {
                        name: 'Setting',
                        icon: 'mdi-cog',
                        url: '/setting',
                        call: this.toPage,
                    },
                    {
                    	name: 'Theme',
                    	icon: 'mdi-palette',
                    	url: '/setting/theme',
                    	call: this.toPage,
                    },
                    {
                        name: 'Signout',
                        icon: 'mdi-account-arrow-right-outline',
                        url: '',
                        call: this.signout,
                    },
                ],
            }
        },
        methods: {
            ...mapMutations([
                'destroySession',
            ]),
        	signout () {
                auth.logout()
                this.destroySession()
            },
            toPage (url) {
            	this.$router.push(url)
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>