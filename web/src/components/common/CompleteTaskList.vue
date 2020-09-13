<template>
    <div v-if="complete_tasks.length === 0">
    </div>
    <div v-else>
        <v-list>
            <v-list-group>
                <template #activator>
                    <v-list-item-title>
                        完了タスク
                    </v-list-item-title>
                </template>
                <v-list-item
                    v-for="(task, i) in complete_tasks"
                    :key="i"
                >
                    <v-list-item-title>
                        {{ task.content }}
                    </v-list-item-title>
                </v-list-item>
            </v-list-group>
        </v-list>
    </div>
</template>
<script>
    export default {
        name: 'CompleteTaskList',
        components: {},
        props: [
            'complete_tasks'
        ],
        data: () => ({
        }),
        methods: {},
    }
</script>
<style lang="scss" scoped>
</style>
