execute as @e[type=thebrokenscript:sub_anomaly] at @s if entity @a[r=40] run scoreboard players random @s particle 1 20
execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=1}] at @s run particle thebrokenscript:black_void ~3~1.5~3
execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=2}] at @s run particle thebrokenscript:black_void ~-3~0.5~3

execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=3}] at @s run particle thebrokenscript:black_void ~-3~0.5~-3
execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=4}] at @s run particle thebrokenscript:black_void ~3~3.5~-3
execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=5}] at @s run particle thebrokenscript:black_void ~~1.5~3
execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=6}] at @s run particle thebrokenscript:black_void ~~1.5~-3
execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=7}] at @s run particle thebrokenscript:black_void ~-1~2.5~2
execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=8}] at @s run particle thebrokenscript:black_void ~2~1.5~
execute as @e[type=thebrokenscript:sub_anomaly,scores={particle=9}] at @s run particle thebrokenscript:black_void ~1~3.5~

execute as @e[type=thebrokenscript:null_is_here] at @s run scoreboard players random @s particle 1 20
execute as @e[type=thebrokenscript:null_is_here,scores={particle=1}] at @s run particle thebrokenscript:black_void ~3~1.5~3
execute as @e[type=thebrokenscript:null_is_here,scores={particle=2}] at @s run particle thebrokenscript:black_void ~-3~0.5~3
execute as @e[type=thebrokenscript:null_is_here,scores={particle=3}] at @s run particle thebrokenscript:black_void ~-3~0.5~-3
execute as @e[type=thebrokenscript:null_is_here,scores={particle=4}] at @s run particle thebrokenscript:black_void ~3~3.5~-3
execute as @e[type=thebrokenscript:null_is_here,scores={particle=5}] at @s run particle thebrokenscript:black_void ~~1.5~3
execute as @e[type=thebrokenscript:null_is_here,scores={particle=6}] at @s run particle thebrokenscript:black_void ~~1.5~-3
execute as @e[type=thebrokenscript:null_is_here,scores={particle=7}] at @s run particle thebrokenscript:black_void ~-1~2.5~2
execute as @e[type=thebrokenscript:null_is_here,scores={particle=8}] at @s run particle thebrokenscript:black_void ~2~1.5~
execute as @e[type=thebrokenscript:null_is_here,scores={particle=9}] at @s run particle thebrokenscript:black_void ~1~3.5~


execute as @e[type=thebrokenscript:error1] at @s run scoreboard players random @s particle 1 20
execute as @e[type=thebrokenscript:error1,scores={particle=1}] at @s run particle thebrokenscript:follows_particle ~-3~0.5~3
execute as @e[type=thebrokenscript:error1,scores={particle=2}] at @s run particle thebrokenscript:follows_particle~3~3.5~-3
execute as @e[type=thebrokenscript:error1,scores={particle=3}] at @s run particle thebrokenscript:follows_particle ~-3~0.5~-3

