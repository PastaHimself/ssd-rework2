execute as @a[tag=!join] at @s run tellraw @a {"rawtext":[{"text":"§e"},{"selector":"*"},{"text":" joined the game "}]}
tag @a add join