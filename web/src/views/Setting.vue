<template>
    <div id='setting'>
        <vs-navbar>
            <template #left>
                <h3>設定</h3>
            </template>
            <template #right>
                <vs-button @click="back">
                    閉じる<i class='bx bx-x'/>
                </vs-button>
            </template>
        </vs-navbar>
        <v-container class="main">
            <v-row>
                <v-col cols='3' class="sidebar_wrap">
                    <vs-sidebar
                        v-model="active"
                        open
                        absolute
                        notShadow
                        class="main mt-0"
                    >
                        <!-- vs-sidebarに直でclickイベント仕込んでも何故か発火しないので
                        buttonタグでラップする -->
                        <button
                            v-for="menu in menus"
                            :key='menu.id'
                            @click="changeView(menu.component)"
                            class="sidebar_btn_wrap"
                        >
                            <vs-sidebar-item :id="menu.id">
                                <template #icon>
                                    <i class="bx" :class="menu.icon"/>
                                </template>
                                {{ menu.name }}
                            </vs-sidebar-item>
                        </button>
                    </vs-sidebar>
                </v-col>
                <v-col cols='9'>
                    <component :is='view'/>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import GeneralSetting from '@/components/common/GeneralSetting'
    import ThemeSetting from '@/components/common/ThemeSetting'
    import AcountSetting from '@/components/common/AcountSetting'
    import KarmaSetting from '@/components/common/KarmaSetting'

    export default {
        name: 'Setting',
        components: {
            GeneralSetting,
            ThemeSetting,
            AcountSetting,
            KarmaSetting,
        },
        data () {
            return {
                active: 'general',
                view: GeneralSetting,
                menus: [
                    {
                        id: 'general',
                        name: '一般',
                        component: GeneralSetting,
                        icon: 'bx-cog',
                    },
                    {
                        id: 'theme',
                        name: 'テーマ',
                        component: ThemeSetting,
                        icon: 'bx-palette',
                    },
                    {
                        id: 'acount',
                        name: 'アカウント',
                        component: AcountSetting,
                        icon: 'bx-user',
                    },
                    {
                        id: 'karma',
                        name: 'カルマ',
                        component: KarmaSetting,
                        icon: 'bx-droplet',
                    },
                ],
            }
        },
        created () {
        },
        computed: {
        },
        methods: {
            changeView (view) {
                this.view = view
            },
            back () {
                this.$router.back()
            }
        },
    }
</script>

<style lang="scss" scoped>
    .sidebar_wrap::v-deep {
        position: relative;

        .sidebar_btn_wrap {
            width: 100%;
        }
    }
</style>
