import { useState } from "react";
import type { Student } from "../types/electron";
import { GetClassNameByYear } from "../main/helpers/helpers";
import { HasPreferredName } from "../main/helpers/helpers";

interface StudentColumnProps {
  students: Student[];
  onCheckIn: (student: Student) => void;
  onLoadDatabase: () => void;
  hasDatabase: boolean;
}

export default function StudentDirectory({
  students,
  onCheckIn,
  onLoadDatabase,
  hasDatabase,
}: StudentColumnProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase().trim();

    // If search is empty, show all students
    if (!search) return true;

    // Search through multiple fields
    const firstName = student.firstName.toLowerCase();
    const lastName = student.lastName.toLowerCase();
    const preferredName = student.preferredName?.toLowerCase() || "";
    const email = student.email.toLowerCase();
    const phone = student.phoneNumber.replace(/\D/g, ""); // Remove non-digits
    const searchPhone = search.replace(/\D/g, "");
    const tag = student.tag?.toLowerCase() || "";
    const classYear = student.classYear?.toString() || "";
    const fullName = `${firstName} ${lastName}`;
    const reverseName = `${lastName} ${firstName}`;

    return (
      firstName.includes(search) ||
      lastName.includes(search) ||
      preferredName.includes(search) ||
      fullName.includes(search) ||
      reverseName.includes(search) ||
      email.includes(search) ||
      (searchPhone && phone.includes(searchPhone)) ||
      tag.includes(search) ||
      classYear.includes(search)
    );
  });

  return (
    <div className="h-full bg-neutral-800 rounded-lg flex flex-col overflow-hidden">
      <div className="bg-neutral-700 px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Student Directory</h1>
        <button onClick={onLoadDatabase} className="primary-button">
          {hasDatabase ? "Change Database" : "Load Database"}
        </button>
      </div>
      <div className="flex-1 min-h-0 flex flex-col p-4">
        {hasDatabase ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email, phone, tag, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <div className="text-gray-400 text-sm mt-2">
                  Found {filteredStudents.length} student
                  {filteredStudents.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
              {filteredStudents.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  {searchTerm
                    ? "No students found"
                    : "All students are checked in"}
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-neutral-700 mr-2 rounded-lg hover:bg-neutral-600 transition-colors cursor-pointer overflow-hidden"
                    onClick={() => onCheckIn(student)}
                  >
                    <div className="px-4 py-2 border-b border-neutral-500">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          {student.lastName}, {student.firstName}
                        </span>
                        {HasPreferredName(student) && (
                          <span className="text-blue-300">
                            "{student.preferredName}"
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-neutral-600 text-gray-300 text-xs rounded">
                          {GetClassNameByYear(student.classYear)}
                        </span>
                        {student.tag && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            {student.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-1.5 text-sm text-gray-300 flex items-center justify-between">
                      <span>{student.email}</span>
                      <span className="whitespace-nowrap ml-4">
                        {student.phoneNumber}
                      </span>
                    </div>
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
    </div>
  );
}
