import React, { useState } from 'react';
import { UserProfile, TeacherAssignment } from '../types';
import { GRADES, SUBJECTS } from '../data/initialData';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  ShieldCheck,
  Phone,
  Mail,
  Award,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Lock,
  Search,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface TeachersDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: UserProfile[];
  currentUser: UserProfile;
  onUpdateTeachers: (updated: UserProfile[]) => void;
  onShowSuccessToast: (msg: string) => void;
}

const MAX_TEACHERS = 12;

export const TeachersDetailsModal: React.FC<TeachersDetailsModalProps> = ({
  isOpen,
  onClose,
  teachers,
  currentUser,
  onUpdateTeachers,
  onShowSuccessToast,
}) => {
  const isAdmin = currentUser.role === 'school_admin' || currentUser.role === 'super_admin';
  const [adminMode, setAdminMode] = useState<boolean>(isAdmin);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  // Form state for Add/Edit
  const [editingTeacher, setEditingTeacher] = useState<UserProfile | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formTsc, setFormTsc] = useState('');
  const [formDepartment, setFormDepartment] = useState('Pure & Applied Sciences');
  const [formAssignments, setFormAssignments] = useState<TeacherAssignment[]>([]);

  if (!isOpen) return null;

  const teacherCount = teachers.length;
  const isAtCapacity = teacherCount >= MAX_TEACHERS;

  // Filter teachers
  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      (t.tscNumber && t.tscNumber.toLowerCase().includes(q)) ||
      (t.department && t.department.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.phone && t.phone.includes(q)) ||
      (t.assignments &&
        t.assignments.some(
          (a) => a.subject.toLowerCase().includes(q) || a.grade.toLowerCase().includes(q)
        ))
    );
  });

  const activeTeacher = selectedTeacherId
    ? teachers.find((t) => t.id === selectedTeacherId) || teachers[0]
    : teachers[0];

  const handleOpenAdd = () => {
    if (isAtCapacity) {
      alert(`Capacity reached: A maximum of ${MAX_TEACHERS} teachers are permitted in the school portal.`);
      return;
    }
    setIsAddingNew(true);
    setEditingTeacher(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('+254 ');
    setFormDesignation('Teacher of Junior Secondary');
    setFormTsc('TSC/');
    setFormDepartment('Pure & Applied Sciences');
    setFormAssignments([
      { grade: 'Grade 8', subject: 'Mathematics' },
    ]);
  };

  const handleOpenEdit = (teacher: UserProfile) => {
    setEditingTeacher(teacher);
    setIsAddingNew(false);
    setFormName(teacher.name);
    setFormEmail(teacher.email);
    setFormPhone(teacher.phone || '+254 ');
    setFormDesignation(teacher.designation || 'Teacher of Junior Secondary');
    setFormTsc(teacher.tscNumber || '');
    setFormDepartment(teacher.department || 'Pure & Applied Sciences');
    setFormAssignments(teacher.assignments ? [...teacher.assignments] : []);
  };

  const handleAddAssignment = () => {
    setFormAssignments((prev) => [...prev, { grade: 'Grade 8', subject: 'Mathematics' }]);
  };

  const handleRemoveAssignment = (idx: number) => {
    setFormAssignments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAssignmentChange = (
    index: number,
    field: 'grade' | 'subject',
    val: string
  ) => {
    setFormAssignments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter the teacher full official name.');
      return;
    }

    if (isAddingNew) {
      if (isAtCapacity) {
        alert(`Cannot add: Portal is capped at ${MAX_TEACHERS} teacher accounts.`);
        return;
      }
      const newTeacher: UserProfile = {
        id: `teacher-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim().toLowerCase() || `teacher${teachers.length + 1}@reberwet.ac.ke`,
        role: 'teacher',
        phone: formPhone.trim(),
        designation: formDesignation.trim(),
        tscNumber: formTsc.trim(),
        department: formDepartment,
        assignments: formAssignments,
        teachingExperienceYears: 4,
        joiningDate: new Date().toISOString().slice(0, 10),
      };
      const updated = [...teachers, newTeacher];
      onUpdateTeachers(updated);
      setSelectedTeacherId(newTeacher.id);
      setIsAddingNew(false);
      onShowSuccessToast(`Successfully added ${newTeacher.name} to school faculty roster.`);
    } else if (editingTeacher) {
      const updated = teachers.map((t) => {
        if (t.id === editingTeacher.id) {
          return {
            ...t,
            name: formName.trim(),
            email: formEmail.trim().toLowerCase(),
            phone: formPhone.trim(),
            designation: formDesignation.trim(),
            tscNumber: formTsc.trim(),
            department: formDepartment,
            assignments: formAssignments,
          };
        }
        return t;
      });
      onUpdateTeachers(updated);
      setEditingTeacher(null);
      onShowSuccessToast(`Updated faculty details & subjects for ${formName}`);
    }
  };

  const handleDeleteTeacher = (teacher: UserProfile) => {
    if (teachers.length <= 1) {
      alert('Cannot delete the last registered teacher account.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${teacher.name} from the portal? This will free up a seat.`)) {
      const updated = teachers.filter((t) => t.id !== teacher.id);
      onUpdateTeachers(updated);
      if (selectedTeacherId === teacher.id) {
        setSelectedTeacherId(updated[0]?.id || null);
      }
      onShowSuccessToast(`Removed ${teacher.name}. Available seats: ${MAX_TEACHERS - updated.length}`);
    }
  };

  return (
    <div
      id="teachers-details-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#6b1426] to-[#540d1e] text-white px-5 py-4 flex items-center justify-between border-b border-[#8c1632] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-sky-200">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Teachers Details &amp; Subject Allocations
                </h2>
                <span className="text-[10px] font-extrabold bg-[#3b0a16] text-sky-200 border border-sky-300/40 px-2 py-0.5 rounded-full">
                  {teacherCount}/{MAX_TEACHERS} Seats Assigned
                </span>
              </div>
              <p className="text-xs text-sky-100/90">
                Staff credentials, TSC registration, phone contacts, and Grade 7, 8 &amp; 9 subjects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && !isAddingNew && !editingTeacher && (
              <button
                onClick={handleOpenAdd}
                disabled={isAtCapacity}
                className="hidden sm:flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition active:scale-95 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Teacher</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50/50">
          {/* Add / Edit Form View */}
          {(isAddingNew || editingTeacher) ? (
            <form onSubmit={handleSaveTeacher} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[#6b1426]" />
                  <span>{isAddingNew ? 'Add New Teacher to Faculty' : `Edit Details: ${editingTeacher?.name}`}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingTeacher(null);
                  }}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Teacher Full Official Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Mr. Brian Bett"
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-stone-900 font-semibold focus:border-[#6b1426]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Official Email (Used for Google Sign-In) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. b.bett@reberwet.ac.ke"
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-stone-900 font-semibold focus:border-[#6b1426]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    TSC Registration Number
                  </label>
                  <input
                    type="text"
                    value={formTsc}
                    onChange={(e) => setFormTsc(e.target.value)}
                    placeholder="e.g. TSC/891234"
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-stone-900 font-semibold focus:border-[#6b1426]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Phone Contact Number (SMS / WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. +254 720 000 000"
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-stone-900 font-semibold focus:border-[#6b1426]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Designation / Responsibilities
                  </label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    placeholder="e.g. Senior Teacher / Class Teacher Grade 8"
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-stone-900 font-semibold focus:border-[#6b1426]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-stone-900 font-semibold focus:border-[#6b1426]"
                  >
                    <option value="Pure & Applied Sciences">Pure &amp; Applied Sciences</option>
                    <option value="Mathematics & Technical">Mathematics &amp; Technical</option>
                    <option value="Languages & Humanities">Languages &amp; Humanities</option>
                    <option value="Creative Arts & Sports">Creative Arts &amp; Sports</option>
                  </select>
                </div>
              </div>

              {/* Subject Allocations */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-stone-800 text-xs">
                    Allocated Classes &amp; Subjects (Grade 7, Grade 8, Grade 9)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAssignment}
                    className="text-xs font-bold text-[#6b1426] hover:underline flex items-center gap-1"
                  >
                    + Add Subject
                  </button>
                </div>

                <div className="space-y-2">
                  {formAssignments.map((asgn, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
                      <select
                        value={asgn.grade}
                        onChange={(e) => handleAssignmentChange(idx, 'grade', e.target.value)}
                        className="rounded-lg border border-stone-300 p-1.5 text-xs font-bold text-stone-800 bg-white"
                      >
                        {GRADES.map((g) => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>

                      <select
                        value={asgn.subject}
                        onChange={(e) => handleAssignmentChange(idx, 'subject', e.target.value)}
                        className="flex-1 rounded-lg border border-stone-300 p-1.5 text-xs font-semibold text-stone-800 bg-white"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveAssignment(idx)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        title="Remove allocation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingTeacher(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6b1426] hover:bg-[#540d1e] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Teacher Details</span>
                </button>
              </div>
            </form>
          ) : (
            /* Regular List & Detail Grid */
            <div className="space-y-4">
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by teacher name, TSC, subject..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:border-[#6b1426]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdminMode(!adminMode)}
                    className="text-xs font-bold px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{adminMode ? 'Viewing Admin Mode' : 'Switch Admin View'}</span>
                  </button>

                  <button
                    onClick={handleOpenAdd}
                    disabled={isAtCapacity}
                    className="sm:hidden flex items-center gap-1 bg-sky-600 text-white font-bold px-3 py-2 rounded-xl text-xs disabled:opacity-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Teachers Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredTeachers.map((teacher) => {
                  const isCurrent = teacher.id === currentUser.id;
                  const isHead = teacher.role === 'super_admin';

                  return (
                    <div
                      key={teacher.id}
                      className={`p-4 rounded-2xl bg-white border transition shadow-xs flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[#6b1426] ring-2 ring-rose-100'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#6b1426] font-extrabold text-sm border border-rose-200">
                              {teacher.name.charAt(0) || 'T'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-extrabold text-stone-950">
                                  {teacher.name}
                                </h4>
                                {isHead && (
                                  <span className="text-[9px] font-extrabold bg-[#6b1426] text-white px-1.5 py-0.5 rounded">
                                    Head
                                  </span>
                                )}
                                {isCurrent && (
                                  <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500 font-medium">
                                {teacher.designation || 'Teacher of Junior Secondary'}
                              </div>
                            </div>
                          </div>

                          {adminMode && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(teacher)}
                                className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition"
                                title="Edit teacher details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {teacher.role !== 'super_admin' && (
                                <button
                                  onClick={() => handleDeleteTeacher(teacher)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                                  title="Delete teacher"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Contacts & TSC */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100 mb-3">
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <Award className="w-3.5 h-3.5 text-[#6b1426] shrink-0" />
                            <span className="font-semibold truncate">
                              {teacher.tscNumber || 'TSC: Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <Phone className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                            <span className="font-semibold truncate">
                              {teacher.phone || 'No phone'}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center gap-1.5 text-stone-600">
                            <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span className="font-semibold truncate">
                              {teacher.email}
                            </span>
                          </div>
                        </div>

                        {/* Allocated Subjects */}
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-[#6b1426]" />
                            <span>Allocated CBC Teaching Subjects:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {teacher.assignments && teacher.assignments.length > 0 ? (
                              teacher.assignments.map((asgn, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-bold bg-sky-50 text-sky-950 border border-sky-200 px-2 py-0.5 rounded-md"
                                >
                                  {asgn.grade} • {asgn.subject}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-stone-400 italic">
                                General Administration
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-stone-600">
            <GraduationCap className="w-4 h-4 text-[#6b1426]" />
            <span className="font-semibold">Reberwet Junior Secondary School Official Faculty Register</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition active:scale-95 text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
