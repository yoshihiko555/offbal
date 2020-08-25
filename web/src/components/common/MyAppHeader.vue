<template>
    <div id="header">
        <v-app-bar
            app
            flat
            dense
            color='white'
        >
        	<v-row align='center'>
	        	<SearchTodo/>
	            <v-spacer/>
	            <v-btn
	                icon
	                small
	                class="mx-2"
	            >
	                <v-icon>mdi-plus</v-icon>
	            </v-btn>
	            <v-btn
	                icon
	                small
	                class="mx-2"
	            >
	                <v-icon>mdi-cog-outline</v-icon>
	            </v-btn>
            </v-row>
        </v-app-bar>
    </div>
</template>

<script>
import SearchTodo from '@/components/parts/SearchTodo'

export default {
    name: 'MyAppHeader',
    components: {
    	SearchTodo,
    },
    data: () => ({
    }),
	created () {
	},
    methods: {
    }
}
</script>

<style lang="scss">
</style>