execute as @e[family=circuit,tag=!chase] at @s if entity @a[r=25] run playsound circuit_chase @a
execute as @e[family=circuit,tag=!chase] at @s if entity @a[r=25] run playsound circuit_jumpscare @a
execute as @e[family=circuit] at @s as @a[r=25] run function textvhs
execute as @e[family=circuit] at @s run title @a[r=35,rm=26] title clear
execute as @e[family=circuit] at @s if entity @a[r=6] run camerashake add @a 1 0.05 rotational
execute as @e[family=circuit,tag=!chase] at @s if entity @a[r=25] run tag @s add chase
execute as @e[family=circuit,tag=chase] at @s unless entity @a[r=25] run tag @s remove chase
execute as @e[type=thebrokenscript:circuit] at @s as @a[r=3] run function kick
execute as @e[type=thebrokenscript:circuit_cave] at @s as @a[r=3] run function kick
execute as @e[type=thebrokenscript:circuit_cave] at @s as @a[r=3] run kill @a
execute as @e[type=thebrokenscript:circuit] at @s as @a[r=3] run kill @a