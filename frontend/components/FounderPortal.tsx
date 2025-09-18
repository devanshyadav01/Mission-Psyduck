import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

type FounderProfile = {
  id: string;
  name: string;
  company: string;
  email: string;
  website?: string;
};

type StudentCandidate = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  progressPercentage: number;
  projectsCompleted: number;
  lastActive: string;
  contactEmail: string;
};

export const FounderPortal: React.FC = () => {
  const { user } = useAuth();
  const [founder, setFounder] = useState<FounderProfile | null>(null);
  const [form, setForm] = useState({ name: '', company: '', email: '', website: '' });
  const [students, setStudents] = useState<StudentCandidate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Placeholder: load existing founder profile if any (from localStorage for now)
    const saved = localStorage.getItem('psyduck_founder_profile');
    if (saved) {
      setFounder(JSON.parse(saved));
    }

    // Placeholder: mock student candidates list until backend endpoints exist
    const mock: StudentCandidate[] = [
      {
        id: 'u1',
        name: 'Aarav Sharma',
        role: 'Frontend Developer',
        skills: ['React', 'TypeScript', 'Tailwind'],
        progressPercentage: 78,
        projectsCompleted: 5,
        lastActive: '2h ago',
        contactEmail: 'aarav@example.com',
      },
      {
        id: 'u2',
        name: 'Zoya Khan',
        role: 'Fullstack Developer',
        skills: ['Node.js', 'PostgreSQL', 'React'],
        progressPercentage: 91,
        projectsCompleted: 8,
        lastActive: '1d ago',
        contactEmail: 'zoya@example.com',
      },
      {
        id: 'u3',
        name: 'Kabir Patel',
        role: 'Data Engineer',
        skills: ['Python', 'Airflow', 'SQL'],
        progressPercentage: 64,
        projectsCompleted: 3,
        lastActive: '5h ago',
        contactEmail: 'kabir@example.com',
      },
    ];
    setStudents(mock);
  }, []);

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.company.trim() && form.email.trim();
  }, [form]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const profile: FounderProfile = {
        id: user?.id || 'local-founder',
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        website: form.website.trim() || undefined,
      };
      // Placeholder persistence
      localStorage.setItem('psyduck_founder_profile', JSON.stringify(profile));
      setFounder(profile);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContact = (student: StudentCandidate) => {
    window.location.href = `mailto:${student.contactEmail}?subject=Collaboration%20with%20${student.name}&body=Hi%20${student.name},%0D%0A%0D%0AI%20would%20love%20to%20connect%20regarding%20opportunities%20at%20${founder?.company || 'our company'}.`;
  };

  const handleHire = (student: StudentCandidate) => {
    // Placeholder: In future, call backend to create hiring intent / send invite
    alert(`Hiring request sent for ${student.name}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Founder Portal</h1>
          <p className="text-muted-foreground">Add your founder profile, discover students, track progress, and contact or hire.</p>
        </div>
        {founder && (
          <Badge variant="secondary">Signed in as Founder</Badge>
        )}
      </div>

      {!founder ? (
        <Card>
          <CardHeader>
            <CardTitle>Create your founder profile</CardTitle>
            <CardDescription>Tell students who you are and what you are building.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSignup}>
              <div className="sm:col-span-1">
                <label className="text-sm font-medium">Full name</label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Rohan Gupta" />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-medium">Company</label>
                <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g., Psyduck Labs" />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-medium">Website (optional)</label>
                <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://company.com" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Student candidates</CardTitle>
            <CardDescription>Browse students, view progress, and take action.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {students.map(student => (
                <div key={student.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.role}</div>
                    </div>
                    <Badge>{student.projectsCompleted} projects</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {student.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="text-xs text-muted-foreground">Progress</div>
                    <Progress value={student.progressPercentage} />
                    <div className="text-xs text-muted-foreground">{student.progressPercentage}% • Last active {student.lastActive}</div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" onClick={() => handleContact(student)}>Contact</Button>
                    <Button onClick={() => handleHire(student)}>Hire</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FounderPortal;


