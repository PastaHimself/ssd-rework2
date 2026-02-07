#dod, Despawn On Death
execute as @e[family=dod] at @s run tag @a[r=4] add dod
execute as @a[tag=dod] at @s if entity @e[type=thebrokenscript:bed,r=3] run scoreboard players set @e[family=despawn,scores={despawn=..87}] despawn 88
execute as @a[tag=dod] at @s if entity @e[type=thebrokenscript:bed,r=3] run title @s title clear
execute as @a[tag=dod] at @s if entity @e[type=thebrokenscript:bed,r=3] run tag @a[tag=dod] remove dod