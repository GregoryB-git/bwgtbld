import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const usersFilePath = path.join(process.cwd(), 'data', 'users.csv');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize CSV file if it doesn't exist
const initCSV = () => {
  ensureDataDirectory();
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, 'id,email,password,role,name,createdAt\n');
  }
};

// Read users from CSV
const readUsers = async (): Promise<any[]> => {
  initCSV();
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  const lines = data.split('\n').slice(1); // Skip header
  return lines
    .filter(line => line.trim())
    .map(line => {
      const [id, email, password, role, name, createdAt] = line.split(',');
      return { id, email, password, role, name, createdAt };
    });
};

// Write user to CSV
const writeUser = async (user: any) => {
  const line = `${user.id},${user.email},${user.password},${user.role},${user.name},${user.createdAt}\n`;
  fs.appendFileSync(usersFilePath, line);
};

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, name } = await request.json();

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const users = await readUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      role,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    await writeUser(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}