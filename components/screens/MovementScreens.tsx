import React, { useState } from 'react';
import { ViewState, MovementItem, UserContextType, Account } from '../../types';
import { Header, Button } from '../ui/Shared';
import { Plus, List, MoreHorizontal, ChevronRight, Check, ChevronDown, Search } from 'lucide-react';

interface MovementProps {
  changeView: (view: ViewState) => void;
  setMovement: (item: MovementItem) => void;
  movement: MovementItem | null;
  user: UserContextType;
  setPreviousView?: (view: ViewState) => void;
  previousView?: ViewState;
}

// Mock Data
const movementsData: MovementItem[] = [
    { id: '1', title: 'Pago en POS', subtitle: 'Supermercado', dateLabel: 'Hoy', time: '14:32', amount: -86.40, type: 'pos', account: 'Cuenta Sueldo' },
    { id: '2', title: 'Transferencia recibida', subtitle: 'Ana Pérez', dateLabel: 'Ayer', time: '18:15', amount: 250.00, type: 'transfer_in', account: 'Cuenta Sueldo' },
    { id: '3', title: 'Pago de servicio', subtitle: 'Entel', dateLabel: 'Hace 3 días', time: '10:22', amount: -59.90, type: 'payment', account: 'Cuenta Sueldo' },
    { id: '4', title: 'Transferencia enviada', subtitle: 'Juan López', dateLabel: 'Hace 3 días', time: '09:15', amount: -120.00, type: 'transfer_out', account: 'Cuenta Sueldo' },
    { id: '5', title: 'Depósito en efectivo', subtitle: 'Agente BCP', dateLabel: 'Hace 1 semana', time: '11:00', amount: 500.00, type: 'transfer_in', account: 'Cuenta Ahorros' },
    { id: '6', title: 'Netflix', subtitle: 'Suscripción', dateLabel: 'Hace 1 semana', time: '08:00', amount: -45.00, type: 'payment', account: 'Cuenta Ahorros' },
];

type DateFilter = 'all' | 'month' | 'today';

