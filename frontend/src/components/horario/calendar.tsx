import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import horarioServices from '../../services/horario';

interface Props {
    professionalId: number;
    selectedDay: string | null;
    setSelectedDay: (value: string) => void;
}

const selectStyle = {
    fontFamily: 'Poppins, sans-serif',
    padding: '8px',
    borderRadius: '1000px',
    border: '1px solid black',
    width: "100%",
    fontSize: '1.2em',
    textAlign: 'center' as const,
}

const CalendarSelector = (props: Props) => {
    const { professionalId, selectedDay, setSelectedDay } = props;
    const [days, setDays] = useState<string[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    useEffect(() => {
        const fetchProfesionalSchedule = async () => {
            const data = await horarioServices.getProfesionalSchedule(professionalId);
            if (data && data.days) setDays(data.days); // días en español: LUNES, MARTES, etc.
        };
        fetchProfesionalSchedule();
    }, [professionalId]);

    dayjs.locale('es');

    // Días de la semana (lunes primero)
    const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const weekDaysEnglish: { [key: string]: string } = {
        'lunes': 'Monday',
        'martes': 'Tuesday',
        'miércoles': 'Wednesday',
        'jueves': 'Thursday',
        'viernes': 'Friday',
        'sábado': 'Saturday',
        'domingo': 'Sunday'
    }

    // Primer día del mes
    const firstDay = selectedMonth.startOf('month');
    const daysInMonth = selectedMonth.daysInMonth();

    // Generamos las celdas del calendario incluyendo los días vacíos del inicio
    const calendarCells: (dayjs.Dayjs | null)[] = [];

    // Ajustamos para que lunes sea la columna 0
    const startDayIndex = (firstDay.day() + 6) % 7; // dayjs: domingo=0
    for (let i = 0; i < startDayIndex; i++) calendarCells.push(null);

    for (let i = 0; i < daysInMonth; i++) {
        calendarCells.push(firstDay.add(i, 'day'));
    }

    const handleDayClick = (date: dayjs.Dayjs) => {
        const daySpanish = date.format('dddd').toLowerCase();
        const dayEnglish = weekDaysEnglish[daySpanish].toLowerCase();
        if (days.map(d => d.toLowerCase()).includes(daySpanish) || days.map(d => d.toLowerCase()).includes(dayEnglish)) {
            setSelectedDay(date.format('YYYY-MM-DD'));
        }
    };

    const isDayAvailable = (date: dayjs.Dayjs): boolean => {
        const daySpanish = date.format('dddd').toLowerCase();
        const dayEnglish = weekDaysEnglish[daySpanish].toLowerCase();
        console.log(days, daySpanish);
        return days.map(d => d.toLowerCase()).includes(daySpanish) || days.map(d => d.toLowerCase()).includes(dayEnglish);
    };

    return (
        <div style={{ margin: '0 auto', fontFamily: 'Poppins', gap: '10px' }}>

            {/* Selector mes y año */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select
                    style={selectStyle}
                    value={selectedMonth.month()}
                    onChange={(e) => setSelectedMonth(selectedMonth.month(Number(e.target.value)))}
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                            {dayjs().month(i).format('MMMM')}
                        </option>
                    ))}
                </select>
                <select
                    style={selectStyle}
                    value={selectedMonth.year()}
                    onChange={(e) => setSelectedMonth(selectedMonth.year(Number(e.target.value)))}
                >
                    {Array.from({ length: 5 }, (_, i) => {
                        const year = dayjs().year() + i;
                        return (
                            <option key={i} value={year}>
                                {year}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Encabezado días */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold' }}>
                {weekDays.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* Celdas del calendario */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                {calendarCells.map((date, idx) => {
                    if (!date) return <div key={idx}></div>;

                    const isValid = isDayAvailable(date);
                    const isSelected = selectedDay === date.format('YYYY-MM-DD');
                    const isToday = date.isSame(dayjs(), 'day');

                    return (
                        <div
                            key={date.format('YYYY-MM-DD')}
                            style={{
                                padding: '10px',
                                backgroundColor: isSelected ? '#5170ff' : 
                                               isValid ? '#9deaff' : '#03045e',
                                color: isSelected ? 'white' : 
                                       isValid ? 'black' : '#ffffffff',
                                fontWeight: isValid ? 'bold' : 'normal',
                                // borderRadius: '8px',
                                textAlign: 'center',
                                cursor: isValid ? 'pointer' : 'not-allowed',
                                border: isToday ? '3px solid black' : '1px solid black',
                            }}
                            onClick={() => isValid && handleDayClick(date)}
                            title={isValid ? 'Día disponible' : 'Día no disponible'}
                        >
                            {date.date()}
                        </div>
                    );
                })}
            </div>
            
            {/* Leyenda */}
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                    <div style={{ width: '15px', height: '15px', backgroundColor: '#9deaff', borderRadius: '3px' }}></div>
                    <span>Días disponibles</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', backgroundColor: '#03045e', borderRadius: '3px' }}></div>
                    <span>Días no disponibles</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarSelector;