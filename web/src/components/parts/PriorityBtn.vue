<template>
    <v-menu
        bottom
        offset-y
        transition="scroll-y-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            ><v-icon
                :color="priority.color"
            >mdi-star-box</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="selectPriority(item)"
            >
                <v-icon
                    class="mr-1"
                    :color="item.color"
                >{{ item.icon }}</v-icon>
                <v-list-item-title
                    class="mr-2"
                >
                    {{ item.text }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
<script>
    import { Const } from '@/assets/js/const'
    const Con = new Const()

    export default {
        name: 'PriorityBtn',
        components: {},
        props: {},
        data: () => ({
            items: [
                {
                    text: '優先度5',
                    icon: 'mdi-star-box',
                    color: 'red accent-4',
                    value: '5',
                },
                {
                    text: '優先度4',
                    icon: 'mdi-star-box',
                    color: 'red accent-3',
                    value: '4',
                },
                {
                    text: '優先度3',
                    icon: 'mdi-star-box',
                    color: 'red accent-2',
                    value: '3',
                },
                {
                    text: '優先度2',
                    icon: 'mdi-star-box',
                    color: 'red accent-1',
                    value: '2',
                },
                {
                    text: '優先度1',
                    icon: 'mdi-star-box',
                    color: 'grey lighten-1',
                    value: '1',
                },
            ],
            priority: {
                value: '',
                color: Con.NON_ACTIVE_COLOR
            },
        }),
        created () {},
        mounted: function () {},
        watch: {},
        computed: {},
        methods: {
            selectPriority (priority) {
                const { value, color } = priority
                this.priority = {
                    value: value,
                    color: color
                }
                this.$eventHub.$emit('create_task_info', 'priority', value)
            }
        }
    }
</script>
<style lang='scss'>

</style>
