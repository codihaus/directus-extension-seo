<template>
	<div>
		<v-tabs v-model="currentTab" class="analyzer">
			<v-tab :value="0" v-if="!isSEOAdvanced" class="px-0"><v-button :secondary="! currentTab.includes(0)">{{ `Readability` }}</v-button></v-tab>
			<v-tab :value="1" class="px-0"><v-button :secondary="! currentTab.includes(1)">{{ `General` }}</v-button></v-tab>
			<v-tab :value="2" class="px-0"><v-button :secondary="! currentTab.includes(2)">{{ `Social` }}</v-button></v-tab>
		</v-tabs>
		<v-tabs-items v-model="currentTab" class="mt-5">
			<v-tab-item v-if="!isSEOAdvanced" :value="0">
				<content-analyzer v-model="keywords" @update:model-value="onChangeKeywords" :result-manager="seoStore.resultManager"/>
			</v-tab-item>
			<v-tab-item :value="1">
				<v-form v-model="settings" :initial-values="item" :primary-key="value" :fields="generalFields"></v-form>
			</v-tab-item>
			<v-tab-item :value="2">
				<v-tabs v-model="socialTabs">
					<v-tab><v-icon name="facebook"></v-icon> Facebook</v-tab>
					<v-tab><v-icon name="twitter"></v-icon> Twitter</v-tab>
				</v-tabs>
				<v-tabs-items v-model="socialTabs">
					<v-tab-item>
						<social-preview
							:title="settings?.facebook_title || values?.[map_title]"
							:description="settings?.facebook_description"
							:image="settings?.facebook_image || values?.[map_thumnail]"
						/>
						<v-form v-model="settings" :initial-values="item" :primary-key="value" :fields="facebookFields"></v-form>
					</v-tab-item>
					<v-tab-item>
						<social-preview
							:title="settings?.twitter_title || values?.[map_title]"
							:description="settings?.twitter_description"
							:image="settings?.twitter_image || values?.[map_thumnail]"
							type="twitter"
						/>
						<v-form v-model="settings" :initial-values="item" :primary-key="value" :fields="twitterFields"></v-form>
					</v-tab-item>
				</v-tabs-items>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, ref, toRefs,getCurrentInstance, h, watch, onMounted } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
// import { useI18n } from 'vue-i18n';
import { useSEOStore } from './stores/useSEOStore'
import debounce from 'lodash/debounce';
import isNumber from 'lodash/isNumber';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import SidebarSEO from './components/sidebar-seo.vue'
import ContentAnalyzer from './components/content-analyzer.vue'
import SocialPreview from './components/social-preview.vue'
import useImage from './composables/use-image';
import SEOAdvancedField from './fields/seo-advanced'
import { COLLECTION } from '../shared/constants';
import { join, merge } from 'lodash';


const props = withDefaults(
	defineProps<{
		value?: number | string | Record<string, any> | null;
		collection: string;
		field: string;
		disabled?: boolean;
		isSEOAdvanced?: boolean;
		primaryKey: [Number, String];
		map_title?: string
		map_content?: string
		map_url?: string
		map_thumnail?: string
	}>(),
	{
		value: () => null,
		disabled: false,
		isSEOAdvanced: false,
		map_title: 'title',
		map_content: 'content',
		map_thumnail: 'thumbnail',
	}
);

const emit = defineEmits(['input']);
const values = inject('values', ref<Record<string, any>>({}));
const stores = useStores();
const { collection, field, isSEOAdvanced, primaryKey } = toRefs(props);
const api = useApi()
const route = useRoute()

const currentTab = ref()

interface seoSetting {
	id?: number | null
	meta_title?: string
	meta_robots?: string
	meta_keywords?: string[] | string
	meta_description?: string
	facebook_image?: string
	twitter_image?: string
	facebook_title?: string
	facebook_description?: string
	twitter_title?: string
	twitter_description?: string
}

const settings = ref<seoSetting>({})
const item = ref<seoSetting>({})

