<template>
    <private-view smallHeader title="Title & Meta">
        <template #title>
            <div>
                <h1 class="font-semibold text-lg text-slate-900">{{ 'Title & Meta' }}</h1>
                <div class="text-sm">Choose a collection to setup.</div>
            </div>
        </template>
        <template #actions>
        </template>
        <template #navigation>
            <navigator/>
        </template>
        <template #sidebar>
            <sidebar-detail icon="info_outline" :title="'Information'" close>
                <div class="page-description px-3">
                    <!-- Information -->
                </div>
            </sidebar-detail>
        </template>
        <div class="py-6 px-7.5">
            <div class="flex gap-4 items-center justify-between mb-5">
                <v-breadcrumb :items="breadcrumbs"></v-breadcrumb>
            </div>
            <div class="grid grid-cols-1 gap-x6 gap-y-8 lg:grid-cols-3 2xl:grid-cols-4">
                <collection-item
                    v-for="(collection, index) in collections" :key="collection.collection"
                    :item="collection"
                    v-model="item"
                    @change="onSelectCollection"
                />
            </div>
        </div>
    </private-view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStores, useApi } from '@directus/extensions-sdk';
import { useResetStyle } from '../../../shared/composables/use-reset-style';
import { useCollectionsItems } from '../../../shared/composables/use-collections-items';
import useLanguage from '../../../shared/composables/use-languages';
import useItem from '../../../shared/composables/use-item';
import { COLLECTION } from '../../../shared/constants';
import { getSeoDetailsField, getSeoDetailRelation } from '../setup/fields/seo-detail'
import Navigator from '../../components/navigator/index.vue'
import CollectionItem from '../../components/collection-item.vue'
import LanguageSelect from '../../../shared/components/language-select.vue';

useResetStyle()
const { t } = useI18n()
import { get } from 'lodash';
const route = useRoute()
const api = useApi()

const breadcrumbs = ref([
    {
        to: "/seo-settings",
        name: "Directus SEO",
        icon: "settings",
        disabled: true
    },
    {
        to: `/seo-settings/title-meta/`,
        name: "Title & Meta",
        icon: "",
        // disabled: true
    },
])

const { items, collections } = useCollectionsItems()

const {
    item,
    currentLanguage,
    languages,
    loading,
    saving,
    save
} = useItem(COLLECTION.seo_setting, 'enabled_collections', false, [])

const enableColllection = async(collection) => await api.post(`/items/${COLLECTION.seo_advanced}/`, {collection})
const createSEODetail = async(collection) => await api.post(`/fields/${collection}`, getSeoDetailsField(collection))
const createSEODetailRelation = async(collection) => await api.post(`/relations/`, getSeoDetailRelation(collection))


async function onSelectCollection(collection) {
    console.log('collection', collection)
    await enableColllection().finally(async () => {

        await save()
        console.log('run save');
        
        await createSEODetail(collection)
        console.log('run seo');
        await createSEODetailRelation(collection)
    })

}

</script>

<style lang="scss" scoped>
@import '../../../styles/form.scss';
.language-switcher {
    --v-input-background-color: var(--primary-25);
    --background-input: var(--primary-25);
    --v-input-color: var(--primary);
    --arrow-color: var(--primary);
    --input-height: 48px;
    --border-width: 0px;
    --border-radius: 4px;
    width: 270px;
}

:deep() {
    .v-breadcrumb {
        a {
            --v-breadcrumb-color: var(--primary);
            color: var(--primary)
        }
    }
    .language-select {
        min-width: 270px;
    }
}


</style>