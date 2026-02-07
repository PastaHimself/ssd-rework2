execute as @e[type=thebrokenscript:gateway] at @s run tp @e[type=thebrokenscript:gateway_gen,rm=15] ~~~
execute as @e[type=thebrokenscript:gateway] at @s run tp ~~~
execute as @e[type=thebrokenscript:gateway_gen] at @s if entity @a[scores={tick=19..}] at @s run tp ~~-1~
execute as @e[type=thebrokenscript:gateway_gen] at @s if block ~~~ air run setblock ~~~ thebrokenscript:errornotexture 