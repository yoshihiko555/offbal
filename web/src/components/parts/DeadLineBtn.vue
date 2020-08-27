<template>
    <v-menu
        bottom
        offset-y
        min-width="400px"
        transition="scroll-y-transition"
        :close-on-content-click="false"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            ><v-icon
                :color='deadLineDateColor'
            >mdi-calendar-clock</v-icon>
            </v-btn>
        </template>
        <Datetime
            v-model="deadLineDate"
            :minute-interval="30"
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
        name: 'DeadLineBtn',
        data: () => ({
            deadLineDate: '',
            deadLineDateColor: Con.NON_ACTIVE_COLOR
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
            deadLineDate: function (val) {
                if (val.length > 0) {
                    this.deadLineDateColor = Con.ACTIVE_COLOR
                } else {
                    this.deadLineDateColor = Con.NON_ACTIVE_COLOR
                }
            }
        },
    }
</script>
<style lang='scss'>
</style>
