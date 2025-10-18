import type { Student } from "../types/electron";

interface CheckInProps {
  students: Student[];
  onCheckOut: (studentId: number) => void;
}

export default function CheckIn({ students, onCheckOut }: CheckInProps) {
  return (
    <div className="h-full bg-neutral-700 rounded-lg flex flex-col overflow-hidden">
      <div className="flex justify-between items-center bg-neutral-600 px-4 py-4 mb-4">
        <h1 className="text-white text-2xl font-bold">Checked In</h1>
        <h1 className="text-white text-2xl font-bold">[{students.length}]</h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {students.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No students checked in yet
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="border border-purple-600 bg-neutral-600 p-3 m-3 rounded hover:bg-neutral-500 transition-colors"
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
                  className="secondary-button"
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
