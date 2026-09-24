import React, { useState } from 'react';
import { UserProfile, TeacherActivity, Announcement } from '../types';
import { SCHOOL_INFO } from '../data/initialData';
import { TeachersDetailsModal } from './TeachersDetailsModal';
import { useRealtimeDate } from '../utils/dateService';
import {
  BookOpen,
  CheckSquare,
  Users,
  FileText,
  Megaphone,
  FolderOpen,
  User,
  GraduationCap,
  Clock,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  Mail,
  ShieldCheck,
  LogIn,
} from 'lucide-react';

interface TeacherDashboardProps {
  currentUser: UserProfile;
  teachers: UserProfile[];
  onNavigate: (view: string) => void;
  activities: TeacherActivity[];
  announcements: Announcement[];
  pendingMarksCount: number;
  onUpdateTeachers: (updated: UserProfile[]) => void;
  onOpenGmail: () => void;
  onOpenAuthModal: () => void;
  onShowSuccessToast: (msg: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  teachers,
  onNavigate,
  activities,
  announcements,
  pendingMarksCount,
  onUpdateTeachers,
  onOpenGmail,
  onOpenAuthModal,
  onShowSuccessToast,
}) => {
  const { formattedDate } = useRealtimeDate();
  const [teachersModalOpen, setTeachersModalOpen] = useState(false);
  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner (Requirement 2) - Styled in Maroon and Light Blue */}
      <div className="rounded-2xl bg-gradient-to-br from-[#6b1426] via-[#540d1e] to-[#3b0a16] p-5 sm:p-7 text-white shadow-md border border-[#8c1632] relative overflow-hidden">
        {/* Subtle decorative crest watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-sky-200" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-[#8c1632]/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Hello, {currentUser.name}
                </h1>
                <span className="bg-[#3b0a16] text-sky-200 border border-sky-300/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {currentUser.role === 'super_admin' ? 'Head Teacher' : currentUser.role === 'school_admin' ? 'School Admin' : 'Teacher Seat'}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-sky-100">
                <span className="font-bold text-sky-200">Allocated Teaching:</span>
                {currentUser.assignments && currentUser.assignments.length > 0 ? (
                  currentUser.assignments.map((asgn, i) => (
                    <span
                      key={i}
                      className="bg-[#3b0a16]/80 border border-sky-300/40 px-2 py-0.5 rounded-md font-semibold text-sky-100"
                    >
                      {asgn.grade} • {asgn.subject}
                    </span>
                  ))
                ) : (
                  <span className="text-sky-200">School Administration</span>
                )}
              </div>
            </div>

            {/* Academic Year, Term & Actions */}
            <div className="flex flex-wrap items-center gap-2 text-xs self-start md:self-auto font-medium">
              <div className="bg-[#3b0a16]/80 p-2 rounded-xl border border-[#8c1632] text-sky-100 flex items-center gap-2">
                <span>{SCHOOL_INFO.currentYear} • {SCHOOL_INFO.currentTerm}</span>
                <span className="text-rose-400">|</span>
                <span className="text-white font-semibold">{formattedDate}</span>
              </div>

              {/* Login / Switch Account Button */}
              <button
                onClick={onOpenAuthModal}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 text-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign Up / Log In</span>
              </button>
            </div>
          </div>

          {/* Quick status notice if pending marks */}
          {pendingMarksCount > 0 && (
            <div className="flex items-center justify-between bg-sky-950/50 border border-sky-400/40 rounded-xl px-3.5 py-2 text-xs text-sky-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-sky-300 shrink-0" />
                <span>
                  <strong>{pendingMarksCount} learners</strong> in your assigned classes require assessment marks.
                </span>
              </div>
              <button
                onClick={() => onNavigate('marks')}
                className="font-bold underline text-white hover:text-sky-200 shrink-0 ml-2"
              >
                Enter marks now →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section 1: Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#6b1426]" />
            <span>Quick Actions</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Enter Marks */}
          <button
            id="quick-action-enter-marks"
            onClick={() => onNavigate('marks')}
            className="group relative flex flex-col items-start p-4 bg-white hover:bg-rose-50/50 rounded-2xl border-2 border-stone-200 hover:border-[#6b1426] shadow-xs hover:shadow-md transition text-left active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#6b1426] group-hover:bg-[#6b1426] group-hover:text-white transition mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-base font-extrabold text-stone-900 group-hover:text-[#6b1426]">
              Enter Marks
            </div>
            <div className="text-xs text-stone-500 mt-1 line-clamp-1">
              Independent % Score &amp; Rubrics
            </div>
            {pendingMarksCount > 0 && (
              <span className="mt-2 text-[10px] font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded-full border border-sky-300">
                {pendingMarksCount} Pending
              </span>
            )}
          </button>

          {/* Take Attendance */}
          <button
            id="quick-action-take-attendance"
            onClick={() => onNavigate('attendance')}
            className="group relative flex flex-col items-start p-4 bg-white hover:bg-sky-50/50 rounded-2xl border-2 border-stone-200 hover:border-sky-600 shadow-xs hover:shadow-md transition text-left active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-800 group-hover:bg-sky-700 group-hover:text-white transition mb-3">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="text-base font-extrabold text-stone-900 group-hover:text-sky-950">
              Take Attendance
            </div>
            <div className="text-xs text-stone-500 mt-1 line-clamp-1">
              Daily Grade 7–9 register
            </div>
          </button>

          {/* Gmail Communicator */}
          <button
            id="quick-action-gmail"
            onClick={onOpenGmail}
            className="group relative flex flex-col items-start p-4 bg-white hover:bg-rose-50/50 rounded-2xl border-2 border-stone-200 hover:border-[#6b1426] shadow-xs hover:shadow-md transition text-left active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100/70 text-[#6b1426] group-hover:bg-[#6b1426] group-hover:text-white transition mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <div className="text-base font-extrabold text-stone-900 group-hover:text-[#6b1426]">
              Gmail Desk
            </div>
            <div className="text-xs text-stone-500 mt-1 line-clamp-1">
              Email reports &amp; circulars
            </div>
          </button>

          {/* Teachers Details (Replaced Download APK as requested) */}
          <button
            id="quick-action-teachers-details"
            onClick={() => setTeachersModalOpen(true)}
            className="group relative flex flex-col items-start p-4 bg-white hover:bg-sky-50/50 rounded-2xl border-2 border-stone-200 hover:border-[#6b1426] shadow-xs hover:shadow-md transition text-left active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-[#6b1426] group-hover:bg-[#6b1426] group-hover:text-white transition mb-3">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-base font-extrabold text-stone-900 group-hover:text-[#6b1426]">
              Teachers Details
            </div>
            <div className="text-xs text-stone-500 mt-1 line-clamp-1">
              Faculty subjects &amp; contacts
            </div>
          </button>
        </div>
      </div>

      {/* Teachers Details Modal (Opens when Teachers Details box is tapped) */}
      <TeachersDetailsModal
        isOpen={teachersModalOpen}
        onClose={() => setTeachersModalOpen(false)}
        teachers={teachers}
        currentUser={currentUser}
        onUpdateTeachers={onUpdateTeachers}
        onShowSuccessToast={onShowSuccessToast}
      />

      {/* Section 2: Teacher Portal Modules */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          Academic Management Modules
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* MY CLASSES */}
          <button
            id="module-my-classes"
            onClick={() => onNavigate('classes')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#6b1426] shadow-xs hover:shadow-md transition text-left active:scale-[0.98] group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#6b1426] group-hover:bg-[#6b1426] group-hover:text-white transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-stone-900 group-hover:text-[#6b1426]">
                MY CLASSES
              </div>
              <div className="text-xs text-stone-500">Grade 7, 8 &amp; 9</div>
            </div>
          </button>

          {/* ALL LEARNERS */}
          <button
            id="module-all-learners"
            onClick={() => onNavigate('learners')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#6b1426] shadow-xs hover:shadow-md transition text-left active:scale-[0.98] group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-800 group-hover:bg-[#6b1426] group-hover:text-white transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-stone-900 group-hover:text-[#6b1426]">
                ALL LEARNERS
              </div>
              <div className="text-xs text-stone-500">Directory &amp; UPI</div>
            </div>
          </button>

          {/* REPORTS & BROADSHEET */}
          <button
            id="module-reports"
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#6b1426] shadow-xs hover:shadow-md transition text-left active:scale-[0.98] group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-800 group-hover:bg-sky-800 group-hover:text-white transition">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-stone-900 group-hover:text-sky-950">
                REPORTS
              </div>
              <div className="text-xs text-stone-500">CBC Broadsheet &amp; Cards</div>
            </div>
          </button>

          {/* MY PROFILE */}
          <button
            id="module-my-profile"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#6b1426] shadow-xs hover:shadow-md transition text-left active:scale-[0.98] group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 group-hover:bg-amber-700 group-hover:text-white transition">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-stone-900 group-hover:text-amber-950">
                MY PROFILE
              </div>
              <div className="text-xs text-stone-500">Staff Credentials</div>
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Recent Activity & Latest Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6b1426]" />
              <span>Your Recent Activity</span>
            </h3>
            <span className="text-[11px] text-stone-500">Verified actions</span>
          </div>

          <div className="mt-3 divide-y divide-stone-100">
            {activities && activities.length > 0 ? (
              activities.slice(0, 4).map((act) => (
                <div key={act.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#6b1426] shrink-0 mt-1.5" />
                    <div>
                      <span className="font-semibold text-stone-800">{act.action}</span>
                      <div className="text-[11px] text-stone-500 capitalize">{act.category} update</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-stone-500 shrink-0">{act.time}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 py-4">No recent activity recorded today.</p>
            )}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#6b1426]" />
              <span>School Announcements</span>
            </h3>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-[#6b1426] hover:text-[#540d1e] flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {announcements.slice(0, 2).map((ann) => (
              <div
                key={ann.id}
                onClick={() => onNavigate('announcements')}
                className="p-3 rounded-xl bg-stone-50 hover:bg-rose-50/40 border border-stone-100 cursor-pointer transition"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{ann.title}</h4>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-medium shrink-0">
                    {ann.category}
                  </span>
                </div>
                <p className="text-xs text-stone-600 line-clamp-2">{ann.message}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-stone-500">
                  <span>Author: {ann.author}</span>
                  <span>{ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
