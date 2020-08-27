<template>
    <div id="header">
        <v-app-bar
            app
            flat
            dense
            color='white'
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
	            <v-btn
	                icon
	                small
	                class="mr-3"
	            >
	                <v-icon>mdi-cog-outline</v-icon>
	            </v-btn>
            </v-row>
        </v-app-bar>

        <TaskDialog
            @update="taskDialog = $event"
            :taskDialog="taskDialog"
        />
    </div>
</template>

<script>
import SearchField from '@/components/parts/SearchField'
import TaskDialog from '@/components/common/TaskDialog'

export default {
    name: 'MyAppHeader',
    components: {
    	SearchField,
        TaskDialog,
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

<style lang="scss">
</style>
