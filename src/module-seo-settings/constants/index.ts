export const navigatorItems = [
    {
        icon: 'public',
        name: "General",
        to: `/seo-settings`,
        childrens: [
            {
                icon: 'public',
                name: "Site basics",
                to: `/seo-settings/site-basic`,
            },
            {
                icon: 'public',
                name: "Title & Meta",
                to: `/seo-settings`,
            },
            {
                icon: 'public',
                name: "Local SEO",
                to: `/seo-settings/local-seo`,
                hidden: true,
            },
        ]
    },
    {
        icon: 'manage_accounts',
        name: "Advanced",
        to: `/seo-settings/advanced`,
        hidden: true,
        childrens: [
            {
                icon: 'public',
                name: "Sitemap",
                to: `/seo-settings/advanced/sitemap`,
            },
            {
                icon: 'public',
                name: "Robots",
                to: `/seo-settings/advanced/robots`,
            },

        ]
    },
    {
        icon: 'start',
        name: "Redirection",
        to: `/seo-settings/redirection`,
        hidden: true
    }
]