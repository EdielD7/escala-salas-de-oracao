import React from 'react';
// As importações que faltavam estão aqui:
import { formatDate, addDays } from '../utils/helpers';

const PdfLayout = React.forwardRef(({ weekData }, ref) => {
     if(!weekData) {
        return null;
     }

     const weekStart = formatDate(weekData.startDate);
     const weekEnd = formatDate(addDays(weekData.startDate, 4));

     return (
        <div ref={ref} className="pdf-container">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
                    <h1 style={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#0f172a' }}>IDPB <span style={{color: '#f59e0b'}}>Filadélfia</span></h1>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#334155' }}>Escala da Sala de Oração</h2>
                    <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#475569' }}>Semana de {weekStart} a {weekEnd}</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {weekData.days.map(day => (
                    <div key={day.date} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem' }}>
                        <h3 style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                            {day.dayName}<br/><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{day.date}</span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {day.slots.map(slot => {
                                const isCoord3 = slot.responsible.includes('Coordenação 3');
                                let mainText = slot.responsible;
                                if (isCoord3) {
                                    mainText = 'Coordenação 3';
                                }

                                return (
                                    <div key={slot.time} style={{ backgroundColor: slot.responsible.includes('Culto') ? '#fffbeb' : '#f8fafc', borderRadius: '0.375rem', padding: '0.5rem', textAlign: 'center' }}>
                                        <p style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#0f172a' }}>{slot.time}</p>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 'bold', wordBreak: 'break-word', color: slot.responsible.includes('Culto') ? '#b45309' : '#1d4ed8', marginTop: '0.25rem' }}>
                                            {mainText}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                Gerado em {formatDate(new Date())} | UMA IGREJA COM A MISSÃO DE AMAR
            </p>
        </div>
     );
});

export default PdfLayout;