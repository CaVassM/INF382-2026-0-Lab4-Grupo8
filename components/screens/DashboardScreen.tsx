import React from 'react';
import { ViewState, UserContextType, MovementItem } from '../../types';
import { StatusBar, ActionCard } from '../ui/Shared';
import { Plus, Calendar, List, MoreVertical } from 'lucide-react';

interface DashboardProps {
  user: UserContextType;
  changeView: (view: ViewState) => void;
  setMovement: (item: MovementItem) => void;
  setPreviousView: (view: ViewState) => void;
}

export const DashboardScreen: React.FC<DashboardProps> = ({ user, changeView, setMovement, setPreviousView }) => {
  // Use the first account as the main display
  const mainAccount = user.accounts[0];

  // Helper to navigate to detail
  const handleMovementClick = (movement: MovementItem) => {
      setMovement(movement);
      setPreviousView(ViewState.DASHBOARD); // Set history to Dashboard
      changeView(ViewState.MOVEMENT_DETAIL);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header Section */}
      <div className="bg-indigo-600 text-white pt-2 pb-8 rounded-b-[2.5rem] shadow-xl">
        <div className="px-6 mb-4">
            {/* Custom Status Bar for Dark BG */}
            <div className="flex justify-between items-center py-3 text-white">
                <span className="font-semibold text-sm">9:41</span>
                <div className="flex items-center gap-1.5 opacity-90">
                    <div className="w-4 h-4 border border-white/50 rounded-sm flex items-end justify-center gap-[1px] p-[1px]">
                         <div className="w-[2px] h-[3px] bg-white"></div>
                         <div className="w-[2px] h-[5px] bg-white"></div>
                         <div className="w-[2px] h-[7px] bg-white"></div>
                    </div>
                    <div className="w-5 h-3 border border-white/50 rounded-sm relative">
                        <div className="absolute inset-[1px] bg-white rounded-[1px] w-2/3"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="px-6 flex justify-between items-start mb-6">
          <div>
            <h3 className="font-medium opacity-90 text-indigo-100">Banco Confía</h3>
            <h1 className="text-3xl font-bold">Hola, {user.name}</h1>
            <p className="text-indigo-200 text-sm">Bienvenido de nuevo</p>
          </div>
          <button 
            onClick={() => changeView(ViewState.EDIT_PROFILE)}
            className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-400 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-8 flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
            <div className="mb-2">
                <span className="text-slate-500 font-bold text-sm">{mainAccount.name}</span>
                <p className="text-slate-400 text-xs">**** {mainAccount.number.slice(-4)}</p>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-slate-900 text-4xl font-extrabold">S/ {mainAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <p className="text-slate-400 text-sm">Saldo disponible</p>
        </div>

        {/* Quick Actions */}
        <h3 className="font-bold text-lg text-slate-900 mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
            <button 
                onClick={() => changeView(ViewState.TRANSFER_MENU)}
                className="flex flex-col items-center gap-3 bg-white p-4 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
            >
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Plus className="w-7 h-7" />
                </div>
                <div className="text-center">
                    <span className="block font-bold text-slate-900 text-sm">Transferir</span>
                    <span className="block text-xs text-slate-400">Enviar dinero</span>
                </div>
            </button>
            <button 
                onClick={() => changeView(ViewState.PAYMENT_MENU)}
                className="flex flex-col items-center gap-3 bg-white p-4 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
            >
                <div className="w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                    <Calendar className="w-7 h-7" />
                </div>
                <div className="text-center">
                    <span className="block font-bold text-slate-900 text-sm">Pagar</span>
                    <span className="block text-xs text-slate-400">Servicios</span>
                </div>
            </button>
            <button 
                onClick={() => changeView(ViewState.MOVEMENTS_LIST)}
                className="flex flex-col items-center gap-3 bg-white p-4 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
            >
                <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <List className="w-7 h-7" />
                </div>
                <div className="text-center">
                    <span className="block font-bold text-slate-900 text-sm leading-tight">Movimientos</span>
                    <span className="block text-xs text-slate-400">Ver historial</span>
                </div>
            </button>
        </div>

        {/* Recent Movements */}
        <h3 className="font-bold text-lg text-slate-900 mb-4">Últimos movimientos</h3>
        <div className="flex flex-col gap-4">
            <div 
                onClick={() => handleMovementClick({ 
                    id: '1', title: 'Pago en POS', subtitle: 'Supermercado', dateLabel: 'Hoy', time: '14:32', amount: -86.40, type: 'pos', account: 'Cuenta Sueldo' 
                })}
                className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer active:bg-slate-50"
            >
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                    <Plus className="w-6 h-6 rotate-45" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-900">Pago en POS - Supermercado</h4>
                    <span className="text-slate-400 text-xs">Hoy</span>
                </div>
                <div className="text-right">
                    <span className="block font-bold text-slate-900">-S/ 86.40</span>
                    <span className="inline-block bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">Cargo</span>
                </div>
            </div>

            <div 
                onClick={() => handleMovementClick({ 
                    id: '2', title: 'Transferencia recibida', subtitle: 'Ana Pérez', dateLabel: 'Ayer', time: '18:15', amount: 250.00, type: 'transfer_in', account: 'Cuenta Sueldo' 
                })}
                className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer active:bg-slate-50"
            >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
                    <Plus className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-900">Transferencia - Ana Pérez</h4>
                    <span className="text-slate-400 text-xs">Ayer</span>
                </div>
                <div className="text-right">
                    <span className="block font-bold text-emerald-500">+S/ 250.00</span>
                    <span className="inline-block bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded">Abono</span>
                </div>
            </div>
        </div>
        
        <div className="text-center mt-6">
            <button onClick={() => changeView(ViewState.MOVEMENTS_LIST)} className="text-indigo-600 font-semibold">Ver todos</button>
        </div>
      </div>
    </div>
  );
};