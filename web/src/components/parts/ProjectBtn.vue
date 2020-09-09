<template>
    <div>
        <v-tooltip
            v-if="isSelected"
            top
            activator="#project_btn"
            z-index=99000
            open-delay=250
        >
            <span>{{ projectName }}</span>
        </v-tooltip>
        <v-tooltip
            v-else
            top
            activator="#project_btn"
            z-index=99000
            open-delay=250
        >
            <span>プロジェクトを選択</span>
        </v-tooltip>
        <v-menu
            :close-on-content-click="false"
            offset-x
            min-width="200px"
            max-height="380px"
            transition="scroll-y-transition"
            v-model="menu"
        >
            <template v-slot:activator="{ on, attrs }">
                <div id="project_btn">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            :color="projectBtnColor"
                        >mdi-inbox</v-icon>
                    </v-btn>
                </div>
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
                                >mdi-rhombus-medium-outline</v-icon>
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
                                >mdi-square-medium-outline</v-icon>
                                {{ item.name }}
                            </v-list-item>
                        </div>
                    </div>
                    <!-- フィルター絞るここまで -->
                </v-list-item-group>
            </v-list>
        </v-menu>
    </div>
</template>
<script>
    import { Const } from '@/assets/js/const'
    import { mapGetters } from 'vuex'
    const Con = new Const()

    export default {
        name: 'ProjectBtn',
        components: {},
        props: {
            defaultProjectId: {
                type: Number,
                required: false,
                default: 0
            },
            defaultProject: {
                type: String,
                required: false,
                default: ''
            },
            defaultSection: {
                type: String,
                required: false,
                default: ''
            },
        },
        data: () => ({
            projectBtnColor: Con.NON_ACTIVE_COLOR,
            filterValue: '',
            filteredItems: [],
            menu: false,
            project: {
                name: '',
                section: '',
            },
            isSelected: false,
        }),
        created () {
            this.project = {
                name: this.defaultProject,
                section: this.defaultSection
            }
            this.$eventHub.$emit('create_task_info', 'project_id', this.defaultProjectId)
        },
        mounted: function () {
        },
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
            },
            project: {
                handler: function (val) {
                    if (val.name !== '' || val.section !== '') {
                        this.projectBtnColor = Con.ACTIVE_COLOR
                        this.isSelected = true
                    } else {
                        this.projectBtnColor = Con.NON_ACTIVE_COLOR
                        this.isSelected = false
                    }
                },
                deep: true
            }
        },
        computed: {
            ...mapGetters([
                'projects',
            ]),
            projectName () {
                let project = this.project.name
                if (this.project.section !== '') project += '/' + this.project.section
                return project
            }
        },
        methods: {
            selectProject (value) {
                // プロジェクトを選択
                if (value.isProject) {
                    this.setProjectInfo(value)
                    this.$eventHub.$emit('create_task_info', 'project_id', value.id)
                    this.$eventHub.$emit('create_task_info', 'section_id', 0)
                } else {
                    this.setSectionInfo(value)
                    this.selectSection(value)
                }
                this.menu = false
            },
            selectSection (value) {
                // セクションを選択
                if (value.target_project_name !== 'インボックス') {
                    this.$eventHub.$emit('create_task_info', 'project_id', value.target_project)
                }
                this.$eventHub.$emit('create_task_info', 'section_id', value.id)
            },
            filterProjectSectionName (value) {
                // プロジェクト名・セクション名を検索する
                return value.name.indexOf(this.filterValue) === 0
            },
            setProjectInfo (value) {
                // プロジェクト選択時情報をセット
                this.project = {
                    name: value.name,
                    section: ''
                }
            },
            setSectionInfo (value) {
                // セクション選択時情報をセット
                this.project = {
                    name: value.target_project_name,
                    section: value.name
                }
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
