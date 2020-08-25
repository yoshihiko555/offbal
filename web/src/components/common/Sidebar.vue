<template>
    <div id="sidebar">
		<v-navigation-drawer
			v-model="drawer"
			:mini-variant="!drawer"
			permanent
			fixed
			hide-overlay
			class='main'
		>
	    	<div class='pa-2 menu_open_btn_wrap'>
				<v-btn icon @click='togleDrawer'>
					<v-icon>mdi-menu</v-icon>
				</v-btn>
			</div>
			<v-list
				nav
				dense
			>
				<v-list-item
				    v-for='(menu, i) in menus'
				    :key='i'
				    @click="menu.call"
				>
					<v-list-item-icon>
					    <v-icon v-text='menu.icon'></v-icon>
					</v-list-item-icon>

					<v-list-item-title>
					    {{ menu.title }}
					</v-list-item-title>
				</v-list-item>
	 		</v-list>
		</v-navigation-drawer>
    </div>
</template>

<script>
import AuthService from '@/auth/AuthService'
const auth = new AuthService()

export default {
    name: 'Sidebar',
    data () {
        return {
            drawer: true,
            menus: [
                {
                    title: 'Inbox',
                    call: this.test,
                    icon: 'mdi-inbox',
                },
                {
                    title: 'Today',
                    call: this.test,
                    icon: 'mdi-calendar-today',
                },
                {
                    title: 'Coming soon',
                    call: this.test,
                    icon: 'mdi-calendar-month-outline',
                },
                {
                    title: 'Favorite',
                    call: this.test,
                    icon: 'mdi-star',
                },
                {
                    title: 'Project',
                    call: this.test,
                    icon: 'mdi-format-list-checkbox',
                },
                {
                    title: 'Label',
                    call: this.test,
                    icon: 'mdi-label-multiple-outline',
                },
                {
                    title: 'Activity',
                    call: this.test,
                    icon: 'mdi-bell-ring',
                },
                {
                    title: 'Signout',
                    call: this.signout,
                    icon: 'mdi-account-arrow-right-outline',
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

<style lang="scss" scoped>
	.menu_open_btn_wrap > button {
		margin-left: 1px;
	}
</style>