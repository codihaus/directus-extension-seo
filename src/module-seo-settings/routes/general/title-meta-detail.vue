<template>
    <private-view smallHeader title="Title & Meta">
        <template #title>
            <div>
                <h1 class="font-semibold text-lg text-slate-900">{{ 'Title & Meta' }}</h1>
                <div class="text-sm">Choose a collection to setup.</div>
            </div>
        </template>
        <template #actions>
            <language-select
                v-if="languages"
                v-model="currentLanguage"
                :items="languages"
                @update:model-value="onSelectLanguage"
            />
            <div class="w-px h-9 my-auto bg-slate-200"></div>
            <v-button
                v-tooltip.bottom="`Save`"
                @click="onSave"
                rounded
				icon
				:secondary="false"
				:disabled="false"
            >
                <v-icon name="check"></v-icon>
            </v-button>
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
            <v-form v-model="mapFieldsSettings" :fields="mapFields" :primary-key="0" :initial-values="field?.meta?.options" class="seo-setting-form"></v-form>
            <v-form
                v-model="settings"
                :collection="COLLECTION.seo_advanced"
                :primary-key="route.params.collection"
                :initial-values="item"
                class="seo-setting-form advanced-form">
            </v-form>
        </div>
    </private-view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useApi, useStores } from '@directus/extensions-sdk';
import { useResetStyle } from '../../../shared/composables/use-reset-style';
import { useCollectionsItems } from '../../../shared/composables/use-collections-items';
import useItem from '../../../shared/composables/use-item';
import { COLLECTION } from '../../../shared/constants';
import { getSeoDetailsField, getSeoDetailRelation } from '../setup/fields/seo-detail'
import useMapFields from '../../composables/use-map-fields'
import Navigator from '../../components/navigator/index.vue'
import CollectionItem from '../../components/collection-item.vue'
import getFields from './fields/title-meta-detail'
import LanguageSelect from '../../../shared/components/language-select.vue';
import merge from 'lodash/merge'

useResetStyle()
const { t } = useI18n()
const api = useApi()
const route = useRoute()
const collection = ref(route.params.collection)

const breadcrumbs = ref([
    {
        to: "/seo-settings",
        name: "Directus SEO",
        icon: "settings",
        disabled: true
    },
    {
        to: `/seo-settings/title-meta/${collection.value}`,
        name: "Title & Meta",
        icon: "",
        // disabled: true
    },
])


const mapFieldsSettings = ref({})
const { mapFields } = useMapFields(collection.value)

const fields = ref(getFields(collection.value))

const {
    settings,
    item,
    currentLanguage,
    languages,
    loading,
    saving,
    save
} = useItem(COLLECTION.seo_advanced, collection.value, false)

const field = ref()
onMounted(async () => {
    field.value = await api.get(`/fields/${collection.value}/${COLLECTION.seo_detail}`).then(({data}) => data?.data)
})

const onSave = async() => {
    save()
    const field = await api.get(`/fields/${collection.value}/seo_detail`)
    .then(({data}) => data?.data)
    .catch(async() => {
        await api.post(`/fields/${collection.value}`, getSeoDetailsField(collection.value))
        await api.post(`/relations/`, getSeoDetailRelation(collection.value))
    })
    await api.patch(`/fields/${collection.value}/seo_detail`, merge(field, {meta: {options: mapFieldsSettings.value}}))
}

const onSelectLanguage = (lang) => {
    document.querySelector('.advanced-form .language-select .toggle').click()
    setTimeout(() => {
        for (const listItem of document.querySelectorAll('#menu-outlet .v-list-item')) {
            console.log('a.textContent',listItem.textContent);
            if (listItem.textContent.includes(lang)) {
                
                listItem.click()
            }
        }
    }, 300);
}

onMounted(() =>setTimeout(() =>  onSelectLanguage(currentLanguage.value), 500))
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
    .v-menu.language-select {
        display: none;
    }
}

.advanced-form {
    :deep() {
        > .first-visible-field > .v-menu {
            display: none;
        }
        .language-select + .v-form {
            grid-template-columns: [start] minmax(0, 1fr) [half] minmax(0, 1fr) [full] 1fr [fill] !important;
            > .field {
                grid-column: start/fill;
            }
            + .v-divider {
                display:none;
            }
        }
    }
}
</style>