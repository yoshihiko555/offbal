class Const {
    CATEGORY_COLOR = [
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
        {
            id: 'other',
            name: 'その他',
            icon: 'bx-label',
            url: '/setting/other/',
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

    /**
     * 設定オプション
     */
    LANGUAGE_OPTIONS = [
        {
            label: 'English',
            value: 'english',
        },
        {
            label: 'French',
            value: 'french',
        },
        {
            label: 'German',
            value: 'german',
        },
        {
            label: '日本語',
            value: 'japanese',
        },
    ]

    START_PAGE_OPTIONS = [
        {
            label: '今日',
            value: 'today',
        },
        {
            label: '近日中',
            value: 'future-scheduled',
        },
    ]

    TIMEZONE_OPTIONS = [
        {
            label: '(UTC-08:00) Los Angeles',
            value: '(UTC-08:00) Los Angeles',
        },
        {
            label: '(UTC+09:00) Tokyo',
            value: '(UTC+09:00) Tokyo',
        },
    ]

    TIME_FORMAT_OPTIONS = [
        {
            label: '13:00',
            value: 0,
        },
        {
            label: '1:00 PM',
            value: 1,
        },
    ]

    WEEK_OPTIONS = [
        {
            label: '月曜日',
            value: 'Mon.',
        },
        {
            label: '火曜日',
            value: 'Tue.',
        },
        {
            label: '水曜日',
            value: 'Wed.',
        },
        {
            label: '木曜日',
            value: 'Thu.',
        },
        {
            label: '金曜日',
            value: 'Fri.',
        },
        {
            label: '土曜日',
            value: 'Sta.',
        },
        {
            label: '日曜日',
            value: 'Sun.',
        },
    ]

    FILTER_OPTION_PRIORITIES = [
        {
            name: '優先度5',
            value: 5,
            color: '#FF0000',
        },
        {
            name: '優先度4',
            value: 4,
            color: '#FF9933',
        },
        {
            name: '優先度3',
            value: 3,
            color: '#FFA500',
        },
        {
            name: '優先度2',
            value: 2,
            color: '#FFDAB9',
        },
        {
            name: '優先度1',
            value: 1,
            color: '#C0C0C0',
        },
    ]

    FILTER_OPTION_DEADLINES = [
        {
            name: '今日中',
            value: 1,
            color: '#FF0000',
        },
        {
            name: '明日まで',
            value: 2,
            color: '#FF9933',
        },
        {
            name: '3日以内',
            value: 3,
            color: '#FFA500',
        },
        {
            name: '1週間以内',
            value: 4,
            color: '#00BCD4',
        },
        {
            name: '今月中',
            value: 5,
            color: '#2196F3',
        },
    ]
}

export { Const }
