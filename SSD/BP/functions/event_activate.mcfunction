scoreboard players random @a[scores={tick=19}] event_activate 1 2500
execute as @a[scores={event_activate=1}] at @s unless entity @e[type=thebrokenscript:event] run summon thebrokenscript:event ~~~5
execute as @a at @s run spreadplayers ~ ~ 7 35 @e[type=thebrokenscript:event]
scoreboard players set @a[scores={event_activate=1}] event_activate 2500
execute as @e[type=thebrokenscript:event] at @s run scoreboard players random @s event 1 26
execute as @e[type=thebrokenscript:event,scores={event=1}] at @s run function null_join_event
execute as @e[type=thebrokenscript:event,scores={event=7}] at @s run function ram2die_join_event
execute as @e[type=thebrokenscript:event,scores={event=2}] at @s run function cave_sound
execute as @e[type=thebrokenscript:event,scores={event=3}] at @s run function nullnullnull
execute as @e[type=thebrokenscript:event,scores={event=4}] at @s run function opengl
execute as @e[type=thebrokenscript:event,scores={event=6}] at @s run function moonglitch
execute as @e[type=thebrokenscript:event,scores={event=8}] at @s run function fakebsodd
execute as @e[type=thebrokenscript:event,scores={event=9}] at @s run function song
execute as @e[type=thebrokenscript:event,scores={event=10}] at @s run time set noon
execute as @e[type=thebrokenscript:event,scores={event=11}] at @s run time set midnight
execute as @e[type=thebrokenscript:event,scores={event=12}] at @s run function flinging
execute as @e[type=thebrokenscript:event,scores={event=13}] at @s run function messagges
execute as @e[type=thebrokenscript:event,scores={event=14}] at @s run playsound heartbeat @a
execute as @e[type=thebrokenscript:event,scores={event=14}] at @s run function goaway
execute as @e[type=thebrokenscript:event,scores={event=15}] at @s run function setnighthb
execute as @e[type=thebrokenscript:event,scores={event=16}] at @s run function nullach
execute as @e[type=thebrokenscript:event,scores={event=17}] at @s run function LightningEvent
execute as @e[type=thebrokenscript:event,scores={event=18}] at @s run function CameraYank
execute as @e[type=thebrokenscript:event,scores={event=19}] at @s run function SkyBedrock
execute as @e[type=thebrokenscript:event,scores={event=20}] at @s run function SkyWater
execute as @e[type=thebrokenscript:event,scores={event=21}] at @s run function normalambienceevent
execute as @e[type=thebrokenscript:event,scores={event=22}] at @s run function keepplaying
execute as @e[type=thebrokenscript:event,scores={event=23}] at @s run function steps
execute as @e[type=thebrokenscript:event,scores={event=24}] at @s run function playerbreath
execute as @e[type=thebrokenscript:event,scores={event=25}] at @s run function damage
execute as @e[type=thebrokenscript:event,scores={event=26}] at @s run function playsound

kill @e[type=thebrokenscript:event]
