execute as @a at @s if block ~ ~ ~ bed unless entity @e[type=thebrokenscript:bed,r=25] run summon thebrokenscript:bed ~ ~ ~
execute as @a at @s if block ~ ~ ~ bed if entity @e[type=thebrokenscript:bed,rm=25] run kill @e[type=thebrokenscript:bed]
scoreboard players random @a[tag=!safe] bed_grief 1 200005
execute as @a[scores={bed_grief=5999}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run setblock ~1 ~ ~2 thebrokenscript:block3
execute as @a[scores={bed_grief=5998}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run setblock ~1 ~ ~2 lava
execute as @a[scores={bed_grief=5997}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run summon tnt ~1 ~ ~2
execute as @a[scores={bed_grief=5996}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run summon thebrokenscript:null_invadebase ~1 ~ ~2
execute as @a[scores={bed_grief=5995}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run setblock ~1 ~ ~2 thebrokenscript:all_dead
execute as @a[scores={bed_grief=5994}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run setblock ~1 ~ ~2 thebrokenscript:empty
execute as @a[scores={bed_grief=5993}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run setblock ~1 ~ ~2 netherrack
execute as @a[scores={bed_grief=5992}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run setblock ~1 ~ ~2 redstone_torch
execute as @a[scores={bed_grief=5991}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run setblock ~1 ~ ~2 water
execute as @a[scores={bed_grief=5990}] at @s as @e[type=thebrokenscript:bed,c=1] at @s run structure load obfuscatedsign ~1 ~ ~2
