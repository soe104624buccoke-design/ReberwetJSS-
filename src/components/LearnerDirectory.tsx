import React, { useState, useMemo } from 'react';
import { Learner, UserProfile } from '../types';
import { GRADES } from '../data/initialData';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  GraduationCap,
  Calendar,
  CheckCircle2,
  X,
} from 'lucide-react';

interface LearnerDirectoryProps {
  learners: Learner[];
  onSelectLearner: (learner: Learner) => void;
  onAddLearner: (newLearner: Learner) => void;
  currentUser: UserProfile;
  onNavigateToMarks: () => void;
}

export const LearnerDirectory: React.FC<LearnerDirectoryProps> = ({
  learners,
  onSelectLearner,
  onAddLearner,
  currentUser,
  onNavigateToMarks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New learner form state
  const [newAdm, setNewAdm] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  const [newGrade, setNewGrade] = useState('Grade 8');

  // Filter learners (Requirement 11)
  const filteredLearners = useMemo(() => {
    return learners.filter((learner) => {
      // Grade filter (3 classes: Grade 7, Grade 8, Grade 9)
      if (selectedGrade !== 'all' && learner.grade !== selectedGrade) {
        return false;
      }
      // Search filter (updates as user types)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = learner.fullName.toLowerCase().includes(q);
        const matchesAdm = learner.admNo.toLowerCase().includes(q);
        if (!matchesName && !matchesAdm) return false;
      }
      return true;
    });
  }, [learners, selectedGrade, searchQuery]);

  const handleCreateLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdm || !newFirstName || !newLastName) {
      alert('Please fill in admission number and full names.');
      return;
    }

    const created: Learner = {
      id: `lrn-${Date.now()}`,
      admNo: newAdm.trim(),
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      fullName: `${newFirstName.trim()} ${newLastName.trim()}`,
      grade: newGrade,
      gender: newGender,
      academicYear: '2026',
      status: 'Active',
      attendanceRate: 95,
      guardianName: 'Parent / Guardian',
      guardianPhone: '+254 700 000000',
    };

    onAddLearner(created);
    setShowAddModal(false);
    setNewAdm('');
    setNewFirstName('');
    setNewLastName('');
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-700" />
            <span>Learners Directory</span>
          </h1>
          <p className="text-xs text-stone-600">
            Search by name or admission number. View academic history, attendance, and remarks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            id="add-learner-btn"
            className="flex items-center gap-1.5 rounded-xl bg-orange-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-900 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Learner</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS (Requirement 11) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Live Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              id="learner-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by learner name or ADM number..."
              className="w-full rounded-xl border border-stone-300 bg-stone-50 pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:border-orange-600 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grade filter (3 classes) */}
          <div className="sm:col-span-6">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-stone-800 focus:border-orange-600 focus:outline-none"
            >
              <option value="all">All Classes (Grade 7, Grade 8, Grade 9)</option>
              {GRADES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <span>
            Found <strong>{filteredLearners.length}</strong> learner(s)
          </span>
          {(selectedGrade !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedGrade('all');
                setSearchQuery('');
              }}
              className="text-orange-800 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* LEARNERS LIST (Requirement 11 & 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredLearners.map((learner) => (
          <div
            key={learner.id}
            className="group bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:shadow-md hover:border-orange-500 transition space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-900 font-extrabold text-sm border border-orange-200 group-hover:bg-orange-800 group-hover:text-white transition">
                  {learner.firstName.charAt(0)}{learner.lastName.charAt(0)}
                </div>
                <div>
                  <div className="font-extrabold text-stone-900 text-sm group-hover:text-orange-950 transition">
                    {learner.fullName}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-500">
                    <span className="font-mono font-bold bg-stone-100 px-1.5 py-0.2 rounded text-stone-700">
                      ADM {learner.admNo}
                    </span>
                    <span>• {learner.gender === 'M' ? 'Male' : 'Female'}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold bg-orange-50 text-orange-900 border border-orange-200 px-2 py-0.5 rounded-lg shrink-0">
                {learner.grade}
              </span>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Attendance</span>
                <span className="font-bold text-emerald-800">{learner.attendanceRate}%</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Term 3 Progress</span>
                <span className="font-bold text-stone-800">Evaluated</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSelectLearner(learner)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-orange-100 text-stone-800 hover:text-orange-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Profile</span>
              </button>

              <button
                onClick={onNavigateToMarks}
                className="py-2 px-3 rounded-xl bg-orange-800 hover:bg-orange-900 text-white font-bold text-xs transition"
                title="Enter Marks for this Class"
              >
                Marks
              </button>
            </div>
          </div>
        ))}

        {filteredLearners.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
            No learners match the search criteria.
          </div>
        )}
      </div>

      {/* Add Learner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-700" />
                <span>Add New Learner</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLearner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Admission Number</label>
                <input
                  type="text"
                  placeholder="e.g. 1018"
                  value={newAdm}
                  onChange={(e) => setNewAdm(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2 text-stone-800 font-mono font-bold focus:border-orange-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Caleb"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-stone-800 focus:border-orange-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kiprono"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-stone-800 focus:border-orange-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-stone-800"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Class</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-stone-800"
                  >
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-800 hover:bg-orange-900 text-white font-bold"
                >
                  Save Learner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
