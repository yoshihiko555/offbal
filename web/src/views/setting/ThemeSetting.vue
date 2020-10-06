<template>
    <v-container>
        <v-row>
            <v-col cols='12'>
                <h3>テーマ</h3>
            </v-col>
            <v-col cols='4'>
                <vs-card @click='themeSelect("default")'>
                    <template #title>
                        <h3>Default</h3>
                    </template>
                    <template #img>
                        <img src="@/assets/img/family.jpg" alt="">
                    </template>
                    <template #text>
                        <p></p>
                    </template>
                    <template #interactions>
                        <vs-button
                            v-show='active === "default"'
                            icon
                            flat
                            active
                        ><i class='bx bx-check-circle'></i></vs-button>
                    </template>
                </vs-card>
            </v-col>
            <v-col cols='4'>
                <vs-card @click='themeSelect("dark")'>
                    <template #title>
                        <h3>Dark</h3>
                    </template>
                    <template #img>
                        <img src="@/assets/img/work.jpg" alt="">
                    </template>
                    <template #text>
                        <p></p>
                    </template>
                    <template #interactions>
                        <vs-button
                            v-show='active === "dark"'
                            icon
                            flat
                            active
                        ><i class='bx bx-check-circle'></i></vs-button>
                    </template>
                </vs-card>
            </v-col>
        </v-row>
        <v-divider/>
        <v-row>
            <v-col cols='12' class="text-right">
                <vs-button
                    :disabled='disabled'
                    class="d-inline-block"
                    @click="update"
                >保存</vs-button>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import _ from 'lodash'
    import { mapActions } from 'vuex'
    export default {
        name: 'ThemeSetting',
        components: {
        },
        props: {
            setting: {
                type: Object,
                requied: true,
            }
        },
        data: () => ({
            cloneSetting: {},
            disabled: true,
            active: '',
        }),
        created () {
            this.cloneSetting = _.cloneDeep(this.setting)
            this.active = this.cloneSetting.theme
        },
        watch: {
            'cloneSetting.theme': function (val) {
                this.disabled = (val === this.setting.theme)
                this.$emit('update-is-change', this.disabled)
            }
        },
        methods: {
            ...mapActions('setting', [
                'updateSettingAction',
            ]),
            update () {
                this.updateSettingAction(this.cloneSetting)
                .then(res => {
                    this.disabled = true
                    this.$emit('update-is-change', this.disabled)
                    this.setTheme(this, this.cloneSetting)
                    this.$vs.notification({
                        color: 'primary',
                        classNotification: 'category_sort',
                    	text: '設定を変更しました。'
                    })
                })
            },
            themeSelect (theme) {
                this.active = theme
                this.cloneSetting.theme = theme
            },
        },
    }
</script>

<style lang="scss" scoped>
    .vs-card-content::v-deep{
        .vs-card__interactions {
            left: initial;
            right: 0px;
        }
    }
</style>
