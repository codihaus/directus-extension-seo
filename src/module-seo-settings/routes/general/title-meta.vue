<template>
    <private-view smallHeader title="Title & Meta">
        <template #title>
            <div>
                <h1 class="font-semibold text-lg text-slate-900">{{ 'Title & Meta' }}</h1>
                <div class="text-sm">Choose a collection to setup.</div>
            </div>
        </template>
        <template #actions>
            <v-checkbox v-model="showTranslationColelctions" label="Show Translation Collections" />
            <div class="w-px h-9 my-auto !ml-2 !mr-4 bg-slate-200"></div>
            <v-button
                v-tooltip.bottom="`Add Custom Setting`"
                rounded
				icon
				:disabled="false"
                to="/seo-settings/title-meta/+"
            >
                <v-icon name="add"></v-icon>
            </v-button>
        </template>
        <template #navigation>
            <navigator/>
        </template>
        <template #sidebar>
            <sidebar-detail icon="info" :title="'Information'" close>
                <div class="page-description px-3">
                    <!-- Information -->
                </div>
            </sidebar-detail>
        </template>
        <div class="py-6 px-7.5">
            <div class="flex gap-4 items-center justify-between mb-5">
                <v-breadcrumb :items="breadcrumbs"></v-breadcrumb>
            </div>
            <div class="">
                <h2 class="text-lg mb-6">Collections</h2>
                <div class="grid grid-cols-1 gap-x6 gap-y-8 lg:grid-cols-3 2xl:grid-cols-4">
                    <collection-item
                        v-for="(collection, index) in collectionsWithoutTranslation" :key="collection.collection"
                        :item="collection"
                        v-model="item"
                        @change="onSelectCollection"
                    />
                </div>
            </div>
            <template v-if="showTranslationColelctions">
                <div class="mt-10">
                    <h2 class="text-lg mb-6">Translation Collections</h2>
                    <div class="grid grid-cols-1 gap-x6 gap-y-8 lg:grid-cols-3 2xl:grid-cols-4">
                        <collection-item
                            v-for="(collection, index) in translationCollections" :key="collection.collection"
                            :item="collection"
                            v-model="item"
                            @change="onSelectCollection"
                        />
                    </div>
                </div>
            </template>
            <div class="mt-10">
                <h2 class="text-lg mb-6">Custom settings</h2>
                <div class="grid grid-cols-1 gap-x6 gap-y-8 lg:grid-cols-3 2xl:grid-cols-4">
                    <collection-item
                        v-for="(collection, index) in customSettingsCollections" :key="collection.collection"
                        :item="collection"
                        v-model="customSettings"
                        @change="onSelectCustomCollection"
                    />
                </div>
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
const route = useRoute()
const api = useApi()
const { useNotificationsStore } = useStores()
const notify = useNotificationsStore()

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

const showTranslationColelctions = ref(false)

const {
    items,
    collections,
    listTranslationCollections,
    translationCollections,
    collectionsWithoutTranslation,
} = useCollectionsItems()

const {
    item,
    currentLanguage,
    languages,
    loading,
    saving,
    save
} = useItem(COLLECTION.seo_setting, 'enabled_collections', false, [])

const {
    item: customSettings,
    loading: loadingCustomSettings,
    saving: savingCustomSettings,
    save: saveCustomSettings
} = useItem(COLLECTION.seo_setting, 'enabled_custom_settings', false, [])

const customSettingsCollections = computed(() => customSettings.value.map((collection) => ({collection, name: collection})))

const enableColllection = async(collection, is_custom: boolean = false) => await api.post(`/items/${COLLECTION.seo_advanced}/`, {collection, is_custom})
const createSEODetail = async(collection) => await api.post(`/fields/${collection}`, getSeoDetailsField(collection))
const createSEODetailRelation = async(collection) => await api.post(`/relations/`, getSeoDetailRelation(collection))


async function onSelectCollection(collection) {
    console.log('collection', collection)
    await enableColllection()
    .then(() => {
        notify.add({
            title: 'Saved!'
        })
    })
    .finally(async () => {

        await save()
        console.log('run save');
        
        // await createSEODetail(collection)
        // console.log('run seo');
        // await createSEODetailRelation(collection)
    })

}

async function onSelectCustomCollection(collection:string) {
    await saveCustomSettings()
}

</script>

<style lang="scss" scoped>
@import '../../../styles/style.scss';
@import '../../../styles/form.scss';

:deep() {
    #main-content.content {
        .header-bar {
            padding-left: 30px;
            @media (min-width: 600px) {
                margin-top: 0;
                padding-right: 30px;
                .title-container {
                    margin-left: 0;
                }
            }
        }
    }
}

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