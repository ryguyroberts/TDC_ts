//import { UI } from "../scenes/UI"
//
//console.log("UI", UI)
//const towerLayer = UI.createTowerLayer();
//console.log("towerLayer in findPath:", towerLayer)

const findPath = (start: Phaser.Math.Vector2, groundLayer: Phaser.Tilemaps.TilemapLayer, wallsLayer: Phaser.Tilemaps.TilemapLayer) => {
  //console.log("towerLayer in findPath:", towerLayer);
  
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
  console.log("start", start)
  console.log("queue push start", queue.push(start))

  const towerLayer = [
    "15x1",
    "15x2",
    "15x3",
    "15x4",
    "15x5",
    "15x6",
    "22x8",
    "22x7",
    "22x6",
    "22x5",
    "23x5",
    "24x5",
    "25x5",
    "26x5",
    "27x5",
    "28x5",
    "29x5",
    "30x5",
    "31x5",
    "32x5",
    "33x5",
    "33x4",
    "33x3"
]

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
        
        //for (const [towerId, tower] of towerState.activeTowers.entries()) {
        //  const towerX = Math.floor(tower.x / 32);
        //  const towerY = Math.floor(tower.y / 32);
        //  const towerKey = toKey(towerX, towerY)
        //  console.log("towerId, towerKey", towerId, towerKey)
        //
       
        //}
        //
        if (wallsLayer.getTileAt(neighbor.x, neighbor.y)) {
            continue;
        }

        const key = toKey(neighbor.x, neighbor.y);
    
        if (key in parentForKey) {
            continue;
        }
        
        //console.log("key", key)
        //console.log("towerLayer in pathfind", towerLayer)
        if (towerLayer.includes(key)) {
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