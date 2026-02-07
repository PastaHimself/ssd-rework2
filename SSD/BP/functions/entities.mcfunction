execute as @e[family=entity,tag=!spawn] at @s run playsound ambient.cave @a
execute as @e[family=entity,tag=!spawn] at @s run tellraw @a[r=32,tag=!acvmnt_hia] {"rawtext":[{"selector":"*"},{"text":" has made the achievement §2[Here i am]"}]}
execute as @e[family=entity,tag=!spawn] at @s run tag @a[r=32] add acvmnt_hia
execute as @e[family=entity,tag=!spawn] at @s run tag @s add spawn
execute as @a[scores={tick=19}] at @s run scoreboard players add @e[family=despawn] despawn 1
execute as @a at @s run tp @e[family=despawn,scores={despawn=90..}] ~ -100~
execute as @a at @s if entity @e[family=despawn,scores={despawn=89..}] run title @s clear
kill @e[family=despawn,scores={despawn=95..}]
execute as @e[type=thebrokenscript:sub_anomaly] at @s run fill ~2~-1~2 ~-2~-1~-2 cobblestone replace water
execute as @e[type=thebrokenscript:null_chase] at @s run fill ~2~-1~2 ~-2~-1~-2 mossy_cobblestone replace water
execute as @e[type=thebrokenscript:circuit] at @s run fill ~2~-1~2 ~-2~-1~-2 cobblestone replace water
execute as @e[type=thebrokenscript:deprivation] at @s run fill ~2~-1~2 ~-2~-1~-2 cobblestone replace water
execute as @e[type=thebrokenscript:silouet] at @s run fill ~2~-1~2 ~-2~-1~-2 cobblestone replace water
execute as @e[type=thebrokenscript:thebrokenendoverhaul] at @s run fill ~2~-1~2 ~-2~-1~-2 cobblestone replace water
execute as @e[type=thebrokenscript:circuit_stalk] at @s run fill ~2~-1~2 ~-2~-1~-2 cobblestone replace water
execute as @e[type=thebrokenscript:circuit_cave] at @s run fill ~2~-1~2 ~-2~-1~-2 cobblestone replace water
execute as @e[type=thebrokenscript:circuit_cave_stalk] at @s run fill ~2~-1~2 ~-2~-1~-2 cobblestone replace water
execute as @e[type=thebrokenscript:sub_anomaly] at @s run damage @e[r=6,type=! thebrokenscript:sub_anomaly] 1 void
execute as @e[type=thebrokenscript:null_chase] at @s run damage @e[r=20,type=! thebrokenscript:null_chase] 1 void
execute as @e[type=thebrokenscript:he] at @s run weather rain
playanimation @e[type=thebrokenscript:silouet] animation.error5.idle x 10
execute as @e[family=entity] at @s unless entity @a[r=70] run tp ~ -100 ~
execute as @e[family=entity] at @s unless entity @a[r=120] run kill @s
execute as @e[type=thebrokenscript:null_miner] at @s run fill ^^1.5^1 ^^^1 air destroy
execute as @e[type=thebrokenscript:ram2die] at @s if entity @a[r=7] run summon thebrokenscript:null_is_here ~~~
execute as @e[type=thebrokenscript:ram2die] at @s if entity @a[r=7] run kill @s
