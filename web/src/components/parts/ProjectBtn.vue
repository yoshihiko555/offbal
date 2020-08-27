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
                    :color="selectedProjectColor"
                >mdi-inbox</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item-group>
                <div
                    v-for="(project, i) in projectList"
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
    const Con = new Const()

    export default {
        name: 'ProjectBtn',
        props: {

        },
        data: () => ({
            projectList: [
                {
                    name: 'インボックス',
                    color: 'red accent-3',
                    section: [
                        {
                            name: 'study',
                            project: 'インボックス'
                        },
                        {
                            name: 'hoby',
                            project: 'インボックス'
                        },
                        {
                            name: 'friend',
                            project: 'インボックス'
                        },
                        {
                            name: 'family',
                            project: 'インボックス'
                        },
                        {
                            name: 'helth',
                            project: 'インボックス'
                        },
                    ]
                },
                {
                    name: 'bandue',
                    color: 'green accent-3',
                    section: [
                    ]
                },
                {
                    name: 'coopy',
                    color: 'grey lighten-1',
                    section: [
                        {
                            name: 'design',
                            project: 'coopy'
                        }
                    ]
                },
                {
                    name: 'offbal',
                    color: 'yellow accent-3',
                    section: [
                        {
                            name: 'design',
                            project: 'offbal'
                        },
                        {
                            name: 'coding',
                            project: 'offbal'
                        },
                        {
                            name: 'deploy',
                            project: 'offbal'
                        }
                    ]
                }
            ],
            selectedProject: '',
            selectedProjectColor: Con.NON_ACTIVE_COLOR
        }),
        created () {
        },
        mounted: function () {
        },
        methods: {
            selectProject (value) {
                this.selectedProject = value.name
                console.log(this.selectedProject)
            },
            selectSection (value) {
                this.selectedProject = value.project + '/' + value.name
                console.log(this.selectedProject)
            }
        },
        watch: {
            selectedProject: function (val) {
                if (val.length > 0) {
                    this.selectedProjectColor = Con.ACTIVE_COLOR
                } else {
                    this.selectedProjectColor = Con.NON_ACTIVE_COLOR
                }
            }
        }
    }
</script>
<style lang='scss'>
    .project_name {
        padding-top: 15px;
        height: 48px;
    }
</style>
