<!-- サイトフッター -->
<template>
    <v-footer
        color='white'
    >
        <v-row justify='end'>
            <small class='footer_copyright'>&copy;&nbsp;offbal.inc</small>
        </v-row>
    </v-footer>
</template>

<script>
export default {
    name: 'Footer',
    data: () => ({
    }),
    created () {
    }
}
</script>

<style lang="scss" scoped>
	.footer_copyright {
		margin-right: 2%;
	}
</style>