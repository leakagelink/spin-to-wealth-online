
export class RouletteGameService {
  static numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  
  static redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  static blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  static getNumberColor = (num: number): string => {
    if (num === 0) return 'green';
    return RouletteGameService.redNumbers.includes(num) ? 'red' : 'black';
  }

  static generateRandomNumber(): number {
    return this.numbers[Math.floor(Math.random() * this.numbers.length)];
  }

  static checkWin(resultNumber: number, selectedBet: string): boolean {
    switch (selectedBet) {
      case 'red':
        return this.redNumbers.includes(resultNumber);
      case 'black':
        return this.blackNumbers.includes(resultNumber);
      case 'even':
        return resultNumber !== 0 && resultNumber % 2 === 0;
      case 'odd':
        return resultNumber !== 0 && resultNumber % 2 === 1;
      case 'low':
        return resultNumber >= 1 && resultNumber <= 18;
      case 'high':
        return resultNumber >= 19 && resultNumber <= 36;
      default:
        return false;
    }
  }

  static calculateWinnings(bet: number, multiplier: number): number {
    return Math.floor(bet * multiplier);
  }
}
