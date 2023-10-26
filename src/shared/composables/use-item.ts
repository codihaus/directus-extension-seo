import { Ref, computed, onMounted, ref } from "vue"
import { useApi, useStores } from "@directus/composables"
import { getEndpoint } from '@directus/utils';
import merge from 'lodash/merge'
import useLanguage from "./use-languages"
import { COLLECTION } from "../constants"

export default function useItem(
        collection: Ref<string>,
        primaryKey: Ref<string | number | null>,
        isMultilang: Ref<boolean> = true,
        defaultValue: any = {}
    ) {
    const { useNotificationsStore } = useStores()
    const notify = useNotificationsStore()

    const { info: collectionInfo, primaryKeyField } = useCollection(collection);
    
    const settings = ref(defaultValue)
    const item = ref(defaultValue)
    const isNew = ref(false)
    const loading = ref(false)
    const saving = ref(false)
    const error = ref()
    
    const { currentLanguage, languages } = useLanguage()
    
    const itemLang = computed(() => {
        return (isMultilang && currentLanguage.value) ? item.value?.[currentLanguage.value] : item.value
    })
    
    const editData = computed({
        get: () => isMultilang ? settings.value?.[currentLanguage.value] : settings.value,
        set: (newValue) => {
            if (isMultilang) {
                
                settings.value[currentLanguage.value] = newValue
                return
            }

            settings.value = newValue
        },
    })

    watch([collection, primaryKey], refresh, { immediate: true });

    function refresh() {
		error.value = null;
		loading.value = false;
		saving.value = false;
		deleting.value = false;

		if (isNew.value === true) {
			item.value = null;
		} else {
			getItem();
		}
	}

    const api = useApi()
    const endPoint = computed(() => `${getEndpoint(collection.value)}/${encodeURIComponent(primaryKey.value as string)}`)

    const saveData = computed(() => (collection === COLLECTION.seo_setting ? {
        key: primaryKey.value,
        value: merge(item.value, settings.value)
    } : merge(item.value, settings.value)))

    async function getItem() {
        loading.value = true;
		error.value = null;

		try {
			const response = await api.get(endPoint.value, {params: {fields: ['*.*']}});
            item.value = response?.data?.data?.value;
		} catch (err: any) {
			error.value = err;
            isNew.value = true
		} finally {
			loading.value = false;
		}
    }

    async function save(data: any = {}) {
        saving.value = true;

        try {
			let response;

			if (isNew.value === true) {
				response = await api.post(getEndpoint(collection.value), {...saveData.value, ...data});

			} else {
                let pathData = {...saveData.value, ...data};
                delete pathData.key;
				response = await api.patch(endPoint.value, pathData);
                isNew.value = false
			}
            notify.add({
                type: 'success',
                title: 'Saved Successfully!'
            })

			settings.value = defaultValue;
			return response.data.data;
		} catch (err: any) {
			// saveErrorHandler(err);
            console.log(error)
            notify.add({
                type: 'error',
                title: 'Save Error'
            })
		} finally {
			saving.value = false;
		}
    }

    // onMounted(async () => {
    //     await getItem()
    // })

    return {
        settings,
        item,
        itemLang,
        editData,
        saveData,
        currentLanguage,
        languages,
        saving,
        loading,
        error,
        getItem,
        save,
    }
}