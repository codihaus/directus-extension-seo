import { defineModule } from '@directus/extensions-sdk';
import SiteBasic from './routes/general/site-basic.vue';
import LocalSEO from './routes/general/local-seo.vue';
import TitleMeta from './routes/general/title-meta.vue';
import TitleMetaDetail from './routes/general/title-meta-detail.vue';
import Setup from './routes/setup/setup.vue';
import SetupWizard from './routes/setup/setup-wizard.vue';
import '../styles/form.scss'

export default defineModule({
	id: 'seo-settings',
    name: 'SEO settings',
    icon: 'area_chart',
	routes: [
        {
            name: 'seo-title-meta',
            path: '',
            component: TitleMeta,
        },
		{
            name: 'seo-title-meta-detail',
            path: '/seo-settings/title-meta/:collection',
            component: TitleMetaDetail,
        },
		{
            name: 'seo-site-basic',
            path: '/seo-settings/site-basic',
            component: SiteBasic,
        },
		{
            name: 'seo-setup',
            path: '/seo-settings/setup',
            component: Setup,
        },
        {
            name: 'seo-setup-wizard',
            path: '/seo-settings/setup-wizard',
            component: SetupWizard,
        },
		{
            name: 'seo-local-seo',
            path: '/seo-settings/local-seo',
            component: LocalSEO,
        },
		
	],
});
