<template>
    <div>
        <v-tooltip
            v-if="isSelected"
            top
            activator="#deadline_btn"
            z-index=99000
            open-delay=250
        >
            <span>{{ deadlineDate }}まで</span>
        </v-tooltip>
        <v-tooltip
            v-else
            top
            activator="#deadline_btn"
            z-index=99000
            open-delay=250
        >
            <span>期限を設定</span>
        </v-tooltip>
        <v-menu
            offset-x
            min-width="400px"
            transition="scroll-y-transition"
            :close-on-content-click="false"
        >
            <template v-slot:activator="{ on, attrs }">
                <div id="deadline_btn">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    ><v-icon
                        :color="deadline.color"
                    >mdi-calendar-clock</v-icon>
                    </v-btn>
                </div>
            </template>
            <Datetime
                v-model="deadline.value"
                :minute-interval="30"
                :min-date="start"
                inline
                no-keyboard
                format="YYYY-MM-DD HH:mm:ss"
            />
        </v-menu>
    </div>
</template>
<script>
    import { Const } from '@/assets/js/const'
    import moment from 'moment'
    import Datetime from 'vue-ctk-date-time-picker'
    import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

    const Con = new Const()

    export default {
        name: 'DeadLineBtn',
        components: {
            Datetime,
        },
        props: {
            defaultDeadline: {
                type: String,
                required: false,
                default: ''
            }
        },
        data: () => ({
            deadline: {
                value: '',
                color: Con.NON_ACTIVE_COLOR
            },
            startTime: '',
        }),
        created () {
            this.$eventHub.$on('set_start_time', this.setStartTime)
            if (this.defaultDeadline !== null) this.deadline.value = this.defaultDeadline
        },
        mounted: function () {},
        watch: {
            'deadline.value': function (val) {
                this.deadline.color = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
                this.$eventHub.$emit('create_task_info', 'deadline_str', val)
                this.$eventHub.$emit('set_deadline', val)
            }
        },
        computed: {
            start () {
                if (this.startTime !== '') return this.startTime
                const start = moment()
                return start.format('YYYY-MM-DDTHH:mm:ss')
            },
            isSelected () {
                return this.deadline.value !== ''
            },
            deadlineDate () {
                return this.deadline.value
            },
        },
        methods: {
            setStartTime (startTime) {
                this.startTime = startTime
            }
        },
    }
</script>
<style lang='scss'>
</style>
