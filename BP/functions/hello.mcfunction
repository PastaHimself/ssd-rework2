execute as @e[type=item,name=thing] at @s run structure load hello_triggered ~~~
execute as @e[type=item,name=thing] at @s run playsound hearthbeat @a
kill @e[type=item,name=thing]