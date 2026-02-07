scoreboard players random @e[family=integrity_boss] particle 1 20
execute as @e[family=integrity_boss,scores={particle=1}] at @s run setblock ~7~5~ thebrokenscript:error
execute as @e[family=integrity_boss,scores={particle=2}] at @s run setblock ~-5~4~ thebrokenscript:error
execute as @e[family=integrity_boss,scores={particle=3}] at @s run setblock ~-3~2~4 thebrokenscript:error
execute as @e[family=integrity_boss,scores={particle=4}] at @s run setblock ~5~6~-3 thebrokenscript:error
execute as @e[family=integrity_boss,scores={particle=5}] at @s run setblock ~-5~8~-3 thebrokenscript:error
execute as @e[family=integrity_boss,scores={particle=6}] at @s run setblock ~-2~-1~1 air
execute as @e[family=integrity_boss,scores={particle=7}] at @s run setblock ~-2~-1~2 air
execute as @e[family=integrity_boss,scores={particle=8}] at @s run setblock ~3~-1~1 air
execute as @e[family=integrity_boss,scores={particle=5}] at @s as @a at @s run playsound ambient.cave @a ~~~ 1 0.5
execute as @e[family=integrity_boss,scores={particle=10}] at @s as @a at @s run playsound ambient.cave @a ~~~ 1 0.5
execute as @e[family=integrity_boss,scores={particle=15}] at @s as @a at @s run playsound ambient.cave @a ~~~ 1 0.5
execute as @e[family=integrity_boss,scores={particle=20}] at @s as @a at @s run playsound ambient.cave @a ~~~ 1 0.5
scoreboard players random @e[family=integrity_boss] particle 1 25
execute as @e[family=integrity_boss,scores={particle=25}] at @s run playsound youknownothing @a[scores={tick=19}]
execute as @e[type=thebrokenscript:integrity_phase,tag=!loop] at @s run scoreboard players set @s loop 0
execute as @e[type=thebrokenscript:integrity_phase,tag=!loop] at @s run tag @s add loop
execute as @e[type=thebrokenscript:integrity_phase,scores={loop=0}] at @s run playsound integrityphase3loop @a
execute as @e[type=thebrokenscript:integrity_phase,scores={loop=0}] at @s run scoreboard players set @s loop 1260
scoreboard players add @e[type=thebrokenscript:integrity_phase,scores={loop=1..}] loop -1
execute as @e[type=item,name=integrity_phase] at @s run summon thebrokenscript:integrity_phase ~~~
kill @e[type=item,name=integrity_phase]
execute as @e[type=item,name=integrity_death] at @s run playsound integritydefeated @a
execute as @e[type=item,name=integrity_death] at @s run stopsound @a integrityphase3loop
kill @e[type=item,name=integrity_death]