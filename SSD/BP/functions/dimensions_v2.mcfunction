#generation
tag @e[family=gen] add gen
execute as @e[type=thebrokenscript:cv_n,tag=gen] at @s run structure load cv_n ~-8 ~-1 ~-16
execute as @e[type=thebrokenscript:cv_s,tag=gen] at @s run structure load cv_s ~-7 ~-1 ~1
execute as @e[type=thebrokenscript:cv_e,tag=gen] at @s run structure load cv_e ~1 ~-1 ~-8
execute as @e[type=thebrokenscript:cv_w,tag=gen] at @s run structure load cv_w ~-16 ~-1 ~-8
execute as @e[type=thebrokenscript:da_n,tag=gen] at @s run structure load da_n ~-8 ~-1 ~-16
execute as @e[type=thebrokenscript:da_s,tag=gen] at @s run structure load da_s ~-7 ~-1 ~1
execute as @e[type=thebrokenscript:da_e,tag=gen] at @s run structure load da_e ~1 ~-1 ~-8
execute as @e[type=thebrokenscript:da_w,tag=gen] at @s run structure load da_w ~-16 ~-1 ~-8

scoreboard players random @e[type=thebrokenscript:clan_void] room 1 8
execute as @e[type=thebrokenscript:clan_void,scores={room=1}] at @s run structure load crafting_room ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:clan_void,scores={room=2}] at @s run structure load empty_room ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:clan_void,scores={room=3}] at @s run structure load hub_room ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:clan_void,scores={room=4}] at @s run structure load exit_room ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:clan_void,scores={room=5}] at @s run structure load fournace_room ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:clan_void,scores={room=6}] at @s run structure load music_room ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:clan_void,scores={room=7}] at @s run structure load stone_room ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:clan_void,scores={room=8}] at @s run structure load storage_room ~-8 ~-1 ~-8

scoreboard players random @e[type=thebrokenscript:daya] room 1 4
execute as @e[type=thebrokenscript:daya,scores={room=1}] at @s if block ~ ~ ~ air run structure load dayA_a ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:daya,scores={room=2}] at @s if block ~ ~ ~ air run structure load dayA_b ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:daya,scores={room=3}] at @s if block ~ ~ ~ air run structure load dayA_c ~-8 ~-1 ~-8
execute as @e[type=thebrokenscript:daya,scores={room=4}] at @s if block ~ ~ ~ air run structure load dayA_d ~-8 ~-1 ~-8

kill @e[family=gen,tag=gen]

#music
scoreboard players add @a[tag=enter,scores={music=1..}] music -1
playsound nulldementionambient @a[scores={music=920}]
scoreboard players set @a[tag=enter,scores={music=0}] music 920

#GET OUT (of the dimension)
scoreboard players add @a[tag=enter,scores={limit=1..}] limit -1
execute as @a[scores={limit=1}] at @s run function exit
execute as @a at @s if block ~ ~ ~ thebrokenscript:white run function exit

#get in
execute as @a at @s if block ~ ~ ~ thebrokenscript:all_dead run function clan_void_enter 
execute as @a at @s if block ~ ~ ~ thebrokenscript:empty run function null_torture_enter
execute as @a at @s if entity @e[type=thebrokenscript:error1,r=3] run function daya_enter