execute as @e[type=thebrokenscript:hetzer] at @s if entity @a[r=15] run scoreboard players random @s song 1 2
execute as @e[type=thebrokenscript:hetzer,scores={song=1},tag=!play] at @s run playsound falsesubwooferlullaby @a
execute as @e[type=thebrokenscript:hetzer,scores={song=2},tag=!play] at @s run playsound falsecalm2 @a
scoreboard players set @e[type=thebrokenscript:hetzer,scores={song=1},tag=!play] falseday 2036
scoreboard players set @e[type=thebrokenscript:hetzer,scores={song=2},tag=!play] falseday 1236
scoreboard players add @e[type=thebrokenscript:hetzer,tag=play] falseday -1
tag @e[type=thebrokenscript:hetzer,scores={song=1..}] add play
effect @e[type=thebrokenscript:hetzer,tag=play] invisibility infinite 1 true
execute as @e[type=thebrokenscript:hetzer,tag=play,scores={falseday=500..}] at @s run time set day
execute as @e[type=thebrokenscript:hetzer,scores={falseday=0},tag=play] at @s run time set midnight
execute as @e[type=thebrokenscript:hetzer,scores={falseday=0},tag=play] at @s run stopsound @a falsesubwooferlullaby
execute as @e[type=thebrokenscript:hetzer,scores={falseday=0},tag=play] at @s run stopsound @a falsecalm2
execute as @e[type=thebrokenscript:hetzer,scores={falseday=0},tag=play] at @s run summon thebrokenscript:circuit
kill @e[type=thebrokenscript:hetzer,scores={falseday=0},tag=play]