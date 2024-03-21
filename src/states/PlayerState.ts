import { makeAutoObservable } from "mobx";

class PlayerState {
  currency: number = 1000;
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

  takeDamage(damage: number) {
    if (this.playerHealth > 0) {
      this.playerHealth -= damage;
    } else {
      return false; // game over
    }
  }

}

export const playerState = new PlayerState();