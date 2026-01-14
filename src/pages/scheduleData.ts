export interface ScheduleEvent {
    id: number;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'practice' | 'worship' | 'special' | 'other';
    time?: string;
    time2?: string;
    location?: string;
    description?: string;
}

export const defaultSchedules: ScheduleEvent[] = [
    {
        id: 1,
        title: "정기 연습",
        date: "2026-01-04",
        type: "practice",
        time: "13:30",
        location: "찬양대실",
        description: "주일 오후 정기 연습입니다."
    },
    {
        id: 2,
        title: "신년 감사 예배",
        date: "2026-01-05",
        type: "worship",
        time: "11:00",
        location: "대예배실",
        description: "신년 첫 주일 예배 찬양"
    },
    {
        id: 3,
        title: "정기 연습",
        date: "2026-01-11",
        type: "practice",
        time: "13:30",
        location: "찬양대실"
    },
    {
        id: 4,
        title: "주일 예배",
        date: "2026-01-12",
        type: "worship",
        time: "11:00",
        location: "대예배실"
    },
    {
        id: 5,
        title: "정기 연습",
        date: "2026-01-18",
        type: "practice",
        time: "13:30",
        location: "찬양대실"
    },
    {
        id: 6,
        title: "주일 예배",
        date: "2026-01-19",
        type: "worship",
        time: "11:00",
        location: "대예배실"
    },
    {
        id: 7,
        title: "찬양대 MT",
        date: "2026-01-24",
        type: "special",
        time: "10:00",
        location: "가평",
        description: "동계 수련회 및 단합 대회"
    },
    {
        id: 8,
        title: "정기 연습",
        date: "2026-01-25",
        type: "practice",
        time: "13:30",
        location: "찬양대실"
    },
    {
        id: 9,
        title: "주일 예배",
        date: "2026-01-26",
        type: "worship",
        time: "11:00",
        location: "대예배실"
    }
];
