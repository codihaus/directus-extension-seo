<template>
<private-view smallHeader title="Setup">
    <template #navigation>
        <v-tabs v-model="currentStep" vertical>
            <v-tab v-for="(step, id) in steps" :key="id" :value="id"><v-icon :name="currentStep.includes(id) ? `radio_button_checked` : `radio_button_unchecked`" />{{ step.label }}</v-tab>
        </v-tabs>
    </template>
    <div class="px-5 pt-10 pb-3">
        <v-tabs-items v-model="currentStep">
            <v-tab-item :value="stepNames[0]">
                <v-info icon="info" :title="current.title" type="warning">
                    {{ current.description }}
                    <v-button class="mt-5" :disabled="loading" :loading="loading" @click="setup">
                        {{ loading ? 'Setting up...' : 'Start' }}
                        <template #loading>
                            <div class="flex gap-2 items-center">
                                <div class="inline-block"><v-progress-circular indeterminate /></div>
                                <span>{{ 'Setting up...' }}</span>
                            </div>
                        </template>
                    </v-button>
                </v-info>
            </v-tab-item>
            <v-tab-item :value="stepNames[1]">
                <v-notice icon="info" type="warning" class="mb-10">
                    <h2>{{ current.description }}</h2>
                </v-notice>
                <div class="field mb-10">
                    <div class="field-label type-label mb-2">Do you want SEO module support multi-language?</div>
                    <v-radio v-model="useLanguage" :value="0" label="No" />
                    <v-radio v-model="useLanguage" :value="1" label="Let SEO module create a new one" />
                    <v-radio v-model="useLanguage" :value="2" label="Choose from existing collection" />
                </div>
                <v-form v-if="useLanguage === 2" v-model="languageCollection" :fields="languageFields"></v-form>
                <v-button class="mt-5" :disabled="loading" :loading="loading" @click="createMultiLanguage">
                    {{ loading ? 'Setting up...' : 'Next step' }}
                    <template #loading>
                        <div class="flex gap-2 items-center">
                            <div class="inline-block"><v-progress-circular indeterminate /></div>
                            <span>{{ 'Setting up...' }}</span>
                        </div>
                    </template>
                </v-button>
                
            </v-tab-item>
            <v-tab-item :value="stepNames[2]">
                <v-info icon="check" :title="current.title" type="success">
                    {{ current.description }}
                    <v-button class="mt-5" :disabled="loading" :loading="loading" @click="complete" to="/seo-settings/title-meta">
                        {{  'Go to Setting' }}
                    </v-button>
                </v-info>
            </v-tab-item>
        </v-tabs-items>

    </div>
    
</private-view>
</template>

<script setup lang="ts">
import { useApi, useStores } from '@directus/extensions-sdk'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStepper } from '@vueuse/core'
import {
    collectionModuleSettings,
    collectionRedirection,
    collectionSeoAdvanced,
    collectionSeoDetails,
    relationsSeoDetails,
    collectionLanguages,
    getCollectionSeoAdvanced,
    getRelationSeoAdvancedTranslation,
collectionSeoAdvancedTrans,
} from './fields'
import { COLLECTION } from '../../../shared/constants';

const api = useApi()
const { useCollectionsStore } = useStores();
const collectionsStore = useCollectionsStore();
const { t } = useI18n()
const router = useRouter()

const loading = ref(false)
// const currentStep = ref()
const currentStepTitle = ref('Welcome to SEO Settings')
const currentStepText = ref('Click to button bellow to start')
const buttonText = ref('Start now')
const useLanguage = ref(0)
const languageCollection = ref<{
    collection?: string,
    field?: string
}>({})
const {
    steps,
    stepNames,
    index,
    current,
    next,
    previous,
    isFirst,
    isLast,
    goTo,
    goToNext,
    goToPrevious,
    goBackTo,
    isNext,
    isPrevious,
    isCurrent,
    isBefore,
    isAfter,
} = useStepper({
    createCollection: {
        label: 'Start',
        title: 'Welcome to SEO Settings',
        description: 'Click to button bellow to start'
    },
    language: {
        label: 'Languages',
        title: 'Languages Support',
        description: 'If you want SEO module support multi-language, choose an existing language collection or let SEO module create a new one for you.'
    },
    completed: {
        label: 'Complete',
        title: 'Setup completed',
        description: 'Now you can use SEO Module.'
    },
})

