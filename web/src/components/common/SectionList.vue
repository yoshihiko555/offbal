<template>
    <div>
        <div v-for="section in detailProject.sections" :key="section.id">
            <div class="section_header_wrap d-flex align-center">
                <p class="ma-0">{{ section.name }}</p>
                <SectionMenuBtn
                    :section='section'
                />
            </div>
            <div v-for="task in section.tasks" :key="task.id">
                {{ task.name }}
            </div>
        </div>
    </div>
</template>

<script>
    import SectionMenuBtn from '@/components/parts/SectionMenuBtn'
    import { mapGetters } from 'vuex'

    export default {
        name: 'SectionList',
        components: {
            SectionMenuBtn,
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