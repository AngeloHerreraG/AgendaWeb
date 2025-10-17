import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import horarioServices from '../../services/horario';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Props {
    professionalId: number;
    selectedDay: string | null;
    setSelectedDay: (value: string) => void;
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
    const weekDaysEnglishToSpanish: { [key: string]: string } = {
        'monday': 'lunes',
        'tuesday': 'martes',
        'wednesday': 'miércoles',
        'thursday': 'jueves',
        'friday': 'viernes',
        'saturday': 'sábado',
        'sunday': 'domingo'
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
        const dayEnglish = weekDaysEnglishToSpanish[daySpanish]?.toLowerCase() || daySpanish;
        if (days.map(d => d.toLowerCase()).includes(daySpanish) || days.map(d => d.toLowerCase()).includes(dayEnglish)) {
            setSelectedDay(date.format('YYYY-MM-DD'));
        }
    };

    const isDayAvailable = (date: dayjs.Dayjs): boolean => {
        const daySpanish = date.format('dddd').toLowerCase();
        const dayEnglish = weekDaysEnglishToSpanish[daySpanish]?.toLowerCase() || daySpanish;
        return days.map(d => d.toLowerCase()).includes(daySpanish) || days.map(d => d.toLowerCase()).includes(dayEnglish);
    };

    return (
        <div style={{ margin: '0 auto', fontFamily: 'Poppins', gap: '10px' }}>

            {/* Selector mes y año */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {/* Flecha izquierda */}
                <button
                    onClick={() => {
                        const previousMonth = selectedMonth.subtract(1, 'month');
                        if (previousMonth.isBefore(dayjs(), 'month')) return; // bloquea meses pasados
                        setSelectedMonth(previousMonth);
                    }}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '1.5rem',
                        cursor: selectedMonth.isAfter(dayjs(), 'month') ? 'pointer' : 'not-allowed',
                        opacity: selectedMonth.isAfter(dayjs(), 'month') ? 1 : 0.5,
                        color: selectedMonth.isAfter(dayjs(), 'month') ? 'black' : 'gray',
                    }}
                >
                    <NavigateBeforeIcon sx={{fontSize: "50px"}}/>
                </button>

                {/* Mes y año actual */}
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {selectedMonth.format('MMMM YYYY')}
                </p>

                {/* Flecha derecha */}
                <button
                    onClick={() => setSelectedMonth(selectedMonth.add(1, 'month'))}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                    }}
                >
                    <NavigateNextIcon sx={{fontSize: "50px"}}/>
                </button>

                {/* <select
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
                </select> */}
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