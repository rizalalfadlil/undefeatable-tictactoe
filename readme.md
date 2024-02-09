# Simple undefeatable bot tic tac toe game

**Note: This is not for playing the game but to demonstrate artificial intelligence, you can't win this.**

---

## Game Description

Tic Tac Toe is a turn-based strategy game played on a 3x3 grid. Each player uses different symbols, usually "X" and "O", to mark the squares on the board. The goal is to place three of the same symbols in a row (diagonally, horizontally, or vertically) to win the game. If the entire board is filled without a winner, the game ends in a draw.

---

## Bot Strategy

### Bot Strategy Priorities:

1. **Winning**: The bot will try to place its symbol in such a way that it allows the bot to win the game on the next move.

2. **Blocking Opponent**: If there are two opponent symbols already connected (adjacent), the bot will take a step to prevent the opponent from completing the line and winning the game.

3. **Avoiding Early Diagonal Traps**: The bot will avoid traps where the opponent has two diagonal symbols already connected, which if left unchecked could lead to defeat.

4. **Choosing Unblocked Corners**: If no traps are detected and unblocked corners are available, the bot will choose a corner to optimize the chances of winning or drawing.

5. **Choosing Any Corner**: If there are no traps or unblocked corners, the bot will randomly select a corner to continue the game.

These are the sequential approaches taken by the bot to make decisions at each step, with a focus on winning and avoiding potential traps set by the opponent.

---
