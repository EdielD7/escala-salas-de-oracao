import React, { useState, useEffect, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { getMondayOfDate, formatDate } from './utils/helpers';
import { generateScheduleData } from './logic/scheduleGenerator';
import WeekCard from './components/WeekCard';
import PdfLayout from './components/PdfLayout';

function App() {
    const [numWeeks, setNumWeeks] = useState(1);
            const [filterCoord, setFilterCoord] = useState('all');
            const [scheduleData, setScheduleData] = useState([]);
            const [isLoading, setIsLoading] = useState(true);
            const [expandedSlots, setExpandedSlots] = useState({});
            
            const [pdfWeekData, setPdfWeekData] = useState(null);
            const pdfRef = React.useRef();

            useEffect(() => {
                setIsLoading(true);
                const today = new Date();
                const monday = getMondayOfDate(today);
                const data = generateScheduleData(monday, numWeeks);
                setScheduleData(data);
                setIsLoading(false);
            }, [numWeeks]);
            
            const handleGeneratePdf = (weekId) => {
                const weekDataToRender = scheduleData.find(w => w.id === weekId);
                if (weekDataToRender) {
                    setPdfWeekData(weekDataToRender); 
                }
            };
            
            useEffect(() => {
        // A condição continua a mesma
        if (pdfWeekData && pdfRef.current) {
            
            // html2canvas também continua igual
            html2canvas(pdfRef.current, { scale: 3 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');

                // ---- AQUI ESTÁ A CORREÇÃO ----
                // Trocamos 'new jspdf.jsPDF' por 'new jsPDF'
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                // -----------------------------

                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                const weekStart = formatDate(pdfWeekData.startDate);
                pdf.save(`escala-oracao-semana-${weekStart}.pdf`);
                
                // Resetar o estado para permitir gerar outros PDFs depois
                setPdfWeekData(null);
            }).catch(err => {
                // Adicionar um .catch é uma boa prática para ver erros silenciosos
                console.error("Erro durante a geração do PDF:", err);
                setPdfWeekData(null); // Reseta mesmo se der erro
            });
        }
    }, [pdfWeekData]);

            const filteredSchedule = useMemo(() => {
                if (filterCoord === 'all') return scheduleData;
                const coordToFilter = parseInt(filterCoord);
                return scheduleData.map(week => {
                    const filteredDays = week.days.map(day => {
                        const filteredSlots = day.slots.filter(slot => slot.coord === coordToFilter || slot.coord <= 0);
                        return { ...day, slots: filteredSlots };
                    }).filter(day => day.slots.length > 0);
                    if (filteredDays.length > 0) return { ...week, days: filteredDays };
                    return null;
                }).filter(Boolean);
            }, [scheduleData, filterCoord]);

            const toggleSlotExpansion = (slotId) => {
                setExpandedSlots(prev => ({ ...prev, [slotId]: !prev[slotId] }));
            }

            return (
                <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col">
                    <div className="max-w-7xl mx-auto w-full">
                        <header className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-white">IDPB <span className="text-amber-400">Filadélfia</span></h1>
                            <p className="text-md text-slate-400 mt-1 tracking-wider">UMA IGREJA COM A MISSÃO DE AMAR</p>
                            <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mt-6">Escala das Salas de Oração</h2>
                        </header>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Semanas Exibidas:</span>
                                <span className="font-bold text-xl w-8 text-center">{numWeeks}</span>
                                <div className="flex flex-col">
                                  <button onClick={() => setNumWeeks(w => w + 1)} className="px-2 py-0 bg-slate-600 rounded-t-md hover:bg-slate-700 transition-colors text-lg">+</button>
                                  <button onClick={() => setNumWeeks(w => Math.max(1, w - 1))} className="px-2 py-0 bg-slate-600 rounded-b-md hover:bg-slate-700 transition-colors text-lg">-</button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <label htmlFor="coord-filter" className="font-semibold">Coordenação:</label>
                                <select 
                                    id="coord-filter" 
                                    value={filterCoord}
                                    onChange={(e) => setFilterCoord(e.target.value)}
                                    className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2 focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="all">Todas</option>
                                    {[...Array(7).keys()].map(i => (
                                        <option key={i+1} value={i+1}>Coord. {i+1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <p className="text-center text-xl">Gerando escala...</p>
                        ) : (
                            <div>
                                {filteredSchedule.length > 0 ? filteredSchedule.map(week => (
                                    <WeekCard 
                                      key={week.id} 
                                      weekData={week} 
                                      onGeneratePdf={handleGeneratePdf} 
                                      onCoord3Click={toggleSlotExpansion}
                                      expandedSlots={expandedSlots}
                                    />
                                )) : (
                                    <div className="text-center bg-slate-800 p-8 rounded-lg">
                                        <h3 className="text-2xl font-semibold text-amber-400">Nenhum horário encontrado</h3>
                                        <p className="text-slate-300 mt-2">A coordenação selecionada não possui escalas no período exibido.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <footer className="w-full mt-auto text-center p-4 text-slate-500 text-sm">
                        Desenvolvido por Ediel Santos
                    </footer>

                    <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
                      <PdfLayout ref={pdfRef} weekData={pdfWeekData} />
                    </div>
                </div>
            );
}

export default App;