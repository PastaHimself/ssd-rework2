execute as @e[type=thebrokenscript:faraway] at @s if entity @a[r=15] run title @a[r=12] title sn_ek
execute as @e[type=thebrokenscript:faraway] at @s run tag @a[r=12] add ui_fix
execute as @e[type=thebrokenscript:faraway] at @s if entity @a[r=15] run playsound randommassjumpscare @a ~~~ 12 1
execute as @e[type=thebrokenscript:faraway] at @s if entity @a[r=15] run kill @s