export const MovementsListScreen: React.FC<MovementProps> = ({ changeView, setMovement, user, setPreviousView }) => {
    const [selectedAccount, setSelectedAccount] = useState<Account>(user.accounts[0]);
    const [showAccountSelector, setShowAccountSelector] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<DateFilter>('month');

    const handleMovementClick = (m: MovementItem) => {
        setMovement(m);
        if (setPreviousView) setPreviousView(ViewState.MOVEMENTS_LIST);
        changeView(ViewState.MOVEMENT_DETAIL);
    };

    // Filtering Logic
    const filteredMovements = movementsData.filter(item => {
        // 1. Filter by Account (Consistent with selector)
        if (item.account !== selectedAccount.name) return false;

        // 2. Filter by Search Term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matches = item.title.toLowerCase().includes(term) || item.subtitle.toLowerCase().includes(term);
            if (!matches) return false;
        }

        // 3. Filter by Date
        if (dateFilter === 'today') {
            return item.dateLabel === 'Hoy';
        }
        if (dateFilter === 'month') {
            return true; 
        }

        return true;
    });

    // Grouping for display
    const groupedMovements: { [key: string]: MovementItem[] } = {};
    filteredMovements.forEach(m => {
        if (!groupedMovements[m.dateLabel]) groupedMovements[m.dateLabel] = [];
        groupedMovements[m.dateLabel].push(m);
    });

    // Sort order for groups
    const sortOrder = ['Hoy', 'Ayer', 'Hace 3 días', 'Hace 1 semana'];

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <Header 
                title="Movimientos" 
                onBack={() => changeView(ViewState.DASHBOARD)} 
            />
            
            <div className="px-6 py-4 flex-1 overflow-y-auto no-scrollbar">
                
                {/* Account Selector */}
                <div 
                    onClick={() => setShowAccountSelector(true)}
                    className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center mb-4 cursor-pointer border border-transparent hover:border-indigo-100 transition-all"
                >
                    <div>
                        <p className="text-slate-500 font-bold text-xs mb-1">Cuenta seleccionada</p>
                        <p className="font-bold text-slate-900">{selectedAccount.name} **** {selectedAccount.number.slice(-4)}</p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm mb-6 border border-slate-100">
                    <Search className="w-5 h-5 text-slate-400 ml-2" />
                    <input 
                        placeholder="Buscar movimientos..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none text-slate-900 placeholder:text-slate-400 font-medium bg-transparent"
                    />
                </div>

                {/* Time Filters */}
                <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-1">
                    <button 
                        onClick={() => setDateFilter('today')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-bold shrink-0 transition-colors ${dateFilter === 'today' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900'}`}
                    >
                        Hoy
                    </button>
                    <button 
                        onClick={() => setDateFilter('month')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-bold shrink-0 transition-colors ${dateFilter === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900'}`}
                    >
                         Último mes
                    </button>
                    <button 
                         onClick={() => setDateFilter('all')}
                         className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-bold shrink-0 transition-colors ${dateFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900'}`}
                    >
                         Todos
                    </button>
                </div>

                {/* List */}
                <div className="space-y-6 pb-20">
                    {Object.keys(groupedMovements).length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-slate-400">No se encontraron movimientos.</p>
                        </div>
                    ) : (
                        sortOrder.map(label => {
                            const items = groupedMovements[label];
                            if (!items || items.length === 0) return null;
                            return (
                                <div key={label}>
                                    <h3 className="font-bold text-lg text-slate-900 mb-4">{label}</h3>
                                    {items.map(m => (
                                        <MovementItemRow key={m.id} item={m} onClick={() => handleMovementClick(m)} />
                                    ))}
                                </div>
                            );
                        })
                    )}
                </div>

            </div>

             {/* Account Selector Modal */}
             {showAccountSelector && (
                <div className="absolute inset-0 z-50 flex items-end">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAccountSelector(false)}></div>
                    <div className="bg-white w-full rounded-t-3xl p-6 relative z-10 animate-in slide-in-from-bottom duration-300">
                        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
                        <h3 className="font-bold text-lg text-slate-900 mb-6">Selecciona una cuenta</h3>
                        
                        <div className="space-y-4 mb-6">
                            {user.accounts.map(acc => (
                                <div 
                                    key={acc.id}
                                    onClick={() => {
                                        setSelectedAccount(acc);
                                        setShowAccountSelector(false);
                                    }}
                                    className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center ${
                                        selectedAccount.id === acc.id 
                                        ? 'border-indigo-600 bg-indigo-50' 
                                        : 'border-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    <div>
                                        <p className="font-bold text-slate-900">{acc.name}</p>
                                        <p className="text-slate-500 text-sm">**** {acc.number.slice(-4)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">S/ {acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2})}</p>
                                        {selectedAccount.id === acc.id && (
                                            <div className="flex justify-end mt-1">
                                                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <Button variant="secondary" onClick={() => setShowAccountSelector(false)}>Cancelar</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

const MovementItemRow: React.FC<{ item: MovementItem, onClick: () => void }> = ({ item, onClick }) => {
    const isIncome = item.amount > 0;
    
    return (
        <div onClick={onClick} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 mb-3 cursor-pointer active:scale-[0.99] transition-transform">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
                {isIncome 
                    ? <Plus className="w-6 h-6" /> 
                    : (item.type === 'payment' ? <List className="w-6 h-6" /> : <Plus className="w-6 h-6 rotate-45" />)
                }
             </div>
             <div className="flex-1">
                 <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                 <div className="flex flex-col">
                    <span className="text-slate-500 text-xs font-medium">{item.subtitle}</span>
                    <span className="text-slate-300 text-[10px]">{item.time}</span>
                 </div>
             </div>
             <div className="text-right">
                 <span className={`block font-bold text-base ${isIncome ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {isIncome ? '+' : '-'}S/ {Math.abs(item.amount).toFixed(2)}
                 </span>
                 <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                     {isIncome ? 'Abono' : 'Cargo'}
                 </span>
             </div>
        </div>
    );
}

export const MovementDetailScreen: React.FC<MovementProps> = ({ changeView, movement, previousView }) => {
    if (!movement) return null;
    const isIncome = movement.amount > 0;

    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Detalle" onBack={() => changeView(previousView || ViewState.MOVEMENTS_LIST)} />
            
            <div className="px-6 pt-4 flex-1 overflow-y-auto no-scrollbar flex flex-col items-center">
                 <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-4 ${isIncome ? 'bg-emerald-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
                    {isIncome ? <Check className="w-14 h-14" /> : <Plus className="w-14 h-14 rotate-45" />}
                 </div>

                 <h1 className={`text-4xl font-extrabold mb-1 ${isIncome ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {isIncome ? '+' : '-'}S/ {Math.abs(movement.amount).toFixed(2)}
                 </h1>
                 <p className={`font-bold text-sm mb-8 ${isIncome ? 'text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full' : 'text-slate-500'}`}>
                    {movement.title}
                 </p>

                 <div className="bg-slate-50 w-full rounded-2xl p-6 mb-8">
                     <div className="mb-6">
                         <p className="text-slate-500 font-bold text-xs mb-1">Remitente</p>
                         <p className="font-bold text-slate-900 text-lg">{movement.subtitle}</p>
                     </div>

                     <div className="border-t border-slate-200 my-4"></div>

                     <div className="mb-4">
                         <p className="text-slate-500 font-bold text-xs mb-1">Cuenta origen</p>
                         <p className="font-bold text-slate-900">**** 1122</p>
                     </div>

                     <div className="border-t border-slate-200 my-4"></div>

                     <div className="mb-4">
                         <p className="text-slate-500 font-bold text-xs mb-1">Cuenta destino</p>
                         <p className="font-bold text-slate-900">Cuenta Sueldo **** 4321</p>
                     </div>

                     <div className="border-t border-slate-200 my-4"></div>

                     <div>
                         <p className="text-slate-500 font-bold text-xs mb-1">Fecha y hora</p>
                         <p className="font-bold text-slate-900">05 Feb 2026, {movement.time}</p>
                     </div>
                 </div>

                 <button className="w-full border border-slate-200 rounded-2xl py-4 px-4 flex items-center justify-center gap-2 font-bold text-slate-900 hover:bg-slate-50 mb-6">
                     <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-xl font-light">+</div>
                     Compartir comprobante
                 </button>
            </div>
        </div>
    );
};