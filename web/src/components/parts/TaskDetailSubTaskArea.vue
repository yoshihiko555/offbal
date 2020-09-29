<template>
    <v-list>
        <v-list-item
            v-for="(subtask, i) in cloneTask.sub_tasks"
            :key="subtask.id"
        >
            <v-container class="ma-0 pa-0">
                <v-row
                    v-if="!isEditSubTask(subtask)"
                    class="sub_task_area_wrap"
                    @mouseover="mouseOverSubTask(subtask)"
                    @mouseleave="mouseLeaveSubTask(subtask)"
                >
                    <v-col cols="10">
                        <vs-checkbox
                            color="success"
                            v-model="complete_sub_task_list"
                            :val="subtask"
                            @change="checkSubTask(subtask)"
                            line-through
                        >
                            <v-list-item-title
                                class="subtask_content"
                            >{{ subtask.content | truncate(18) }}</v-list-item-title>
                        </vs-checkbox>
                    </v-col>
                    <v-col cols="2">
                        <v-btn
                            v-if="isMouseOverSubTask(subtask)"
                            icon
                            height="33px"
                            color="primary"
                            @click="editSubTaskContent(subtask)"
                        >
                            <v-icon>mdi-square-edit-outline</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row
                    v-else
                    class="sub_task_area_wrap"
                >
                    <v-col cols="9">
                        <vs-input
                            v-model="subtask.content"
                            @keypress.prevent.enter.exact="changeEditSubTaskSubmitValue"
                            @keyup.prevent.enter.exact="setEditSubTaskContent(subtask, i)"
                        >
                            <template #icon>
                                <i class="bx bx-message-alt-detail"></i>
                            </template>
                        </vs-input>
                    </v-col>
                    <v-col cols="3">
                        <v-card-actions class="pa-0 ma-0">
                            <v-btn
                                class="edit_sub_task_content_submit_btn"
                                icon
                                color="primary"
                                @click="editSubTaskContentBtn(subtask, i)"
                                size="small"
                            >
                                <i class='bx bx-check'></i>
                            </v-btn>
                            <v-btn
                                class="edit_task_content_submit_btn"
                                icon
                                color="danger"
                                @click="deleteSubTask(subtask, i)"
                                size="small"
                            >
                                <i class='bx bx-minus'></i>
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-container>
        </v-list-item>
        <v-list-item
            class="create_sub_task_area"
        >
            <vs-input
                v-model="subTask.content"
                placeholder="新規サブタスクを追加"
                @keyup.enter="createSubTask"
                @keypress="setCreateSubTask"
            ></vs-input>
        </v-list-item>
    </v-list>
</template>
<script>
    export default {
        name: 'TaskDetailSubTaskArea',
        components: {},
        props: {
            cloneTask: {
                type: Object,
                required: true,
            }
        },
        data: () => ({
        }),
        created () {
        },
        watch: {
        },
        computed: {
        },
        methods: {
        }
    }
</script>
