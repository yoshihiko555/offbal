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
                :color="selectedPriorityIconColor"
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
        props: {
        },
        data: () => ({
            items: [
                {
                    text: '優先度5',
                    icon: 'mdi-star-box',
                    color: 'red accent-4',
                },
                {
                    text: '優先度4',
                    icon: 'mdi-star-box',
                    color: 'red accent-3',
                },
                {
                    text: '優先度3',
                    icon: 'mdi-star-box',
                    color: 'red accent-2',
                },
                {
                    text: '優先度2',
                    icon: 'mdi-star-box',
                    color: 'red accent-1',
                },
                {
                    text: '優先度1',
                    icon: 'mdi-star-box',
                    color: 'grey lighten-1',
                },
            ],
            selectedPriority: '',
            selectedPriorityIconColor: Con.NON_ACTIVE_COLOR
        }),
        created () {
        },
        mounted: function () {
        },
        methods: {
            selectPriority (item) {
                this.selectedPriority = item.text
                this.selectedPriorityIconColor = item.color
                console.log(item)
            }
        }
    }
</script>
<style lang='scss'>

</style>
