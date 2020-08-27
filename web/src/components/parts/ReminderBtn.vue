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
                :color="reminderDateColor"
            >mdi-alarm</v-icon>
            </v-btn>
        </template>
        <Datetime
            v-model="reminderDate"
            :minute-interval="15"
            :min-date="start"
            inline
            no-keyboard
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
        data: () => ({
            reminderDate: '',
            reminderDateColor: Con.NON_ACTIVE_COLOR
        }),
        components: {
            Datetime,
        },
        computed: {
            start () {
                const start = moment().add(1, 'days').hour(8)
                return start.format('YYYY-MM-DDTHH:mm:ss')
            },
        },
        watch: {
            reminderDate: function (val) {
                if (val.length > 0) {
                    this.reminderDateColor = Con.ACTIVE_COLOR
                } else {
                    this.reminderDateColor = Con.NON_ACTIVE_COLOR
                }
            }
        },
    }
</script>
<style lang='scss'>
</style>
