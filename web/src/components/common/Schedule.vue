<template>
    <v-container fluid>
        <v-row class="schedule_nav_wrap">
            <v-col cols='2' class="pa-0">
                <v-btn
                    icon
                    class="ma-2"
                    @click="$refs.calendar.prev()"
                >
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                    icon
                    class="ma-2"
                    @click="$refs.calendar.next()"
                >
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-col>
            <v-spacer/>
            <v-col cols='2'>
                    <vs-button @click="changeType('week')">週</vs-button>
                    <vs-button @click="changeType('month')">月</vs-button>
            </v-col>
        </v-row>
        <v-row class="schedule_calendar_wrap">
            <v-col cols='12' class="pa-0">
                <v-calendar
                    ref='calendar'
                    v-model="value"
                    :type='type'
                    :events='events'
                    :event-color="getEventColor"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'Schedule',
        components: {
        },
        data: () => ({
            type: 'month',
            value: '',
            events: [],
            // テスト用データ
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
        }),
        created () {
        	this.$axios({
        		url: '/api/task/get_schedule/',
        		method: 'GET',
        	})
        	.then(res => {
        		console.log('スケジュール情報', res)
        		this.setEvents(res.data.incomp_tasks)
        	})
        	.catch(e => {
        		console.log(e)
        	})
        },
    	computed: {
    	},
        methods: {
            move () {
                console.log(this.$refs.calendar)
                console.log(this.value)
                this.$refs.calendar.move(2)
            },
            changeType (type) {
                this.type = type
            },
            // テスト用データの生成
            getEvents ({ start, end }) {
                const events = []

                const min = new Date(`${start.date}T00:00:00`)
                const max = new Date(`${end.date}T23:59:59`)
                const days = (max.getTime() - min.getTime()) / 86400000
                const eventCount = this.rnd(days, days + 20)

                for (let i = 0; i < eventCount; i++) {
                    const allDay = this.rnd(0, 3) === 0
                    const firstTimestamp = this.rnd(min.getTime(), max.getTime())
                    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
                    const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
                    const second = new Date(first.getTime() + secondTimestamp)

                    events.push({
                        name: this.names[this.rnd(0, this.names.length - 1)],
                        start: first,
                        end: second,
                        color: this.colors[this.rnd(0, this.colors.length - 1)],
                        // timed: !allDay,
                        timed: false
                    })
                }

                this.events = events
            },
            getEventColor (event) {
                return event.color
            },
            rnd (a, b) {
                return Math.floor((b - a + 1) * Math.random()) + a
            },
            setEvents (tasks) {
            	const events = []

            	for (const task of tasks) {
                    const start = task.start_time.replace(/-/g, '/')
                    const startStamp = new Date(start)
                    const end = task.deadline.replace(/-/g, '/')
                    const endStamp = new Date(end)
                    events.push({
                        name: task.content,
                        start: startStamp,
                        end: endStamp,
                        color: task.target_category_color,
                        timed: false    // 時間表示切替のフラグ
                    })
            	}
            	this.events = events
            }
        },
    }
</script>

<style lang="scss" scoped>
    .container::v-deep {
        height: calc(100vh - 170px);

        .row {
            width: 100%;
            margin: auto;
        }
    }
    .schedule_nav_wrap::v-deep {
        align-items: center;
        background-color: #e2e2e2;
        .vs-button {
            display: inline-block;
        }
    }
    .schedule_calendar_wrap {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
</style>
