'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Navigation from '@/components/ui/Navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/components/auth/withAuth';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Loader2, 
  FileText, 
  Shield, 
  Zap,
  Calendar,
  Tag,
  User,
  Settings,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { createPost } from '@/lib/posts';

// Security writeup templates
const SECURITY_TEMPLATES = {
  'vulnerability-assessment': {
    title: 'Vulnerability Assessment Report',
    content: `<h1>Vulnerability Assessment Report</h1>

<h2>Executive Summary</h2>
<p>Brief overview of the assessment scope, methodology, and key findings.</p>

<h2>Assessment Scope</h2>
<ul>
<li>Target systems and applications</li>
<li>Testing boundaries and limitations</li>
<li>Assessment timeline</li>
</ul>

<h2>Methodology</h2>
<p>Description of the assessment approach and tools used.</p>

<h2>Key Findings</h2>
<h3>Critical Vulnerabilities</h3>
<p>Details of critical security issues discovered.</p>

<h3>High-Risk Vulnerabilities</h3>
<p>Description of high-risk security flaws.</p>

<h3>Medium-Risk Vulnerabilities</h3>
<p>Overview of medium-risk issues.</p>

<h2>Remediation Recommendations</h2>
<p>Prioritized list of remediation steps with timelines.</p>

<h2>Conclusion</h2>
<p>Summary of overall security posture and next steps.</p>`,
    tags: ['Vulnerability Assessment', 'Security Testing', 'Penetration Testing']
  },
  'incident-response': {
    title: 'Security Incident Response Report',
    content: `<h1>Security Incident Response Report</h1>

<h2>Incident Overview</h2>
<p>Summary of the security incident including timeline and impact.</p>

<h2>Incident Timeline</h2>
<ul>
<li>Detection time and method</li>
<li>Initial response actions</li>
<li>Containment measures</li>
<li>Resolution timeline</li>
</ul>

<h2>Technical Analysis</h2>
<h3>Attack Vector</h3>
<p>Analysis of how the attack was carried out.</p>

<h3>Indicators of Compromise (IOCs)</h3>
<p>Technical indicators that can be used for detection.</p>

<h3>Forensic Findings</h3>
<p>Key findings from forensic analysis.</p>

<h2>Impact Assessment</h2>
<p>Assessment of business and technical impact.</p>

<h2>Lessons Learned</h2>
<p>Key takeaways and process improvements.</p>

<h2>Prevention Measures</h2>
<p>Recommendations to prevent similar incidents.</p>`,
    tags: ['Incident Response', 'Security Operations', 'Forensics']
  },
  'penetration-testing': {
    title: 'Penetration Testing Report',
    content: `<h1>Penetration Testing Report</h1>

<h2>Executive Summary</h2>
<p>High-level overview of the penetration test scope and findings.</p>

<h2>Testing Methodology</h2>
<ul>
<li>Reconnaissance phase</li>
<li>Vulnerability assessment</li>
<li>Exploitation attempts</li>
<li>Post-exploitation activities</li>
</ul>

<h2>Technical Findings</h2>
<h3>Critical Vulnerabilities</h3>
<p>Detailed analysis of critical security flaws.</p>

<h3>Exploitation Results</h3>
<p>Results of successful exploitation attempts.</p>

<h3>Access Achieved</h3>
<p>Level of access obtained during testing.</p>

<h2>Risk Assessment</h2>
<p>Risk analysis of discovered vulnerabilities.</p>

<h2>Remediation Roadmap</h2>
<p>Prioritized remediation plan with timelines.</p>

<h2>Conclusion</h2>
<p>Overall security assessment and recommendations.</p>`,
    tags: ['Penetration Testing', 'Security Assessment', 'Red Team']
  },
  'security-research': {
    title: 'Security Research: [Topic]',
    content: `<h1>Security Research: [Your Topic]</h1>

<h2>Abstract</h2>
<p>Brief summary of the research and key findings.</p>

<h2>Introduction</h2>
<p>Background and motivation for the research.</p>

<h2>Related Work</h2>
<p>Review of existing research and literature.</p>

<h2>Methodology</h2>
<p>Description of research approach and methodology.</p>

<h2>Technical Analysis</h2>
<h3>Attack Vector Analysis</h3>
<p>Detailed technical analysis of the security issue.</p>

<h3>Proof of Concept</h3>
<p>Demonstration of the security vulnerability.</p>

<h3>Impact Assessment</h3>
<p>Analysis of potential impact and scope.</p>

<h2>Countermeasures</h2>
<p>Proposed security measures and mitigations.</p>

<h2>Future Work</h2>
<p>Areas for further research and investigation.</p>

<h2>Conclusion</h2>
<p>Summary of findings and contributions.</p>`,
    tags: ['Security Research', 'Vulnerability Research', 'Academic']
  },
  'bug-bounty-report': {
    title: 'Bug Bounty Report: [Vulnerability Type]',
    content: `<h1>Bug Bounty Report: [Vulnerability Type]</h1>

<h2>Summary</h2>
<p>Brief description of the vulnerability and its impact.</p>

<h2>Steps to Reproduce</h2>
<ol>
<li>Step 1: Navigate to the vulnerable page</li>
<li>Step 2: Perform the specific action</li>
<li>Step 3: Observe the vulnerability</li>
<li>Step 4: Document the proof of concept</li>
</ol>

<h2>Proof of Concept</h2>
<p>Detailed proof of concept with screenshots and code examples.</p>

<h3>Request/Response Example</h3>
<pre><code>POST /api/vulnerable-endpoint HTTP/1.1
Host: target.com
Content-Type: application/json

{
  "payload": "malicious_input_here"
}</code></pre>

<h2>Impact Assessment</h2>
<p>Analysis of the potential impact and scope of the vulnerability.</p>

<h2>Remediation</h2>
<p>Suggested fixes and security measures to address the vulnerability.</p>

<h2>CVSS Score</h2>
<p>Common Vulnerability Scoring System assessment.</p>

<h2>Additional Information</h2>
<p>Any additional context or related findings.</p>`,
    tags: ['Bug Bounty', 'Vulnerability Disclosure', 'Web Security']
  },
  'malware-analysis': {
    title: 'Malware Analysis Report',
    content: `<h1>Malware Analysis Report</h1>

<h2>Sample Information</h2>
<ul>
<li>File name and hash values</li>
<li>File type and size</li>
<li>Compilation date and strings</li>
</ul>

<h2>Static Analysis</h2>
<h3>File Properties</h3>
<p>Analysis of file headers, sections, and metadata.</p>

<h3>String Analysis</h3>
<p>Interesting strings and potential indicators.</p>

<h3>Import Analysis</h3>
<p>Analysis of imported functions and libraries.</p>

<h2>Dynamic Analysis</h2>
<h3>Behavioral Analysis</h3>
<p>Observed behaviors during execution.</p>

<h3>Network Analysis</h3>
<p>Network communication patterns and endpoints.</p>

<h3>File System Changes</h3>
<p>Files created, modified, or deleted.</p>

<h3>Registry Changes</h3>
<p>Registry modifications and persistence mechanisms.</p>

<h2>Code Analysis</h2>
<p>Reverse engineering findings and code structure.</p>

<h2>Indicators of Compromise (IOCs)</h2>
<ul>
<li>File hashes</li>
<li>Network indicators</li>
<li>Registry keys</li>
<li>File paths</li>
</ul>

<h2>Mitigation Strategies</h2>
<p>Recommended detection and prevention measures.</p>`,
    tags: ['Malware Analysis', 'Reverse Engineering', 'Threat Intelligence']
  },
  'web-application-security': {
    title: 'Web Application Security Assessment',
    content: `<h1>Web Application Security Assessment</h1>

<h2>Assessment Overview</h2>
<p>Scope and methodology of the web application security assessment.</p>

<h2>Application Information</h2>
<ul>
<li>Application name and version</li>
<li>Technology stack</li>
<li>Assessment scope</li>
<li>Testing environment</li>
</ul>

<h2>Vulnerability Findings</h2>
<h3>OWASP Top 10 Analysis</h3>
<p>Assessment against OWASP Top 10 vulnerabilities.</p>

<h3>Authentication Issues</h3>
<p>Findings related to authentication and session management.</p>

<h3>Authorization Flaws</h3>
<p>Access control and authorization vulnerabilities.</p>

<h3>Input Validation</h3>
<p>Input validation and sanitization issues.</p>

<h3>Security Misconfigurations</h3>
<p>Configuration and deployment security issues.</p>

<h2>Technical Details</h2>
<p>Detailed technical analysis of each vulnerability.</p>

<h2>Risk Assessment</h2>
<p>Risk analysis and prioritization of findings.</p>

<h2>Remediation Plan</h2>
<p>Detailed remediation steps and recommendations.</p>

<h2>Security Best Practices</h2>
<p>Recommendations for secure development practices.</p>`,
    tags: ['Web Security', 'OWASP', 'Application Security']
  },
  'network-security': {
    title: 'Network Security Assessment',
    content: `<h1>Network Security Assessment</h1>

<h2>Executive Summary</h2>
<p>Overview of network security posture and key findings.</p>

<h2>Network Architecture</h2>
<p>Description of network topology and security controls.</p>

<h2>Assessment Methodology</h2>
<ul>
<li>Network discovery and mapping</li>
<li>Port scanning and service enumeration</li>
<li>Vulnerability scanning</li>
<li>Configuration review</li>
</ul>

<h2>Network Segmentation</h2>
<p>Analysis of network segmentation and access controls.</p>

<h2>Perimeter Security</h2>
<h3>Firewall Configuration</h3>
<p>Review of firewall rules and configurations.</p>

<h3>Intrusion Detection/Prevention</h3>
<p>Analysis of IDS/IPS deployment and effectiveness.</p>

<h2>Internal Network Security</h2>
<p>Assessment of internal network security controls.</p>

<h2>Wireless Security</h2>
<p>Analysis of wireless network security.</p>

<h2>Remote Access Security</h2>
<p>Assessment of VPN and remote access controls.</p>

<h2>Monitoring and Logging</h2>
<p>Review of network monitoring and logging capabilities.</p>

<h2>Recommendations</h2>
<p>Prioritized recommendations for network security improvements.</p>`,
    tags: ['Network Security', 'Infrastructure', 'Perimeter Security']
  },
  'social-engineering': {
    title: 'Social Engineering Assessment Report',
    content: `<h1>Social Engineering Assessment Report</h1>

<h2>Assessment Overview</h2>
<p>Scope and objectives of the social engineering assessment.</p>

<h2>Methodology</h2>
<ul>
<li>Phishing campaign design</li>
<li>Pretexting scenarios</li>
<li>Physical security testing</li>
<li>Vishing (voice phishing) attempts</li>
</ul>

<h2>Campaign Results</h2>
<h3>Phishing Campaign</h3>
<p>Results of email phishing campaigns and click rates.</p>

<h3>Physical Security</h3>
<p>Findings from physical security assessments.</p>

<h3>Phone-Based Attacks</h3>
<p>Results of vishing and pretexting attempts.</p>

<h2>Target Analysis</h2>
<p>Analysis of target demographics and susceptibility.</p>

<h2>Success Metrics</h2>
<ul>
<li>Click-through rates</li>
<li>Credential harvesting success</li>
<li>Physical access attempts</li>
<li>Information disclosure rates</li>
</ul>

<h2>Behavioral Patterns</h2>
<p>Analysis of human behavior and security awareness.</p>

<h2>Training Recommendations</h2>
<p>Security awareness training recommendations.</p>

<h2>Policy Improvements</h2>
<p>Recommendations for policy and procedure improvements.</p>`,
    tags: ['Social Engineering', 'Human Factors', 'Security Awareness']
  },
  'cloud-security': {
    title: 'Cloud Security Assessment',
    content: `<h1>Cloud Security Assessment</h1>

<h2>Cloud Environment Overview</h2>
<p>Description of cloud infrastructure and services.</p>

<h2>Cloud Provider Security</h2>
<h3>Shared Responsibility Model</h3>
<p>Analysis of security responsibilities and controls.</p>

<h3>Provider Security Controls</h3>
<p>Assessment of cloud provider security measures.</p>

<h2>Identity and Access Management</h2>
<p>Review of IAM policies and configurations.</p>

<h2>Data Security</h2>
<h3>Data Classification</h3>
<p>Analysis of data classification and protection.</p>

<h3>Encryption</h3>
<p>Assessment of encryption in transit and at rest.</p>

<h2>Network Security</h2>
<p>Review of cloud network security controls.</p>

<h2>Compliance Assessment</h2>
<p>Evaluation of compliance with relevant standards.</p>

<h2>Security Monitoring</h2>
<p>Analysis of cloud security monitoring capabilities.</p>

<h2>Incident Response</h2>
<p>Assessment of cloud incident response procedures.</p>

<h2>Recommendations</h2>
<p>Cloud security improvement recommendations.</p>`,
    tags: ['Cloud Security', 'AWS', 'Azure', 'GCP']
  },
  'mobile-security': {
    title: 'Mobile Application Security Assessment',
    content: `<h1>Mobile Application Security Assessment</h1>

<h2>Application Overview</h2>
<p>Description of the mobile application and platform.</p>

<h2>Static Analysis</h2>
<h3>Code Review</h3>
<p>Analysis of application source code and binaries.</p>

<h3>Permission Analysis</h3>
<p>Review of application permissions and capabilities.</p>

<h3>Hardcoded Secrets</h3>
<p>Identification of hardcoded credentials and secrets.</p>

<h2>Dynamic Analysis</h2>
<h3>Runtime Analysis</h3>
<p>Analysis of application behavior during execution.</p>

<h3>Network Traffic</h3>
<p>Analysis of network communication patterns.</p>

<h3>Data Storage</h3>
<p>Assessment of local data storage security.</p>

<h2>Platform-Specific Security</h2>
<h3>iOS Security</h3>
<p>iOS-specific security controls and vulnerabilities.</p>

<h3>Android Security</h3>
<p>Android-specific security controls and vulnerabilities.</p>

<h2>API Security</h2>
<p>Assessment of backend API security.</p>

<h2>Data Privacy</h2>
<p>Analysis of data privacy and protection measures.</p>

<h2>Recommendations</h2>
<p>Mobile security improvement recommendations.</p>`,
    tags: ['Mobile Security', 'iOS', 'Android', 'App Security']
  },
  'iot-security': {
    title: 'IoT Security Assessment',
    content: `<h1>IoT Security Assessment</h1>

<h2>IoT Environment Overview</h2>
<p>Description of IoT devices and network architecture.</p>

<h2>Device Security Assessment</h2>
<h3>Hardware Security</h3>
<p>Analysis of device hardware security features.</p>

<h3>Firmware Analysis</h3>
<p>Assessment of device firmware security.</p>

<h3>Default Configurations</h3>
<p>Review of default security configurations.</p>

<h2>Network Security</h2>
<p>Analysis of IoT network security controls.</p>

<h2>Communication Security</h2>
<h3>Protocol Analysis</h3>
<p>Assessment of communication protocols and encryption.</p>

<h3>API Security</h3>
<p>Review of IoT device API security.</p>

<h2>Data Security</h2>
<p>Analysis of data collection, storage, and transmission.</p>

<h2>Privacy Assessment</h2>
<p>Evaluation of privacy controls and data handling.</p>

<h2>Supply Chain Security</h2>
<p>Assessment of IoT supply chain security.</p>

<h2>Vulnerability Management</h2>
<p>Analysis of vulnerability management processes.</p>

<h2>Recommendations</h2>
<p>IoT security improvement recommendations.</p>`,
    tags: ['IoT Security', 'Embedded Systems', 'Device Security']
  },
  'threat-hunting': {
    title: 'Threat Hunting Report',
    content: `<h1>Threat Hunting Report</h1>

<h2>Hunting Hypothesis</h2>
<p>Description of the threat hunting hypothesis and objectives.</p>

<h2>Hunting Methodology</h2>
<ul>
<li>Data sources and collection</li>
<li>Analysis techniques</li>
<li>Tools and platforms used</li>
<li>Timeline of activities</li>
</ul>

<h2>Data Analysis</h2>
<h3>Log Analysis</h3>
<p>Analysis of security logs and event data.</p>

<h3>Network Traffic Analysis</h3>
<p>Analysis of network traffic patterns and anomalies.</p>

<h3>Endpoint Analysis</h3>
<p>Analysis of endpoint data and artifacts.</p>

<h2>Findings</h2>
<h3>Detected Threats</h3>
<p>Description of any threats or suspicious activity discovered.</p>

<h3>False Positives</h3>
<p>Analysis of false positive findings.</p>

<h3>Baseline Analysis</h3>
<p>Establishment of normal behavior baselines.</p>

<h2>Indicators</h2>
<p>Technical indicators and observables discovered.</p>

<h2>Lessons Learned</h2>
<p>Key insights and process improvements.</p>

<h2>Recommendations</h2>
<p>Recommendations for threat hunting program improvements.</p>`,
    tags: ['Threat Hunting', 'SOC', 'Detection', 'Analytics']
  }
};

function PostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
  }, [user, router]);

  const handleTemplateSelect = (templateKey: string) => {
    const template = SECURITY_TEMPLATES[templateKey as keyof typeof SECURITY_TEMPLATES];
    if (template) {
      setTitle(template.title);
      setContent(template.content);
      setTags(template.tags.join(', '));
      setShowTemplates(false);
    }
  };

  const handleCopyTemplate = async (templateKey: string) => {
    const template = SECURITY_TEMPLATES[templateKey as keyof typeof SECURITY_TEMPLATES];
    if (template) {
      await navigator.clipboard.writeText(template.content);
      setCopiedTemplate(templateKey);
      setTimeout(() => setCopiedTemplate(''), 2000);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    if (!user) {
      alert('You must be signed in to create a post');
      return;
    }

    setIsSaving(true);
    try {
      const newPost = {
        title: title.trim(),
        content,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        authorPhotoURL: user.photoURL || null,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        readTime: Math.ceil(content.split(' ').length / 200), // Rough estimate
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      };

      await createPost(newPost);

      // Reset form
      setTitle('');
      setContent('');
      setTags('');
      setIsPreview(false);

      alert('Security writeup saved successfully!');
      router.push('/my-blogs');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to save security writeup: ' + errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
            {/* Mobile Back Button */}
            <div className="md:hidden">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Desktop Back Button */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-md border border-border bg-background text-foreground hover:bg-accent transition-colors text-sm"
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Templates</span>
              </button>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md border transition-colors text-sm ${
                  isPreview 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background text-foreground border-border hover:bg-accent'
                }`}
              >
                <Eye size={16} />
                <span className="hidden sm:inline">{isPreview ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !title.trim() || !content.trim()}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm ${
                  isSaving || !title.trim() || !content.trim()
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span className="hidden sm:inline">Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Templates Panel */}
          {showTemplates && (
            <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Writeup Templates
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(SECURITY_TEMPLATES).map(([key, template]) => (
                  <div key={key} className="p-4 bg-background rounded-md border border-border hover:border-primary transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.title}</h4>
                      <button
                        onClick={() => handleCopyTemplate(key)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy template content"
                      >
                        {copiedTemplate === key ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {template.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleTemplateSelect(key)}
                      className="w-full px-3 py-2 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPreview ? (
            // Preview Mode
            <div className="space-y-6">
              <div className="bg-background border border-border rounded-lg p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Security Writeup</span>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">{title || 'Untitled Security Writeup'}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{user!.displayName || user!.email?.split('@')[0] || 'Anonymous'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  {tags && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>{tags}</span>
                      </div>
                    </>
                  )}
                </div>
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-a:text-primary prose-li:text-foreground"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          ) : (
            // Editor Mode
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Editor */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Writeup Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your security writeup title..."
                    className="w-full px-4 py-3 text-lg font-medium border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                {/* Editor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Writeup Content
                  </label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your security analysis, findings, and recommendations..."
                    className="min-h-[600px]"
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Tags Input */}
                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Security Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="vulnerability, penetration-testing, incident-response"
                    className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Actions
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="w-full px-3 py-2 text-sm border border-border rounded hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Browse Templates
                    </button>
                    <button
                      onClick={() => {
                        const currentDate = new Date().toLocaleDateString();
                        setTitle(prev => prev || `Security Writeup - ${currentDate}`);
                      }}
                      className="w-full px-3 py-2 text-sm border border-border rounded hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Add Date to Title
                    </button>
                  </div>
                </div>

                {/* Writing Tips */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Writing Tips
                  </label>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <div className="p-3 bg-muted/30 rounded border border-border">
                      <strong className="text-foreground">Structure:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Executive Summary</li>
                        <li>• Technical Analysis</li>
                        <li>• Impact Assessment</li>
                        <li>• Recommendations</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-muted/30 rounded border border-border">
                      <strong className="text-foreground">Best Practices:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Include proof-of-concepts</li>
                        <li>• Provide remediation steps</li>
                        <li>• Use clear, technical language</li>
                        <li>• Include relevant code examples</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Word Count */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Statistics
                  </label>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Words: {content.split(' ').filter(word => word.length > 0).length}</div>
                    <div>Characters: {content.length}</div>
                    <div>Estimated read time: {Math.ceil(content.split(' ').length / 200)} min</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(PostPage); 