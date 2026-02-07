execute as @e[type=thebrokenscript:null_ground_scare] at @s run tellraw @a {"rawtext":[{"text":"§4§kVOIDNULLSILUETTANIMALY"}]}
execute as @e[type=thebrokenscript:null_ground_scare] at @s run tellraw @a {"rawtext":[{"text":"§4§lHERE I AM"}]}
execute as @e[type=thebrokenscript:null_ground_scare] at @s run playsound thebrokenendishere @a
execute as @e[type=thebrokenscript:null_ground_scare,scores={despawn=60..}] at @s run kill @s
scoreboard players add @e[type=thebrokenscript:null_ground_scare] despawn 1
execute as @e[type=thebrokenscript:null_ground_scare,scores={despawn=59}] at @s as @a[r=3] run function kick