scoreboard objectives add null_join dummy
scoreboard players add @a[scores={null_join=1..}] null_join -1
execute as @a[scores={null_join=1}] at @s run function null_join_event