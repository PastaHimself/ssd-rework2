scoreboard players random @s screen 1 20
title @s[scores={screen=1}] title textvhs
title @s[scores={screen=2}] title textvhs2
title @s[scores={screen=3}] title red
execute as @s[scores={screen=5}] run time set day
execute as @s[scores={screen=6}] run time set midnight
execute as @s[scores={screen=7}] at @s run tp ~~~ facing @e[family=circuit,c=1]
title @s[scores={screen=8}] title blick
gamemode survival @a[m=creative]
tag @a add ui_fix