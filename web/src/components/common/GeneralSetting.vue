<template>
    <div>
        <v-container>
            <h4>一般</h4>
            <!-- 言語 -->
            <v-row>
                <v-col cols='3'>
                    <p>言語</p>
                </v-col>
                <v-col cols='9'>
                    <vs-select v-model="language">
                        <vs-option label='日本語' value='japanese'>
                            日本語
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
                    <vs-select v-model="startPage">
                        <vs-option label='今日' value='0'>
                            今日
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
                    <vs-select v-model="timezone">
                        <vs-option label='日本' value='0'>
                            日本
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
                    <vs-radio v-model="timeFormat" val='0'>13:00</vs-radio>
                    <vs-radio v-model="timeFormat" val='1'>1:00pm</vs-radio>
                </v-col>
            </v-row>

            <!-- 週の始まり -->
            <v-row>
                <v-col cols='3'>
                    <p>週の始まり</p>
                </v-col>
                <v-col cols='9'>
                    <vs-select v-model="weeklyBeginning">
                        <vs-option label='月曜' value='0'>
                            月曜
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
                    <vs-select v-model="nextWeekInterpretation">
                        <vs-option label='月曜' value='0'>
                            月曜
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
                    <vs-select v-model="weekendInterpretation">
                        <vs-option label='土曜' value='0'>
                            土曜
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
                    <vs-switch v-model="todayResult" />
                </v-col>
            </v-row>
            <!-- お知らせ -->
            <v-row>
                <v-col cols='3'>
                    <p>お知らせ</p>
                </v-col>
                <v-col cols='9'>
                    <vs-switch v-model="news" />
                </v-col>
            </v-row>
            <!-- ヒントとコツ -->
            <v-row>
                <v-col cols='3'>
                    <p>ヒントとコツ</p>
                </v-col>
                <v-col cols='9'>
                    <vs-switch v-model="hint" />
                </v-col>
            </v-row>

            <v-divider/>
            <v-row>
                <v-col cols='12'>
                    <vs-button>保存</vs-button>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'GeneralSetting',
        components: {
        },
        data: () => ({
            language: 'japanese',
            startPage: '0',
            timezone: '0',
            timeFormat: '0',
            weeklyBeginning: '0',
            nextWeekInterpretation: '0',
            weekendInterpretation: '0',
            todayResult: false,
            news: false,
            hint: false,
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
    .vs-radio-content {
        justify-content: start;
    }
</style>
