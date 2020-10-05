<!-- その他設定画面 -->
<template>
    <div>
        <v-container>
            <h3>その他設定</h3>

            <v-row>
                <v-col cols='3'>
                    <p>カテゴリー</p>
                </v-col>
                <v-col cols='9'>
                    <vs-button @click="changeCategory">カテゴリーを入れ替える</vs-button>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols='3'>
                    <p>ラベル</p>
                </v-col>
                <v-col cols='9'>
                    <vs-button @click="changeLabel">ラベル編集</vs-button>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols='3'>
                    <p>フィルターの複数選択の可否</p>
                </v-col>
                <v-col cols='9'>
                    <vs-switch v-model="cloneSetting.is_multiple_filter" @change="update"/>
                </v-col>
            </v-row>
        </v-container>
        <!-- モーダル読み込み -->
        <ChangeCategoryDialog
            ref='category'
        />
    </div>
</template>

<script>
    import ChangeCategoryDialog from '@/components/common/ChangeCategoryDialog'
    import _ from 'lodash'
    import { mapActions } from 'vuex'

    export default {
        name: 'OtherSetting',
        components: {
            ChangeCategoryDialog,
        },
        props: {
            setting: {
                type: Object,
                required: true,
            }
        },
        data: () => ({
            cloneSetting: {},
        }),
        created () {
            this.cloneSetting = _.cloneDeep(this.setting)
        },
        watch: {
        },
        methods: {
            ...mapActions('setting', [
                'updateSettingAction',
            ]),
            changeCategory () {
                this.$refs.category.open()
            },
            changeLabel () {
                console.log('ラベル編集')
            },
            update: _.debounce(function () {
                this.updateSettingAction(this.cloneSetting)
                .then(res => {
                    this.$vs.notification({
                        color: 'primary',
                        classNotification: 'category_sort',
                    	text: '設定を変更しました。'
                    })
                })
            }, 1000)
        },
    }
</script>

<style lang="scss" scoped>
    .vs-switch {
        max-width: 60px;
    }
</style>
