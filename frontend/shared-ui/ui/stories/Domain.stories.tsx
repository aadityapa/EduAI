import type { Meta, StoryObj } from '@storybook/react';
import { LessonCard } from '../src/components/lesson-card';
import { ProgressRing } from '../src/components/domain-aliases';
import { StreakFlame } from '../src/components/domain-aliases';
import { XpCounter } from '../src/components/domain-aliases';
import { CoinCounter } from '../src/components/coin-counter';
import { BadgeShowcase } from '../src/components/badge-showcase';
import { LeaderboardRow } from '../src/components/leaderboard-row';
import { AttendanceGrid } from '../src/components/attendance-grid';
import { TimetableGrid } from '../src/components/timetable-grid';
import { GradeBook } from '../src/components/grade-book';
import { FeeInvoiceCard } from '../src/components/fee-invoice-card';
import { AiTutorChatBubble, AiTutorComposer } from '../src/components/ai-tutor-chat';
import { QuizQuestion } from '../src/components/quiz-question';
import { useState } from 'react';

const meta = {
  title: 'Domain/Learning',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'EduAI domain components for student / teacher / parent surfaces. Labels are props for i18n.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const LessonAndGamification: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <XpCounter xp={1250} />
        <StreakFlame days={7} />
        <CoinCounter coins={340} />
        <ProgressRing value={72} label="Mastery" />
      </div>
      <div className="grid max-w-sm gap-4">
        <LessonCard
          title="Quadratic equations"
          subject="Mathematics"
          durationMinutes={25}
          status="in_progress"
          progress={45}
          onAction={() => undefined}
        />
      </div>
      <BadgeShowcase
        badges={[
          { id: '1', name: 'First lesson', earned: true, description: 'Complete your first lesson' },
          { id: '2', name: 'Week streak', earned: false, description: 'Study 7 days in a row' },
        ]}
      />
      <LeaderboardRow rank={1} name="Asha Patel" xp={2400} />
    </div>
  ),
};

export const TeacherGrids: Story = {
  render: () => (
    <div className="space-y-8">
      <AttendanceGrid
        days={Array.from({ length: 14 }, (_, i) => ({
          date: `2026-07-${String(i + 1).padStart(2, '0')}`,
          status: (['present', 'present', 'late', 'absent', 'present'] as const)[i % 5],
        }))}
      />
      <TimetableGrid
        days={['Mon', 'Tue', 'Wed']}
        periods={['9:00', '10:00']}
        slots={[
          { id: '1', day: 0, startPeriod: 0, title: 'Math', subtitle: 'Room 12', tone: 'primary' },
          { id: '2', day: 1, startPeriod: 1, title: 'Science', tone: 'success' },
        ]}
      />
      <GradeBook
        columns={[
          { id: 'q1', label: 'Quiz 1', max: 20 },
          { id: 'q2', label: 'Quiz 2', max: 20 },
        ]}
        entries={[
          {
            id: '1',
            studentName: 'Asha',
            rollNumber: '12',
            scores: { q1: 18, q2: 15 },
            average: 16.5,
          },
        ]}
      />
    </div>
  ),
};

export const ParentFeesAndTutor: Story = {
  render: function DomainDemo() {
    const [text, setText] = useState('');
    return (
      <div className="max-w-lg space-y-6">
        <FeeInvoiceCard
          invoiceNumber="INV-1042"
          title="Term 2 tuition"
          amount={18500}
          dueDate="2026-08-01"
          status="due"
          studentName="Asha Patel"
          onPay={() => undefined}
          onView={() => undefined}
        />
        <AiTutorChatBubble
          message={{ id: '1', role: 'assistant', content: 'Let’s solve this step by step.' }}
        />
        <AiTutorChatBubble
          message={{ id: '2', role: 'user', content: 'How do I factor x² − 5x + 6?' }}
        />
        <AiTutorComposer value={text} onChange={setText} onSubmit={() => setText('')} />
        <QuizQuestion
          type="mcq"
          question="What is 2 + 2?"
          options={['3', '4', '5']}
          value="4"
          onChange={() => undefined}
        />
      </div>
    );
  },
};
