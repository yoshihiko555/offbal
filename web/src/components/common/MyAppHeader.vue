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
    </div>
</template>

<script>
import SearchField from '@/components/parts/SearchField'

export default {
    name: 'MyAppHeader',
    components: {
    	SearchField,
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