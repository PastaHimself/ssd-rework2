scoreboard players random @a rain 7 10
execute as @a[scores={rain=7}] at @s run playsound silence @a
execute as @a[scores={rain=8}] at @s run playsound silence @a
execute as @a[scores={rain=9}] at @s run playsound silence @a
execute as @a[scores={rain=10}] at @s run weather rain
title @a title bsod
playsound fakebsodaudio @a
tag @a add ui_fix