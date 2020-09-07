<template>
    <v-menu
        :close-on-content-click="false"
        bottom
        offset-x
        min-width="200px"
        max-height="380px"
        transition="scroll-y-transition"
        v-model="menu"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon
                    :color="projectBtnColor"
                >mdi-inbox</v-icon>
            </v-btn>
        </template>
        <v-list
            dense
        >
            <vs-input
                class="px-3 mt-3"
                size="small"
                placeholder="プロジェクト名を検索"
                v-model="filterValue"
            ></vs-input>
            <v-list-item-group>
                <!-- フィルター絞る前 -->
                <div v-if="filterValue.length === 0">
                    <div
                        v-for="(project, i) in projects"
                        :key="i"
                    >
                        <v-list-item
                            class="project_name"
                            @click="selectProject(project)"
                        >
                            <v-icon
                                class="mr-2"
                                :color="project.color"
                            >mdi-circle-medium</v-icon>
                            {{ project.name }}
                        </v-list-item>
                        <v-list-item
                            class="pl-8"
                            v-for="(section, i) in project.sections"
                            :key="i"
                            @click="selectProject(section)"
                        >
                            <v-icon
                                class="mr-2"
                                color="grey lighten-1"
                            >mdi-menu-down</v-icon>
                            {{ section.name }}
                        </v-list-item>
                    </div>
                </div>
                <!-- フィルター絞る前ここまで -->
                <!-- フィルター絞る -->
                <div v-else>
                    <div
                        v-for="(item, i) in filteredItems"
                        :key="i"
                    >
                        <v-list-item
                            v-if="item.isProject"
                            class="project_name"
                            @click="selectProject(item)"
                        >
                            <v-icon
                                class="mr-2"
                                :color="item.color"
                            >mdi-circle-medium</v-icon>
                            {{ item.name }}
                        </v-list-item>
                        <v-list-item
                            v-else
                            class="project_name"
                            @click="selectProject(item)"
                        >
                            <v-icon
                                class="mr-3"
                                color="grey lighten-1"
                            >mdi-menu-down</v-icon>
                            {{ item.name }}
                        </v-list-item>
                    </div>
                </div>
                <!-- フィルター絞るここまで -->
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
            projectBtnColor: Con.NON_ACTIVE_COLOR,
            filterValue: '',
            filteredItems: [],
            menu: false
        }),
        created () {},
        mounted: function () {},
        watch: {
            filterValue: function (val) {
                this.filteredItems = []
                if (val.length > 0) {
                    const projectList = this.projects
                    for (const [k, project] of Object.entries(projectList)) {
                        if (this.filterProjectSectionName(project)) {
                            this.filteredItems.push(project)
                        }
                        for (const [j, section] of Object.entries(project.sections)) {
                            if (this.filterProjectSectionName(section)) {
                                this.filteredItems.push(section)
                            }
                        }
                    }
                }
            }
        },
        computed: {
            ...mapGetters([
                'projects',
            ]),
        },
        methods: {
            selectProject (value) {
                if (value.isProject) {
                    this.$eventHub.$emit('create_task_info', 'project_id', value.id)
                } else {
                    this.$eventHub.$emit('create_task_info', 'section_id', value.id)
                }
                this.menu = false
                this.projectBtnColor = Con.ACTIVE_COLOR
            },
            filterProjectSectionName (value) {
                return value.name.indexOf(this.filterValue) === 0
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
