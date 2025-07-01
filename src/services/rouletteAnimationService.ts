
export class RouletteAnimationService {
  static startBallAnimation(
    resultNumber: number,
    onPositionUpdate: (position: number) => void,
    onComplete: () => void
  ): void {
    let currentBallPosition = 0;
    let ballSpeed = 20;
    const ballDeceleration = 0.98;
    let ballSpinCount = 0;
    const maxBallSpins = 150;
    
    const ballSpinInterval = setInterval(() => {
      currentBallPosition = (currentBallPosition + ballSpeed) % 360;
      onPositionUpdate(currentBallPosition);
      ballSpeed *= ballDeceleration;
      ballSpinCount++;
      
      if (ballSpinCount >= maxBallSpins || ballSpeed < 1) {
        clearInterval(ballSpinInterval);
        
        // Calculate final ball position based on result
        const finalBallPosition = (resultNumber * (360 / 37)) + Math.random() * 8 - 4;
        onPositionUpdate(finalBallPosition);
        onComplete();
      }
    }, 40);
  }
}
