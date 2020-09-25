<template>
    <div id='setting'>
        <vs-navbar>
            <template #left>
                <h3>設定</h3>
            </template>
            <template #right>
                <vs-button to='/myapp'>
                    閉じる<i class='bx bx-x'/>
                </vs-button>
            </template>
        </vs-navbar>
        <v-container class="main">
            <v-row>
                <!-- サイドバー -->
                <v-col cols='3' class="sidebar_wrap">
                    <vs-sidebar
                        v-model="active"
                        open
                        absolute
                        notShadow
                        class="main mt-0"
                    >
                        <vs-sidebar-item
                            v-for="menu in menus"
                            :key='menu.id'
                            :id="menu.id"
                            :to='menu.url'
                        >
                            <template #icon>
                                <i class="bx" :class="menu.icon"/>
                            </template>
                            {{ menu.name }}
                            </vs-sidebar-item>
                    </vs-sidebar>
                </v-col>

                <!-- メインコンテンツ -->
                <v-col cols='9'>
                    <router-view/>
                    <button @click='get'>get</button>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import { Const } from '@/assets/js/const'
    import { createNamespacedHelpers  } from 'vuex'

    const Con = new Const()
    const { mapGetters } = createNamespacedHelpers('setting')

    export default {
        name: 'Setting',
        components: {
        },
        data: () => ({
            active: 'general',
            menus: Con.SETTING_SIDEBAR_MENU,
        }),
        created () {
        	switch (this.$route.name) {
        	case 'General':
        		this.active = 'general'
        		break

        	case 'Theme':
        		this.active = 'theme'
        		break

        	case 'Acount':
        		this.active = 'acount'
        		break

        	case 'Karma':
        		this.active = 'karma'
        		break

    		default:
    		    break
        	}
        },
        computed: {
        	...mapGetters([
        		'setting',
        	]),
        },
        methods: {
        	get () {
        		console.log(this.setting)
        		console.log(this.categorys)
        		console.log(this.$store.getters)
        	}
        },
    }
</script>

<style lang="scss" scoped>
    .sidebar_wrap::v-deep {
        position: relative;
    }
</style>
