<template>
    <div>
        <v-container>
            <h3>一般</h3>
            <!-- 言語 -->
            <v-row>
                <v-col cols='3'>
                    <p>言語</p>
                </v-col>
                <v-col cols='9'>
                    <vs-select v-model="cloneSetting.language">
                        <vs-option
                            v-for="option in languageOptions"
                            :key='option.label'
                            :label='option.label'
                            :value='option.value'
                        >
                            {{ option.label}}
                        </vs-option>
                    </vs-select>
                </v-col>
            </v-row>

            <!-- スタートページ -->
            <v-row>
                <v-col cols='3'>
                    <p>スタートページ</p>
                </v-col>
                <v-col cols='9'>
                    <vs-select v-model="cloneSetting.start_page">
                        <vs-option
                            v-for="option in startPageOptions"
                            :key='option.label'
                            :label='option.label'
                            :value='option.value'
                        >
                            {{ option.label}}
                        </vs-option>
                    </vs-select>
                </v-col>
            </v-row>

            <v-divider/>

            <h4>日付と時刻</h4>
            <!-- タイムゾーン -->
            <v-row>
                <v-col cols='3'>
                    <p>タイムゾーン</p>
                </v-col>
                <v-col cols='9'>
                    <vs-select v-model="cloneSetting.time_zone" class="select_timezone">
                        <vs-option
                            v-for="option in timezoneOptions"
                            :key='option.label'
                            :label='option.label'
                            :value='option.value'
                        >
                            {{ option.label}}
                        </vs-option>
                    </vs-select>
                </v-col>
            </v-row>

            <!-- 時刻の書式 -->
            <v-row>
                <v-col cols='3'>
                    <p>時刻の書式</p>
                </v-col>
                <v-col cols='9'>
                    <vs-radio
                        v-for="option in timeFormatOptions"
                        :key="option.label"
                        v-model="cloneSetting.time_format"
                        :val='option.value'
                    >
                        {{ option.label}}
                    </vs-radio>
                </v-col>
            </v-row>

            <!-- 週の始まり -->
            <v-row>
                <v-col cols='3'>
                    <p>週の始まり</p>
                </v-col>
                <v-col cols='9'>
                    <vs-select v-model="cloneSetting.weekly_beginning">
                        <vs-option
                            v-for="option in weekOptions"
                            :key='option.label'
                            :label='option.label'
                            :value='option.value'
                        >
                            {{ option.label}}
                        </vs-option>
                    </vs-select>
                </v-col>
            </v-row>
            <!-- 来週 -->
            <v-row>
                <v-col cols='3'>
                    <p>来週</p>
                </v-col>
                <v-col cols='9'>
                    <vs-select v-model="cloneSetting.next_week_interpretation">
                        <vs-option
                            v-for="option in weekOptions"
                            :key='option.label'
                            :label='option.label'
                            :value='option.value'
                        >
                            {{ option.label}}
                        </vs-option>
                    </vs-select>
                </v-col>
            </v-row>
            <!-- 週末 -->
            <v-row>
                <v-col cols='3'>
                    <p>週末</p>
                </v-col>
                <v-col cols='9'>
                    <vs-select v-model="cloneSetting.weekend_interpretation">
                        <vs-option
                            v-for="option in weekOptions"
                            :key='option.label'
                            :label='option.label'
                            :value='option.value'
                        >
                            {{ option.label}}
                        </vs-option>
                    </vs-select>
                </v-col>
            </v-row>

            <v-divider/>

            <h4>メール</h4>
            <!-- 今日の結果 -->
            <v-row>
                <v-col cols='3'>
                    <p>今日の結果</p>
                </v-col>
                <v-col cols='9'>
                    <vs-switch v-model="cloneSetting.mail_today_result" />
                </v-col>
            </v-row>
            <!-- お知らせ -->
            <v-row>
                <v-col cols='3'>
                    <p>お知らせ</p>
                </v-col>
                <v-col cols='9'>
                    <vs-switch v-model="cloneSetting.mail_news" />
                </v-col>
            </v-row>
            <!-- ヒントとコツ -->
            <v-row>
                <v-col cols='3'>
                    <p>ヒントとコツ</p>
                </v-col>
                <v-col cols='9'>
                    <vs-switch v-model="cloneSetting.mail_hint" />
                </v-col>
            </v-row>

            <v-divider/>
            <v-row>
                <v-col cols='12' class="text-right">
                    <vs-button
                        :disabled='disabled'
                        class="d-inline-block"
                        @click='update'
                    >
                        保存
                    </vs-button>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { mapGetters, mapActions } from 'vuex'
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'GeneralSetting',
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
            languageOptions: Con.LANGUAGE_OPTIONS,
            startPageOptions: Con.START_PAGE_OPTIONS,
            timezoneOptions: Con.TIMEZONE_OPTIONS,
            timeFormatOptions: Con.TIME_FORMAT_OPTIONS,
            weekOptions: Con.WEEK_OPTIONS,
        }),
        created () {
            this.cloneSetting = _.cloneDeep(this.setting)
            this.addStartPageOptions()
        },
        watch: {
            cloneSetting: {
                handler (val) {
                    this.disabled = _.isEqual(val, this.setting)
                    this.$emit('update-is-change', this.disabled)
                },
                deep: true,
            }
        },
        computed: {
        	...mapGetters([
        		'categorys',
        	]),
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
            addStartPageOptions () {
            	const options = []
            	for (const category of this.categorys) {
            		options.push({
            			label: category.name.toUpperCase(),
            			value: category.name
            		})
            	}
            	this.startPageOptions = this.startPageOptions.concat(options)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .vs-radio-content {
        justify-content: start;
    }
    .select_timezone {
        max-width: 300px;
    }
    .vs-switch {
        max-width: 60px;
    }
</style>