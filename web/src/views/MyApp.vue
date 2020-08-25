<template>
    <div id='my-app'>
        <MyAppHeader/>
        <v-container fluid>
            <v-row>
           		<Sidebar
           			@togleDrawer='drawer = !drawer'
           		/>
                <v-col cols='12' class='myapp_main_wrap main' :class="{ 'is-drawer': drawer }">
                    <h1>Hello</h1>
                    <v-btn @click="openCreateProject">open project dialog</v-btn>
                    <div class='operation_btn_wrap pr-2'>
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

					<div class='today_todo_count_wrap pr-2'>
						<vs-button
							icon
							relief
                            size="large"
						>
							<i class='bx bx-list-check'></i>2/5
						</vs-button>
					</div>
                </v-col>
            </v-row>
        </v-container>

        <!-- モーダル読み込み -->
        <CreateProjectDialog
            ref='project'
        />
    </div>
</template>

<script>
import MyAppHeader from '@/components/common/MyAppHeader'
import Sidebar from '@/components/common/Sidebar'
import CreateProjectDialog from '@/components/common/CreateProjectDialog'

import AuthService from '@/auth/AuthService'
const auth = new AuthService()

export default {
    name: 'MyApp',
    components: {
        MyAppHeader,
        Sidebar,
        CreateProjectDialog,
    },
    data: () => ({
        drawer: true,
    }),
    created () {
    },
    computed: {
    },
    methods: {
        openCreateProject () {
            this.$refs.project.open()
        }
    },
}
</script>

<style lang="scss" scoped>
    .myapp_main_wrap {
        margin-left: 60px;
        max-width: calc(100% - 60px);
    	position: relative;
        transition: .2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    .is-drawer {
        margin-left: 256px;
        max-width: calc(100% - 256px);
    }
    .operation_btn_wrap::v-deep {
        position: absolute;
        top: 0;
        right: 0;
        .vs-button {
            display: inline-block;
        }
    }
    .today_todo_count_wrap::v-deep {
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>