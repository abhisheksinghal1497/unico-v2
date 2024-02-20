export default function getRandomNumber(min, max) {
  // Generate a random floating-point number between 0 and 1
  const randomFloat = Math.random();

  // Scale the random number to the desired range
  const randomNumber = Math.floor(randomFloat * (max - min + 1)) + min;

  return randomNumber;
}
