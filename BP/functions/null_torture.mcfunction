scoreboard players random @e[family=nt,tag=!out] room 2 4
scoreboard players random @e[family=nt,tag=out] room 1 4
execute as @e[type=thebrokenscript:null_torture_gen] at @s run tag @e[family=nt,rm=130] add out
execute as @e[type=thebrokenscript:nt_n,scores={room=2..}] at @s run structure load nt ~-5~-2~-16
execute as @e[type=thebrokenscript:nt_s,scores={room=2..}] at @s run structure load nt ~-5~-2~16
execute as @e[type=thebrokenscript:nt_n,scores={room=1}] at @s if entity @s[scores={dead_end=1}] run structure load nt_dead_end ~-5~-2~-16
execute as @e[type=thebrokenscript:nt_s,scores={room=1}] at @s if entity @s[scores={dead_end=1}] run structure load nt_dead_end ~-5~-2~16
execute as @e[type=thebrokenscript:nt_n,scores={room=1}] at @s if entity @s[scores={dead_end=2}] run structure load nt_exit ~-5~-2~-16
execute as @e[type=thebrokenscript:nt_s,scores={room=1}] at @s if entity @s[scores={dead_end=2}] run structure load nt_exit ~-5~-2~16
execute as @e[type=thebrokenscript:nt_n] at @s run tp ~~~-16
execute as @e[type=thebrokenscript:nt_s] at @s run tp ~~~16