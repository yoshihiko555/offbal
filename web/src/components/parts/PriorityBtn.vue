<template>
    <v-menu
        bottom
        offset-y
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            ><v-icon
                :color="selectPriorityIconColor"
            >mdi-star-box</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="selectPriorityIcon(item)"
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
            selectPriorityIconColor: 'grey lighten-1'
        }),
        created () {
        },
        mounted: function () {
        },
        methods: {
            selectPriorityIcon (item) {
                this.selectPriorityIconColor = item.color
            }
        }
    }
</script>
<style lang='scss'>

</style>
