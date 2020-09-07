<template>
    <v-list>
        <v-list-item
            v-for="task in tasks"
            :key="task.id"
        >
            <v-list-item-action
                class="mr-3 ml-1"
            >
                <vs-checkbox
                    color="primary"
                ></vs-checkbox>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title
                    v-text="task.content"
                ></v-list-item-title>
            </v-list-item-content>
            <TaskMenuBtn
                :task=task
            />
        </v-list-item>
    </v-list>
</template>

<script>
    import { mapGetters } from 'vuex'
    import TaskMenuBtn from '@/components/parts/TaskMenuBtn'

    export default {
        name: 'TaskList',
        components: {
            TaskMenuBtn
        },
        props: {
            tasks: {
                type: Array,
                required: true,
            },
        },
        data: () => ({
        }),
        mounted: function () {
        },
    	computed: {
    		...mapGetters([
                'detailProject',
    		])
    	},
        methods: {
        },
    }
</script>

<style lang="scss" scoped>
</style>
