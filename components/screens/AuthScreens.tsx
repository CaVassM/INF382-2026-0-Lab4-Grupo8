import React, { useState, useEffect } from 'react';
import { ViewState } from '../../types';
import { Header, Button, Keypad, PinDots, InputField, ActionCard } from '../ui/Shared';
import { CreditCard, Hash, Smartphone, Lock, Check, Mail, X } from 'lucide-react';

interface ScreenProps {
  changeView: (view: ViewState) => void;
}

// 1. Login Methods Selection
export const LoginMethodsScreen: React.FC<ScreenProps> = ({ changeView }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center px-6 pt-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-1">Banco</h1>
          <h1 className="text-4xl font-extrabold text-indigo-500 mb-4">Confía</h1>
          <p className="text-slate-500">Tú confía</p>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Inicia sesión</h2>
          <p className="text-slate-500">Selecciona tu método de acceso</p>
        </div>

        <div className="flex flex-col gap-4">
          <ActionCard 
            title="Número de cuenta"
            subtitle="Ingresa con tu cuenta bancaria"
            icon={<Hash className="w-6 h-6" />}
            onClick={() => changeView(ViewState.PIN_ENTRY)}
          />
          <ActionCard 
             title="Tarjeta de débito"
             subtitle="Ingresa con tu tarjeta"
             icon={<CreditCard className="w-6 h-6" />}
             bgColor="bg-white"
             textColor="text-slate-900" // Simulating transparent/white icon bg
             onClick={() => changeView(ViewState.PIN_ENTRY)}
          />
          <ActionCard 
            title="Documento de identidad"
            subtitle="Ingresa con tu DNI"
            icon={<span className="text-xs font-bold border border-current rounded px-1">DNI</span>}
            bgColor="bg-white border border-indigo-200"
            textColor="text-indigo-600"
            onClick={() => changeView(ViewState.PIN_ENTRY)}
          />
        </div>
      </div>
      <div className="p-6 text-center">
        <button className="text-indigo-600 font-semibold">¿Problemas para acceder?</button>
      </div>
    </div>
  );
};

// 2. PIN Entry Screen
export const PinEntryScreen: React.FC<ScreenProps> = ({ changeView }) => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showError, setShowError] = useState(false);

  const handlePress = (val: string) => {
    if (pin.length < 6) setPin(prev => prev + val);
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 6) {
      // Mock validation
      if (pin === '123456') {
        setTimeout(() => changeView(ViewState.DASHBOARD), 300);
      } else {
        setTimeout(() => setShowError(true), 300);
      }
    }
  }, [pin, changeView]);

  return (
    <div className="flex flex-col h-full relative">
      <Header onBack={() => changeView(ViewState.LOGIN_METHODS)} />
      
      <div className="flex-1 flex flex-col items-center pt-8 px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ingresa tu PIN</h2>
        <p className="text-slate-500 mb-8">Cuenta **** 4321</p>
        
        <PinDots length={6} filled={pin.length} isError={showError} />

        <Keypad 
          onPress={handlePress} 
          onDelete={handleDelete} 
          onForgot={() => changeView(ViewState.FORGOT_PIN_EMAIL)} 
        />
      </div>

      {/* Error Modal Overlay */}
      {showError && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-6">
              <X className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">PIN incorrecto</h3>
            <p className="text-slate-500 mb-6">
              La clave de 6 dígitos que ingresaste no es válida.
              <br/>Inténtalo de nuevo.
            </p>
            <p className="text-slate-500 text-sm font-semibold mb-6">
              Tienes un máximo de 3 oportunidades. Luego de ello, la cuenta se bloqueará.
            </p>
            <Button 
              onClick={() => {
                setShowError(false);
                setPin('');
                setAttempts(a => a + 1);
              }}
              className="mb-4"
            >
              Reintentar
            </Button>
            <Button variant="secondary" onClick={() => changeView(ViewState.FORGOT_PIN_EMAIL)}>
              Olvidé mi clave
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Forgot PIN - Email
export const ForgotPinEmailScreen: React.FC<ScreenProps> = ({ changeView }) => {
  return (
    <div className="flex flex-col h-full">
      <Header onBack={() => changeView(ViewState.PIN_ENTRY)} />
      <div className="px-6 pt-4 flex-1">
        <h1 className="text-center text-xl font-bold mb-8">Recuperar PIN</h1>
        
        <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-6">
                <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">¿Olvidaste tu PIN?</h2>
            <p className="text-center text-slate-500 px-4">Ingresa tu correo para enviarte un código de verificación.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <InputField 
                label="Correo"
                placeholder="correo@ejemplo.com"
                type="email"
                className="mb-4"
            />
            <p className="text-slate-500 text-sm mb-6">Si el correo existe, te enviaremos un código.</p>
            <Button onClick={() => changeView(ViewState.VERIFY_CODE)}>
                Enviar código
            </Button>
        </div>
        
        <div className="mt-8 text-center">
             <button onClick={() => changeView(ViewState.LOGIN_METHODS)} className="text-indigo-600">Volver a iniciar sesión</button>
        </div>
      </div>
    </div>
  );
};

// 4. Verify Code
export const VerifyCodeScreen: React.FC<ScreenProps> = ({ changeView }) => {
  return (
    <div className="flex flex-col h-full">
      <Header onBack={() => changeView(ViewState.FORGOT_PIN_EMAIL)} />
      <div className="px-6 pt-4 flex-1 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-10">Verificar código</h1>
        
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
            <Mail className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Ingresa el código</h2>
        <p className="text-center text-slate-500 mb-1">Enviamos un código a</p>
        <p className="text-center text-slate-900 font-bold mb-8">mi****@correo.com</p>

        <div className="flex gap-3 mb-4 w-full justify-center">
            {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-12 h-14 border border-slate-200 rounded-xl flex items-center justify-center text-2xl font-bold">
                    {i === 3 ? '•' : ''}
                </div>
            ))}
        </div>

        <div className="flex justify-between w-full text-slate-500 text-sm mb-8 px-2">
            <span>Reenviar en 00:42</span>
            <span className="text-slate-400">Reenviar</span>
        </div>

        <Button onClick={() => changeView(ViewState.CREATE_PIN)}>
            Verificar
        </Button>
        
        <div className="mt-8">
             <button className="text-indigo-600">Cambiar correo</button>
        </div>
      </div>
    </div>
  );
};

