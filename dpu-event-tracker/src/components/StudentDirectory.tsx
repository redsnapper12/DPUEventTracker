// src/components/StudentColumn.tsx
import { useState } from 'react';
import type { Student } from '../types/electron';
import { GetClassNameByYear } from '../main/helpers/helpers';

interface StudentColumnProps {
  students: Student[];
  onCheckIn: (student: Student) => void;
  onLoadDatabase: () => void;
  hasDatabase: boolean;
}

export default function StudentDirectory({ students, onCheckIn, onLoadDatabase, hasDatabase }: StudentColumnProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search) ||
      student.email?.toLowerCase().includes(search) ||
      student.classYear.includes(search)
    );
  });

  return (
    <div className="h-full bg-neutral-700 rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white text-2xl font-bold">Student Directory</h1>
        <button
          onClick={onLoadDatabase}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          {hasDatabase ? 'Change Database' : 'Load Database'}
        </button>
      </div>
      
      {hasDatabase ? (
        <>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 px-4 py-2 rounded bg-neutral-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
            {filteredStudents.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                {searchTerm ? 'No students found' : 'All students are checked in'}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-neutral-600 p-3 rounded hover:bg-neutral-500 transition-colors cursor-pointer"
                  onClick={() => onCheckIn(student)}
                >
                  <div className="text-white font-semibold">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {GetClassNameByYear(student.classYear)} {student.classYear}
                  </div>
                  {student.tag && (
                    <div className="text-xs mt-1 text-yellow-400">
                      Tag: {student.tag}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-4">
              No database loaded
            </div>
            <div className="text-gray-500 text-sm">
              Click "Load Database" to get started
            </div>
          </div>
        </div>
      )}
    </div>
  );
}