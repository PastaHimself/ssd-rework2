execute as @e[type=thebrokenscript:thebrokenend] at @s run ride @a[r=7] start_riding @s
playanimation @e[type=thebrokenscript:thebrokenend] animation.thebrokenend.jumpscare x 1
playsound thebrokenendishere
scoreboard players set @a[r=6] jumpscare 60
