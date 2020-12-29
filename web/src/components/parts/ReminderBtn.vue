<template>
    <div>
        <v-tooltip
            v-if="isSelected"
            top
            activator="#reminder_btn"
            z-index=99000
            open-delay=250
        >
            <span>{{ remindDate }}に通知</span>
        </v-tooltip>
        <v-tooltip
            v-else
            top
            activator="#reminder_btn"
            z-index=99000
            open-delay=250
        >
            <span>リマインダー</span>
        </v-tooltip>
        <v-menu
            offset-x
            min-width="400px"
            transition="scroll-y-transition"
        >
            <template v-slot:activator="{ on, attrs }">
                <div id="reminder_btn">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    ><v-icon
                        :color="remind.color"
                    >mdi-alarm</v-icon>
                    </v-btn>
                </div>
            </template>
            <Datetime
                v-model="remind.value"
                :minute-interval="15"
                :min-date="start"
                :max-date="end"
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
        name: 'ReminderBtn',
        components: {
            Datetime,
        },
        props: {
            defaultRemind: {
                type: String,
                required: false,
                default: () => ('')
            }
        },
        data: () => ({
            remind: {
                value: '',
                color: Con.NON_ACTIVE_COLOR
            },
            isSelected: false,
            endTime: '',
        }),
        created () {
            this.$eventHub.$off('setDeadline', this.setEndTime)
            this.$eventHub.$on('setDeadline', this.setEndTime)
        },
        mounted: function () {
            if (this.defaultRemind !== null) this.remind.value = this.defaultRemind
        },
        watch: {
            'remind.value': function (val) {
                if (val.length > 0) {
                    this.remind.color = Con.ACTIVE_COLOR
                    this.isSelected = true
                } else {
                    this.remind.color = Con.NON_ACTIVE_COLOR
                    this.isSelected = false
                }
                this.$eventHub.$emit('createTaskInfo', 'remind_str', val)
            }
        },
        computed: {
            start () {
                const start = moment()
                return start.format('YYYY-MM-DDTHH:mm:ss')
            },
            end () {
                return this.endTime
            },
            remindDate () {
                return this.remind.value
            }
        },
        methods: {
            setEndTime (endTime) {
                this.endTime = endTime
            }
        },
    }
</script>
<style lang='scss'>
</style>
