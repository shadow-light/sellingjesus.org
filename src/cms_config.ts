
import type {CmsConfig, CmsField, CmsCollectionFile} from 'netlify-cms-core'

import {people} from './people.json'
import {objection_categories} from '../settings.json'
import {categories as resource_categories} from './learn/resources.json'


// Authors (add additional combos that won't show a profile at bottom of article)
const authors = [
    ...people.map(p => p.name),
    "Conley Owens & Andrew Case",
    "Conley Owens & Jon Here",
    "Andrew Case & Jon Here",
    "Conley Owens, Andrew Case, Jon Here",
]


// Common fields
const field_title:CmsField = {
    name: 'title',
    label: "Title",
    widget: 'string',
}
const field_desc:CmsField = {
    name: 'description',
    label: "Description",
    widget: 'text',
    hint: "This will appear in lists and search engine results and should usually be less than 150 characters.",
}
const field_file:CmsField = {
    name: 'file',
    label: "File",
    widget: 'file',
    allow_multiple: false,
    choose_url: false,
}
const field_image:CmsField = {
    name: 'image',
    label: "Image",
    widget: 'image',
    allow_multiple: false,
    choose_url: false,
}
const field_date:CmsField = {
    name: 'date',
    label: "Date",
    widget: 'datetime',
    time_format: false,
}
const field_body:CmsField = {
    name: 'body',
    label: "Content",
    widget: 'markdown',
}


// Other common things
const conversation_fields:CmsCollectionFile['fields'] = [
    {name: 'intro', label: "Introduction", widget: 'markdown', required: false},
    {
        name: 'topics',
        label: "Topics",
        label_singular: "Topic",
        widget: 'list',
        fields: [
            {name: 'heading', label: "Heading", widget: 'string'},
            {name: 'description', label: "Description", widget: 'markdown', required: false},
            {name: 'podcast', label: "Podcast episode", widget: 'string', required: false},
            {name: 'messages', label: "Messages", widget: 'markdown',
                hint: "New lines start new messages alternating between people"},
        ],
    },
]


