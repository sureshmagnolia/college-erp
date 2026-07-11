export const dynamic = 'force-dynamic';
import { getStudentsForExam, submitExamMarks } from '@/app/actions/exams';

export const runtime = 'edge';

export default async function ExamMarksPage({ params }: { params: { exam_id: string } }) {
  const { exam, students, existingMarks, error } = await getStudentsForExam(params.exam_id);

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  const marksMap = new Map();
  if (existingMarks) {
    existingMarks.forEach((record: any) => marksMap.set(record.student_id, record.marks_obtained));
  }

  async function handleSave(formData: FormData) {
    'use server';
    const marksData: { student_id: string, marks_obtained: number }[] = [];
    
    formData.forEach((value, key) => {
      if (!key.startsWith('$')) {
         marksData.push({ student_id: key, marks_obtained: Number(value) });
      }
    });

    await submitExamMarks(params.exam_id, marksData);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.name}</h1>
        <p className="text-gray-600 mb-8">
          Course: <span className="font-semibold">{exam.course_name}</span> | Batch: <span className="font-semibold">{exam.batch_name}</span> | Max Marks: <span className="font-semibold">{exam.max_marks}</span>
        </p>
        
        <form action={handleSave}>
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <ul className="divide-y divide-gray-200">
              {students && students.map((student: any) => {
                const currentMarks = marksMap.get(student.id) ?? '';
                return (
                  <li key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.admission_no}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        step="0.5"
                        min="0"
                        max={exam.max_marks}
                        name={student.id} 
                        defaultValue={currentMarks}
                        placeholder="Marks"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-24 sm:text-sm border-gray-300 rounded-md p-2 border" 
                      />
                      <span className="text-gray-500">/ {exam.max_marks}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            Save Marks
          </button>
        </form>
      </div>
    </div>
  );
}
