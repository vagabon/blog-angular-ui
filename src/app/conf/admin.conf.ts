import { ADMIN_COL, ADMIN_INPUT, ADMIN_PROFILE, ADMIN_USER, AdminTabConfDto } from '@ng-vagabond-lab/ng-dsv/modules/admin';

export const AdminConf: AdminTabConfDto = {
    max: 10,
    tabs: [
        ...ADMIN_USER,
        ...ADMIN_PROFILE,
        {
            name: 'blog',
            label: 'BLOG:TITLE',
            findByChamps: 'title%And|description%',
            sortBy: 'creationDate',
            sortByAsc: 'desc',
            cells: [
                { label: 'FIELDS.ID', name: 'id', width: '70px', order: true },
                { label: 'NEWS:FIELDS.TITLE', name: 'title', order: true },
                { label: 'NEWS:FIELDS.USER', name: 'user.username', order: false },
                ...ADMIN_COL,
            ],
            form: [
                { label: 'NEWS:FIELDS.TITLE', name: 'title', type: 'text', required: true },
                { label: 'NEWS:FIELDS.AVATAR', name: 'avatar', type: 'upload', required: false },
                { label: 'NEWS:FIELDS.IMAGE', name: 'image', type: 'upload', required: false },
                { label: 'NEWS:FIELDS.RESUME', name: 'resume', type: 'textarea5', required: true },
                { label: 'NEWS:FIELDS.DESCRIPTION', name: 'description', type: 'textarea', required: true },
                { label: 'NEWS:FIELDS.TAGS', name: 'tags', type: 'text', required: true },
                { label: 'NEWS:FIELDS.USER', name: 'user', type: 'select', listId: true, required: true, listEndPoint: '/user/', listName: 'username' },
                ...ADMIN_INPUT,
            ],
        },
    ],
}