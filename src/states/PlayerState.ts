import { makeAutoObservable } from "mobx";

class PlayerState {
  currency: number = 10000;
  playerHealth: number = 100;

  constructor() {
    makeAutoObservable(this);
  }

  buyTower(price: number) {
    if (this.currency >= price) {
      this.currency -= price;
      return true; // successful purchase
    }
     return false; // insufficient funds 
  }

  addFunds(amount: number) {
    this.currency += amount;
  }

  takeDamage(damage: number): boolean {
    if (this.playerHealth > 0) {
      this.playerHealth -= damage;
      if (this.playerHealth <= 0) {
        return true; // game over
      }
    }
    return false; // player still alive
  }
  
  reset() {
    this.playerHealth = 100;
    this.currency = 100;
  }
}

export const playerState = new PlayerState();