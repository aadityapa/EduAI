'use client';

import { Button, Card, CardContent, CardHeader, CardTitle, FileUploader, Tabs, TabsContent, TabsList, TabsTrigger } from '@eduai/ui';
import { BookOpen, FileText, Plus, Video } from 'lucide-react';
import { PageHeader } from './page-header';

const mockCourses = [
  { id: '1', title: 'Class 8 Mathematics', chapters: 12, lessons: 48, status: 'published' },
  { id: '2', title: 'Class 10 Science', chapters: 15, lessons: 60, status: 'draft' },
  { id: '3', title: 'Class 6 English', chapters: 10, lessons: 40, status: 'published' },
];

export function ContentManagement() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Video library, notes, courses, chapters, and quizzes"
        breadcrumbs={[{ label: 'Admin', href: '/dashboard' }, { label: 'Content' }]}
        actions={<Button size="sm"><Plus className="mr-2 h-4 w-4" />New Course</Button>}
      />

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="videos">Video Library</TabsTrigger>
          <TabsTrigger value="notes">Notes Library</TabsTrigger>
          <TabsTrigger value="media">Media Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <Card key={course.id} className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{course.title}</CardTitle>
                    <span className={`text-xs ${course.status === 'published' ? 'text-success' : 'text-warning'}`}>{course.status}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{course.chapters} chapters · {course.lessons} lessons</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Chapters</Button>
                    <Button variant="outline" size="sm">Quiz Builder</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Video className="h-4 w-4" />Video Library</CardTitle></CardHeader>
            <CardContent>
              <FileUploader accept="video/*" label="Upload video" description="MP4, WebM up to 500MB" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4" />Notes Library</CardTitle></CardHeader>
            <CardContent>
              <FileUploader accept=".pdf,.doc,.docx" label="Upload notes" description="PDF, DOCX up to 10MB" multiple />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4" />Media Manager</CardTitle></CardHeader>
            <CardContent>
              <FileUploader accept="image/*,video/*,.pdf" label="Upload media" description="Images, videos, documents" multiple />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
