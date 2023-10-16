import { defineModule } from '@directus/extensions-sdk';
import RoutePass from '../shared/utils/router-passthrough'
import SiteBasic from './routes/general/site-basic.vue';
import LocalSEO from './routes/general/local-seo.vue';
import TitleMeta from './routes/general/title-meta.vue';
import TitleMetaDetail from './routes/general/title-meta-detail.vue';
import Scripts from './routes/advanced/scripts.vue';
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
            path: '/seo-settings',
            component: RoutePass,
            children: [
                {
                    name: 'seo-title-meta',
                    path: '',
                    component: TitleMeta,
                },
                {
                    name: 'seo-title-meta-detail',
                    path: 'title-meta/:collection',
                    component: TitleMetaDetail,
                },
                {
                    name: 'seo-site-basic',
                    path: 'site-basic',
                    component: SiteBasic,
                },
                {
                    name: 'seo-local-seo',
                    path: 'local-seo',
                    component: LocalSEO,
                },
            ]
        },
        {
            name: 'seo-advanced-scripts',
            path: '/seo-settings/advanced/scripts',
            component: RoutePass,
            children: [
                {
                    name: 'seo-advanced-scripts',
                    path: '',
                    component: Scripts,
                },
            ]
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
		
	],
});
