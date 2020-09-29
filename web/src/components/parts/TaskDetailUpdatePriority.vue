<template>
    <v-menu
        :close-on-content-click="false"
        offset-y
        bottom
        transition="scroll-y-transition"
        min-width="180px"
        v-model="priority_menu"
    >
        <template v-slot:activator="{ on, attrs }">
            <div id="priority_btn" class="mr-3">
                <v-btn
                    text
                    v-bind="attrs"
                    v-on="on"
                ><v-icon
                    :color="priority.color[cloneTask.priority]"
                >{{ priority.icon }}</v-icon>
                <span>優先度{{ cloneTask.priority }}</span>
                </v-btn>
            </div>
        </template>
        <v-card>
            <v-card-title>
                <h5>
                    優先度設定
                </h5>
            </v-card-title>
            <v-list
                dense
            >
                <v-list-item
                    v-for="(item, i) in priority_items"
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
</template>
<script>
    export default {
        name: 'TaskDetailUpdatePriority',
        props: {
            cloneTask: {
                type: Object,
                required: true,
            }
        },
        data: () => ({
            priority_menu: false,
            priority_items: [
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
                color: {
                    1: 'grey lighten-1',
                    2: 'red accent-1',
                    3: 'red accent-2',
                    4: 'red accent-3',
                    5: 'red accent-4',
                },
                icon: 'mdi-star',
            },
        }),
        created () {
            this.priority.value = this.cloneTask.priority
        },
        methods: {
            selectPriority (priority) {
                this.$eventHub.$emit('selectPriority', priority)
                this.priority.value = priority
                this.priority_menu = false
            },
        }
    }
</script>
