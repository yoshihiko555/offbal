<template>
    <v-menu
        bottom
        offset-y
        min-width="400px"
        transition="scroll-y-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            ><v-icon
                :color="remind.color"
            >mdi-alarm</v-icon>
            </v-btn>
        </template>
        <Datetime
            v-model="remind.value"
            :minute-interval="15"
            :min-date="start"
            inline
            no-keyboard
            format="YYYY-MM-DD HH:mm:ss"
        />
    </v-menu>
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
        props: {},
        data: () => ({
            remind: {
                value: '',
                color: Con.NON_ACTIVE_COLOR
            }
        }),
        created () {},
        mounted: function () {},
        watch: {
            'remind.value': function (val) {
                this.remind.color = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
                this.$eventHub.$emit('create_task_info', 'remind_str', val)
            }
        },
        computed: {
            start () {
                const start = moment()
                return start.format('YYYY-MM-DDTHH:mm:ss')
            },
        },
        methods: {},
    }
</script>
<style lang='scss'>
</style>
