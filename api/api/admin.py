from django.contrib import admin
from .models import (
    mUser,
    Week,
    mSetting,
    Project,
    ProjectMemberShip,
    Section,
    Task,
    SubTask,
    Label,
    Karma,
)

admin.site.register(mUser)
admin.site.register(Week)
admin.site.register(mSetting)
admin.site.register(Project)
admin.site.register(ProjectMemberShip)
admin.site.register(Section)
admin.site.register(Task)
admin.site.register(SubTask)
admin.site.register(Label)
admin.site.register(Karma)
