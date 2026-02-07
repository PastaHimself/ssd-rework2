
scoreboard players random @a null_spawn 1 8000
execute as @a[scores={null_spawn=1}] at @s run summon thebrokenscript:null_spawner ~~5~
execute as @a[scores={null_spawn=1}] at @s run playsound normalambienceevent @a
execute as @a[scores={null_spawn=1}] at @s run spreadplayers ~ ~ 1 50 @e[type=thebrokenscript:null_spawner,r=10]
execute as @e[type=thebrokenscript:null_spawner] at @s run summon thebrokenscript:null mobismissingID ~~25~
kill @e[type=thebrokenscript:null_spawner] 