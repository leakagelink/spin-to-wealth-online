
export class RouletteGameService {
  static readonly numbers = Array.from({ length: 37 }, (_, i) => i);
  static readonly redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  static readonly blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  static getNumberColor(num: number): string {
    if (num === 0) return "green";
    if (this.redNumbers.includes(num)) return "red";
    if (this.blackNumbers.includes(num)) return "black";
    return "black";
  }

  static checkWin(resultNumber: number, bet: string): boolean {
    if (bet === "red" && this.redNumbers.includes(resultNumber)) return true;
    if (bet === "black" && this.blackNumbers.includes(resultNumber)) return true;
    if (bet === "even" && resultNumber !== 0 && resultNumber % 2 === 0) return true;
    if (bet === "odd" && resultNumber % 2 === 1) return true;
    if (bet === "low" && resultNumber >= 1 && resultNumber <= 18) return true;
    if (bet === "high" && resultNumber >= 19 && resultNumber <= 36) return true;
    return false;
  }

  static generateRandomNumber(): number {
    return Math.floor(Math.random() * 37);
  }

  static calculateWinnings(bet: number, multiplier: number): number {
    return bet * multiplier;
  }
}
