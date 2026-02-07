execute as @e[type=thebrokenscript:deceiver] at @s if entity @a[r=5] run scoreboard players random @s dec 1 4
execute as @e[type=thebrokenscript:deceiver,scores={dec=1}] at @s run summon thebrokenscript:circuit
execute as @e[type=thebrokenscript:deceiver,scores={dec=1}] at @s run effect @s invisibility 20000000
execute as @e[type=thebrokenscript:deceiver,scores={dec=1}] at @s run function gmsurvival
execute as @e[type=thebrokenscript:deceiver,scores={dec=2}] at @s run summon thebrokenscript:circuit
execute as @e[type=thebrokenscript:deceiver,scores={dec=2}] at @s run effect @s invisibility 20000000
execute as @e[type=thebrokenscript:deceiver,scores={dec=2}] at @s run function gmsurvival
execute as @e[type=thebrokenscript:deceiver,scores={dec=3}] at @s run playsound silence @a
execute as @e[type=thebrokenscript:deceiver,scores={dec=4}] at @s run playsound silence @a
execute as @e[type=thebrokenscript:deceiver,scores={dec=4}] at @s run effect @s invisibility 20000000
execute as @e[type=thebrokenscript:deceiver] at @s run scriptevent thebrokenscript:copy_inventory

