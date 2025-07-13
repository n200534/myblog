const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, Timestamp } = require('firebase/firestore');
const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: '.env.local' });

// Firebase config
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

// 30 security blog posts
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
    content: `<h2>What is Sensitive Data Exposure?</h2><p>Data exposure happens when sensitive data is not properly protected. Encryption is key.</p><h3>Prevention</h3><ul><li>Use HTTPS</li><li>Encrypt data at rest</li><li>Don't log sensitive info</li></ul>`,
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
  {
    title: 'The OWASP Top 10: A7 - Cross-Site Scripting (XSS)',
    excerpt: 'XSS attacks inject malicious scripts into web pages. Learn how to prevent this common vulnerability.',
    tags: ['OWASP', 'XSS', 'web security'],
    content: `<h2>What is XSS?</h2><p>Cross-Site Scripting allows attackers to inject malicious scripts into web pages viewed by other users.</p><h3>Prevention</h3><ul><li>Validate and sanitize input</li><li>Use Content Security Policy</li><li>Encode output</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A8 - Insecure Deserialization',
    excerpt: 'Insecure deserialization can lead to remote code execution. Learn how to secure your applications.',
    tags: ['OWASP', 'deserialization', 'web security'],
    content: `<h2>What is Insecure Deserialization?</h2><p>Insecure deserialization can lead to remote code execution, replay attacks, and privilege escalation.</p><h3>Prevention</h3><ul><li>Use secure serialization formats</li><li>Validate serialized objects</li><li>Implement integrity checks</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A9 - Using Components with Known Vulnerabilities',
    excerpt: 'Using vulnerable components is a major security risk. Learn how to manage dependencies securely.',
    tags: ['OWASP', 'dependencies', 'vulnerabilities'],
    content: `<h2>What are Known Vulnerabilities?</h2><p>Using components with known vulnerabilities is a major security risk that can lead to data breaches.</p><h3>Prevention</h3><ul><li>Keep dependencies updated</li><li>Use vulnerability scanners</li><li>Monitor security advisories</li></ul>`,
  },
  {
    title: 'The OWASP Top 10: A10 - Insufficient Logging & Monitoring',
    excerpt: 'Insufficient logging makes it hard to detect attacks. Learn how to implement proper monitoring.',
    tags: ['OWASP', 'logging', 'monitoring'],
    content: `<h2>What is Insufficient Logging?</h2><p>Insufficient logging and monitoring makes it difficult to detect and respond to security incidents.</p><h3>Prevention</h3><ul><li>Log security events</li><li>Implement real-time monitoring</li><li>Set up alerts</li></ul>`,
  },
  {
    title: 'Understanding Zero Trust Security',
    excerpt: 'Zero Trust is a modern security model that assumes no trust by default. Learn how it works.',
    tags: ['zero trust', 'network security', 'modern security'],
    content: `<h2>What is Zero Trust?</h2><p>Zero Trust is a security model that assumes no trust by default and requires verification for every access attempt.</p><h3>Principles</h3><ul><li>Never trust, always verify</li><li>Least privilege access</li><li>Assume breach</li></ul>`,
  },
  {
    title: 'What is Ransomware?',
    excerpt: 'Ransomware encrypts your files and demands payment. Learn how to protect against this growing threat.',
    tags: ['ransomware', 'malware', 'backup'],
    content: `<h2>What is Ransomware?</h2><p>Ransomware is malicious software that encrypts files and demands payment for decryption.</p><h3>Prevention</h3><ul><li>Regular backups</li><li>Keep systems updated</li><li>User education</li></ul>`,
  },
  {
    title: 'How to Secure Your Home Wi-Fi',
    excerpt: 'Your home Wi-Fi is a gateway to your network. Learn how to secure it properly.',
    tags: ['Wi-Fi', 'home security', 'network'],
    content: `<h2>Securing Your Wi-Fi</h2><p>Your home Wi-Fi network is a critical security point. Proper configuration prevents unauthorized access.</p><h3>Steps</h3><ul><li>Change default passwords</li><li>Use WPA3 encryption</li><li>Hide SSID</li></ul>`,
  },
  {
    title: 'The Principle of Least Privilege',
    excerpt: 'Least privilege is a fundamental security principle. Learn how to implement it in your systems.',
    tags: ['least privilege', 'access control', 'principles'],
    content: `<h2>What is Least Privilege?</h2><p>The principle of least privilege means giving users only the minimum access necessary to perform their tasks.</p><h3>Implementation</h3><ul><li>Role-based access control</li><li>Regular access reviews</li><li>Just-in-time access</li></ul>`,
  },
  {
    title: 'Security in Cloud Computing',
    excerpt: 'Cloud security is different from traditional security. Learn the key concepts and best practices.',
    tags: ['cloud security', 'AWS', 'Azure', 'GCP'],
    content: `<h2>Cloud Security Basics</h2><p>Cloud security requires a shared responsibility model between providers and customers.</p><h3>Best Practices</h3><ul><li>Identity and access management</li><li>Data encryption</li><li>Security monitoring</li></ul>`,
  },
  {
    title: 'Incident Response: What to Do After a Breach',
    excerpt: 'When a security incident occurs, you need a plan. Learn the fundamentals of incident response.',
    tags: ['incident response', 'breach', 'forensics'],
    content: `<h2>Incident Response Plan</h2><p>Having a plan for security incidents is crucial for minimizing damage and recovery time.</p><h3>Steps</h3><ul><li>Preparation</li><li>Detection and analysis</li><li>Containment and eradication</li><li>Recovery</li></ul>`,
  },
  {
    title: 'Security for Remote Work',
    excerpt: 'Remote work creates new security challenges. Learn how to secure your remote workforce.',
    tags: ['remote work', 'VPN', 'endpoint security'],
    content: `<h2>Remote Work Security</h2><p>Remote work introduces new security challenges that require specific solutions.</p><h3>Solutions</h3><ul><li>VPN access</li><li>Endpoint protection</li><li>Secure collaboration tools</li></ul>`,
  },
  {
    title: 'The Dangers of Public Wi-Fi',
    excerpt: 'Public Wi-Fi networks are convenient but dangerous. Learn how to stay safe on public networks.',
    tags: ['public Wi-Fi', 'VPN', 'network security'],
    content: `<h2>Public Wi-Fi Risks</h2><p>Public Wi-Fi networks are convenient but pose significant security risks to your data.</p><h3>Protection</h3><ul><li>Use a VPN</li><li>Avoid sensitive transactions</li><li>Enable firewall</li></ul>`,
  },
  {
    title: 'What is a VPN and When Should You Use One?',
    excerpt: 'VPNs encrypt your internet traffic. Learn when and how to use them effectively.',
    tags: ['VPN', 'privacy', 'encryption'],
    content: `<h2>What is a VPN?</h2><p>A Virtual Private Network (VPN) encrypts your internet traffic and routes it through secure servers.</p><h3>When to Use</h3><ul><li>Public Wi-Fi</li><li>Geographic restrictions</li><li>Privacy protection</li></ul>`,
  },
  {
    title: 'How to Spot a Malicious Email',
    excerpt: 'Email is a primary attack vector. Learn the red flags that indicate malicious emails.',
    tags: ['email security', 'phishing', 'awareness'],
    content: `<h2>Spotting Malicious Emails</h2><p>Email remains a primary attack vector. Learning to spot malicious emails is crucial.</p><h3>Red Flags</h3><ul><li>Urgent language</li><li>Suspicious sender addresses</li><li>Unexpected attachments</li></ul>`,
  },
  {
    title: 'Mobile Device Security Tips',
    excerpt: 'Mobile devices contain sensitive data. Learn how to secure your smartphones and tablets.',
    tags: ['mobile security', 'smartphone', 'tablet'],
    content: `<h2>Mobile Security</h2><p>Mobile devices contain sensitive data and are often targeted by attackers.</p><h3>Tips</h3><ul><li>Use biometric authentication</li><li>Keep apps updated</li><li>Enable remote wipe</li></ul>`,
  },
  {
    title: 'The Basics of Encryption',
    excerpt: 'Encryption protects your data from unauthorized access. Learn the fundamentals of encryption.',
    tags: ['encryption', 'cryptography', 'data protection'],
    content: `<h2>What is Encryption?</h2><p>Encryption converts data into a format that can only be read by authorized parties.</p><h3>Types</h3><ul><li>Symmetric encryption</li><li>Asymmetric encryption</li><li>Hashing</li></ul>`,
  },
  {
    title: 'What is a Firewall?',
    excerpt: 'Firewalls are network security devices. Learn how they work and why you need them.',
    tags: ['firewall', 'network security', 'perimeter'],
    content: `<h2>What is a Firewall?</h2><p>A firewall is a network security device that monitors and controls incoming and outgoing network traffic.</p><h3>Types</h3><ul><li>Network firewalls</li><li>Host-based firewalls</li><li>Web application firewalls</li></ul>`,
  },
  {
    title: 'Security Awareness for Employees',
    excerpt: 'Employees are often the weakest link in security. Learn how to build a security-aware culture.',
    tags: ['awareness', 'training', 'culture'],
    content: `<h2>Security Awareness</h2><p>Employees are often the weakest link in security. Building awareness is crucial.</p><h3>Training Topics</h3><ul><li>Phishing awareness</li><li>Password security</li><li>Social engineering</li></ul>`,
  },
  {
    title: 'How to Protect Your Privacy Online',
    excerpt: 'Online privacy is increasingly important. Learn practical steps to protect your personal information.',
    tags: ['privacy', 'personal data', 'online security'],
    content: `<h2>Online Privacy</h2><p>Protecting your privacy online requires understanding how your data is collected and used.</p><h3>Steps</h3><ul><li>Use privacy-focused browsers</li><li>Enable tracking protection</li><li>Review app permissions</li></ul>`,
  },
  {
    title: 'What is a Security Audit?',
    excerpt: 'Security audits assess your security posture. Learn what they involve and how to prepare.',
    tags: ['audit', 'assessment', 'compliance'],
    content: `<h2>Security Audits</h2><p>Security audits systematically evaluate your security controls and identify vulnerabilities.</p><h3>Types</h3><ul><li>Internal audits</li><li>External audits</li><li>Penetration testing</li></ul>`,
  },
  {
    title: 'The Role of Penetration Testing',
    excerpt: 'Penetration testing simulates real attacks. Learn how it helps improve your security.',
    tags: ['penetration testing', 'ethical hacking', 'assessment'],
    content: `<h2>What is Penetration Testing?</h2><p>Penetration testing simulates real attacks to identify vulnerabilities before attackers do.</p><h3>Benefits</h3><ul><li>Identify vulnerabilities</li><li>Test incident response</li><li>Validate security controls</li></ul>`,
  },
  {
    title: 'Understanding Malware',
    excerpt: 'Malware comes in many forms. Learn about different types and how to protect against them.',
    tags: ['malware', 'viruses', 'trojan horses'],
    content: `<h2>What is Malware?</h2><p>Malware is malicious software designed to harm systems or steal data.</p><h3>Types</h3><ul><li>Viruses</li><li>Worms</li><li>Trojan horses</li><li>Ransomware</li></ul>`,
  },
  {
    title: 'What is a Security Policy?',
    excerpt: 'Security policies define your organization\'s security rules. Learn how to create effective policies.',
    tags: ['policy', 'governance', 'compliance'],
    content: `<h2>Security Policies</h2><p>Security policies define rules and procedures for protecting information assets.</p><h3>Components</h3><ul><li>Acceptable use policy</li><li>Password policy</li><li>Incident response policy</li></ul>`,
  },
  {
    title: 'The Importance of Software Updates',
    excerpt: 'Software updates fix security vulnerabilities. Learn why keeping systems updated is crucial.',
    tags: ['updates', 'patches', 'vulnerabilities'],
    content: `<h2>Why Updates Matter</h2><p>Software updates often include security patches that fix known vulnerabilities.</p><h3>Best Practices</h3><ul><li>Enable automatic updates</li><li>Test updates in staging</li><li>Monitor for vulnerabilities</li></ul>`,
  },
  {
    title: 'What is a Security Token?',
    excerpt: 'Security tokens provide secure authentication. Learn about different types and their uses.',
    tags: ['tokens', 'authentication', 'MFA'],
    content: `<h2>Security Tokens</h2><p>Security tokens are physical or digital devices used for authentication and authorization.</p><h3>Types</h3><ul><li>Hardware tokens</li><li>Software tokens</li><li>Smart cards</li></ul>`,
  },
  {
    title: 'How to Report a Security Incident',
    excerpt: 'Knowing how to report security incidents is crucial. Learn the proper procedures and contacts.',
    tags: ['incident reporting', 'procedures', 'communication'],
    content: `<h2>Reporting Security Incidents</h2><p>Proper incident reporting ensures timely response and helps prevent future incidents.</p><h3>Steps</h3><ul><li>Document the incident</li><li>Notify appropriate parties</li><li>Preserve evidence</li></ul>`,
  },
  {
    title: 'The Future of Cybersecurity',
    excerpt: 'Cybersecurity is constantly evolving. Learn about emerging trends and technologies.',
    tags: ['future', 'AI', 'quantum computing', 'trends'],
    content: `<h2>Cybersecurity Trends</h2><p>The cybersecurity landscape is constantly evolving with new threats and technologies.</p><h3>Emerging Trends</h3><ul><li>AI-powered security</li><li>Quantum-resistant cryptography</li><li>Zero Trust architecture</li></ul>`,
  },
];

async function seedBlogs() {
  console.log('Starting to seed blogs...');
  
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    // Pick a random user
    const user = users[Math.floor(Math.random() * users.length)];

    try {
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
    } catch (error) {
      console.error(`Error adding blog "${blog.title}":`, error);
    }
  }
  console.log('Seeding complete!');
}

seedBlogs().catch(console.error); 