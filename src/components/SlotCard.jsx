import React from 'react';

// Envolver o componente com React.memo previne re-renderizações desnecessárias
// se as suas props não mudarem, uma otimização de performance.
const SlotCard = React.memo(({ slot, onCoord3Click, isExpanded }) => {
    const isCoord3 = slot.responsible.includes('Coordenação 3');
            const isCulto = slot.responsible.includes('Culto');
            
            let displayResponsible = slot.responsible;
            let supervisor = '';

            if (isCoord3) {
                const match = slot.responsible.match(/\(([^)]+)\)/);
                if (match) supervisor = match[1];
                displayResponsible = 'Coordenação 3';
            }

            const cardClasses = `p-3 rounded-lg flex flex-col transition-all duration-300 h-full ${
                isCulto
                    ? 'bg-amber-900/20 border border-amber-700/50'
                    : isCoord3
                    ? 'bg-blue-900/30 border border-blue-700/50 cursor-pointer hover:bg-blue-800/40'
                    : 'bg-slate-800/60 border border-slate-700/50'
            }`;

            return (
                <div className={cardClasses} onClick={isCoord3 ? () => onCoord3Click() : undefined}>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-white">{slot.time}</span>
                        <span className={`font-semibold text-sm ${isCulto ? 'text-amber-300' : 'text-slate-400'}`}>
                           {isCulto ? '' : 'Responsável'}
                        </span>
                    </div>
                    <div className="mt-1 text-center flex-grow flex flex-col justify-center">
                        <p className={`text-xl font-bold ${isCulto ? 'text-amber-300' : 'text-sky-400'}`}>
                            {displayResponsible}
                        </p>
                         {isCoord3 && isExpanded && (
                            <div className="reveal-enter reveal-enter-active mt-2 pt-2 border-t border-blue-700/50">
                                <p className="text-lg text-emerald-400 font-semibold">{supervisor}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
});

export default SlotCard;