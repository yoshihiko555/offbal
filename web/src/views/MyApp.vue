<template>
    <div id='my-app'>
        <MyAppHeader/>
        <v-container class="main">
            <v-row>
           		<Sidebar
           			@togleDrawer='drawer = !drawer'
           		/>
                <v-col cols='12' class='myapp_main_wrap' :class="{ 'is-drawer': drawer }">
                    <h1>Hello</h1>
                    <div class='operation_btn_wrap'>
	                    <vs-button
							icon
							relief
						>
							<i class='bx bx-filter' ></i>
						</vs-button>
						<vs-button
							icon
							relief
						>
							<i class='bx bx-slider-alt'></i>
						</vs-button>
					</div>

					<div class='today_todo_count_wrap'>
						<vs-button
							icon
							relief
						>
							<i class='bx bx-list-check'></i>2/5
						</vs-button>
					</div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import MyAppHeader from '@/components/common/MyAppHeader'
import Sidebar from '@/components/common/Sidebar'

import AuthService from '@/auth/AuthService'
const auth = new AuthService()

export default {
    name: 'MyApp',
    components: {
        MyAppHeader,
        Sidebar,
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
    .myapp_main_wrap {
    	position: relative;
    }
</style>