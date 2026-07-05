-- Carga inicial dos prospects já mapeados no Instagram (Radar, estágio "novo").
-- Nome/segmento foram INFERIDOS a partir do @ do perfil — não são dados
-- confirmados, revise antes de abordar (fica marcado em "observacoes").
-- Rodar depois de 20260703120000_schema_consolidado_pt.sql + 20260704000000_prospeccao.sql.

insert into prospeccoes
    (nome, tipo, segmento, canal, instagram, origem, status, oportunidade, como_ajudar, ideia_abordagem, observacoes, data_encontrado)
values
    ('Audra Hair', 'microempresa', 'Cabelo / Salão de beleza', 'instagram', 'audrahair', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Clínica Monet', 'empresa', 'Clínica de estética', 'instagram', 'clinica.monet', 'Instagram', 'novo',
     'Gestão de tráfego pago e conteúdo para Instagram, focado em captação de novos clientes', 'Estruturar funil de agendamento e aumentar volume de leads qualificados via Instagram/WhatsApp', 'Abordagem consultiva: analisar o Instagram atual da clínica e apontar 1-2 oportunidades rápidas de melhoria', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Colzani Odontologia', 'empresa', 'Odontologia', 'instagram', 'colzani.odontologia', 'Instagram', 'novo',
     'Gestão de tráfego pago e conteúdo para Instagram, focado em captação de novos clientes', 'Estruturar funil de agendamento e aumentar volume de leads qualificados via Instagram/WhatsApp', 'Abordagem consultiva: analisar o Instagram atual da clínica e apontar 1-2 oportunidades rápidas de melhoria', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Emanuele (Biomédica)', 'profissional_liberal', 'Biomedicina estética', 'instagram', 'dra.emanuelebiomedica', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Incantare (Joinville)', 'empresa', 'Estética / Beleza', 'instagram', 'incantare.jlle', 'Instagram', 'novo',
     'Gestão de tráfego pago e conteúdo para Instagram, focado em captação de novos clientes', 'Estruturar funil de agendamento e aumentar volume de leads qualificados via Instagram/WhatsApp', 'Abordagem consultiva: analisar o Instagram atual da clínica e apontar 1-2 oportunidades rápidas de melhoria', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Clínica Totum', 'empresa', 'Clínica de estética/saúde', 'instagram', 'clinicatotum', 'Instagram', 'novo',
     'Gestão de tráfego pago e conteúdo para Instagram, focado em captação de novos clientes', 'Estruturar funil de agendamento e aumentar volume de leads qualificados via Instagram/WhatsApp', 'Abordagem consultiva: analisar o Instagram atual da clínica e apontar 1-2 oportunidades rápidas de melhoria', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Derma Clinic (Joinville)', 'empresa', 'Clínica dermatológica', 'instagram', 'dermaclinicjlle', 'Instagram', 'novo',
     'Gestão de tráfego pago e conteúdo para Instagram, focado em captação de novos clientes', 'Estruturar funil de agendamento e aumentar volume de leads qualificados via Instagram/WhatsApp', 'Abordagem consultiva: analisar o Instagram atual da clínica e apontar 1-2 oportunidades rápidas de melhoria', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Royal Face (Joinville)', 'empresa', 'Estética facial', 'instagram', 'royalface.joinville', 'Instagram', 'novo',
     'Gestão de tráfego pago e conteúdo para Instagram, focado em captação de novos clientes', 'Estruturar funil de agendamento e aumentar volume de leads qualificados via Instagram/WhatsApp', 'Abordagem consultiva: analisar o Instagram atual da clínica e apontar 1-2 oportunidades rápidas de melhoria', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Vanessa Engelmann', 'profissional_liberal', 'Medicina', 'instagram', 'dravanessaengelmann', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Link repetido 2x na lista original, mantido só uma vez.', current_date),

    ('Dr. Fabrício Sordi', 'profissional_liberal', 'Medicina', 'instagram', 'dr.fabriciosordi', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Larissa Sdrigotti', 'profissional_liberal', 'Medicina', 'instagram', 'dralarissasdrigotti', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Mariane Aquim (Dermato)', 'profissional_liberal', 'Dermatologia', 'instagram', 'marianeaquim.dermato', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Veruska Noleto', 'profissional_liberal', 'Medicina', 'instagram', 'draveruskanoleto', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Ariele Fachini', 'profissional_liberal', 'Medicina', 'instagram', 'dra.arielefachini', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Lari Hardt', 'profissional_liberal', 'A confirmar', 'instagram', 'larihardt', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Segmento não ficou claro só pelo @, checar o perfil.', current_date),

    ('Dra. Bianca Gastaldi (Dermato)', 'profissional_liberal', 'Dermatologia', 'instagram', 'dermatobiancagastaldi', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Glaumi Cheluzzi', 'profissional_liberal', 'A confirmar', 'instagram', 'glaumicheluzzi', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Segmento não ficou claro só pelo @, checar o perfil.', current_date),

    ('Dra. Cássia Farris', 'profissional_liberal', 'Medicina', 'instagram', 'dracassiafarris', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Tatiane Malia', 'profissional_liberal', 'Medicina', 'instagram', 'dra.tatianemalia', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Jakelline Venturi', 'profissional_liberal', 'Medicina', 'instagram', 'drajakellineventuri', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dr. Gastão Jr.', 'profissional_liberal', 'Medicina', 'instagram', 'drgastaojr', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Kati Kindermann', 'profissional_liberal', 'Medicina', 'instagram', 'drakatikindermann', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dr. Claudio Mokross', 'profissional_liberal', 'Medicina', 'instagram', 'dr.claudio.mokross', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('André Bridi', 'profissional_liberal', 'A confirmar', 'instagram', 'andre.bridi', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Sem prefixo dr./dra. no @, checar o perfil.', current_date),

    ('Edmundo Neto', 'profissional_liberal', 'A confirmar', 'instagram', 'edmundowneto', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Sem prefixo dr./dra. no @, checar o perfil.', current_date),

    ('Dra. Kelly Okamoto', 'profissional_liberal', 'Medicina', 'instagram', 'drakellyokamoto', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dr. Paulo Henrique Douat', 'profissional_liberal', 'Medicina', 'instagram', 'drpaulohenriquedouat', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Laise Rodrigues (Biomédica)', 'profissional_liberal', 'Biomedicina estética', 'instagram', 'laiserodriguesbmd', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Josi Boehm', 'profissional_liberal', 'Medicina', 'instagram', 'dra.josiboehm', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Aline Santiago', 'profissional_liberal', 'Medicina', 'instagram', 'dra.alinesantiago', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dr. Adrian Schner', 'profissional_liberal', 'Medicina', 'instagram', 'dr.adrianschner', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Dra. Luísa Ames', 'profissional_liberal', 'Medicina', 'instagram', 'draluisaames', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Lethycia Viana', 'profissional_liberal', 'A confirmar', 'instagram', 'lethyciaviana.oficial', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. @ sugere perfil pessoal/influencer, checar o perfil.', current_date),

    ('Dra. Vanessa Yumi Ido', 'profissional_liberal', 'Medicina', 'instagram', 'dravanessayumiido', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Karina Sanyy', 'profissional_liberal', 'A confirmar', 'instagram', 'karinasanyy', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Segmento não ficou claro só pelo @, checar o perfil.', current_date),

    ('Spa Conutrir (Joinville)', 'empresa', 'Spa / Nutrição', 'instagram', 'spaconutrirjlle', 'Instagram', 'novo',
     'Gestão de tráfego pago e conteúdo para Instagram, focado em captação de novos clientes', 'Estruturar funil de agendamento e aumentar volume de leads qualificados via Instagram/WhatsApp', 'Abordagem consultiva: analisar o Instagram atual da clínica e apontar 1-2 oportunidades rápidas de melhoria', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Anna (Parteira)', 'profissional_liberal', 'Obstetrícia / Parto', 'instagram', 'annaparteira', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Priscila Schofer', 'profissional_liberal', 'A confirmar', 'instagram', 'priscilaschofer', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Segmento não ficou claro só pelo @, checar o perfil.', current_date),

    ('Dra. Karol Prado', 'profissional_liberal', 'Medicina', 'instagram', 'drakarolprado', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Marjorie Olinquevicz (Fisio)', 'profissional_liberal', 'Fisioterapia', 'instagram', 'fisiomarjorieolinquevicz', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Moni Zerios Arquitetura', 'microempresa', 'Arquitetura', 'instagram', 'monizerios.arquitetura', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Nicho diferente dos demais (saúde/estética), vale playbook próprio.', current_date),

    ('Dra. Nicole Brenny', 'profissional_liberal', 'Medicina', 'instagram', 'dra.nicolebrenny', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Bruna Carla (Fono)', 'profissional_liberal', 'Fonoaudiologia', 'instagram', 'fonobrunacarla', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date),

    ('Bebê Cuidados', 'empresa', 'Produtos/serviços infantis', 'instagram', 'bebecuidados', 'Instagram', 'novo',
     'Gestão de redes sociais e tráfego pago para geração de leads', 'Aumentar visibilidade e captação de clientes qualificados via Instagram', 'Elogiar o trabalho/portfólio e oferecer um diagnóstico gratuito de presença digital', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar. Nicho diferente dos demais (saúde/estética), vale playbook próprio.', current_date),

    ('Anna Nogueira (Psi)', 'profissional_liberal', 'Psicologia', 'instagram', 'annanogueirapsi', 'Instagram', 'novo',
     'Gestão de conteúdo e tráfego pago no Instagram para aumentar agendamentos', 'Ajudar a converter seguidores em pacientes com presença digital consistente e captação ativa', 'Elogiar o conteúdo atual do perfil e oferecer um diagnóstico gratuito de redes sociais/tráfego', 'Nome e segmento inferidos automaticamente a partir do perfil do Instagram — confirmar dados reais antes de abordar.', current_date);
