<template>
    <v-list>
        <v-tooltip
            top
            activator="#start_time_btn"
            z-index=99000
        >
            <span>タスク開始時刻を変更する</span>
        </v-tooltip>
        <v-tooltip
            top
            activator="#deadline_btn"
            z-index=99000
        >
            <span>期限を変更する</span>
        </v-tooltip>
        <v-tooltip
            top
            activator="#remind_btn"
            z-index=99000
        >
            <span>リマインダーを変更する</span>
        </v-tooltip>
        <v-list-item>
            <v-list-item-icon id="start_time_btn" class="mr-5">
                <v-menu
                    offset-x
                    min-width="400px"
                    transition="scroll-y-transition"
                    :close-on-content-click="false"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-clock-start</v-icon>
                        </v-btn>
                    </template>
                    <Datetime
                        v-model="cloneTask.start_time"
                        :minute-interval="30"
                        :min-date="start"
                        inline
                        no-keyboard
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </v-menu>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>{{ cloneTask.start_time }} に開始</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
            <v-list-item-icon id="deadline_btn" class="mr-5">
                <v-menu
                    offset-x
                    min-width="400px"
                    transition="scroll-y-transition"
                    :close-on-content-click="false"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-calendar-clock</v-icon>
                        </v-btn>
                    </template>
                    <Datetime
                        v-model="cloneTask.deadline"
                        :minute-interval="30"
                        :min-date="StartTime"
                        inline
                        no-keyboard
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </v-menu>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title v-if="cloneTask.deadline !== ''">{{ cloneTask.deadline }} まで</v-list-item-title>
                <v-list-item-subtitle v-else>期限を設定する</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
            <v-list-item-icon id="remind_btn" class="mr-5">
                <v-menu
                    offset-x
                    min-width="400px"
                    transition="scroll-y-transition"
                    :close-on-content-click="false"
                >
                    <template activator="#ttt" v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-alarm</v-icon>
                        </v-btn>
                    </template>
                    <Datetime
                        v-model="cloneTask.remind"
                        :minute-interval="30"
                        :min-date="StartTime"
                        :max-date="end"
                        inline
                        no-keyboard
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </v-menu>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title v-if="cloneTask.remind !== ''">{{ cloneTask.remind }} に通知</v-list-item-title>
                <v-list-item-subtitle v-else>リマインダーを設定する</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
            <v-list-item-content>
                <v-text-field
                    v-model="cloneTask.comment"
                    placeholder="コメントを追加"
                ></v-text-field>
            </v-list-item-content>
        </v-list-item>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-card-subtitle>{{ cloneTask.created_at }}に作成</v-card-subtitle>
            <v-spacer></v-spacer>
            <v-btn
                icon
                @click="showTaskDeleteConfirm"
            >
                <i class='bx bxs-trash task_delete_btn' style='color:#e60b0b'></i>
            </v-btn>
        </v-card-actions>
    </v-list>
</template>
<script>
    import moment from 'moment'
    import Datetime from 'vue-ctk-date-time-picker'

    export default {
        name: 'TaskDetailUpdateDate',
        components: {
            Datetime,
        },
        props: {
            cloneTask: {
                type: Object,
                required: true,
            }
        },
        date: () => ({
        }),
        created () {
        },
        watch: {
        },
        computed: {
            start () {
                const start = moment()
                return start.format('YYYY-MM-DDTHH:mm:ss')
            },
            StartTime () {
                if (this.cloneTask.start_time !== '') return this.cloneTask.start_time
                return this.start()
            },
            end () {
                if (this.cloneTask.deadline !== '') return this.cloneTask.deadline
                return ''
            }
        },
        methods: {
            showTaskDeleteConfirm () {
                this.$eventHub.$emit('showTaskDeleteConfirm')
            }
        }
    }
</script>
<style lang="scss" scoped>
    .task_delete_btn {
        font-size: 25px;
    }
</style>
