execute as @e[type=thebrokenscript:event] if score ram2die_join thebrokenscript:ram2die_join matches 0 at @s run summon thebrokenscript:ram2die xXram2dieXx
execute if score ram2die_join thebrokenscript:ram2die_join matches 0 run tellraw @a {"rawtext":[{"text":"Local game hosted on port [§200000§r]"}]}
execute if score ram2die_join thebrokenscript:ram2die_join matches 0 run tellraw @a {"rawtext":[{"text":"§exXram2dieXx joined the game"}]}
scoreboard players set ram2die_join thebrokenscript:ram2die_join 1