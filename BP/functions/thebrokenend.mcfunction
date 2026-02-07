scoreboard players set @e[type=thebrokenscript:thebrokenendoverhaul,tag=!tbe] chase 0
execute as @e[type=thebrokenscript:thebrokenendoverhaul,tag=!tbe] at @s run playsound thebrokenendishere @a
execute as @e[type=thebrokenscript:thebrokenendoverhaul,tag=!tbe] at @s run playsound glitchroar @a
execute as @e[type=thebrokenscript:thebrokenendoverhaul,tag=!tbe] at @s run function gmsurvival
execute as @e[type=thebrokenscript:thebrokenendoverhaul,tag=!tbe] at @s run effect @a darkness 50
execute as @e[type=thebrokenscript:thebrokenendoverhaul,tag=!tbe] at @s run effect @a mining_fatigue 50 3
tag @e[type=thebrokenscript:thebrokenendoverhaul,tag=!tbe] add tbe
execute as @e[type=thebrokenscript:thebrokenendoverhaul,scores={chase=0}] at @s run playsound glitchroar @a
scoreboard players set @e[type=thebrokenscript:thebrokenendoverhaul,scores={chase=0}] chase 100
scoreboard players add @e[type=thebrokenscript:thebrokenendoverhaul,scores={chase=1..}] chase -1
execute as @e[type=thebrokenscript:thebrokenendoverhaul] at @s as @a[r=32] at @s run function tbe_frame
execute as @e[type=thebrokenscript:thebrokenendoverhaul] at @s run title @a[rm=32,r=40] clear 
execute as @e[type=thebrokenscript:thebrokenendoverhaul] at @s as @a[r=3] run function kick