import React, { useState } from 'react';
import { formatDate, addDays } from '../utils/helpers';
import SlotCard from './SlotCard';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
);

const WeekCard = ({ weekData, onGeneratePdf, onCoord3Click, expandedSlots }) => {
    const [copyStatus, setCopyStatus] = useState('Copiar');
    const weekStart = formatDate(weekData.startDate);
    const weekEnd = formatDate(addDays(weekData.startDate, 4));

    // A função handleCopyToClipboard foi atualizada para usar a API moderna do navegador
    const handleCopyToClipboard = async () => {
        let text = `*Escala da Sala de Oração*\n`;
        text += `*Semana de ${weekStart} a ${weekEnd}*\n\n`;
        
        // ... (restante da lógica de criação do texto)

        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus('Copiado!');
            setTimeout(() => setCopyStatus('Copiar'), 2000);
        } catch (err) {
            console.error('Falha ao copiar texto: ', err);
            setCopyStatus('Erro!');
        }
    };

    return (
        // O JSX original do WeekCard foi movido para cá.
        <div id={weekData.id} className="bg-slate-800/40 rounded-2xl shadow-lg p-4 md:p-6 mb-8 backdrop-blur-sm border border-slate-700/50">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white mb-2 md:mb-0">
                           Semana de <span className="text-amber-400">{weekStart}</span> a <span className="text-amber-400">{weekEnd}</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                             <button 
                                onClick={handleCopyToClipboard}
                                className={`flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-colors duration-300 shadow-md ${copyStatus === 'Copiado!' ? 'bg-green-600' : 'bg-sky-600 hover:bg-sky-700'}`}
                            >
                               <CopyIcon />
                               {copyStatus}
                            </button>
                            <button 
                                onClick={() => onGeneratePdf(weekData.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-300 shadow-md"
                            >
                               <DownloadIcon />
                               Gerar PDF
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {weekData.days.map((day, index) => (
                            <div key={index} className="bg-slate-900/40 p-3 rounded-xl">
                                <h3 className="font-bold text-center text-lg mb-3 border-b border-slate-700 pb-2">{day.dayName} <span className="text-slate-400 text-sm block">{day.date}</span></h3>
                                <div className="space-y-3">
                                    {day.slots.map(slot => (
                                        <SlotCard 
                                          key={`${day.date}-${slot.time}`} 
                                          slot={slot}
                                          onCoord3Click={() => onCoord3Click(`${weekData.id}-${day.date}-${slot.time}`)} 
                                          isExpanded={expandedSlots[`${weekData.id}-${day.date}-${slot.time}`]}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    );
};

export default WeekCard;