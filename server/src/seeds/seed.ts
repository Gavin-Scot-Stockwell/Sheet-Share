import db from '../config/connection.js';
import { Character, User } from '../models/index.js';
import cleanDB from './cleanDB.js';

import userData from './userData.json' assert { type: 'json'};
import characterData from './characterData.json' assert { type: 'json' };

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    await Character.insertMany(characterData);
    await User.create(userData);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();