import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Firebase config (reuse your src/lib/firebase.ts config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Random users for authorship
const users = Array.from({ length: 10 }).map(() => ({
  authorId: faker.string.uuid(),
  authorName: faker.person.fullName(),
  authorPhotoURL: faker.image.avatar(),
}));

// 10 security blog posts (expand to 30 in batches)
const blogs = [
  {
    title: 'What is Social Engineering? Real-World Examples & Defense',
    excerpt: 'Learn how attackers manipulate people to gain access and how to defend against social engineering.',
    tags: ['social engineering', 'psychology', 'defense'],
    content: `<h2>What is Social Engineering?</h2><p>Social engineering is the art of manipulating people so they give up confidential information. Attackers use psychological tricks to gain trust and access.</p><h3>Common Attacks</h3><ul><li>Phishing emails</li><li>Pretexting (fake scenarios)</li><li>Baiting (malicious USBs)</li></ul><h3>How to Defend</h3><ul><li>Be skeptical of unsolicited requests</li><li>Verify identities</li><li>Educate employees</li></ul>`,
  },
  {
    title: 'Introduction to Phishing Attacks',
    excerpt: 'Phishing is one of the most common cyber threats. Learn how to spot and avoid phishing emails.',
    tags: ['phishing', 'email', 'awareness'],
    content: `<h2>What is Phishing?</h2><p>Phishing is a type of social engineering where attackers send fraudulent messages to trick victims into revealing information.</p><h3>Red Flags</h3><ul><li>Urgent language</li><li>Suspicious links</li><li>Requests for credentials</li></ul><h3>Prevention</h3><ul><li>Check sender address</li><li>Hover over links</li><li>Report suspicious emails</li></ul>`,
  },
  {
    title: 'How to Create Strong Passwords',
    excerpt: 'A strong password is your first line of defense. Learn how to create and manage secure passwords.',
    tags: ['passwords', 'authentication', 'basics'],
    content: `<h2>Why Strong Passwords Matter</h2><p>Weak passwords are easy to guess or crack. Use long, complex, and unique passwords for each account.</p><h3>Tips</h3><ul><li>Use a passphrase</li><li>Include numbers, symbols, and both cases</li><li>Use a password manager</li></ul>`,
  },
  {
    title: 'Multi-Factor Authentication Explained',
    excerpt: 'MFA adds an extra layer of security. Learn how it works and why you should enable it everywhere.',
    tags: ['MFA', 'authentication', 'basics'],
    content: `<h2>What is MFA?</h2><p>Multi-factor authentication (MFA) requires two or more verification methods. Even if a password is stolen, your account stays protected.</p><h3>Types of MFA</h3><ul><li>SMS codes</li><li>Authenticator apps</li><li>Hardware tokens</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A1 - Injection',
    excerpt: 'Injection attacks like SQL injection are a top web risk. Learn how they work and how to prevent them.',
    tags: ['OWASP', 'injection', 'web security'],
    content: `<h2>What is Injection?</h2><p>Injection flaws allow attackers to send malicious data to an interpreter. SQL injection is the most famous example.</p><h3>Prevention</h3><ul><li>Use parameterized queries</li><li>Validate input</li><li>Least privilege for database accounts</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A2 - Broken Authentication',
    excerpt: 'Broken authentication can let attackers take over accounts. Learn the risks and how to secure logins.',
    tags: ['OWASP', 'authentication', 'web security'],
    content: `<h2>What is Broken Authentication?</h2><p>Broken authentication means attackers can compromise passwords, keys, or session tokens.</p><h3>Prevention</h3><ul><li>Implement MFA</li><li>Rotate credentials</li><li>Monitor for brute force</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A3 - Sensitive Data Exposure',
    excerpt: 'Sensitive data must be protected in transit and at rest. Learn best practices for data security.',
    tags: ['OWASP', 'data security', 'encryption'],
    content: `<h2>What is Sensitive Data Exposure?</h2><p>Data exposure happens when sensitive data is not properly protected. Encryption is key.</p><h3>Prevention</h3><ul><li>Use HTTPS</li><li>Encrypt data at rest</li><li>Don’t log sensitive info</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A4 - XML External Entities (XXE)',
    excerpt: 'XXE attacks exploit XML parsers. Learn how to secure your apps against this risk.',
    tags: ['OWASP', 'XXE', 'web security'],
    content: `<h2>What is XXE?</h2><p>XML External Entity attacks exploit vulnerable XML parsers to access internal files or services.</p><h3>Prevention</h3><ul><li>Disable external entities</li><li>Use secure parsers</li><li>Validate XML input</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A5 - Broken Access Control',
    excerpt: 'Broken access control lets attackers act as other users. Learn how to enforce proper permissions.',
    tags: ['OWASP', 'access control', 'web security'],
    content: `<h2>What is Broken Access Control?</h2><p>Broken access control means users can act outside their intended permissions.</p><h3>Prevention</h3><ul><li>Enforce server-side checks</li><li>Use role-based access</li><li>Test for privilege escalation</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A6 - Security Misconfiguration',
    excerpt: 'Misconfigurations are a leading cause of breaches. Learn how to harden your systems.',
    tags: ['OWASP', 'configuration', 'web security'],
    content: `<h2>What is Security Misconfiguration?</h2><p>Misconfiguration happens when security settings are left insecure by default or changed improperly.</p><h3>Prevention</h3><ul><li>Harden all environments</li><li>Automate configuration management</li><li>Review settings regularly</li></ul>`,
  },
];

async function seedBlogs() {
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    // Pick a random user
    const user = users[Math.floor(Math.random() * users.length)];

    // Check if a blog with the same title exists
    const q = query(collection(db, 'posts'), where('title', '==', blog.title));
    const existing = await getDocs(q);
    if (!existing.empty) {
      console.log(`Blog "${blog.title}" already exists, skipping.`);
      continue;
    }

    await addDoc(collection(db, 'posts'), {
      title: blog.title,
      content: blog.content,
      authorId: user.authorId,
      authorName: user.authorName,
      authorPhotoURL: user.authorPhotoURL,
      tags: blog.tags,
      excerpt: blog.excerpt,
      publishedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log(`Added: ${blog.title}`);
  }
  console.log('Seeding complete!');
}

seedBlogs().catch(console.error); 