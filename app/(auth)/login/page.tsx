'use client'

import { useState } from 'react'
import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const result = await signIn(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full font-sans overflow-hidden">
            {/* Left Side - Branding & Visuals */}
            <div className="hidden lg:flex w-[60%] relative bg-[#0D0D0D] flex-col items-center px-[88px] pt-[60px] pb-8 overflow-hidden">
                {/* Top Logo */}
                <div className="w-full flex justify-center flex-none">
                    <Image
                        src="/login/grafismo_vismo.svg"
                        alt="Vismo Logo"
                        width={140}
                        height={35}
                        className="opacity-90"
                    />
                </div>

                {/* Content Container (Image + Text) */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {/* Center Graphic */}
                    <div className="relative w-full flex items-center justify-center mb-[42px]">
                        <Image
                            src="/login/retangulo_login.png"
                            alt="Visual Identity"
                            width={1000}
                            height={600}
                            className="object-contain w-full max-h-[50vh]"
                            priority
                        />
                    </div>

                    {/* Bottom Text */}
                    <div className="relative z-10 text-center flex flex-col items-center gap-[24px] w-full">
                        <h2 className="font-medium text-[#F5F1EA] tracking-wide leading-[95%] w-[90%]" style={{ fontSize: '36px' }}>
                            ORGANIZE, EXECUTE E ESCALE
                        </h2>
                        <p className="text-[#F5F1EA] font-medium tracking-widest uppercase leading-[95%] w-[88%]" style={{ fontSize: '22px' }}>
                            CRM COMPLETO PARA CLIENTES, PROJETOS, FINANÇAS E METAS EM UM SÓ AMBIENTE.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col bg-[#F5F1EA] p-8 lg:p-12 relative overflow-y-auto">
                {/* Top Tag */}
                <div className="absolute top-12 left-12">
                    <div className="bg-[#FE3C00] text-[#0D0D0D] rounded-[8px] font-bold px-[10px] py-[6px] uppercase tracking-wider inline-block" style={{ fontSize: '16px' }}>
                        HELLO VISMO
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <div className="mb-8">
                        <h1 className="text-3xl text-[#1A1A1A] mb-2 font-normal">Bem-vindo(a) à Vismo</h1>
                        <p className="text-gray-500 text-sm">
                            Faça login para acessar o painel completo
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="exemplo@vismo.com.br"
                                required
                                className="!bg-transparent border-[#606060] h-12 text-[#0d0d0d] placeholder:text-gray-500 focus:border-[#FE3C00] focus:ring-1 focus:ring-[#FE3C00] transition-all"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="*****************"
                                required
                                className="!bg-transparent border-[#606060] h-12 text-[#0d0d0d] placeholder:text-gray-500 focus:border-[#FE3C00] focus:ring-1 focus:ring-[#FE3C00] transition-all pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-[#FE3C00] hover:bg-[#E03500] text-white h-12 font-medium rounded-md text-base transition-colors mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-auto flex justify-between text-[10px] text-[#0D0D0D] uppercase tracking-widest font-medium">
                    <span>TECH & AI</span>
                    <span>UI/UX</span>
                    <span>BRANDING</span>
                </div>
            </div>
        </div>
    )
}