// const SEOAdvancedFields = SEOAdvancedField(collection.value)
const metaTemplateCollection = isSEOAdvanced.value ?
	(route.params?.primaryKey || route.params?.collection) :
	(values?.seo_advanced_setting_collection ||
	values?.collection ||
	collection.value)


const socialTabs = ref()
const generalFields = ref([
	{
		field: "meta_robots",
		name: "Robots Meta",
		type: "json",
		meta: {
			width: "full",
			interface: "select-multiple-checkbox",
			options: {
				"choices": [
					{
						"text": "No Index",
						"value": "noindex"
					},
					{
						"text": "No follow",
						"value": "nofollow"
					},
					{
						"text": "No Archive",
						"value": "noarchive"
					},
					{
						"text": "No Image Index",
						"value": "noimageindex"
					},
					{
						"text": "No Snippet",
						"value": "nosnippet"
					}
				],
				"itemsShown": 6
			}
		}
	},
	{
		field: "meta_title",
		name: "Meta title",
		type: "string",
		meta: {
			width: "full",
			interface: "meta-template",
			options: {
				collectionName: metaTemplateCollection,
				inject: {
					fields: [
						{
							field: "sep",
							name: "Seperator",
							collection: metaTemplateCollection,
							type: "string",
						},
					],
				},
			},
		}
	},
	{
		field: "meta_description",
		name: "Meta description",
		type: "string",
		meta: {
			width: "full",
			interface: "meta-template",
			options: {
				collectionName: metaTemplateCollection,
				inject: {
					fields: [
						{
							field: "sep",
							name: "Seperator",
							collection: metaTemplateCollection,
							type: "string",
						},
					],
				},
			},
		}
	},
])
const facebookFields = ref([
	{
		collection: COLLECTION.seo_detail,
		field: "facebook_image",
		name: "Add image",
		type: "uuid",
		meta: {
			collection: COLLECTION.seo_detail,
			interface: "file-image",
			special: [
				"file"
			],
			note: "Field notes ... ?"
		},
	},
	{
		field: "facebook_title",
		name: "Facebook title",
		type: "string",
		meta: {
			width: "full",
			interface: "meta-template",
			options: {
				collectionName: metaTemplateCollection,
				inject: {
					fields: [
						{
							field: "sep",
							name: "Seperator",
							collection: metaTemplateCollection,
							type: "string",
						},
					],
				},
			},
		}
	},
	{
		field: "facebook_description",
		name: "Facebook description",
		type: "string",
		meta: {
			width: "full",
			interface: "meta-template",
			options: {
				collectionName: metaTemplateCollection,
				inject: {
					fields: [
						{
							field: "sep",
							name: "Seperator",
							collection: metaTemplateCollection,
							type: "string",
						},
					],
				},
			},
		}
	},
])
const twitterFields = ref([
	{
		collection: COLLECTION.seo_detail,
		field: "twitter_image",
		name: "Add image",
		type: "uuid",
		meta: {
			collection: COLLECTION.seo_detail,
			interface: "file-image",
			special: [
				"file"
			],
			note: "Field notes ... ?"
		},
	},
	{
		field: "twitter_title",
		name: "Twitter title",
		type: "string",
		meta: {
			width: "full",
			interface: "meta-template",
			options: {
				collectionName: metaTemplateCollection,
				inject: {
					fields: [
						{
							field: "sep",
							name: "Seperator",
							collection: metaTemplateCollection,
							type: "string",
						},
					],
				},
			},
		}
	},
	{
		field: "twitter_description",
		name: "Twitter description",
		type: "string",
		meta: {
			width: "full",
			interface: "meta-template",
			options: {
				collectionName: metaTemplateCollection,
				inject: {
					fields: [
						{
							field: "sep",
							name: "Seperator",
							collection: metaTemplateCollection,
							type: "string",
						},
					],
				},
			},
		}
	},
])


