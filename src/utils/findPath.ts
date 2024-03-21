const findPath = (start: Phaser.Math.Vector2, groundLayer: Phaser.Tilemaps.TilemapLayer, wallsLayer: Phaser.Tilemaps.TilemapLayer) => {
  
  type ParentForKey = {
    [key: string]: {
      key: string;
      position: { x: number; y: number };
    };
  };
  
  type Point = {
    x: number;
    y: number;
  }

  const queue = [];
  const parentForKey: ParentForKey = {};

  // console.log("startVec in findPath:", start);
  // console.log("targetVec in findPath:", target);

  const startKey = toKey(start.x, start.y);
  //console.log("startKey:", startKey)

  const targetKey = "33x29";

  parentForKey[startKey] = {
      key: '',
      position: { x: -1, y: -1 }
  };
  //console.log("Adding target position to parentForKey:", parentForKey[startKey]);

  queue.push(start);

  while (queue.length > 0) {
      const { x, y } = queue.shift() as Point;
      const currentKey = toKey(x, y);

      //console.log("Checking current position:", x, y);
      //console.log("Target position:", target.x, target.y);

      if (currentKey === targetKey) {
          break;
      }

      const neighbors: Point[] = [
          { x, y: y - 1 },    // top
          { x: x + 1, y },    // right
          { x, y: y + 1 },    // bottom
          { x: x - 1, y }     // left
      ];

      for (let i = 0; i < neighbors.length; ++i) {
        const neighbor = neighbors[i];
        //console.log("Neighbor:", neighbor);
        const tile = groundLayer.getTileAt(neighbor.x, neighbor.y);
    
        if (!tile) {
            continue;
        }
    
        if (wallsLayer.getTileAt(neighbor.x, neighbor.y)) {
            continue;
        }
    
        const key = toKey(neighbor.x, neighbor.y);
        //console.log("Key:", key);
    
        if (key in parentForKey) {
            continue;
        }
    
        parentForKey[key] = {
            key: currentKey,
            position: { x, y }
        };
    
        queue.push(neighbor);
    }
  }

  //console.log("parentForKey:", parentForKey);
  //console.log("targetKey:", targetKey);
  //console.log("parentForKey[targetKey]:", parentForKey[targetKey]);


  const path = [];
  let currentKey = targetKey;
  let currentPos = parentForKey[targetKey].position;

  while (currentKey !== startKey) {
      const pos = groundLayer.tileToWorldXY(currentPos.x, currentPos.y);
      pos.x += groundLayer.tilemap.tileWidth * 0.5;
      pos.y += groundLayer.tilemap.tileHeight * 0.5;

      path.push(pos);

      const { key, position } = parentForKey[currentKey];
      currentKey = key;
      currentPos = position;
  }

  return path.reverse();
};

const toKey = (x: number, y: number) => `${x}x${y}`;

export default findPath;