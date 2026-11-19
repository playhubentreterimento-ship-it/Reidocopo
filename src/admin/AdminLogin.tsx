import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Check, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  isRecoveryInitial?: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onSuccess,
  isRecoveryInitial = false,
}) => {
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>(
    isRecoveryInitial ? 'reset' : 'login'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para redefinição de senha
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Detecta se a URL contém token de recuperação
  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setMode('reset');
    }

    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setMode('reset');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // 1. Login com e-mail e senha
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(
        'Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente da Vercel.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, informe e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (
          error.message.includes('Invalid login credentials') ||
          error.message.includes('invalid_credentials')
        ) {
          setErrorMessage('E-mail ou senha incorretos. Caso tenha esquecido, clique em "Esqueceu a senha?".');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.session) {
        onSuccess();
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(errObj.message || 'Erro inesperado ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Solicitar recuperação de senha por e-mail
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Supabase não configurado.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/admin`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        `Link de recuperação enviado para ${email.trim()}! Verifique sua caixa de entrada e spam.`
      );
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(errObj.message || 'Erro ao enviar e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Salvar nova senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (!supabase) return;

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage('Senha atualizada com sucesso! Acessando o painel...');
      setTimeout(() => {
        // Limpa o hash de recuperação da URL
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(errObj.message || 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0C0B0A] text-[#F4EFE6] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-[#161514] border border-white/[0.08] rounded-[22px] p-8 sm:p-10 shadow-2xl relative">
        {/* Top subtle brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#B8975A]/40 bg-[#B8975A]/10 text-xs text-[#B8975A] font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8975A]" />
            <span>
              {mode === 'reset'
                ? 'Nova Senha'
                : mode === 'forgot'
                ? 'Recuperação'
                : 'Acesso Restrito'}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-medium text-[#F4EFE6] mb-2">
            Rei do Copo
          </h1>
          <p className="font-sans text-sm text-[#A59E92] font-normal">
            {mode === 'reset'
              ? 'Defina sua nova senha de acesso'
              : mode === 'forgot'
              ? 'Recuperar acesso ao painel'
              : 'Painel de controle do catálogo'}
          </p>
        </div>

        {/* Warning if Supabase is not configured */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Atenção:</strong> Variáveis de ambiente do Supabase não detectadas.
              Configure <code className="text-[#F4EFE6]">VITE_SUPABASE_URL</code> e{' '}
              <code className="text-[#F4EFE6]">VITE_SUPABASE_ANON_KEY</code>.
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed flex items-start gap-3">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>{successMessage}</div>
          </div>
        )}

        {/* ==================================================== */}
        {/* MODO 1: LOGIN */}
        {/* ==================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A59E92] mb-2">
                E-mail de acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A59E92]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@reidocopo.com.br"
                  className="w-full pl-10 pr-4 py-3 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#A59E92]">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('forgot');
                  }}
                  className="text-xs text-[#B8975A] hover:underline font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A59E92]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#F4EFE6] text-[#0C0B0A] text-[15px] font-semibold hover:bg-[#B8975A] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Acessar painel</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ==================================================== */}
        {/* MODO 2: ESQUECEU A SENHA (SOLICITAR RECUPERAÇÃO) */}
        {/* ==================================================== */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <p className="text-xs text-[#A59E92] leading-relaxed">
              Digite seu e-mail abaixo. Enviaremos um link de redefinição para você criar uma nova senha.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A59E92] mb-2">
                Seu e-mail cadastrado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A59E92]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu-email@dominio.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#B8975A] text-[#0C0B0A] text-[15px] font-semibold hover:bg-[#c9a767] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 group mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando link...</span>
                </>
              ) : (
                <>
                  <span>Enviar link de recuperação</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setMode('login');
                }}
                className="text-xs text-[#A59E92] hover:text-[#F4EFE6] transition-colors"
              >
                ← Voltar para a tela de login
              </button>
            </div>
          </form>
        )}

        {/* ==================================================== */}
        {/* MODO 3: DEFINIR NOVA SENHA */}
        {/* ==================================================== */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A59E92] mb-2">
                Nova senha (mínimo 6 caracteres)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A59E92]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="w-full pl-10 pr-4 py-3 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A59E92] mb-2">
                Confirmar nova senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A59E92]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua nova senha"
                  className="w-full pl-10 pr-4 py-3 bg-[#0C0B0A] border border-white/[0.12] rounded-full text-sm text-[#F4EFE6] placeholder-[#6E675D] focus:outline-none focus:border-[#B8975A] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#F4EFE6] text-[#0C0B0A] text-[15px] font-semibold hover:bg-[#B8975A] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 group mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando nova senha...</span>
                </>
              ) : (
                <>
                  <span>Salvar nova senha</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to public site */}
        <div className="text-center mt-8 pt-6 border-t border-white/[0.08]">
          <a
            href="/"
            className="text-xs text-[#A59E92] hover:text-[#F4EFE6] transition-colors inline-flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Voltar para o site da Rei do Copo</span>
          </a>
        </div>
      </div>
    </div>
  );
};
