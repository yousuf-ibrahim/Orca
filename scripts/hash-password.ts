import bcrypt from 'bcryptjs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to hash: ', async (password) => {
  if (!password || password.trim().length === 0) {
    console.error('Password cannot be empty');
    process.exit(1);
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('\n✓ Password hashed successfully!\n');
  console.log('Add this to your Replit Secrets as ADMIN_PASSWORD_HASH:\n');
  console.log(hash);
  console.log('\n');
  
  rl.close();
});
