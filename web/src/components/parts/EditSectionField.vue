<template>
    <ValidationObserver v-slot="{ invalid }">
        <ValidationProvider v-slot='{ errors }' name='セクション名' rules='required'>
            <vs-input
                v-model="section.name"
                placeholder='セクション名'
            >
                <template #message-danger>
                    {{ errors[0] }}
                </template>
            </vs-input>
        </ValidationProvider>
        <div class="create_section_btn_wrap">
            <vs-button
                dark
                @click="close"
            >
                キャンセル
            </vs-button>
            <vs-button
                :disabled='invalid'
                @click="update"
            >
                更新
            </vs-button>
        </div>
    </ValidationObserver>
</template>

<script>
    import { mapMutations } from 'vuex'
    import _ from 'lodash'

    export default {
        name: 'EditSectionField',
        data: () => ({
            section: {},
        }),
        methods: {
            ...mapMutations([
                'updateSection',
            ]),
            update () {
                this.$axios({
                    url: `/api/section/${this.section.id}/`,
                    method: 'PUT',
                    data: {
                        target_category: this.$route.params.id,
                        name: this.section.name,
                    }
                })
                .then(res => {
                    console.log(res)
                    this.updateSection(res.data)
                    this.close()
                })
                .catch(e => {
                    console.log(e)
                })
            },
            open (section) {
                this.section = _.cloneDeep(section)
            },
            close () {
                this.section = {}
                this.$emit('close-edit')
            }
        }
    }
</script>

<style lang='scss' scoped>
    .create_section_btn_wrap {
        display: flex;
        justify-content: flex-start;
    }

    .add_section_btn::v-deep {
        position: relative;
        width: 100%;
        color: #777;
        transition: .2s;

        &::before {
            position: absolute;
            top: 50%;
            z-index: 1;
            content: '';
            display: block;
            width: 100%;
            height: 1px;
            background-color: #ccc;
        }
        &:hover {
            color: #333;
        }

        .add_section {
            position:relative;
            display: inline-block;
            z-index: 2;
            margin: 0 2.5em;
            padding: 0 1em;
            background-color: #fff;
            text-align: center;
        }
    }
</style>