const currentStep = computed({
    get: () => [stepNames.value[index.value]],
    set: (val: any) => {
        console.log(val);
        
        goTo(val?.[0])
    }
})

const languageFields = ref([
    {
        field: 'collection',
        name: 'Choose a collection for multi-language',
        type: 'string',
        meta: {
            interface: 'system-collection',
            width: 'half',
            options: {
                includeSystem: false,
                includeSingleton: false,
            },
        },
    },
    {
        field: 'field',
        type: 'string',
        name: 'Choose code field:',
        meta: {
            interface: 'system-field',
            options: {
                collectionField: 'collection',
                allowPrimaryKey: true,
                allowNone: true,
            },
            width: 'half',
        },
    },
])

onMounted(() => {
    if(isCollectionExist(COLLECTION.seo_setting) && isCollectionExist(COLLECTION.seo_redirection)) {
        currentStepText.value = 'Go to next step for settings.'
        buttonText.value = 'Next step'
    }
})

const setup = async() => {
    loading.value = true
    await collectionsStore.hydrate()
    if( isCollectionExist(COLLECTION.seo_setting) && isCollectionExist(COLLECTION.seo_redirection) && isCollectionExist(COLLECTION.seo_detail) ) {
        goToNext()
        loading.value = false
        return
    }
    
    console.log('exist', isCollectionExist(COLLECTION.seo_setting) && isCollectionExist(COLLECTION.seo_redirection) && isCollectionExist(COLLECTION.seo_detail))
    console.log('after check')

    if( ! isCollectionExist(COLLECTION.seo_setting) ) {
        currentStepTitle.value = 'Create settings'
        currentStepText.value = 'Creating collections for saving settings...'
        await api.post('/collections', collectionModuleSettings).then((res) => {
            if( ! res.data.data ) {
                currentStepTitle.value = 'Error!'
                // currentStepText.value = res.data.errors.
            }
        })
        await collectionsStore.hydrate()
    }
    if( ! isCollectionExist(COLLECTION.seo_redirection) ) {
        
        await api.post('/collections', collectionRedirection).then((res) => {
            if( ! res.data.data ) {
            }
        })
        await collectionsStore.hydrate()
    }
    if( ! isCollectionExist(COLLECTION.seo_detail) ) {
        await api.post('/collections', collectionSeoDetails).then((res) => {
            if( ! res.data.data ) {
            }
        })
        await collectionsStore.hydrate()
        for await (const relation of relationsSeoDetails) {
            await api.post('/relations', relation)
        }
    }
    loading.value = false
    goToNext()
    buttonText.value = 'Next step'
}

const createMultiLanguage = async() => {

    loading.value = true
    await collectionsStore.hydrate()

    if( ! isCollectionExist(COLLECTION.seo_advanced) ) {
        await api.post('/collections', getCollectionSeoAdvanced(useLanguage.value > 0))
        await collectionsStore.hydrate()
    }

    if( ! isCollectionExist(`${COLLECTION.seo_advanced}_translations`) && useLanguage.value > 0 ) {
        await api.post('/collections', collectionSeoAdvancedTrans)
        await collectionsStore.hydrate()
    }


    if( ! isCollectionExist(COLLECTION.language) && useLanguage.value === 1 ) {
        await api.post('/collections', collectionLanguages)
        await collectionsStore.hydrate()
    }

    if( useLanguage.value > 0 ) {
        const relationSeoAdvancedTranslation = getRelationSeoAdvancedTranslation(languageCollection.value.collection || 'languages', languageCollection.value.field || 'code')

        for await (const relation of relationSeoAdvancedTranslation) {
            await api.post('/relations', relation)
        }
    }
    
    loading.value = false
    goToNext()
}

const complete = async() => {
    // const generalData = {
    //     key: 'general',
    //     value: {}
    // }
    
    api.post(`/items/${COLLECTION.seo_setting}`, {key: 'setup', value: {
        enabled: true
    }})
    router.push('/seo-settings/title-meta')
    // await api.post(`/items/${COLLECTION.seo_setting}`, generalData)

}

const isCollectionExist = (collection: string) => collectionsStore.getCollection(collection)
</script>

<style scoped>

</style>