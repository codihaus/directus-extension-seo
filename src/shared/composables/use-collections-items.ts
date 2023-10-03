import { useStores } from "@directus/extensions-sdk";
import { computed } from "vue";

export function useCollectionsItems() {
    const stores = useStores()
    const { useCollectionsStore, useFieldsStore } = stores
    const collectionsStore = useCollectionsStore();
    const fieldsStore = useFieldsStore();
    const collections = computed(() => {
        let collections = collectionsStore.collections;
        
        return [
            ...collections.filter((collection: any) => {
                const hasTranslation = fieldsStore.getFieldsForCollection(collection.collection).filter((field: any) => field.meta.interface === 'translations').length > 0
                return ! hasTranslation
                && collection.collection.startsWith('directus_') === false
                && collection.collection.startsWith('seo_') === false
                && collection.collection.startsWith('module_seo_') === false
                && collection.collection.startsWith('menu') === false
                && collection.collection !== 'languages'
            })
        ];
    });

    const items = computed(() => {
        return collections.value.map((collection) => ({
            text: collection.name,
            value: collection.collection,
            icon: collection.icon,
            description: collection.meta.note
        }));
    });

    return {
        collections,
        items
    }
}