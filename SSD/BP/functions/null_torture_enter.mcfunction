execute as @s in the_end run tp 49999 200 -50000
scoreboard players random @s nt_random 1 5
execute as @s[scores={nt_random=1}] in overworld run tp 49999 200 -50000
execute as @s[scores={nt_random=2}] in overworld run tp 50025 200 -50000
execute as @s[scores={nt_random=3}] in overworld run tp 49973 200 -50000
execute as @s[scores={nt_random=4}] in overworld run tp 49986 200 -50000
execute as @s[scores={nt_random=5}] in overworld run tp 50012 200 -50000
tag @s add enter
execute as @a positioned 50000 200 -50000 unless entity @e[type=thebrokenscript:null_torture_gen] run structure load nt_fix 49967 198 -49992
execute as @a positioned 50000 200 -50000 unless entity @e[type=thebrokenscript:null_torture_gen] run structure load nt_main ~-32~-2~-8
scoreboard players set @s limit 6000
time set day
scoreboard players set @s music 960