import { addDays, formatDate, capitalize } from '../utils/helpers';

export const generateScheduleData = (startDate, numWeeks) => {
    // A função original generateScheduleData foi movida para cá, sem alterações na sua lógica interna.
    const schedule = [];
            const coordinations = [1, 2, 3, 4, 5, 6, 7];
            const supervisorsCoord3 = ['Lucivaldo', 'Flávio', 'Ediel', 'Tony', 'Henrique'];
            
            let currentDate = new Date(startDate);
            let coordIndex = 0;
            let supervisorIndex = 0;

            const baseDate = new Date('2025-06-02T00:00:00');
            let initialDate = new Date(baseDate);
            let initialCoordIndex = 0;
            let initialSupervisorIndex = 0;

            while (initialDate < startDate) {
                 const dayOfWeek = initialDate.getDay();
                if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                    if (dayOfWeek !== 1) {
                        if (coordinations[initialCoordIndex % 7] === 3) initialSupervisorIndex++;
                        initialCoordIndex++;
                    }
                    if (dayOfWeek !== 3) {
                       if (coordinations[initialCoordIndex % 7] === 3) initialSupervisorIndex++;
                       initialCoordIndex++;
                    }
                }
                initialDate = addDays(initialDate, 1);
            }
            coordIndex = initialCoordIndex;
            supervisorIndex = initialSupervisorIndex;

            for (let week = 0; week < numWeeks; week++) {
                const weekData = { id: `week-${week}`, startDate: new Date(currentDate), days: [] };
                const weekCoord3Appearances = [];

                let tempCurrentDate = new Date(currentDate);
                let tempCoordIndex = coordIndex;
                for (let day = 0; day < 5; day++) {
                    const dayOfWeek = tempCurrentDate.getDay();
                    if(dayOfWeek !== 1){
                        if (coordinations[tempCoordIndex % 7] === 3) weekCoord3Appearances.push({ dayOfWeek, time: '6h' });
                        tempCoordIndex++;
                    }
                    if (dayOfWeek !== 3) {
                        if (coordinations[tempCoordIndex % 7] === 3) weekCoord3Appearances.push({ dayOfWeek, time: '21h' });
                        tempCoordIndex++;
                    }
                    tempCurrentDate = addDays(tempCurrentDate, 1);
                }
                
                const isDanielWeek = weekCoord3Appearances.length >= 2 && 
                    weekCoord3Appearances.some(a => a.dayOfWeek === 1) && 
                    weekCoord3Appearances.some(a => a.dayOfWeek === 5);

                for (let day = 0; day < 5; day++) {
                    const dayOfWeek = currentDate.getDay();
                    const dayName = currentDate.toLocaleDateString('pt-BR', { weekday: 'long' });
                    const daySlots = { date: formatDate(currentDate), dayName: capitalize(dayName), slots: [] };

                    // 6h Slot
                    if (dayOfWeek === 1) {
                        daySlots.slots.push({ time: '6h', responsible: 'Pr. Joel Santos', coord: 0 });
                    } else {
                        const currentCoord = coordinations[coordIndex % 7];
                        let responsible = `Coordenação ${currentCoord}`;
                        if (currentCoord === 3) {
                            responsible = `Coordenação 3 (${supervisorsCoord3[supervisorIndex % supervisorsCoord3.length]})`;
                            supervisorIndex++;
                        }
                        daySlots.slots.push({ time: '6h', responsible, coord: currentCoord });
                        coordIndex++;
                    }

                    // 21h Slot
                    if (dayOfWeek !== 3) {
                        const currentCoord = coordinations[coordIndex % 7];
                        let responsible = `Coordenação ${currentCoord}`;
                        if (currentCoord === 3) {
                             if(isDanielWeek && dayOfWeek === 5) {
                                responsible = `Coordenação 3 (Daniel - Coordenador)`;
                             } else {
                                responsible = `Coordenação 3 (${supervisorsCoord3[supervisorIndex % supervisorsCoord3.length]})`;
                             }
                            supervisorIndex++;
                        }
                        daySlots.slots.push({ time: '21h', responsible, coord: currentCoord });
                        coordIndex++;
                    } else {
                        daySlots.slots.push({ time: '19h30', responsible: 'Culto de Oração', coord: -1 });
                    }
                    weekData.days.push(daySlots);
                    currentDate = addDays(currentDate, 1);
                }
                schedule.push(weekData);
                currentDate = addDays(currentDate, 2);
            }
            return schedule;
};