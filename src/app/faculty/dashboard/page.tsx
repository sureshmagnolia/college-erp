export const dynamic = 'force-dynamic';
import { getFacultyTimetable } from '@/app/actions/academic';
import Link from 'next/link';

export const runtime = 'edge';

// Hardcoding for demo. In real app, get from session via NextAuth auth()
const FACULTY_ID = 'faculty_1'; 

export default async function FacultyDashboard() {
  // Day of week: 1=Mon, 2=Tue. Today is Monday in this test scenario.
  const DAY_OF_WEEK = 1; 
  const { timetable, error } = await getFacultyTimetable(FACULTY_ID, DAY_OF_WEEK);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Faculty Dashboard</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Timetable</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Date: {todayStr}</p>
          </div>
          
          {error ? (
             <div className="p-4 text-red-600">Error: {error}</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {timetable && timetable.length > 0 ? (
                timetable.map((slot: any) => (
                  <li key={slot.timetable_id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                        Hour {slot.hour_slot}
                      </span>
                      <h4 className="text-lg font-semibold text-gray-900">{slot.course_name}</h4>
                      <p className="text-sm text-gray-500">Batch: {slot.batch_name}</p>
                    </div>
                    <div>
                      <Link 
                        href={`/faculty/attendance/${slot.timetable_id}?date=${todayStr}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Mark Attendance
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-6 text-gray-500">No classes scheduled for today!</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
