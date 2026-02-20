export const semesterInfo = {
  name: "Semester II",
  session: "2025/2026",
  duration: "18 Weeks",
  startDate: "2026-03-01", // Calendar starts viewing from here
};

export interface semesterEvent{
    title: string;
    session: string;
    duration: string;
    startDate: string;
}

export interface AcademicEvent {
  title: string;
  start: string;
  end: string;
  type: string;
  color: string;
  date: string;
}

export const academicEvents: AcademicEvent[] = [
  { title: "Course Registration", start: "2026-03-12", end: "2026-03-13", type: "admin", color: "bg-blue-100 text-blue-700", date: "12 - 13 March" },
  { title: "Lecture Part 1 (W1-W7)", start: "2026-03-16", end: "2026-05-03", type: "lecture", color: "bg-yellow-100 text-yellow-700", date: "16 March - 03 May" },
  { title: "Eid al-Fitr", start: "2026-03-20", end: "2026-03-21", type: "holiday", color: "bg-red-100 text-red-700", date: "20 - 21 March" },
  { title: "Sultan of Johor's Birthday", start: "2026-03-23", end: "2026-03-23", type: "holiday", color: "bg-red-100 text-red-700", date: "23 March" },
  { title: "Labour Day", start: "2026-05-01", end: "2026-05-01", type: "holiday", color: "bg-red-100 text-red-700", date: "01 May" },
  { title: "Lecture Part 2 (W8-W14)", start: "2026-05-04", end: "2026-06-21", type: "lecture", color: "bg-yellow-100 text-yellow-700", date: "04 May - 21 June" },
  { title: "Eldul Adha", start: "2026-05-27", end: "2026-05-27", type: "holiday", color: "bg-red-100 text-red-700", date: "27 May" },
  { title: "Wesak Day", start: "2026-05-31", end: "2026-05-31", type: "holiday", color: "bg-red-100 text-red-700", date: "31 May" },
  { title: "Agong's Birthday", start: "2026-06-01", end: "2026-06-01", type: "holiday", color: "bg-red-100 text-red-700", date: "01 June" },
  { title: "1st Day of Muharram", start: "2026-06-17", end: "2026-06-17", type: "holiday", color: "bg-red-100 text-red-700", date: "17 June" },
  { title: "Revision Week (W15)", start: "2026-06-22", end: "2026-06-28", type: "break", color: "bg-green-100 text-green-700", date: "22 - 28 June" },
  { title: "Final Exams (W16-W18)", start: "2026-06-29", end: "2026-07-19", type: "exam", color: "bg-purple-100 text-purple-700", date: "29 June - 19 July" }
];