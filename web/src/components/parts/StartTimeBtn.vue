<template>
    <div>
        <v-tooltip
            v-if="isSelected"
            top
            activator="#start_time_btn"
            z-index=99000
            open-delay=250
        >
            <span>{{ startTimeDate }}</span>
        </v-tooltip>
        <v-tooltip
            v-else
            top
            activator="#start_time_btn"
            z-index=99000
            open-delay=250
        >
            <span>開始時刻を設定</span>
        </v-tooltip>
        <v-menu
            offset-x
            min-width="400px"
            transition="scroll-y-transition"
            :close-on-content-click="false"
        >
            <template v-slot:activator="{ on, attrs }">
                <div id="start_time_btn">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    ><v-icon
                        :color="startTime.color"
                    >mdi-clock-start</v-icon>
                    </v-btn>
                </div>
            </template>
            <Datetime
                v-model="startTime.value"
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
            defaultStartTime: {
                type: String,
                required: false,
                default: ''
            }
        },
        data: () => ({
            startTime: {
                value: '',
                color: Con.NON_ACTIVE_COLOR
            },
        }),
        created () {
            if (this.defaultStartTime !== null) this.startTime.value = this.defaultStartTime
        },
        mounted: function () {},
        watch: {
            'startTime.value': function (val) {
                this.startTime.color = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
                this.$eventHub.$emit('create_task_info', 'start_time_str', val)
            }
        },
        computed: {
            start () {
                const start = moment()
                return start.format('YYYY-MM-DDTHH:mm:ss')
            },
            isSelected () {
                return this.startTime.value !== ''
            },
            startTimeDate () {
                return this.startTime.value
            },
        },
        methods: {},
    }
</script>
<style lang='scss'>
</style>
