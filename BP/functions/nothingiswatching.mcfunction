execute as @e[type=thebrokenscript:deprivation] at @s if entity @a run scoreboard players random @s niw 1 2
execute as @s[type=thebrokenscript:deprivation,scores={niw=1}] at @s run tp ~~~ facing @e[family=niw,c=1]
execute as @e[type=thebrokenscript:deprivation,scores={niw=1}] at @s run playsound nullchase_1
execute as @e[family=niw,scores={niw=1}] at @s if entity @a[r=6] run camerashake add @a 1 0.05 rotational
execute as @e[type=thebrokenscript:deprivation,scores={niw=2}] at @s as @a[r=7] at @s run summon lightning_bolt ~~~

