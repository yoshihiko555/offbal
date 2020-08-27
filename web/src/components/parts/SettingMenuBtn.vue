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
                    @click="menu.call"
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
                        name: 'Signout',
                        icon: 'mdi-account-arrow-right-outline',
                        call: this.signout,
                    },
                ],
            }
        },
        methods: {
        	signout () {
                auth.logout()
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>