<template>
    <v-menu
        bottom
        offset-y
        min-width="250px"
        max-height="400px"
        transition="scroll-y-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon
                    :color="project.color"
                >mdi-inbox</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item-group>
                <div
                    v-for="(project, i) in projects"
                    :key="i"
                >
                    <v-list-item
                        class="project_name"
                        @click="selectProject(project)"
                    >
                        <v-icon
                            class="pl-1 mr-2"
                            :color="project.color"
                        >mdi-circle-medium</v-icon>
                        {{ project.name }}
                    </v-list-item>
                    <v-list-item
                        class="pl-8"
                        v-for="(section, i) in project.section"
                        :key="i"
                        @click="selectSection(section)"
                    >
                        <v-icon
                            class="mr-2"
                            color="grey lighten-1"
                        >mdi-menu-down</v-icon>
                        {{ section.name }}
                    </v-list-item>
                </div>
            </v-list-item-group>
        </v-list>
    </v-menu>
</template>
<script>
    import { Const } from '@/assets/js/const'
    import { mapGetters } from 'vuex'
    const Con = new Const()

    export default {
        name: 'ProjectBtn',
        components: {},
        props: {},
        data: () => ({
            project: {
                name: '',
                color: Con.NON_ACTIVE_COLOR,
                section: ''
            }
        }),
        created () {},
        mounted: function () {},
        watch: {
            'project.name': function (val) {
                this.project.color = (val.length > 0) ? Con.ACTIVE_COLOR : Con.NON_ACTIVE_COLOR
            }
        },
        computed: {
            ...mapGetters([
                'projects',
            ])
        },
        methods: {
            selectProject (value) {
                const { name } = value
                this.project.name = value.name
                this.$eventHub.$emit('create_task_info', 'project_name', name)
            },
            selectSection (value) {
                const { name, section } = value
                this.project.name = name
                this.project.section = section
                this.$eventHub.$emit('create_task_info', 'project_name', name)
                this.$eventHub.$emit('create_task_info', 'section_name', section)
            }
        },
    }
</script>
<style lang='scss'>
    .project_name {
        padding-top: 15px;
        height: 48px;
    }
</style>