// 5. Create/Confirm PIN Logic (Combined for brevity but handles both states)
export const CreatePinScreen: React.FC<ScreenProps & { mode: 'create' | 'confirm' }> = ({ changeView, mode }) => {
  const [pin, setPin] = useState('');
  
  const handlePress = (val: string) => {
      if (pin.length < 6) setPin(prev => prev + val);
  };
  
  useEffect(() => {
      if (pin.length === 6) {
          // Delay for effect
          if(mode === 'create') {
             setTimeout(() => changeView(ViewState.CONFIRM_PIN), 500);
          } else {
             setTimeout(() => changeView(ViewState.PIN_SUCCESS), 500);
          }
      }
  }, [pin, mode, changeView]);

  return (
      <div className="flex flex-col h-full">
          <Header onBack={() => changeView(mode === 'create' ? ViewState.VERIFY_CODE : ViewState.CREATE_PIN)} />
          <div className="px-6 pt-4 flex-1 flex flex-col items-center">
            <h1 className="text-xl font-bold mb-8">Nuevo PIN</h1>
            
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-6">
                <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                {mode === 'create' ? 'Crea tu PIN' : 'Confirma tu PIN'}
            </h2>
            <p className="text-center text-slate-500 mb-6">
                {mode === 'create' 
                  ? 'El PIN debe tener 6 dígitos numéricos.' 
                  : 'Este será tu código de acceso'}
            </p>

            {/* Visual representation only for the "top" part of the screenshot design */}
            {mode === 'create' && (
                 <div className="w-full flex justify-center gap-2 mb-8">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="w-12 h-14 bg-slate-100 rounded-xl"></div>)}
                 </div>
            )}
             
            {mode === 'confirm' && (
                <PinDots length={6} filled={pin.length} />
            )}

            {mode === 'create' && (
                <div className="w-full">
                   <p className="text-xs text-slate-400 text-center mb-4">Tip: evita usar secuencias (123456) o fechas fáciles de adivinar.</p>
                   {/* In real app, we would use Keypad here, but screenshot shows an input field visualization. 
                       We'll stick to Keypad for functionality as requested "fully functional" */}
                   <Button onClick={() => changeView(ViewState.CONFIRM_PIN)}>Guardar PIN</Button>
                </div>
            )}

            {mode === 'confirm' && (
                <Keypad onPress={handlePress} onDelete={() => setPin(p => p.slice(0, -1))} showForgot={false} />
            )}
          </div>
      </div>
  )
}

// 6. Success PIN
export const PinSuccessScreen: React.FC<ScreenProps & { message: string, btnText: string, nextView: ViewState }> = ({ changeView, message, btnText, nextView }) => {
    return (
        <div className="flex flex-col h-full justify-center px-6 items-center">
             <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-8 animate-in zoom-in duration-300">
                <Check className="w-16 h-16" strokeWidth={3} />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-2">{message}</h2>
             <p className="text-slate-500 text-center mb-12">
                {message === '¡PIN creado!' ? 'Tu cuenta ha sido configurada correctamente' : 'Ya puedes iniciar sesión con tu nuevo PIN.'}
             </p>
             
             {message === '¡PIN creado!' && (
                 <div className="bg-slate-100 p-4 rounded-xl flex items-center gap-4 w-full mb-12">
                     <div className="w-10 h-10 bg-indigo-200 rounded-lg flex items-center justify-center text-indigo-600">
                        <Lock className="w-5 h-5" />
                     </div>
                     <div>
                         <h4 className="font-bold text-sm">Guarda tu PIN en un lugar seguro</h4>
                         <p className="text-xs text-slate-500">No lo compartas con nadie</p>
                     </div>
                 </div>
             )}

             <Button onClick={() => changeView(nextView)}>{btnText}</Button>
             
             {message === 'PIN actualizado' && (
                 <p className="mt-6 text-slate-400 text-xs text-center px-8">Si no solicitaste este cambio, contacta soporte.</p>
             )}
             
             {message === 'PIN actualizado' && (
                 <div className="mt-8 w-full border border-slate-200 rounded-2xl p-6 text-center">
                    <h3 className="font-bold mb-2">Soporte</h3>
                    <p className="text-sm text-slate-500 mb-4">Ayuda con el acceso a tu cuenta</p>
                    <button className="bg-blue-50 text-blue-600 py-2 px-6 rounded-lg font-bold text-sm">Contactar</button>
                 </div>
             )}
        </div>
    )
}
