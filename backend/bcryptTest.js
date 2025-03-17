const bcrypt = require('bcrypt');

async function reHashPassword() {
  const password = '1';
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('New Hashed Password:', hashedPassword);
    // Copy the new hash and update your database
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

reHashPassword();