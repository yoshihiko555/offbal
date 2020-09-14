class Const {
    CATEGORY_COLOR = [
        { color: 'grey',    code: '#607D8B' },
        { color: 'red',     code: '#F44336' },
        { color: 'blue',    code: '#2196F3' },
        { color: 'green',   code: '#009688' },
        { color: 'yellow',  code: '#FFD600' },
    ]

    ACTIVE_COLOR = 'red accent-4'

    NON_ACTIVE_COLOR = 'grey lighten-1'

    SIDEBAR_MENU = [
        {
            title: 'Inbox',
            icon: 'mdi-inbox',
            isNest: false,
            route: 'Inbox',
        },
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
        {
            title: 'Favorite',
            icon: 'mdi-star',
            isNest: false,
            route: 'DetailCategory',
        },
        {
            title: 'Category',
            icon: 'mdi-format-list-checkbox',
            isNest: true,
            route: 'DetailCategory',
        },
        {
            title: 'Label',
            icon: 'mdi-label-multiple-outline',
            isNest: true,
            route: 'Labels',
        },
        {
            title: 'Activity',
            icon: 'mdi-bell-ring',
            isNest: false,
            route: 'Activitys',
        },
    ]

    DEFAULT_CATEGORY_MSG = {
    		1: 'あなたの仕事を管理しましょう',
    		2: '睡眠の質をあげましょう',
    		3: '家族を大切にしましょう',
    		4: '体を動かしましょう',
    		5: '親しき中にも礼儀あり',
    		6: 'ドキドキしましょう',
    		7: '健康的な生活を目指しましょう',
    		8: '熱中できる趣味を探しましょう',
    }
}

export { Const }
