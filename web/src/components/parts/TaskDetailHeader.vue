<template>
    <v-card-actions>
        <v-card-subtitle>タスク詳細</v-card-subtitle>
        <v-spacer></v-spacer>
        <TaskDetailUpdatePriority
            :cloneTask=cloneTask
        />
    </v-card-actions>
    <!-- タスク表示モードここから -->
    <v-card-title v-if="!isEdit"
        @mouseover="isHover = true"
        @mouseleave="isHover = false"
    >
        <vs-checkbox
            color="primary"
            v-model="cloneTask.completed"
            @change="checkTask()"
            class="project_complete_checkbox"
            line-through
        >
            <h1>{{ cloneTask.content }}</h1>
        </vs-checkbox>
        <v-spacer></v-spacer>
        <v-btn
            v-if="isHover"
            icon
            color="primary"
            @click="editTaskContent"
        >
            <v-icon>mdi-square-edit-outline</v-icon>
        </v-btn>
    </v-card-title>
    <!-- タスク表示モードここまで -->
    <!-- タスク編集モードここから -->
    <v-card-title v-else>
        <v-card-actions class="edit_task_content_area">
            <vs-input
                v-model="cloneTask.content"
                @keypress.prevent.enter.exact="changeEditTaskSubmitValue"
                @keyup.prevent.enter.exact="setEditTaskContent"
            >
                <template #icon>
                    <i class="bx bx-message-alt-detail"></i>
                </template>
            </vs-input>
            <v-btn
                class="edit_task_content_submit_btn"
                icon
                color="primary"
                @click="editTaskContentBtn"
                :disabled="isDisabledEditTaskSubmitBtn"
            >
                <i class='bx bx-check'></i>
            </v-btn>
        </v-card-actions>
    </v-card-title>
</template>