export const cms_config:CmsConfig = {
    backend: {
        name: import.meta.env.DEV ? 'test-repo' : 'gitlab',
        repo: 'selling-jesus/sellingjesus.org',
        auth_type: 'pkce',
        app_id: 'a205c9787587e6ee85d6b4fe9d36cd2c06a1befc36963c5366c7b6978e08fd65',
    },
    media_folder: 'src/_public/media',
    public_folder: '/media',
    site_url: 'https://sellingjesus.org',
    logo_url: '/_assets/icon.png',
    collections: [
        {
            name: 'settings',
            label: "Settings",
            editor: {preview: false},
            files: [
                {
                    name: 'site_settings',
                    label: "Site-wide settings",
                    file: 'settings.json',
                    fields: [
                        {
                            name: 'trigger',
                            label: "Trigger update",
                            widget: 'boolean',
                            hint: "Change this on/off to trigger an update of the site (such as updating the list of episodes)",
                        },
                        field_desc,
                        {
                            name: 'youtube_playlist_doc',
                            label: "YouTube documentaries playlist ID",
                            widget: 'string',
                            hint: 'Get this from the URL of the "View full playlist" page',
                        },
                        {
                            name: 'youtube_playlist_humor',
                            label: "YouTube humor playlist ID",
                            widget: 'string',
                            hint: 'Get this from the URL of the "View full playlist" page',
                        },
                        {
                            name: 'youtube_playlist_reactions',
                            label: "YouTube reactions playlist ID",
                            widget: 'string',
                            hint: 'Get this from the URL of the "View full playlist" page',
                        },
                        {
                            name: 'spotify_show',
                            label: "Spotify podcast ID",
                            widget: 'string',
                            hint: "Get this from the URL when viewing a podcast's homepage",
                        },
                        {
                            name: 'objection_categories',
                            label: "Objection categories",
                            widget: 'list',
                        },
                    ],
                },
                {
                    name: 'people',
                    label: "Biographies",
                    file: 'src/people.json',
                    fields: [
                        {
                            name: 'people',
                            label: "People",
                            label_singular: "Person",
                            widget: 'list',
                            fields: [
                                {name: 'name', label: "Name", widget: 'string'},
                                {name: 'title', label: "Title", widget: 'string'},
                                {name: 'degrees', label: "Degrees", widget: 'string', required: false},
                                {name: 'site', label: "Website", widget: 'string', required: false},
                                {name: 'bio', label: "Bio", widget: 'text'},
                                {name: 'quote', label: "Quote", widget: 'text', required: false},
                                {
                                    ...field_image,
                                    media_folder: '/src/_public/media/people',
                                    public_folder: '/media/people',
                                    default: '/_assets/defaults/person.webp',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: 'pages',
            label: "Special pages",
            editor: {preview: false},
            files: [

                {
                    name: 'about',
                    label: "About",
                    file: 'src/about.md',
                    preview_path: '/about',
                    fields: [
                        field_body,
                    ],
                },
                {
                    name: 'beliefs',
                    label: "Statement of Faith",
                    file: 'src/about/beliefs.md',
                    preview_path: '/about/beliefs',
                    fields: [
                        field_body,
                    ],
                },
                {
                    name: 'act',
                    label: "Take Action",
                    file: 'src/act.md',
                    preview_path: '/act',
                    fields: [
                        field_body,
                    ],
                },

                {
                    name: 'podcast',
                    label: "Podcast",
                    file: 'src/podcast.json',
                    preview_path: '/podcast',
                    fields: [
                        {
                            name: 'episodes',
                            label: "Episodes",
                            label_singular: "Episode",
                            widget: 'list',
                            summary: '{{fields.title}}',
                            fields: [
                                {name: 'id', label: "Spotify ID", widget: 'string', hint: "Get from URL of podcast episode", required: true},
                                {name: 'title', label: "Title", widget: 'string', required: true},
                                {name: 'description_md', label: "Override description", widget: 'markdown', required: false},
                                {name: 'transcript_md', label: "Transcript", widget: 'markdown', required: false},
                            ],
                        },
                    ],
                },

                {
                    name: 'conversations',
                    label: "Conversations about Selling Jesus",
                    file: 'src/learn/conversations.json',
                    preview_path: '/learn/conversations',
                    fields: conversation_fields,
                },
                {
                    name: 'corinthians',
                    label: "Conversations between Paul and the Corinthians",
                    file: 'src/learn/corinthians.json',
                    preview_path: '/learn/corinthians',
                    fields: conversation_fields,
                },
                {
                    name: 'profiles',
                    label: "Christians Who Sell Jesus",
                    file: 'src/learn/profiles.md',
                    preview_path: '/learn/profiles',
                    fields: [
                        field_body,
                    ],
                },
                {
                    name: 'objections',
                    label: "Objections",
                    file: 'src/learn/objections.md',
                    preview_path: '/learn/objections',
                    fields: [
                        field_body,
                    ],
                },
                {
                    name: 'resources',
                    label: "Books and Other Resources",
                    file: 'src/learn/resources.json',
                    preview_path: '/learn/resources',
                    fields: [
                        {
                            name: 'categories',
                            label: "Categories",
                            label_singular: "Category",
                            widget: 'list',
                            fields: [
                                {name: 'category', label: "Category", widget: 'string'},
                                {
                                    name: 'resources',
                                    label: "Resources",
                                    label_singular: "Resource",
                                    widget: 'list',
                                    fields: [
                                        {name: 'title', label: "Title", widget: 'string'},
                                        {name: 'authors', label: "Author(s)", widget: 'string'},
                                        {name: 'description', label: "Description", widget: 'markdown'},
                                        {name: 'paywall', label: "Paywall", widget: 'boolean'},
                                        {
                                            ...field_image,
                                            media_folder: '/src/_public/media/resources',
                                            public_folder: '/media/resources',
                                            default: '/_assets/defaults/resource.jpg',
                                        },
                                        {...field_file, label: "Link", choose_url: true},
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ]
        },
        {
            name: 'articles',
            label: "Articles",
            label_singular: "Article",
            editor: {preview: false},
            folder: 'src/articles',
            preview_path: 'articles/{{slug}}',
            create: true,
            fields: [
                field_title,
                field_desc,
                {name: 'category', label: "Category", widget: 'select',
                    options: ["Theology", "Specific Passages", "Application", "Licensing & Copyright", "Specific Ministries", "History", "Responses"],
                },
                {
                    name: 'author',
                    label: 'Author',
                    widget: 'select',
                    options: authors,
                },
                field_date,
                // WARN Must be absolute to be relative to repo base and not collection's dir
                {
                    ...field_image,
                    required: false,
                    media_folder: '/src/_public/media/articles',
                    public_folder: '/media/articles',
                },
                field_body,
            ],
        },
    ],
}
