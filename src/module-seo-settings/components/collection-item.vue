<template>
<div class="flex flex-col rounded-t rounded-b border-px border-solid border-slate-300">
    <div class="flex gap-5 px-5 py-6">
        <div class="icon self-center">
            <v-icon large :name="item?.icon || 'label'" />
        </div>
        <div class="text-slate-900">
            <div class="text-md font-semibold text-slate-900">
                {{ item?.name || formatTitle(item?.collection) }}
            </div>
            <div class="text-sm text-slate-500 mt-1 line-clamp-1" :title="item?.meta?.note || '...'">
                {{ item?.meta?.note || '...' }}
            </div>
            <div v-if="item?.translation_collection" class="text-xs text-slate-500 mt-1">
                Translation collection: {{ item?.translation_collection }}
            </div>
        </div>
    </div>
    <div class="flex gap-5 px-5 py-4 justify-between bg-slate-100 rounded-b mt-auto">
        <v-switch
            :model-value="modelValue"
            @update:model-value="updateValue($event, item?.collection)"
        />
        <v-button
            class="button-setting"
            :to="`/seo-settings/title-meta/${item?.collection}`"
            :disabled="!modelValue"
            :style="{
                '--v-button-background-color': '#fff',
                '--v-button-color': '#070A13',
                '--border-width': '1px',
                '--v-button-min-width': '0',
            }"
        >Setting</v-button>
    </div>
</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import VSwitch from './v-switch.vue'
import formatTitle from '@directus/format-title';

const props = defineProps({
    item: {
        type: Object as PropType<{[key: string]: any}>,
        default: null
    },
    value: {
        type: Boolean,
        default: null,
    },
    modelValue: {
        type: Boolean,
        default: null
    }
})
const emit = defineEmits(['update:modelValue'])

const updateValue = ($event, collection) => {
    emit('update:modelValue', $event, collection);
}
</script>

<style lang="scss" scoped>
.icon {
    flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	color: var(--foreground-subdued);
	background-color: var(--background-normal);
}
.button-setting {
    :deep() {
        .button {
            border-color: #94A3B8!important
        }
    }
}
</style>