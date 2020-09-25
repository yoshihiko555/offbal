class Const {
    CATEGORY_COLOR = [
        { color: 'grey',    code: '#607D8B' },
        { color: 'grey',    code: '#607D8B' },
        { color: 'red',     code: '#F44336' },
        { color: 'blue',    code: '#2196F3' },
        { color: 'green',   code: '#009688' },
        { color: 'yellow',  code: '#FFD600' },
        { color: 'cyan',    code: '#00BCD4' },
        { color: 'teal',    code: '#009688' },
        { color: 'orange',  code: '#FF9800' },
    ]

    ACTIVE_COLOR = 'red accent-4'

    NON_ACTIVE_COLOR = 'grey lighten-1'

    SIDEBAR_MENU = [
        {
            title: 'Today',
            icon: 'mdi-calendar-today',
            isNest: false,
            route: 'TodayScheduled',
        },
        {
            title: 'Coming soon',
            icon: 'mdi-calendar-month-outline',
            isNest: false,
            route: 'FutureScheduled',
        },
    ]

    SETTING_SIDEBAR_MENU = [
        {
            id: 'general',
            name: '一般',
            icon: 'bx-cog',
            url: '/setting',
        },
        {
            id: 'theme',
            name: 'テーマ',
            icon: 'bx-palette',
            url: '/setting/theme/',
        },
        {
            id: 'acount',
            name: 'アカウント',
            icon: 'bx-user',
            url: '/setting/acount/',
        },
        {
            id: 'karma',
            name: 'カルマ',
            icon: 'bx-droplet',
            url: '/setting/karma/',
        },
    ]

    VUETIFY_COLORS = {
        RED: '#F44336',
        INDIGO: '#3F51B5',
        BLUE: '#2196F3',
        LIGHT_BLUE: '#03A9F4',
        CYAN: '#00BCD4',
        TEAL: '#009688',
        GREEN: '#4CAF50',
        LIGHT_GREEN: '#8BC34A',
        AMBER: '#FFC107',
        ORANGE: '#FF9800',
        DEEP_ORANGE: '#FF5722',
    }

    WEEK = ['月', '火', '水', '木', '金', '土', '日']

    /**
     * タスク結果画面でのグラフ生成時の固定値設定
     */
    TODAY_TASK_POINT_CONFIG = {
        BACK_GROUND_COLOR: [
            this.VUETIFY_COLORS.TEAL,   // 今日の完了タスク数
        ]
    }

    TASK_STATUS_DATA_CONFIG = {
        BACK_GROUND_COLOR: [
            this.VUETIFY_COLORS.CYAN,   // 未完了
            this.VUETIFY_COLORS.INDIGO, // 完了
        ]
    }

    WEEK_TASK_POINT_CONFIG = {
        LABELS: this.WEEK,
        BACK_GROUND_COLOR: [
            this.VUETIFY_COLORS.DEEP_ORANGE,
            this.VUETIFY_COLORS.GREEN,
            this.VUETIFY_COLORS.LIGHT_BLUE,
            this.VUETIFY_COLORS.RED,
            this.VUETIFY_COLORS.TEAL,
            this.VUETIFY_COLORS.CYAN,
            this.VUETIFY_COLORS.AMBER,
        ]
    }

    CATEGORY_TASK_DATA_CONFIG = {
        BACK_GROUND_COLOR: [
            this.VUETIFY_COLORS.BLUE,
            this.VUETIFY_COLORS.DEEP_ORANGE,
            this.VUETIFY_COLORS.LIGHT_GREEN,
            this.VUETIFY_COLORS.RED,
            this.VUETIFY_COLORS.TEAL,
        ]
    }

    PRIORITY_TASK_DATA_CONFIG = {
        BACK_GROUND_COLOR: [
            this.VUETIFY_COLORS.RED,
            this.VUETIFY_COLORS.INDIGO,
            this.VUETIFY_COLORS.DEEP_ORANGE,
            this.VUETIFY_COLORS.GREEN,
            this.VUETIFY_COLORS.AMBER,
        ]
    }

    /**
     * カルマ結果画面でのグラフ生成時の固定値設定
     */
    KARMA_RANK_INFO_CONFIG = {
        BACK_GROUND_COLOR: [
            this.VUETIFY_COLORS.BLUE,
        ]
    }

    WEEK_KARMA_POINT_CONFIG = {
        LABELS: this.WEEK,
    }
}

export { Const }
