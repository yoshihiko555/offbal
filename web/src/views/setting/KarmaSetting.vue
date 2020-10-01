<template>
    <v-container>
        <!-- カルマの有効化 -->
        <v-row>
            <v-col cols='12'>
                <h4>カルマの有効化</h4>
                <p>カルマを使ってモチベーションを保ちましょう</p>

                <vs-switch v-model="cloneSetting.karma" />
            </v-col>
        </v-row>

        <!-- 一日のゴール -->
        <v-row>
            <v-col cols='12'>
                <h4>一日のゴール</h4>
                <p>毎日の小さなステップが、あなたを大きく成長させます</p>
                <span class="mr-3">１日のゴール:</span>
                <vs-input
                    v-model="cloneSetting.daily_task_number"
                    type='number'
                />
            </v-col>
        </v-row>

        <!-- 休日 -->
        <v-row>
            <v-col cols='12'>
                <h4>休日</h4>
                <p>リフレッシュも大切です</p>
                <vs-checkbox
                    v-for="day in week"
                    :key='day.id'
                    v-model="cloneSetting.holiday"
                    :val='day.id'
                >
                    <template #icon>
                        {{ day.week }}
                    </template>
                </vs-checkbox>
            </v-col>
        </v-row>

        <!-- バケーションモード -->
        <v-row>
            <v-col cols='12'>
                <h4>バケーションモード</h4>
                <p>バケーションモードがオンの間は、ゴールを達成していなくてもカルマに影響はありません</p>
                <vs-switch v-model="cloneSetting.vacation_mode" />
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
        name: 'KamraSetting',
        components: {
        },
        props: {
            setting: {
                type: Object,
                required: true,
            }
        },
        data: () => ({
            cloneSetting: {},
            disabled: true,
            option: false,
            week: [
                {
                    id: 1,
                    week: '日',
                },
                {
                    id: 2,
                    week: '月',
                },
                {
                    id: 3,
                    week: '火',
                },
                {
                    id: 4,
                    week: '水',
                },
                {
                    id: 5,
                    week: '木',
                },
                {
                    id: 6,
                    week: '金',
                },
                {
                    id: 7,
                    week: '土',
                },
            ]
        }),
        created () {
            this.cloneSetting = _.cloneDeep(this.setting)
        },
        watch: {
            cloneSetting: {
                handler (val) {
                    this.disabled = this.validate(val)
                    this.$emit('update-is-change', this.disabled)
                },
                deep: true,
            },
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
                    this.$vs.notification({
                        color: 'primary',
                        classNotification: 'category_sort',
                    	text: '設定を変更しました。'
                    })
                })
            },
            validate (val) {
                let res = true
                // １日のゴール数のバリデーション
                if (Number(val.daily_task_number) === 0 || Math.sign(val.daily_task_number) === -1) return res

                // 一つでも差分があればfalseを返却
                if (Number(val.daily_task_number) !== this.setting.daily_task_number ||
                    val.karma !== this.setting.karma ||
                    val.holiday.length !== this.setting.holiday.length ||
                    val.vacation_mode !== this.setting.vacation_mode) {
                        res = false
                    }
                return res
            }
        },
    }
</script>

<style lang="scss" scoped>
    .vs-input-parent{
        display: inline-block;
    }
    .vs-checkbox-content::v-deep {
        display: inline-block;
        color: #333;
        font-weight: bold;
        padding: 3px;
    }

    .vs-checkbox--checked {
        color: #fff;
    }
    .vs-switch {
        max-width: 60px;
    }
</style>
