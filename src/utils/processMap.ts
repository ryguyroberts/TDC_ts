export interface MapData {
  walls: boolean[][];
}

export const preprocessMapData = (groundLayer: Phaser.Tilemaps.TilemapLayer, wallsLayer: Phaser.Tilemaps.TilemapLayer): MapData => {
  const mapWidth = groundLayer.width;
  const mapHeight = groundLayer.height;

  const walls: boolean[][] = [];

  for (let y = 0; y < mapHeight; y++) {
    walls[y] = [];
    for (let x = 0; x < mapWidth; x++) {
      // const groundTile
      groundLayer.getTileAt(x, y, true);
      const wallTile = wallsLayer.getTileAt(x, y, true);
      walls[y][x] = !!wallTile; // Convert to boolean
    }
  }

  return { walls };
};


