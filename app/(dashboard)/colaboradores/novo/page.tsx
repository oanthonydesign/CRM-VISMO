"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, Col } from "@/components/layout/grid";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NovoColaboradorPage() {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        aniversario: "",
        telefone: "",
        endereco: "",
        categoria: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dados do colaborador:", formData);
        // Aqui você implementará a lógica de salvar no Supabase
        alert("Colaborador cadastrado com sucesso! (Dados no console)");
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/colaboradores">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="space-y-2">
                    <h1 className="text-display-xl font-sans text-text-primary">Novo Colaborador</h1>
                    <p className="text-text-secondary font-mono">Cadastro de novo membro da equipe</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Colaborador</CardTitle>
                        <CardDescription>Preencha os dados abaixo para cadastrar um novo colaborador</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Grid cols={2}>
                            {/* Nome Completo */}
                            <Col span={2}>
                                <div className="space-y-2">
                                    <label htmlFor="nome" className="text-sm font-medium text-text-secondary">
                                        Nome Completo *
                                    </label>
                                    <Input
                                        id="nome"
                                        placeholder="Ex: João Silva"
                                        value={formData.nome}
                                        onChange={(e) => handleChange("nome", e.target.value)}
                                        required
                                    />
                                </div>
                            </Col>

                            {/* Email */}
                            <Col span={1}>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-text-secondary">
                                        Email *
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="joao@exemplo.com"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        required
                                    />
                                </div>
                            </Col>

                            {/* Telefone */}
                            <Col span={1}>
                                <div className="space-y-2">
                                    <label htmlFor="telefone" className="text-sm font-medium text-text-secondary">
                                        Telefone *
                                    </label>
                                    <Input
                                        id="telefone"
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        value={formData.telefone}
                                        onChange={(e) => handleChange("telefone", e.target.value)}
                                        required
                                    />
                                </div>
                            </Col>

                            {/* Aniversário */}
                            <Col span={1}>
                                <div className="space-y-2">
                                    <label htmlFor="aniversario" className="text-sm font-medium text-text-secondary">
                                        Aniversário *
                                    </label>
                                    <Input
                                        id="aniversario"
                                        type="date"
                                        value={formData.aniversario}
                                        onChange={(e) => handleChange("aniversario", e.target.value)}
                                        required
                                    />
                                </div>
                            </Col>

                            {/* Categoria */}
                            <Col span={1}>
                                <div className="space-y-2">
                                    <label htmlFor="categoria" className="text-sm font-medium text-text-secondary">
                                        Categoria *
                                    </label>
                                    <Select onValueChange={(value) => handleChange("categoria", value)} required>
                                        <SelectTrigger id="categoria">
                                            <SelectValue placeholder="Selecione a categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixo">Fixo</SelectItem>
                                            <SelectItem value="freela">Freela</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Col>

                            {/* Endereço */}
                            <Col span={2}>
                                <div className="space-y-2">
                                    <label htmlFor="endereco" className="text-sm font-medium text-text-secondary">
                                        Endereço Completo *
                                    </label>
                                    <Input
                                        id="endereco"
                                        placeholder="Rua, número, bairro, cidade - UF"
                                        value={formData.endereco}
                                        onChange={(e) => handleChange("endereco", e.target.value)}
                                        required
                                    />
                                </div>
                            </Col>
                        </Grid>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-utility-border-subtle">
                            <Link href="/colaboradores">
                                <Button variant="outline">Cancelar</Button>
                            </Link>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Salvar Colaborador
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
