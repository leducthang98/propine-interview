import readline from 'node:readline';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const question = (question: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    rl.question(`${question}`, (answer: string) => {
      try {
        resolve(answer);
      } catch (error) {
        reject(error);
      }
    });
  });
};
