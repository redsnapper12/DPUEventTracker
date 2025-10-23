import type { Student } from "../types/electron";
import { GetClassNameByYear } from "../main/helpers/helpers";

interface CheckInProps {
  students: Student[];
  onCheckOut: (studentId: number) => void;
}

export default function CheckIn({ students, onCheckOut }: CheckInProps) {
  // Helper function to check if preferred name should be shown
  const hasPreferredName = (student: Student) => {
    return student.preferredName != "N/A";
  };

  return (
    <div className="h-full bg-neutral-800 rounded-lg flex flex-col overflow-hidden">
      <div className="flex justify-between items-center bg-neutral-700 px-4 py-3">
        <h1 className="text-white text-2xl font-bold">Checked In</h1>
        <h1 className="text-white text-2xl font-bold">[{students.length}]</h1>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 p-4">
        {students.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No students checked in yet
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="bg-neutral-700 rounded-lg hover:bg-neutral-500 transition-colors overflow-hidden border-l-4 border-blue-500"
            >
              <div className="px-4 py-3 border-b border-neutral-600">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold">
                      {student.lastName}, {student.firstName}
                    </span>
                    {hasPreferredName(student) && (
                      <span className="text-blue-300">"{student.preferredName}"</span>
                    )}
                    <span className="px-2 py-0.5 bg-neutral-600 text-gray-300 text-xs rounded">
                      {GetClassNameByYear(student.classYear)}
                    </span>
                    {student.tag && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                        {student.tag}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onCheckOut(student.id)}
                    className="secondary-button whitespace-nowrap cursor-pointer"
                  >
                    Check Out
                  </button>
                </div>
              </div>
              
              <div className="px-4 py-2 text-sm text-gray-300 flex items-center justify-between">
                <span>{student.email}</span>
                <span className="whitespace-nowrap ml-4">{student.phoneNumber}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}