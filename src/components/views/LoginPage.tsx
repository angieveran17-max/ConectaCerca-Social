import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { HeartHandshake, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  initialMode?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialMode = 'login' }) => {
  const { login, register, quickDemoLogin, setCurrentRoute, addToast } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (mode === 'register' && !name.trim()) {
      errs.name = 'El nombre es obligatorio.';
    }
    if (!email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Ingresa un correo electrónico válido.';
    }

    if (mode !== 'forgot') {
      if (!password) {
        errs.password = 'La contraseña es obligatoria.';
      } else if (password.length < 6) {
        errs.password = 'La contraseña debe tener al menos 6 caracteres.';
      }

      if (mode === 'register' && password !== confirmPassword) {
        errs.confirmPassword = 'Las contraseñas no coinciden.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    if (mode === 'login') {
      await login(email, password);
      setIsSubmitting(false);
    } else if (mode === 'register') {
      await register(name, email, password);
      setIsSubmitting(false);
    } else if (mode === 'forgot') {
      setTimeout(() => {
        setIsSubmitting(false);
        setResetSuccessMessage(`Hemos enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`);
        addToast('success', 'Enlace de recuperación enviado.');
      }, 1000);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Logo Banner */}
        <div className="text-center mb-8">
          <div 
            onClick={() => setCurrentRoute('/')}
            className="inline-flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity mb-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-emerald-600 bg-clip-text text-transparent">
              ConectaCerca
            </span>
          </div>
          <p className="text-sm text-slate-600 font-medium">
            {mode === 'login' && 'Inicia sesión para ver personas compatibles en tu zona'}
            {mode === 'register' && 'Crea tu cuenta gratis para conectar con amigos de tu zona'}
            {mode === 'forgot' && 'Recupera el acceso a tu cuenta'}
          </p>
        </div>

        <Card className="shadow-lg border-indigo-100 p-6 sm:p-8">
          
          {resetSuccessMessage ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Correo enviado</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {resetSuccessMessage}
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => { setResetSuccessMessage(''); setMode('login'); }}
              >
                Volver al inicio de sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'register' && (
                <Input
                  label="Nombre completo"
                  placeholder="Ej. Camila Ríos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  leftIcon={<User className="w-4 h-4" />}
                />
              )}

              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tu.correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              {mode !== 'forgot' && (
                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  leftIcon={<Lock className="w-4 h-4" />}
                />
              )}

              {mode === 'register' && (
                <Input
                  label="Confirmar contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  leftIcon={<Lock className="w-4 h-4" />}
                />
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full mt-2"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {mode === 'login' && 'Iniciar sesión'}
                {mode === 'register' && 'Crear cuenta'}
                {mode === 'forgot' && 'Enviar enlace de recuperación'}
              </Button>

            </form>
          )}

          {/* Toggle between login / register */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-600">
            {mode === 'login' ? (
              <p>
                ¿Aún no tienes cuenta?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  Regístrate gratis
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                ¿Ya tienes cuenta en ConectaCerca?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  Inicia sesión
                </button>
              </p>
            ) : (
              <p>
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  Regresar al inicio de sesión
                </button>
              </p>
            )}
          </div>

          {/* Instant Demo Access Button */}
          <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
            <button
              type="button"
              onClick={quickDemoLogin}
              className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Entrar directamente con Perfil Demo</span>
            </button>
          </div>

        </Card>
      </div>
    </div>
  );
};
