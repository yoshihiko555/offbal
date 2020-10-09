<template>
    <div id='setting'>
        <vs-navbar>
            <template #left>
                <h3>設定</h3>
            </template>
            <template #right>
                <vs-button @click='toApp'>
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
                    <router-view
                        :setting='setting'
                        @update-is-change='updateIsChange'
                    />
                </v-col>
            </v-row>
        </v-container>

        <!-- モーダル読み込み -->
        <SettingConfirmDialog
            ref='confirm'
        />
    </div>
</template>

<script>
    import SettingConfirmDialog from '@/components/common/SettingConfirmDialog'
    import { Const } from '@/assets/js/const'
    import { createNamespacedHelpers  } from 'vuex'

    const Con = new Const()
    const { mapGetters } = createNamespacedHelpers('setting')

    export default {
        name: 'Setting',
        components: {
            SettingConfirmDialog,
        },
        data: () => ({
            active: 'general',
            menus: Con.SETTING_SIDEBAR_MENU,
            isChange: true,
        }),
        created () {
            this.$eventHub.$on('confirmApplySetting', this.applySetting)
            this.$eventHub.$on('confirmCancelSetting', this.cancelSetting)
            this.changeActiveSidebar()
            this.setTheme(this, this.setting)
        },
        beforeRouteUpdate (to, from, next) {
            if (this.isChange) {
                // 変更なし
                next()
            } else {
                this.$refs.confirm.open(to.path, next)
            }
        },
        computed: {
        	...mapGetters([
        		'setting',
        	]),
        },
        methods: {
            toApp () {
                if (this.isChange) {
                    this.$router.push('/myapp')
                } else {
                    this.$refs.confirm.open('/myapp')
                }
            },
            updateIsChange (flg) {
                this.isChange = flg
            },
            applySetting (path, next) {
                this.isChange = true
                if (next) {
                    next()
                } else {
                    this.$router.push(path)
                }
            },
            cancelSetting () {
                this.changeActiveSidebar()
            },
            changeActiveSidebar () {
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

                case 'SettingKarma':
                    this.active = 'karma'
                    break

                case 'Other':
                    this.active = 'other'
                    break

                default:
                    break
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .sidebar_wrap::v-deep {
        position: relative;
    }
</style>
