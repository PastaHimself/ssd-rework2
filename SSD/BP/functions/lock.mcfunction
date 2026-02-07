execute as @a at @s if entity @e[type=thebrokenscript:null_is_here] unless entity @e[type=thebrokenscript:look,r=3] run tp ~~~ facing @e[type=thebrokenscript:null_is_here]
execute as @a at @s if entity @e[type=thebrokenscript:null_is_here] unless entity @e[type=thebrokenscript:look,r=3] run summon thebrokenscript:look
execute as @a at @s if entity @e[type=thebrokenscript:deprivation] unless entity @e[type=thebrokenscript:look,r=3] run summon thebrokenscript:look
execute as @a at @s if entity @e[type=thebrokenscript:deprivation] unless entity @e[type=thebrokenscript:look,r=3] run tp ~~~ facing @e[type=thebrokenscript:deprivation]

execute as @e[type=thebrokenscript:look] at @s as @p at @s run tp @e[type=thebrokenscript:look] ~~~ facing @e[type=thebrokenscript:null_is_here,c=1]
execute as @e[type=thebrokenscript:look] at @s as @p at @s run tp @e[type=thebrokenscript:look] ~~~ facing @e[type=thebrokenscript:deprivation,c=1]

execute as @e[type=thebrokenscript:look] at @s run camera @p set minecraft:free pos ^^1.5^1 facing ^^1.5^2

execute as @a at @s unless entity @e[type=thebrokenscript:null_is_here] run camera @a clear
execute as @a at @s unless entity @e[type=thebrokenscript:deprivation] run camera @a clear
execute as @e[type=thebrokenscript:look] at @s unless entity @e[type=thebrokenscript:null_is_here] run kill @s
execute as @e[type=thebrokenscript:look] at @s unless entity @e[type=thebrokenscript:deprivation] run kill @s