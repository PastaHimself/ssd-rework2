execute as @e[type=thebrokenscript:null_invadebase] at @s if entity @a[r=7.5] run title @a[r=7.5] title wecanhearyou
execute as @e[type=thebrokenscript:null_invadebase] at @s run tag @a[r=7.5] add ui_fix
execute as @e[type=thebrokenscript:null_invadebase] at @s if entity @a[r=7.5] run playsound ded @a[r=7.5]
execute as @e[type=thebrokenscript:null_invadebase] at @s if entity @a[r=7.5] run kill @s
tag @a add ui_fix