<template>
    <v-menu
        min-width="400px"
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
            inline
            :minute-interval="15"
            :min-date="start"
        >
        </Datetime>
    </v-menu>
</template>
<script>
    import moment from 'moment'
    import Datetime from 'vue-ctk-date-time-picker'
    import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

    export default {
        name: 'ReminderBtn',
        data: () => ({
            reminderDate: '',
            reminderDateColor: 'grey lighten-1'
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
                    this.reminderDateColor = 'red accent-4'
                } else {
                    this.reminderDateColor = 'grey lighten-1'
                }
            }
        },
    }
</script>
<style lang='scss'>
</style>
