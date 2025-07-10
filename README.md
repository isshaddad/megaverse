# Megaverse Challenge

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. To run Phase 1 (X-shape):
   ```bash
   npm start
   ```
3. To reset the map for Phase 1:
   ```bash
   npm run reset
   ```
4. To run Phase 2 (logo from goal map):
   ```bash
   npm run phase2
   ```

## Thought Process

- **Phase 1:** Automated the X-shape by using simple math rules for diagonals. First diagonal is row = colummn and the second diagonal is row+column = size - 1 while leaving 2 empty cell on each edge
- **Phase 2:** Parsed the goal map and placed objects programmatically based on its contents. For SOLoon and comETHs, I split the string in 2 to identify color and orientation respectively
