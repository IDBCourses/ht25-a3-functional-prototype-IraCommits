Malmö University
Student: Iryna Vratslavska

Bubble Rush

This is an interactive game written in JavaScript where the player is supposed to swipe and catch the live targets that randomly move up and down on the 
screen.  To win the game, you need to collect all 30 targets. Each target makes the player grow, and is a source of energy for the player that helps gain
enough size to move along the screen. You can lose if you don't collect targets, because the player is programmed to compress itself continuously, 
until it disappears, and the game stops automatically.

Movement
The player circle spawns in the middle of the screen, where it immediately starts losing its weight. Swipe movement is done by pressing
keys [Q, W, E, R, T, Y]. The player is only allowed to move left and right. It is ok to decide the swipe direction yourself. 
Minimum distance is 50px along the screen width. Press incrementally two keys closer to each other keys and now you can move a minimal distance. 
To move a farther distance, you need to press more keys gradually, but in such a way that when one key is held down, the next one is pressed after it
to activate the chain for movement. You cannot press the first and last key, for example [Q] and [Y], and move; this just won't work. 
You need to do a movement that resembles sliding your fingers across a touchpad, 
but on the keys of the keyboard. One great feature is that you are free to start with whatever key you want, but note that starting somewhere in the
middle of a key row will limit the distance you can move along the screen width. The longest step is when all keys are engaged.
Catching
Another action that is possible in the game is catching targets and absorbing them. The player decides which target is going to be absorbed. 
Press key [C] when the target is in the same position as the player, so you can visually see they are overlapping, then the player can eat the target. 
This is very important to catch circles, because the player circle grows when food is eaten, which makes possible future movements along the screen until
all targets are absorbed.  
Feedback 
It is important to control how dynamically the player's state is changing if it doesn't catch targets. 
The player's size gradually decreases from the start, and without growth, the player will continue to decrease to zero size, which will result in defeat.
Moreover, the player circle changes its background in relation to its size. 
Yellow => big enough, can move along the screen for a while without catching food. 
Red => critically small size, urgent need to eat, otherwise game over!  


