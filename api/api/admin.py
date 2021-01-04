from django.contrib import admin
from .models import (
    mUser,
    Week,
    mSetting,
    Category,
    mUserCategoryRelation,
    CategoryMemberShip,
    Task,
    SubTask,
    Label,
    Karma,
)

admin.site.register(mUser)
admin.site.register(Week)
admin.site.register(mSetting)
admin.site.register(Category)
admin.site.register(mUserCategoryRelation)
admin.site.register(CategoryMemberShip)
admin.site.register(Task)
admin.site.register(SubTask)
admin.site.register(Label)
admin.site.register(Karma)
