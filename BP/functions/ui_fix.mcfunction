scoreboard players set @a[tag=ui_fix] ui_fix 100
tag @a[scores={ui_fix=100}] remove ui_fix
scoreboard players add @a[scores={ui_fix=1..}] ui_fix -1
title @a[scores={ui_fix=1}] title clear