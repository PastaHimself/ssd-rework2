execute as @e[type=thebrokenscript:silouet] at @s if entity @a[r=5] run scoreboard players random @s silouet 1 2
execute as @e[type=thebrokenscript:silouet,scores={silouet=1}] at @s run title @a[r=7] title cantyousee
execute as @e[type=thebrokenscript:silouet,scores={silouet=1}] at @s run tag @a[r=7] add ui_fix
execute as @e[type=thebrokenscript:silouet,scores={silouet=1}] at @s run playsound ded @a[r=7]
execute as @e[type=thebrokenscript:silouet,scores={silouet=1}] at @s run playsound ded @a[r=7]
execute as @e[type=thebrokenscript:silouet,scores={silouet=1}] at @s run playsound ded @a[r=7]
execute as @e[type=thebrokenscript:silouet,scores={silouet=1}] at @s run playsound ded @a[r=7]
execute as @e[type=thebrokenscript:silouet,scores={silouet=1}] at @s run playsound ded @a[r=7]
kill @e[type=thebrokenscript:silouet,scores={silouet=1}]
execute as @e[type=thebrokenscript:silouet,scores={silouet=2},tag=!chase] at @s as @a[r=7] at @s run summon lightning_bolt ~~~
execute as @e[type=thebrokenscript:silouet,scores={silouet=2},tag=!chase] at @s run playsound nullchase_1 @a[r=20]
execute as @e[type=thebrokenscript:silouet,scores={silouet=2}] at @s run tag @s add chase
execute as @e[type=thebrokenscript:silouet,scores={silouet=2}] at @s run function gmsurvival
execute as @e[type=thebrokenscript:silouet,scores={silouet=2},tag=!chase] at @s run function gmsurvival
execute as @e[type=thebrokenscript:silouet,tag=chase] at @s run effect @s speed 1 2 true