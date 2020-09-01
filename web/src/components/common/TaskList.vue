<template>
    <div>
        <div v-for="task in detailProject.tasks" :key="task.id">
            <p>{{ task.name }}</p>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'TaskList',
        components: {
        },
        data: () => ({
        }),
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