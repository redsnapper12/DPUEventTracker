import type { Student } from '../types/electron';

interface CheckInColumnProps {
  students: Student[];
  onCheckOut: (studentId: number) => void;
}

export default function CheckIn({ students, onCheckOut }: CheckInColumnProps) {
  return (
    <div className="h-full bg-neutral-700 rounded-lg p-4 flex flex-col">
      <h1 className="text-white text-2xl font-bold mb-4">
        Checked In ({students.length})
      </h1>
  
      <div className="flex-1 overflow-y-auto space-y-2">
        {students.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No students checked in yet
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="bg-green-900/30 border border-green-600 p-3 rounded"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-semibold">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Class of {student.classYear}
                  </div>
                  {student.tag && (
                    <div className="text-xs mt-1 text-yellow-400">
                      {student.tag}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onCheckOut(student.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Check Out
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}