const keywords = ref([''])
const seoStore = useSEOStore()
const { options } = storeToRefs(seoStore)
const { idToUrl } = useImage()
const getValue = (key, val = values.value) => {
	return Object.keys(val).includes(key) ? val[key] : null
}

function onChangeKeywords() {
	const newKeywords = keywords.value
	
	seoStore.setOptions({
		title: getValue(props.map_title, values.value) || '',
		keywords: newKeywords || [''],
		thumbnail: values.value?.[props.map_thumnail] ? idToUrl(values.value?.[props.map_thumnail]) : '',
		url: getValue(props.map_url, values.value) || '',
	})
	seoStore.setContent(values.value?.[props.map_content])
}

watch([settings, keywords], function([newSettings, newKeywords]) {
	let data = merge({...item.value}, newSettings, {meta_keywords: newKeywords})

	// if( !!isSEOAdvanced.value ) {
	// 	emit('input', data);
	// 	return
	// }

	const {
		id,
		meta_title,
		meta_description,
		facebook_title,
		facebook_description,
		twitter_title,
		twitter_description,
		meta_robots,
		facebook_image,
		twitter_image,
		meta_keywords
	} = data
	data = {
		id,
		meta_title,
		meta_description,
		meta_robots,
		facebook_image,
		twitter_image,
		meta_social: {
			facebook_title,
			facebook_description,
			twitter_title,
			twitter_description
		},
		meta_keywords: join(meta_keywords, ',')
	}
	
	console.log('data', data);
	
	emit('input', data);

})

const getSettingData = async(id) => {
	try {
		await api.get(`/items/${COLLECTION.seo_detail}/${id}`).then((res) => {
			let data = res?.data?.data
			console.log(data);

			// if( !!isSEOAdvanced.value ) {
			// 	item.value = data
			// 	return
			// }
			
			const {
				id,
				meta_title,
				meta_description,
				facebook_image,
				twitter_image,
				meta_robots,
			} = data
			let meta_keywords = data?.meta_keywords?.split(',') || ['']
			const meta_social = JSON.parse(data.meta_social || '{}')
			item.value = {
				id,
				meta_title,
				meta_description,
				meta_robots: JSON.parse(meta_robots || '{}'),
				facebook_image,
				twitter_image,
				meta_keywords,
				...meta_social
			}
			if( !!isSEOAdvanced.value ) {
				return
			}
			keywords.value = meta_keywords
			seoStore.setSelectedKeyword(meta_keywords?.[0])
		})
	} catch (error) {
		
	}
}

onMounted(() => {

	if( !!isSEOAdvanced.value ) {
		return
	}

	const instance = getCurrentInstance()

	let parent = instance?.parent
	while (parent && parent.type.__name !== 'private-view') {
		parent = parent.parent;
	}

	// @ts-ignore
	const renderSidebarSEO = h(SidebarSEO, {modelValue: keywords} )
	// @ts-ignore
	const sidebar = parent.slots.sidebar()
	sidebar.push( renderSidebarSEO )
	// @ts-ignore
	parent.slots.sidebar = () => sidebar
})

onMounted(async() => {
	if( props.value ) {
		await getSettingData(props.value);
	}
})

watch(() => props.value , async(newValue, oldValue) => {
	if( isNumber(newValue) ) {
		getSettingData(newValue);
	}
})

</script>
<style lang="scss" scoped>
@import '../styles/form.scss';
.v-tabs.horizontal.analyzer {
	background-color: #F1F5F9;
	padding: 4px;
	gap: 4px;
	border-radius: 24px;
    :deep() {
		.v-tab {
			height: auto;
			padding: 0;
			--v-tab-background-color: transparent;
			--v-tab-background-color-active: transparent;
		}
		.button {
			// --v-button-background-color: transparent;
			--border-width: 0;
			--border-radius: 24px;
			--v-button-height: 40px;
			--v-button-min-width: 0;
			padding: 0 16px;
			gap: 0;
		}
	}
	
}
</style>