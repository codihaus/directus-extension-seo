export default [
    {
        field: "default_meta_info",
        type: "alias",
        schema: null,
        meta: {
            field: "default_meta_info",
            special: ["alias", "no-data", "group"],
            interface: "group-section",
            options: null,
            sort: 0,
            width: "full",
        },
        name: "Default Meta Info",
    },
    {
        field: "default_meta_info_left",
        type: "alias",
        schema: null,
        meta: {
            field: "default_meta_info_left",
            special: ["alias", "no-data", "group"],
            interface: "group-column",
            options: null,
            sort: 1,
            width: "full",
            group: "default_meta_info",
        },
        name: "Default Meta Info Left",
    },
    {
        field: "default_meta_info_title",
        type: "alias",
        schema: null,
        meta: {
            field: "default_meta_info_title",
            special: ["alias", "no-data"],
            interface: "presentation-info",
            options: {
                title: "Default meta info",
            },
            sort: 1,
            width: "full",
            group: "default_meta_info_left",
        },
        name: "Default Meta Info Title",
    },
    {
        field: "default_meta_info_right",
        type: "alias",
        schema: null,
        meta: {
            field: "default_meta_info_right",
            special: ["alias", "no-data", "group"],
            interface: "group-column",
            options: null,
            sort: 2,
            width: "full",
            group: "default_meta_info",
        },
        name: "Default Meta Info Right",
    },
    {
        field: "meta_title",
        type: "string",
        schema: {
            name: "meta_title",
        },
        meta: {
            field: "meta_title",
            special: null,
            interface: "input",
            options: null,
            sort: 1,
            width: "full",
            translations: null,
            note: "Default title tag for single all pages. This can be changed on a per-post basis on the content detail screen.",
            conditions: null,
            required: false,
            group: "default_meta_info_right",
        },
        name: "Meta Title",
    },
    {
        field: "meta_description",
        type: "text",
        meta: {
            field: "meta_description",
            special: null,
            interface: "input-multiline",
            options: {
                softLength: 255,
            },
            sort: 2,
            width: "full",
            translations: null,
            note: "Default meta title for single all pages. This can be changed on a per-post basis on the content detail screen.",
            conditions: null,
            required: false,
            group: "default_meta_info_right",
        },
        name: "Meta Description",
    },
    {
        field: "social_sharing_section",
        type: "alias",
        schema: null,
        meta: {
            field: "social_sharing_section",
            special: ["alias", "no-data", "group"],
            interface: "group-section",
            options: null,
            sort: 1,
            width: "full",
            translations: null,
            note: "Add social account information to your website's Schema and Open Graph.[Learn More](http://codihaus.com).",
            conditions: null,
            required: false,
            group: null,
        },
        name: "Social Sharing Section",
    },
    {
        field: "social_sharing_left",
        type: "alias",
        schema: null,
        meta: {
            field: "social_sharing_left",
            special: ["alias", "no-data", "group"],
            interface: "group-column",
            options: null,
            sort: 1,
            width: "full",
            group: "social_sharing_section",
        },
        name: "Social Sharing Left",
    },
    {
        field: "social_sharing_title",
        type: "alias",
        schema: null,
        meta: {
            field: "social_sharing_title",
            special: ["alias", "no-data"],
            interface: "presentation-info",
            options: {
                title: "Social sharing",
            },
            sort: 1,
            width: "full",
            translations: null,
            note: "Add social account information to your website's Schema and Open Graph.[Learn More](http://codihaus.com).",
            conditions: null,
            required: false,
            group: "social_sharing_left",
        },
        name: "Social Sharing Title",
    },
    {
        field: "social_sharing_right",
        type: "alias",
        schema: null,
        meta: {
            field: "social_sharing_right",
            special: ["alias", "no-data", "group"],
            interface: "group-column",
            options: null,
            sort: 2,
            width: "full",
            group: "social_sharing_section",
        },
        name: "Social Sharing Right",
    },
    {
        field: "social_sharing_tab",
        type: "string",
        schema: {
            name: "social_sharing_tab",
            data_type: "varchar",
            default_value: "facebook",
            max_length: 255,
            numeric_precision: null,
            numeric_scale: null,
            is_generated: false,
            generation_expression: null,
            is_nullable: true,
            is_unique: false,
            is_primary_key: false,
            has_auto_increment: false,
            foreign_key_column: null,
            foreign_key_table: null,
        },
        meta: {
            field: "social_sharing_tab",
            special: null,
            interface: "radio-button",
            options: {
                choices: [
                    {
                        text: "Facebook",
                        value: "facebook",
                    },
                    {
                        text: "Twitter",
                        value: "twitter",
                    },
                ],
            },
            sort: 1,
            width: "full",
            group: "social_sharing_right",
        },
        name: "",
    },
    {
        field: "facebook_image",
        type: "uuid",
        meta: {
            special: null,
            interface: "social-preview",
            options: null,
            sort: 1,
            width: "full",
            note: null,
            conditions: [
                {
                    name: "social_facebook",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "facebook",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "",
    },
    {
        field: "facebook_title",
        type: "string",
        schema: {
            name: "facebook_title",
        },
        meta: {
            field: "facebook_title",
            special: null,
            interface: "input",
            options: null,
            sort: 2,
            width: "full",
            translations: null,
            note: null,
            conditions: [
                {
                    name: "social_facebook",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "facebook",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "Facebook Title",
    },
    {
        field: "facebook_description",
        type: "string",
        schema: {
            name: "facebook_description",
        },
        meta: {
            field: "facebook_description",
            interface: "input",
            sort: 2,
            width: "full",
            translations: null,
            note: null,
            conditions: [
                {
                    name: "social_facebook",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "facebook",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            group: "social_sharing_right",
        },
        name: "Facebook Description",
    },
    {
        field: "facebook_page_url",
        type: "string",
        schema: {
            name: "facebook_page_url",
        },
        meta: {
            field: "facebook_page_url",
            special: null,
            interface: "input",
            options: null,
            sort: 3,
            width: "full",
            translations: null,
            note: null,
            conditions: [
                {
                    name: "social_facebook",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "facebook",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "Facebook Page URL",
    },
    {
        field: "facebook_authorship",
        type: "string",
        schema: {
            name: "facebook_authorship",
        },
        meta: {
            field: "facebook_authorship",
            special: null,
            interface: "input",
            options: null,
            sort: 4,
            width: "full",
            translations: null,
            note: null,
            conditions: [
                {
                    name: "social_facebook",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "facebook",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "Facebook Authorship",
    },
    {
        field: "facebook_admin",
        type: "string",
        schema: {
            name: "facebook_admin",
        },
        meta: {
            field: "facebook_admin",
            special: null,
            interface: "input",
            options: null,
            sort: 5,
            width: "full",
            translations: null,
            note: null,
            conditions: [
                {
                    name: "social_facebook",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "facebook",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "Facebook Admin",
    },
    {
        field: "facebook_app",
        type: "string",
        schema: {
            name: "facebook_app",
        },
        meta: {
            field: "facebook_app",
            special: null,
            interface: "input",
            options: null,
            sort: 6,
            width: "full",
            translations: null,
            note: null,
            conditions: [
                {
                    name: "social_facebook",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "facebook",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "Facebook App",
    },
    {
        field: "facebook_secret",
        type: "string",
        schema: {
            name: "facebook_secret",
        },
        meta: {
            field: "facebook_secret",
            special: null,
            interface: "input",
            options: null,
            sort: 7,
            width: "full",
            translations: null,
            note: null,
            conditions: [
                {
                    name: "social_facebook",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "facebook",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "Facebook Secret",
    },
    {
        field: "twitter_image",
        type: "uuid",
        meta: {
            special: null,
            interface: "social-preview",
            options: {
                provider: 'twitter'
            },
            sort: 8,
            width: "full",
            note: null,
            conditions: [
                {
                    name: "social_twitter",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "twitter",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "",
    },
    {
        field: "twitter_title",
        type: "string",
        schema: {
            name: "twitter_title",
        },
        meta: {
            field: "twitter_title",
            special: null,
            interface: "input",
            options: null,
            sort: 9,
            width: "full",
            translations: null,
            note: null,
            conditions: [
                {
                    name: "social_twitter",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "twitter",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            required: false,
            group: "social_sharing_right",
        },
        name: "Twitter Title",
    },
    {
        field: "twitter_description",
        type: "string",
        meta: {
            field: "twitter_description",
            interface: "input",
            sort: 10,
            conditions: [
                {
                    name: "social_twitter",
                    rule: {
                        _and: [
                            {
                                social_sharing_tab: {
                                    _neq: "twitter",
                                },
                            },
                        ],
                    },
                    hidden: true,
                    options: {
                        font: "sans-serif",
                        trim: false,
                        masked: false,
                        clear: false,
                        slug: false,
                    },
                },
            ],
            group: "social_sharing_right",
        },
        name: "Twitter Description",
    },
    {
        field: "site_connections",
        type: "alias",
        schema: null,
        meta: {
            field: "site_connections",
            special: ["alias", "no-data", "group"],
            interface: "group-section",
            options: null,
            sort: 999,
            width: "full",
        },
        name: "Site Connections",
    },
    {
        field: "site_connection_left",
        type: "alias",
        schema: null,
        meta: {
            field: "site_connection_left",
            special: ["alias", "no-data", "group"],
            interface: "group-column",
            options: null,
            sort: 1,
            width: "full",
            group: "site_connections",
        },
        name: "Site Connection Left",
    },
    {
        field: "site_connection_title",
        type: "alias",
        schema: null,
        meta: {
            field: "site_connection_title",
            special: ["alias", "no-data"],
            interface: "presentation-info",
            options: {
                title: "Site connections",
            },
            sort: 1,
            width: "full",
            translations: null,
            note: "Verify your site with different tools. This will add a verification meta tag to your homepage.",
            conditions: null,
            required: false,
            group: "site_connection_left",
        },
        name: "Site Connection Title",
    },
    {
        field: "site_connection_right",
        type: "alias",
        schema: null,
        meta: {
            field: "site_connection_right",
            special: ["alias", "no-data", "group"],
            interface: "group-column",
            options: null,
            sort: 2,
            width: "full",
            group: "site_connections",
        },
        name: "Site Connection Right",
    },
    {
        field: "google_verification_code",
        type: "string",
        schema: {
            name: "google_verification_code",
        },
        meta: {
            field: "google_verification_code",
            special: null,
            interface: "input",
            options: {
                placeholder: "Add verification code",
            },
            sort: 1,
            width: "full",
            translations: null,
            note: "Get your verification code in [Google Search console](https://search.google.com/search-console/).",
            conditions: null,
            required: false,
            group: "site_connection_right",
        },
        name: "Google Verification Code",
    },
    {
        field: "bing_verification_code",
        type: "string",
        schema: {
            name: "bing_verification_code",
        },
        meta: {
            field: "bing_verification_code",
            special: null,
            interface: "input",
            options: {
                placeholder: "Add verification code",
            },
            sort: 2,
            width: "full",
            translations: null,
            note: "Get your verification code in [Bing Webmaster Tools](https://www.bing.com/webmasters/about).",
            conditions: null,
            required: false,
            group: "site_connection_right",
        },
        name: "Bing Verification Code",
    },
    {
        field: "pinterest_verification_code",
        type: "string",
        schema: {
            name: "pinterest_verification_code",
        },
        meta: {
            field: "pinterest_verification_code",
            special: null,
            interface: "input",
            options: {
                placeholder: "Add verification code",
            },
            sort: 3,
            width: "full",
            translations: null,
            note: "Claim your site over at Pinterest.",
            conditions: null,
            required: false,
            group: "site_connection_right",
        },
        name: "Pinterest Verification Code",
    },
    {
        field: "yandex_verification_code",
        type: "string",
        schema: {
            name: "yandex_verification_code",
        },
        meta: {
            field: "yandex_verification_code",
            special: null,
            interface: "input",
            options: {
                placeholder: "Add verification code",
            },
            sort: 4,
            width: "full",
            translations: null,
            note: "Get your verification code in [Yandex Webmaster tools](https://webmaster.yandex.com/).",
            conditions: null,
            required: false,
            group: "site_connection_right",
        },
        name: "Yandex Verification Code",
    },
    {
        field: "baidu_verification_code",
        type: "string",
        schema: {
            name: "baidu_verification_code",
        },
        meta: {
            field: "baidu_verification_code",
            special: null,
            interface: "input",
            options: {
                placeholder: "Add verification code",
            },
            sort: 5,
            width: "full",
            translations: null,
            note: "Get your verification code in [Baidu Webmaster tools](https://ziyuan.baidu.com/login/index?u=/site/siteadd).",
            conditions: null,
            required: false,
            group: "site_connection_right",
        },
        name: "Baidu Verification Code",
    },
];
