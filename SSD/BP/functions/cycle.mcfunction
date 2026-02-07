scoreboard players random @a cycle 1 3
execute as @a[scores={cycle=1}] at @s run gamerule dodaylightcycle false
execute as @a[scores={cycle=2..}] at @s run gamerule dodaylightcycle true