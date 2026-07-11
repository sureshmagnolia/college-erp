import { getStudentsForAttendance, submitAttendance } from '@/app/actions/academic';
import { redirect } from 'next/navigation';



// hardcoded for demo
const FACULTY_ID = 'faculty_1';

export default async function MarkAttendancePage({
  params,
  searchParams,
}: {
  params: { timetable_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const timetableId = params.timetable_id;
  const dateStr = (searchParams.date as string) || new Date().toISOString().split('T')[0];

  const { students, existingAttendance, error } = await getStudentsForAttendance(timetableId, dateStr);

  if (error) {
    return <div className="p-8 text-red-600">Error loading students: {error}</div>;
  }

  // Pre-fill existing attendance or default to PRESENT
  const existingMap = new Map();
  if (existingAttendance) {
    existingAttendance.forEach((record: any) => existingMap.set(record.student_id, record.status));
  }

  async function handleSave(formData: FormData) {
    'use server';
    // Parse the form data dynamically
    const attendanceData: { student_id: string, status: string }[] = [];
    
    // In FormData, radio buttons are grouped by name, which we set to the student_id
    formData.forEach((value, key) => {
      // Ignore Next.js internal hidden fields like $ACTION_ID_...
      if (!key.startsWith('$')) {
         attendanceData.push({ student_id: key, status: value as string });
      }
    });

    await submitAttendance(timetableId, dateStr, FACULTY_ID, attendanceData);
    redirect('/faculty/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
        <p className="text-gray-600 mb-8">Date: {dateStr}</p>
        
        <form action={handleSave}>
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <ul className="divide-y divide-gray-200">
              {students && students.map((student: any) => {
                const currentStatus = existingMap.get(student.id) || 'PRESENT';
                return (
                  <li key={student.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-500">Admission No: {student.admission_no}</p>
                    </div>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name={student.id} value="PRESENT" defaultChecked={currentStatus === 'PRESENT'} className="form-radio h-4 w-4 text-green-600" />
                        <span className="ml-2 text-sm text-gray-700">Present</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name={student.id} value="ABSENT" defaultChecked={currentStatus === 'ABSENT'} className="form-radio h-4 w-4 text-red-600" />
                        <span className="ml-2 text-sm text-gray-700">Absent</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name={student.id} value="DUTY_LEAVE" defaultChecked={currentStatus === 'DUTY_LEAVE'} className="form-radio h-4 w-4 text-blue-600" />
                        <span className="ml-2 text-sm text-gray-700">Duty Leave</span>
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            Save Attendance
          </button>
        </form>
      </div>
    </div>
  );
}
