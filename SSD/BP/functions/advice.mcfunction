scoreboard objectives add thebrokenscript:world dummy
scoreboard objectives add thebrokenscript:null_join dummy
scoreboard objectives add thebrokenscript:ram2die_join dummy
scoreboard objectives add event dummy
scoreboard objectives add ui_fix dummy
scoreboard objectives add screen dummy
scoreboard objectives add tick dummy
scoreboard objectives add song dummy
scoreboard objectives add falseday dummy
scoreboard objectives add nt_random dummy
scoreboard objectives add bed_grief dummy
scoreboard objectives add cycle dummy
scoreboard objectives add limit dummy
scoreboard objectives add room dummy
scoreboard objectives add particle dummy
scoreboard objectives add music dummy
scoreboard objectives add msg dummy
scoreboard objectives add loop dummy
scoreboard objectives add jumpscare dummy
scoreboard objectives add frame dummy
scoreboard objectives add dead_end dummy
scoreboard objectives add entity dummy
scoreboard objectives add skip dummy
scoreboard objectives add chase dummy
scoreboard objectives add structure dummy
scoreboard objectives add silouet dummy
scoreboard objectives add niw dummy
scoreboard objectives add text dummy
scoreboard objectives add event_activate dummy
scoreboard objectives add despawn dummy
scoreboard objectives add null_spawn dummy
scoreboard objectives add he dummy
scoreboard objectives add record dummy
scoreboard objectives add rain dummy
scoreboard objectives add dec dummy
scoreboard players add Initialised thebrokenscript:world 0
scoreboard players add null_join thebrokenscript:null_join 0
scoreboard players add ram2die_join thebrokenscript:ram2die_join 0
execute if score Initialised thebrokenscript:world matches 0 run say < ??? > this World Is not yours...
scoreboard players set Initialised thebrokenscript:world 1
scoreboard players add @a tick 1
scoreboard players set @a[scores={tick=21..}] tick 0
damage @a[scores={jumpscare=1}] 20
scoreboard players add @a[scores={jumpscare=0..}] jumpscare -1
scoreboard players add @a[scores={falseday=0..}] jumpscare -1
scoreboard players random @a[tag=!ok] null_join 30000 48000
title @a[tag=!ok] clear
tag @a add ok