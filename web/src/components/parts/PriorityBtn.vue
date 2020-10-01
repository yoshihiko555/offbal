<template>
    <div>
        <v-tooltip
            v-if="isSelected"
            top
            activator="#priority_btn"
            z-index=99000
            open-delay=250
        >
            <span>{{ priorityValue }}</span>
        </v-tooltip>
        <v-tooltip
            v-else
            top
            activator="#priority_btn"
            z-index=99000
            open-delay=250
        >
            <span>優先度を設定</span>
        </v-tooltip>
        <v-menu
            :close-on-content-click="false"
            offset-x
            transition="scroll-y-transition"
            min-width="180px"
            v-model="menu"
        >
            <template v-slot:activator="{ on, attrs }">
                <div id="priority_btn">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    ><v-icon
                        :color="priority.color"
                    >{{ priority.icon }}</v-icon>
                    </v-btn>
                </div>
            </template>
            <v-card>
                <v-subheader class="description">優先度を設定</v-subheader>
                <!-- <v-card-title>
                    <h5>
                        優先度設定
                    </h5>
                </v-card-title> -->
                <v-list
                    dense
                >
                    <v-list-item
                        v-for="(item, i) in items"
                        :key="i"
                        @click="selectPriority(item.value)"
                    >
                        <v-icon
                            class="mr-1 ml-2"
                            :color="item.color"
                        >{{ item.icon }}</v-icon>
                        <v-list-item-title
                            class="ml-5"
                        >
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </div>
</template>
<script>
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'PriorityBtn',
        components: {},
        props: {
            defaultPriority: {
                type: String,
                required: false,
                default: () => ('1')
            }
        },
        data: () => ({
            items: [
                {
                    text: '優先度5',
                    icon: 'mdi-star',
                    color: 'red accent-4',
                    value: '5',
                },
                {
                    text: '優先度4',
                    icon: 'mdi-star',
                    color: 'red accent-3',
                    value: '4',
                },
                {
                    text: '優先度3',
                    icon: 'mdi-star',
                    color: 'red accent-2',
                    value: '3',
                },
                {
                    text: '優先度2',
                    icon: 'mdi-star',
                    color: 'red accent-1',
                    value: '2',
                },
                {
                    text: '優先度1',
                    icon: 'mdi-star-outline',
                    color: 'grey lighten-1',
                    value: '1',
                },
            ],
            priority: {
                value: '1',
                color: Con.NON_ACTIVE_COLOR,
                icon: 'mdi-star-outline',
                text: '優先度1'
            },
            isSelected: false,
            menu: false
        }),
        created () {
            this.priority.value = this.defaultPriority
        },
        mounted: function () {},
        watch: {
            'priority.value': function (val) {
                const item = this.items.filter(item => item.value === val)[0]
                this.priority.color = item.color
                this.priority.icon = item.icon
                this.priority.text = item.text
                this.isSelected = true
            }
        },
        computed: {
            priorityValue () {
                return this.priority.text
            }
        },
        methods: {
            selectPriority (value) {
                this.priority.value = value
                this.$eventHub.$emit('create_task_info', 'priority', value)
                this.isSelected = true
                this.menu = false
            }
        }
    }
</script>
<style lang='scss' scoped>
    .v-card__title {
        height: 50px;
    }
    .description {
        position: relative;
        top: 10px;
    }
</style>
