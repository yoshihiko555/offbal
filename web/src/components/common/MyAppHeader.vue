<template>
    <div id="header">
        <v-app-bar
            app
            flat
            dense
        >
        	<v-row align='center'>
	        	<SearchField/>
	            <v-spacer/>
	            <v-btn
	                icon
	                small
	                class="mr-4"
                    @click="taskDialog=!taskDialog"
	            >
	                <v-icon>mdi-plus</v-icon>
	            </v-btn>
                <SettingMenuBtn/>
            </v-row>
        </v-app-bar>

        <!-- モーダル読み込み -->
        <TaskDialog
            @update="taskDialog = $event"
            :taskDialog="taskDialog"
        />
    </div>
</template>

<script>
import SearchField from '@/components/parts/SearchField'
import TaskDialog from '@/components/common/TaskDialog'
import SettingMenuBtn from '@/components/parts/SettingMenuBtn'

export default {
    name: 'MyAppHeader',
    components: {
    	SearchField,
        TaskDialog,
        SettingMenuBtn,
    },
    data: () => ({
        taskDialog: false,
    }),
	created () {
	},
    methods: {
    }
}
</script>

<style lang="scss" scoped>
    .theme--light.v-app-bar.v-toolbar.v-sheet {
        background-color: #fff;
    }
</style>
