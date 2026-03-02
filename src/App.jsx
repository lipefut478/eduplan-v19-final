'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import { 
  BookOpen, Download, Layout, BrainCircuit, 
  Wand2, CheckSquare, MessageSquare, FileEdit, 
  Calendar, ArrowRight, ArrowLeft, CheckCircle2,
  School, Sparkles, ChevronDown, ChevronUp, RotateCcw,
  FileText, Eye, EyeOff, Maximize2, Minimize2, RefreshCw,
  AlertCircle, HelpCircle, Info, Zap, Target, Feather,
  Palette, Globe, Users, Music, Image, Film, Code,
  TrendingUp, Award, Clock, Bell, Sun, Moon, LogOut,
  Save, FolderOpen, Trash2, Edit, Copy, Archive, Cloud,
  Pencil, X, Map, SkipForward, CopyPlus, CalendarRange,
  Accessibility, Upload
} from 'lucide-react';
import jsPDF from "jspdf";
import * as docx from "docx";
import { saveAs } from "file-saver";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// ==========================================
// 🎨 CONSTANTES E CONFIGURAÇÕES
// ==========================================
const DIAS_SEMANA = [
  "Segunda-feira", 
  "Terça-feira", 
  "Quarta-feira", 
  "Quinta-feira", 
  "Sexta-feira"
];

const DIAS_ABREVIADO = {
  "Segunda-feira": "SEG",
  "Terça-feira": "TER",
  "Quarta-feira": "QUA",
  "Quinta-feira": "QUI",
  "Sexta-feira": "SEX"
};

const CAMPOS_EXP = {
  "EO": { 
    nome: "O EU, O OUTRO E O NÓS", 
    cor: "#ef4444", 
    bg: "#fee2e2",
    icone: Users,
    descricao: "Experiências que envolvem a construção da identidade, autonomia e relações interpessoais.",
    palavrasChave: ["identidade", "emoções", "socialização", "empatia", "cooperação"]
  },
  "CG": { 
    nome: "CORPO, GESTOS E MOVIMENTOS", 
    cor: "#f59e0b", 
    bg: "#fef3c7",
    icone: Feather,
    descricao: "Exploração do corpo e suas possibilidades motoras, expressivas e criativas.",
    palavrasChave: ["movimento", "coordenação", "equilíbrio", "dança", "circuito"]
  },
  "TS": { 
    nome: "TRAÇOS, SONS, CORES E FORMAS", 
    cor: "#ec4899", 
    bg: "#fdf2f8",
    icone: Palette,
    descricao: "Experiências artísticas, musicais e estéticas.",
    palavrasChave: ["arte", "música", "cores", "criatividade", "expressão"]
  },
  "EF": { 
    nome: "ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO", 
    cor: "#3b82f6", 
    bg: "#eff6ff",
    icone: MessageSquare,
    descricao: "Desenvolvimento da linguagem oral, pensamento e imaginação.",
    palavrasChave: ["linguagem", "histórias", "conversa", "imaginação", "leitura"]
  },
  "ET": { 
    nome: "ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES", 
    cor: "#10b981", 
    bg: "#ecfdf5",
    icone: Globe,
    descricao: "Exploração do mundo físico, social e cultural.",
    palavrasChave: ["natureza", "descoberta", "experiências", "investigação", "tempo"]
  }
};

// ==========================================
// 📚 BANCO DE DADOS BNCC NACIONAL - COMPLETO
// ==========================================
const BNCC_NATIONAL = {
  bercario: {
    label: "Berçário (0 a 1a6m)",
    codigos: [
      // EO - O EU, O OUTRO E O NÓS
      { code: "EI01EO01", desc: "Perceber que suas ações têm efeitos nas outras crianças e nos adultos.", campo: "EO" },
      { code: "EI01EO02", desc: "Perceber as possibilidades e os limites de seu corpo nas brincadeiras e interações das quais participa.", campo: "EO" },
      { code: "EI01EO03", desc: "Interagir com crianças da mesma faixa etária e adultos ao explorar espaços, materiais, objetos, brinquedos.", campo: "EO" },
      { code: "EI01EO04", desc: "Comunicar necessidades, desejos e emoções, utilizando gestos, balbucios, palavras.", campo: "EO" },
      { code: "EI01EO05", desc: "Reconhecer seu corpo e expressar suas sensações em momentos de alimentação, higiene, brincadeira e descanso.", campo: "EO" },
      
      // CG - CORPO, GESTOS E MOVIMENTOS
      { code: "EI01CG01", desc: "Movimentar as partes do corpo para exprimir corporalmente emoções, necessidades e desejos.", campo: "CG" },
      { code: "EI01CG02", desc: "Experimentar as possibilidades corporais nas brincadeiras e interações em ambientes acolhedores e desafiantes.", campo: "CG" },
      { code: "EI01CG03", desc: "Imitar gestos e movimentos de outras crianças, adultos e animais.", campo: "CG" },
      { code: "EI01CG04", desc: "Participar do cuidado do seu corpo e da promoção do seu bem-estar.", campo: "CG" },
      { code: "EI01CG05", desc: "Utilizar os movimentos de preensão, encaixe e lançamento, ampliando possibilidades de manuseio de materiais, objetos e brinquedos.", campo: "CG" },
      
      // TS - TRAÇOS, SONS, CORES E FORMAS
      { code: "EI01TS01", desc: "Explorar sons produzidos com o próprio corpo e com objetos do ambiente.", campo: "TS" },
      { code: "EI01TS02", desc: "Traçar marcas gráficas, em diferentes suportes, usando instrumentos riscantes e tintas.", campo: "TS" },
      { code: "EI01TS03", desc: "Explorar diferentes fontes sonoras e materiais para acompanhar brincadeiras cantadas, canções, músicas e melodias.", campo: "TS" },
      
      // EF - ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO
      { code: "EI01EF01", desc: "Reconhecer quando é chamado por seu nome e reconhecer os nomes de pessoas com quem convive.", campo: "EF" },
      { code: "EI01EF02", desc: "Demonstrar interesse ao ouvir a leitura de poemas e a apresentação de músicas.", campo: "EF" },
      { code: "EI01EF03", desc: "Demonstrar interesse ao ouvir histórias lidas ou contadas, observando ilustrações e os movimentos de leitura do adulto-leitor.", campo: "EF" },
      { code: "EI01EF04", desc: "Reconhecer elementos das ilustrações de histórias, apontando-os, a pedido do adulto-leitor.", campo: "EF" },
      { code: "EI01EF05", desc: "Imitar as variações de entonação e gestos realizados pelos adultos, ao ler histórias e ao cantar.", campo: "EF" },
      { code: "EI01EF06", desc: "Comunicar-se com outras pessoas usando movimentos, gestos, balbucios, fala e outras formas de expressão.", campo: "EF" },
      { code: "EI01EF07", desc: "Conhecer e manipular materiais impressos e audiovisuais em diferentes portadores (livro, revista, gibi, jornal, cartaz, CD, tablet etc.).", campo: "EF" },
      { code: "EI01EF08", desc: "Participar de situações de escuta de textos em diferentes gêneros textuais (poemas, fábulas, contos, receitas, quadrinhos, anúncios etc.).", campo: "EF" },
      
      // ET - ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES
      { code: "EI01ET01", desc: "Explorar e descobrir as propriedades de objetos e materiais (odor, cor, sabor, temperatura).", campo: "ET" },
      { code: "EI01ET02", desc: "Explorar relações de causa e efeito (transbordar, tingir, misturar, mover e remover etc.) na interação com o mundo físico.", campo: "ET" },
      { code: "EI01ET03", desc: "Explorar o ambiente pela ação e observação, manipulando, experimentando e fazendo descobertas.", campo: "ET" },
      { code: "EI01ET04", desc: "Manipular, experimentar, arrumar e explorar o espaço por meio de experiências de deslocamentos de si e dos objetos.", campo: "ET" },
      { code: "EI01ET05", desc: "Manipular materiais diversos e variados para comparar as diferenças e semelhanças entre eles.", campo: "ET" },
      { code: "EI01ET06", desc: "Vivenciar diferentes ritmos, velocidades e fluxos nas interações e brincadeiras (em danças, balanços, escorregadores etc.).", campo: "ET" }
    ]
  },
  maternal: {
    label: "Maternal (1a7m a 3a11m)",
    codigos: [
      // EO - O EU, O OUTRO E O NÓS
      { code: "EI02EO01", desc: "Demonstrar atitudes de cuidado e solidariedade na interação com crianças e adultos.", campo: "EO" },
      { code: "EI02EO02", desc: "Demonstrar imagem positiva de si e confiança em sua capacidade para enfrentar dificuldades e desafios.", campo: "EO" },
      { code: "EI02EO03", desc: "Compartilhar os objetos e os espaços com crianças da mesma faixa etária e adultos.", campo: "EO" },
      { code: "EI02EO04", desc: "Comunicar-se com os colegas e os adultos, buscando compreendê-los e fazendo-se compreender.", campo: "EO" },
      { code: "EI02EO05", desc: "Perceber que as pessoas têm características físicas diferentes, respeitando essas diferenças.", campo: "EO" },
      { code: "EI02EO06", desc: "Respeitar regras básicas de convívio social nas interações e brincadeiras.", campo: "EO" },
      { code: "EI02EO07", desc: "Resolver conflitos nas interações e brincadeiras, com a orientação de um adulto.", campo: "EO" },
      
      // CG - CORPO, GESTOS E MOVIMENTOS
      { code: "EI02CG01", desc: "Apropriar-se de gestos e movimentos de sua cultura no cuidado de si e nos jogos e brincadeiras.", campo: "CG" },
      { code: "EI02CG02", desc: "Deslocar seu corpo no espaço, orientando-se por noções como em frente, atrás, no alto, embaixo, dentro, fora etc., ao se envolver em brincadeiras e atividades de diferentes naturezas.", campo: "CG" },
      { code: "EI02CG03", desc: "Explorar formas de deslocamento no espaço (pular, saltar, dançar), combinando movimentos e seguindo orientações.", campo: "CG" },
      { code: "EI02CG04", desc: "Demonstrar progressiva independência no cuidado do seu corpo.", campo: "CG" },
      { code: "EI02CG05", desc: "Desenvolver progressivamente as habilidades manuais, adquirindo controle para desenhar, pintar, rasgar, folhear, entre outros.", campo: "CG" },
      
      // TS - TRAÇOS, SONS, CORES E FORMAS
      { code: "EI02TS01", desc: "Criar sons com materiais, objetos e instrumentos musicais, para acompanhar diversos ritmos de música.", campo: "TS" },
      { code: "EI02TS02", desc: "Utilizar materiais variados com possibilidades de manipulação (argila, massa de modelar), explorando cores, texturas, superfícies, planos, formas e volumes ao criar objetos tridimensionais.", campo: "TS" },
      { code: "EI02TS03", desc: "Utilizar diferentes fontes sonoras disponíveis no ambiente em brincadeiras cantadas, canções, músicas e melodias.", campo: "TS" },
      
      // EF - ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO
      { code: "EI02EF01", desc: "Dialogar com crianças e adultos, expressando seus desejos, necessidades, sentimentos e opiniões.", campo: "EF" },
      { code: "EI02EF02", desc: "Identificar e criar diferentes sons e reconhecer rimas e aliterações em cantigas de roda e textos poéticos.", campo: "EF" },
      { code: "EI02EF03", desc: "Demonstrar interesse e atenção ao ouvir a leitura de histórias e outros textos, diferenciando escrita de ilustrações, e acompanhando, com orientação do adulto-leitor, a direção da leitura (de cima para baixo, da esquerda para a direita).", campo: "EF" },
      { code: "EI02EF04", desc: "Formular e responder perguntas sobre fatos da história narrada, identificando cenários, personagens e principais acontecimentos.", campo: "EF" },
      { code: "EI02EF05", desc: "Relatar experiências e fatos acontecidos, histórias ouvidas, filmes ou peças teatrais assistidos etc.", campo: "EF" },
      { code: "EI02EF06", desc: "Criar e contar histórias oralmente, com base em imagens ou temas sugeridos.", campo: "EF" },
      { code: "EI02EF07", desc: "Manusear diferentes portadores textuais, demonstrando reconhecer seus usos sociais.", campo: "EF" },
      { code: "EI02EF08", desc: "Manipular textos e participar de situações de escuta para ampliar seu contato com diferentes gêneros textuais (parlendas, histórias de aventura, tirinhas, cartazes de sala, cardápios, notícias etc.).", campo: "EF" },
      { code: "EI02EF09", desc: "Manusear diferentes instrumentos e suportes de escrita para desenhar, traçar letras e outros sinais gráficos.", campo: "EF" },
      
      // ET - ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES
      { code: "EI02ET01", desc: "Explorar e descrever semelhanças e diferenças entre as características e propriedades dos objetos (textura, massa, tamanho).", campo: "ET" },
      { code: "EI02ET02", desc: "Observar, relatar e descrever incidentes do cotidiano e fenômenos naturais (luz solar, vento, chuva etc.).", campo: "ET" },
      { code: "EI02ET03", desc: "Compartilhar, com outras crianças, situações de cuidado de plantas e animais nos espaços da instituição e fora dela.", campo: "ET" },
      { code: "EI02ET04", desc: "Identificar relações espaciais (dentro e fora, em cima, embaixo, acima, abaixo, entre e do lado) e temporais (antes, durante e depois).", campo: "ET" },
      { code: "EI02ET05", desc: "Classificar objetos, considerando determinado atributo (tamanho, peso, cor, forma etc.).", campo: "ET" },
      { code: "EI02ET06", desc: "Utilizar conceitos básicos de tempo (agora, antes, durante, depois, ontem, hoje, amanhã, lento, rápido, depressa, devagar).", campo: "ET" },
      { code: "EI02ET07", desc: "Contar oralmente objetos, pessoas, livros etc., em contextos diversos.", campo: "ET" },
      { code: "EI02ET08", desc: "Registrar com números a quantidade de crianças (meninas e meninos, presentes e ausentes) e a quantidade de objetos da mesma natureza (bonecas, bolas, livros etc.).", campo: "ET" }
    ]
  },
  pre: {
    label: "Pré-Escola (4 a 5a11m)",
    codigos: [
      // EO - O EU, O OUTRO E O NÓS
      { code: "EI03EO01", desc: "Demonstrar empatia pelos outros, percebendo que as pessoas têm diferentes sentimentos, necessidades e maneiras de pensar e agir.", campo: "EO" },
      { code: "EI03EO02", desc: "Agir de maneira independente, com confiança em suas capacidades, reconhecendo suas conquistas e limitações.", campo: "EO" },
      { code: "EI03EO03", desc: "Ampliar as relações interpessoais, desenvolvendo atitudes de participação e cooperação.", campo: "EO" },
      { code: "EI03EO04", desc: "Comunicar suas ideias e sentimentos a pessoas e grupos diversos.", campo: "EO" },
      { code: "EI03EO05", desc: "Demonstrar valorização das características de seu corpo e respeitar as características dos outros (crianças e adultos) com os quais convive.", campo: "EO" },
      { code: "EI03EO06", desc: "Manifestar interesse e respeito por diferentes culturas e modos de vida.", campo: "EO" },
      { code: "EI03EO07", desc: "Usar estratégias pautadas no respeito mútuo para lidar com conflitos nas interações com crianças e adultos.", campo: "EO" },
      
      // CG - CORPO, GESTOS E MOVIMENTOS
      { code: "EI03CG01", desc: "Criar com o corpo formas diversificadas de expressão de sentimentos, sensações e emoções, tanto nas situações do cotidiano quanto em brincadeiras, dança, teatro, música.", campo: "CG" },
      { code: "EI03CG02", desc: "Demonstrar controle e adequação do uso de seu corpo em brincadeiras e jogos, escuta e reconto de histórias, atividades artísticas, entre outras possibilidades.", campo: "CG" },
      { code: "EI03CG03", desc: "Criar movimentos, gestos, olhares e mímicas em brincadeiras, jogos e atividades artísticas como dança, teatro e música.", campo: "CG" },
      { code: "EI03CG04", desc: "Adotar hábitos de autocuidado relacionados a higiene, alimentação, conforto e aparência.", campo: "CG" },
      { code: "EI03CG05", desc: "Coordenar suas habilidades manuais no atendimento adequado a seus interesses e necessidades em situações diversas.", campo: "CG" },
      
      // TS - TRAÇOS, SONS, CORES E FORMAS
      { code: "EI03TS01", desc: "Utilizar sons produzidos por materiais, objetos e instrumentos musicais durante brincadeiras de faz de conta, encenações, criações musicais, festas.", campo: "TS" },
      { code: "EI03TS02", desc: "Expressar-se livremente por meio de desenho, pintura, colagem, dobradura e escultura, criando produções bidimensionais e tridimensionais.", campo: "TS" },
      { code: "EI03TS03", desc: "Reconhecer as qualidades do som (intensidade, duração, altura e timbre), utilizando-as em suas produções sonoras e ao ouvir músicas e sons.", campo: "TS" },
      
      // EF - ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO
      { code: "EI03EF01", desc: "Expressar ideias, desejos e sentimentos sobre suas vivências, por meio da linguagem oral e escrita (escrita espontânea), de fotos, desenhos e outras formas de expressão.", campo: "EF" },
      { code: "EI03EF02", desc: "Inventar brincadeiras cantadas, poemas e canções, criando rimas, aliterações e ritmos.", campo: "EF" },
      { code: "EI03EF03", desc: "Escolher e folhear livros, procurando orientar-se por temas e ilustrações e tentando identificar palavras conhecidas.", campo: "EF" },
      { code: "EI03EF04", desc: "Recontar histórias ouvidas e planejar coletivamente roteiros de vídeos e de encenações, definindo os contextos, os personagens, a estrutura da história.", campo: "EF" },
      { code: "EI03EF05", desc: "Recontar histórias ouvidas para produção de reconto escrito, tendo o professor como escriba.", campo: "EF" },
      { code: "EI03EF06", desc: "Produzir suas próprias histórias orais e escritas (escrita espontânea), em situações com função social significativa.", campo: "EF" },
      { code: "EI03EF07", desc: "Levantar hipóteses sobre gêneros textuais veiculados em portadores conhecidos, recorrendo a estratégias de observação gráfica e/ou de leitura.", campo: "EF" },
      { code: "EI03EF08", desc: "Selecionar livros e textos de gêneros conhecidos para a leitura de um adulto e/ou para sua própria leitura (partindo de seu repertório sobre esses textos, como a recuperação pela memória, pela leitura das ilustrações etc.).", campo: "EF" },
      { code: "EI03EF09", desc: "Levantar hipóteses em relação à linguagem escrita, realizando registros de palavras e textos, por meio de escrita espontânea.", campo: "EF" },
      
      // ET - ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES
      { code: "EI03ET01", desc: "Estabelecer relações de comparação entre objetos, observando suas propriedades.", campo: "ET" },
      { code: "EI03ET02", desc: "Observar e descrever mudanças em diferentes materiais, resultantes de ações sobre eles, em experimentos envolvendo fenômenos naturais e artificiais.", campo: "ET" },
      { code: "EI03ET03", desc: "Identificar e selecionar fontes de informações, para responder a questões sobre a natureza, seus fenômenos, sua conservação.", campo: "ET" },
      { code: "EI03ET04", desc: "Registrar observações, manipulações e medidas, usando múltiplas linguagens (desenho, registro por números ou escrita espontânea), em diferentes suportes.", campo: "ET" },
      { code: "EI03ET05", desc: "Classificar objetos e figuras de acordo com suas semelhanças e diferenças.", campo: "ET" },
      { code: "EI03ET06", desc: "Relatar fatos importantes sobre seu nascimento e desenvolvimento, a história dos seus familiares e da sua comunidade.", campo: "ET" },
      { code: "EI03ET07", desc: "Relacionar números às suas respectivas quantidades e identificar o antes, o depois e o entre em uma sequência.", campo: "ET" },
      { code: "EI03ET08", desc: "Expressar medidas (peso, altura etc.), construindo gráficos básicos.", campo: "ET" }
    ]
  }
};

// ==========================================
// 📚 REFERENCIAL CURRICULAR DO PARANÁ - COMPLETO
// ==========================================
const REFERENCIAL_PR = {
  bercario: {
    label: "Berçário (0 a 1a6m)",
    codigos: [
      // EO - O EU, O OUTRO E O NÓS
      { code: "PR.EI01EO01.a", desc: "Perceber que suas ações têm efeitos nas outras crianças e nos adultos.", saber: "Convivência e interação social", campo: "EO" },
      { code: "PR.EI01EO02.b", desc: "Perceber as possibilidades e os limites de seu corpo.", saber: "Identidade e autonomia", campo: "EO" },
      { code: "PR.EI01EO03.c", desc: "Interagir com crianças da mesma faixa etária e adultos.", saber: "Convivência e interação social", campo: "EO" },
      { code: "PR.EI01EO04.d", desc: "Comunicar necessidades, desejos e emoções.", saber: "Comunicação e expressão", campo: "EO" },
      { code: "PR.EI01EO05.e", desc: "Reconhecer seu corpo e expressar suas sensações.", saber: "Identidade e autonomia", campo: "EO" },
      
      // CG - CORPO, GESTOS E MOVIMENTOS
      { code: "PR.EI01CG01.f", desc: "Movimentar as partes do corpo para exprimir emoções.", saber: "Esquema corporal e movimento", campo: "CG" },
      { code: "PR.EI01CG02.g", desc: "Experimentar as possibilidades corporais nas brincadeiras.", saber: "Coordenação motora", campo: "CG" },
      { code: "PR.EI01CG03.h", desc: "Imitar gestos e movimentos de outras crianças, adultos e animais.", saber: "Esquema corporal e movimento", campo: "CG" },
      { code: "PR.EI01CG04.i", desc: "Participar do cuidado do seu corpo.", saber: "Autocuidado e bem-estar", campo: "CG" },
      { code: "PR.EI01CG05.j", desc: "Utilizar movimentos de preensão, encaixe e lançamento.", saber: "Coordenação motora fina", campo: "CG" },
      
      // TS - TRAÇOS, SONS, CORES E FORMAS
      { code: "PR.EI01TS01.k", desc: "Explorar sons produzidos com o próprio corpo.", saber: "Linguagem musical e expressão", campo: "TS" },
      { code: "PR.EI01TS02.l", desc: "Traçar marcas gráficas, em diferentes suportes.", saber: "Linguagem artística", campo: "TS" },
      { code: "PR.EI01TS03.m", desc: "Explorar diferentes fontes sonoras e materiais.", saber: "Linguagem musical e expressão", campo: "TS" },
      
      // EF - ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO
      { code: "PR.EI01EF01.n", desc: "Reconhecer quando é chamado por seu nome.", saber: "Oralidade e comunicação", campo: "EF" },
      { code: "PR.EI01EF02.o", desc: "Demonstrar interesse ao ouvir a leitura de poemas e músicas.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI01EF03.p", desc: "Demonstrar interesse ao ouvir histórias lidas ou contadas.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI01EF04.q", desc: "Reconhecer elementos das ilustrações de histórias.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI01EF05.r", desc: "Imitar as variações de entonação e gestos ao ler histórias.", saber: "Oralidade e comunicação", campo: "EF" },
      { code: "PR.EI01EF06.s", desc: "Comunicar-se com outras pessoas usando movimentos, gestos, balbucios, fala.", saber: "Oralidade e comunicação", campo: "EF" },
      { code: "PR.EI01EF07.t", desc: "Conhecer e manipular materiais impressos e audiovisuais.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI01EF08.u", desc: "Participar de situações de escuta de textos em diferentes gêneros textuais.", saber: "Gêneros textuais e literários", campo: "EF" },
      
      // ET - ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES
      { code: "PR.EI01ET01.v", desc: "Explorar e descobrir as propriedades de objetos e materiais.", saber: "Relações e propriedades dos objetos", campo: "ET" },
      { code: "PR.EI01ET02.w", desc: "Explorar relações de causa e efeito na interação com o mundo físico.", saber: "Fenômenos naturais e artificiais", campo: "ET" },
      { code: "PR.EI01ET03.x", desc: "Explorar o ambiente pela ação e observação.", saber: "Relações e propriedades dos objetos", campo: "ET" },
      { code: "PR.EI01ET04.y", desc: "Manipular, experimentar, arrumar e explorar o espaço.", saber: "Noções espaciais", campo: "ET" },
      { code: "PR.EI01ET05.z", desc: "Manipular materiais diversos e variados para comparar as diferenças e semelhanças.", saber: "Relações e propriedades dos objetos", campo: "ET" },
      { code: "PR.EI01ET06.aa", desc: "Vivenciar diferentes ritmos, velocidades e fluxos.", saber: "Noções temporais", campo: "ET" }
    ]
  },
  maternal: {
    label: "Maternal (1a7m a 3a11m)",
    codigos: [
      // EO - O EU, O OUTRO E O NÓS
      { code: "PR.EI02EO01.a", desc: "Demonstrar atitudes de cuidado e solidariedade.", saber: "Convivência e interação social", campo: "EO" },
      { code: "PR.EI02EO02.b", desc: "Demonstrar imagem positiva de si e confiança.", saber: "Identidade e autonomia", campo: "EO" },
      { code: "PR.EI02EO03.c", desc: "Compartilhar objetos e espaços.", saber: "Convivência e interação social", campo: "EO" },
      { code: "PR.EI02EO04.d", desc: "Comunicar-se com colegas e adultos.", saber: "Comunicação e expressão", campo: "EO" },
      { code: "PR.EI02EO05.e", desc: "Perceber características físicas diferentes.", saber: "Identidade e autonomia", campo: "EO" },
      { code: "PR.EI02EO06.f", desc: "Respeitar regras básicas de convívio social.", saber: "Convivência e interação social", campo: "EO" },
      { code: "PR.EI02EO07.g", desc: "Resolver conflitos com orientação de adulto.", saber: "Convivência e interação social", campo: "EO" },
      
      // CG - CORPO, GESTOS E MOVIMENTOS
      { code: "PR.EI02CG01.h", desc: "Apropriar-se de gestos e movimentos de sua cultura.", saber: "Esquema corporal e movimento", campo: "CG" },
      { code: "PR.EI02CG02.i", desc: "Deslocar seu corpo no espaço.", saber: "Noções espaciais", campo: "CG" },
      { code: "PR.EI02CG03.j", desc: "Explorar formas de deslocamento no espaço.", saber: "Coordenação motora", campo: "CG" },
      { code: "PR.EI02CG04.k", desc: "Demonstrar independência no cuidado do corpo.", saber: "Autocuidado e bem-estar", campo: "CG" },
      { code: "PR.EI02CG05.l", desc: "Desenvolver habilidades manuais.", saber: "Coordenação motora fina", campo: "CG" },
      
      // TS - TRAÇOS, SONS, CORES E FORMAS
      { code: "PR.EI02TS01.m", desc: "Criar sons com materiais e instrumentos.", saber: "Linguagem musical e expressão", campo: "TS" },
      { code: "PR.EI02TS02.n", desc: "Utilizar materiais variados com manipulação.", saber: "Linguagem artística", campo: "TS" },
      { code: "PR.EI02TS03.o", desc: "Utilizar fontes sonoras do ambiente.", saber: "Linguagem musical e expressão", campo: "TS" },
      
      // EF - ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO
      { code: "PR.EI02EF01.p", desc: "Dialogar expressando desejos e opiniões.", saber: "Oralidade e comunicação", campo: "EF" },
      { code: "PR.EI02EF02.q", desc: "Identificar sons e reconhecer rimas.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI02EF03.r", desc: "Demonstrar interesse ao ouvir histórias.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI02EF04.s", desc: "Formular perguntas sobre fatos da história.", saber: "Oralidade e comunicação", campo: "EF" },
      { code: "PR.EI02EF05.t", desc: "Relatar experiências e fatos acontecidos.", saber: "Oralidade e comunicação", campo: "EF" },
      { code: "PR.EI02EF06.u", desc: "Criar histórias oralmente.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI02EF07.v", desc: "Manusear diferentes portadores textuais.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI02EF08.w", desc: "Manipular textos em diferentes gêneros.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI02EF09.x", desc: "Manusear instrumentos de escrita.", saber: "Escrita e linguagem escrita", campo: "EF" },
      
      // ET - ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES
      { code: "PR.EI02ET01.y", desc: "Explorar semelhanças e diferenças entre objetos.", saber: "Relações e propriedades dos objetos", campo: "ET" },
      { code: "PR.EI02ET02.z", desc: "Observar e descrever fenômenos naturais.", saber: "Fenômenos naturais e artificiais", campo: "ET" },
      { code: "PR.EI02ET03.aa", desc: "Compartilhar cuidado de plantas e animais.", saber: "Fenômenos naturais e artificiais", campo: "ET" },
      { code: "PR.EI02ET04.ab", desc: "Identificar relações espaciais e temporais.", saber: "Noções espaciais", campo: "ET" },
      { code: "PR.EI02ET05.ac", desc: "Classificar objetos por atributos.", saber: "Relações e propriedades dos objetos", campo: "ET" },
      { code: "PR.EI02ET06.ad", desc: "Utilizar conceitos básicos de tempo.", saber: "Noções temporais", campo: "ET" },
      { code: "PR.EI02ET07.ae", desc: "Contar oralmente objetos.", saber: "Noções matemáticas", campo: "ET" },
      { code: "PR.EI02ET08.af", desc: "Registrar quantidades.", saber: "Noções matemáticas", campo: "ET" }
    ]
  },
  pre: {
    label: "Pré-Escola (4 a 5a11m)",
    codigos: [
      // EO - O EU, O OUTRO E O NÓS
      { code: "PR.EI03EO01.a", desc: "Demonstrar empatia pelos outros.", saber: "Convivência e interação social", campo: "EO" },
      { code: "PR.EI03EO02.b", desc: "Agir de maneira independente.", saber: "Identidade e autonomia", campo: "EO" },
      { code: "PR.EI03EO03.c", desc: "Ampliar relações interpessoais.", saber: "Convivência e interação social", campo: "EO" },
      { code: "PR.EI03EO04.d", desc: "Comunicar ideias e sentimentos.", saber: "Comunicação e expressão", campo: "EO" },
      { code: "PR.EI03EO05.e", desc: "Valorizar características do corpo.", saber: "Identidade e autonomia", campo: "EO" },
      { code: "PR.EI03EO06.f", desc: "Manifestar interesse por diferentes culturas.", saber: "Convivência e interação social", campo: "EO" },
      { code: "PR.EI03EO07.g", desc: "Usar estratégias de respeito para conflitos.", saber: "Convivência e interação social", campo: "EO" },
      
      // CG - CORPO, GESTOS E MOVIMENTOS
      { code: "PR.EI03CG01.h", desc: "Criar formas de expressão com o corpo.", saber: "Esquema corporal e movimento", campo: "CG" },
      { code: "PR.EI03CG02.i", desc: "Demonstrar controle do corpo.", saber: "Coordenação motora", campo: "CG" },
      { code: "PR.EI03CG03.j", desc: "Criar movimentos e mímicas.", saber: "Esquema corporal e movimento", campo: "CG" },
      { code: "PR.EI03CG04.k", desc: "Adotar hábitos de autocuidado.", saber: "Autocuidado e bem-estar", campo: "CG" },
      { code: "PR.EI03CG05.l", desc: "Coordenar habilidades manuais.", saber: "Coordenação motora fina", campo: "CG" },
      
      // TS - TRAÇOS, SONS, CORES E FORMAS
      { code: "PR.EI03TS01.m", desc: "Utilizar sons em brincadeiras.", saber: "Linguagem musical e expressão", campo: "TS" },
      { code: "PR.EI03TS02.n", desc: "Expressar-se por meio de arte.", saber: "Linguagem artística", campo: "TS" },
      { code: "PR.EI03TS03.o", desc: "Reconhecer qualidades do som.", saber: "Linguagem musical e expressão", campo: "TS" },
      
      // EF - ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO
      { code: "PR.EI03EF01.p", desc: "Expressar ideias e sentimentos.", saber: "Oralidade e comunicação", campo: "EF" },
      { code: "PR.EI03EF02.q", desc: "Inventar brincadeiras cantadas.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI03EF03.r", desc: "Escolher livros por temas.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI03EF04.s", desc: "Recontar histórias ouvidas.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI03EF05.t", desc: "Recontar histórias para produção escrita.", saber: "Escrita e linguagem escrita", campo: "EF" },
      { code: "PR.EI03EF06.u", desc: "Produzir histórias orais e escritas.", saber: "Escrita e linguagem escrita", campo: "EF" },
      { code: "PR.EI03EF07.v", desc: "Levantar hipóteses sobre gêneros textuais.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI03EF08.w", desc: "Selecionar livros para leitura.", saber: "Gêneros textuais e literários", campo: "EF" },
      { code: "PR.EI03EF09.x", desc: "Levantar hipóteses sobre linguagem escrita.", saber: "Escrita e linguagem escrita", campo: "EF" },
      
      // ET - ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES
      { code: "PR.EI03ET01.y", desc: "Comparar objetos por propriedades.", saber: "Relações e propriedades dos objetos", campo: "ET" },
      { code: "PR.EI03ET02.z", desc: "Observar mudanças em materiais.", saber: "Fenômenos naturais e artificiais", campo: "ET" },
      { code: "PR.EI03ET03.aa", desc: "Selecionar fontes de informação.", saber: "Fenômenos naturais e artificiais", campo: "ET" },
      { code: "PR.EI03ET04.ab", desc: "Registrar observações.", saber: "Noções matemáticas", campo: "ET" },
      { code: "PR.EI03ET05.ac", desc: "Classificar objetos e figuras.", saber: "Relações e propriedades dos objetos", campo: "ET" },
      { code: "PR.EI03ET06.ad", desc: "Relatar história familiar.", saber: "Noções temporais", campo: "ET" },
      { code: "PR.EI03ET07.ae", desc: "Relacionar números a quantidades.", saber: "Noções matemáticas", campo: "ET" },
      { code: "PR.EI03ET08.af", desc: "Expressar medidas.", saber: "Noções matemáticas", campo: "ET" }
    ]
  }
};

// ==========================================
// 🧠 TEMPLATES INTELIGENTES V17 (ESTRUTURADOS)
// ==========================================
const MODELOS_ATIVIDADES = [
  {
    tipo: "Movimento",
    titulos: [
      "Circuito dos Desafios Motores", 
      "Túnel de Cadeiras e Tecidos", 
      "O Chão é Lava (Equilíbrio)", 
      "Estátua Musical com Emoções",
      "Corrida dos Bichos",
      "Dança das Fitas Coloridas",
      "Yoga dos Animais",
      "Ponte do Equilíbrio (Corda)"
    ],
    desenvolvimento: `1. ACOLHIDA: Reunir as crianças em roda e alongar o corpo de forma lúdica, imitando espreguiçar de gato ou alcançar o céu. Explicar o desafio do dia com entusiasmo.
2. EXPERIÊNCIA: Organizar o circuito proposto utilizando os materiais. Convidar as crianças a percorrerem o trajeto explorando diferentes movimentos (saltar, rastejar, equilibrar). Mediar a atividade incentivando a autonomia e a superação dos limites corporais de cada um.
3. FINALIZAÇÃO: Diminuir o ritmo com uma música calma. Pedir que coloquem a mão no coração para sentir as batidas e relatem qual foi o obstáculo mais difícil.`,
    materiais: `[ ] Cadeiras
[ ] Cordas ou Barbante
[ ] Fita Crepe
[ ] Colchonetes
[ ] Aparelho de som`,
    adaptacao: `Para crianças com mobilidade reduzida: Adaptar o circuito para o nível do chão ou focar na manipulação de objetos sensoriais durante o percurso. 
Para TEA: Usar apoio visual (fotos) mostrando a sequência do circuito antes de começar.`
  },
  {
    tipo: "Arte",
    titulos: [
      "Pintura Sensorial com Dedos", 
      "Carimbo com Elementos da Natureza", 
      "Colagem de Texturas", 
      "Mural Coletivo no Kraft",
      "Ateliê de Massinha Caseira",
      "Pintura com Gelo Colorido",
      "Autorretrato no Espelho",
      "Escultura com Argila"
    ],
    desenvolvimento: `1. ACOLHIDA: Apresentar os materiais de forma investigativa (dentro de uma caixa ou cobertos por um pano). Deixar que as crianças toquem e sintam antes de começar.
2. EXPERIÊNCIA: Disponibilizar o suporte (papel, chão, parede) e permitir a livre expressão. Focar no processo criativo e na exploração das cores e texturas, não no produto final. Observar como a criança segura o instrumento riscador ou manipula a tinta.
3. FINALIZAÇÃO: Organizar uma 'exposição' na sala onde cada criança pode mostrar sua produção (se quiser) e ajudar na limpeza e organização dos materiais.`,
    materiais: `[ ] Papel Pardo/Kraft ou Cartolina
[ ] Tintas atóxicas
[ ] Pincéis variados ou esponjas
[ ] Cola branca
[ ] Elementos naturais (folhas, gravetos)`,
    adaptacao: `Para hipersensibilidade tátil: Oferecer pincéis, rolinhos ou luvas para que a criança não precise tocar diretamente na tinta se não quiser. 
Para baixa visão: Utilizar cores de alto contraste (ex: tinta preta no papel amarelo) e texturas em relevo.`
  },
  {
    tipo: "História",
    titulos: [
      "Hora do Conto Interativa", 
      "Teatro de Sombras", 
      "História na Lata", 
      "Leitura Compartilhada",
      "Reconto com Fantoches",
      "Saco Surpresa de Histórias",
      "História Desenhada",
      "Tapete Literário"
    ],
    desenvolvimento: `1. ACOLHIDA: Criar um ambiente mágico (apagar as luzes, usar lanterna ou tapete especial). Cantar a música de 'início da história' para marcar o momento.
2. EXPERIÊNCIA: Narrar a história com entonação de voz variada, fazendo pausas para que as crianças completem frases ou façam previsões ('O que será que vai acontecer?'). Utilizar recursos visuais (fantoches ou o próprio livro) para manter o engajamento.
3. FINALIZAÇÃO: Propor uma roda de conversa sobre a parte favorita da história ou pedir que as crianças desenhem o personagem principal.`,
    materiais: `[ ] Livro de Literatura Infantil
[ ] Fantoches ou Dedoches
[ ] Tapete e Almofadas
[ ] Caixa cênica ou lata decorada`,
    adaptacao: `Para TDAH: Permitir que a criança segure um objeto sensorial (fidget toy) durante a história para ajudar no foco. Manter a narrativa curta e dinâmica. Usar recursos visuais grandes e claros.`
  },
  {
    tipo: "Música",
    titulos: [
      "Bandinha Rítmica", 
      "Dança das Cadeiras Cooperativa", 
      "Qual é o som?", 
      "Construção de Chocalhos",
      "Estátua Sonora",
      "Som do Corpo (Percussão)",
      "Relaxamento Musical",
      "Maestro por um Dia"
    ],
    desenvolvimento: `1. ACOLHIDA: Iniciar com uma brincadeira de silêncio e som, pedindo para ouvirem os barulhos do ambiente (pássaros, carros, vozes).
2. EXPERIÊNCIA: Apresentar a proposta musical. Se for dança, explorar ritmos rápidos e lentos. Se for instrumentos, permitir a exploração sonora livre antes de propor ritmos dirigidos. Incentivar a percepção auditiva e a coordenação motora no ritmo da música.
3. FINALIZAÇÃO: Terminar com uma música calma de relaxamento, pedindo que as crianças deitem e fechem os olhos por um momento.`,
    materiais: `[ ] Aparelho de som ou celular
[ ] Instrumentos musicais (chocalhos, tambores)
[ ] Sucata para construção (garrafas, grãos)
[ ] Lenços coloridos`,
    adaptacao: `Para hipersensibilidade auditiva: Evitar sons muito altos ou estridentes. Permitir que a criança fique um pouco mais afastada da caixa de som ou use abafadores se necessário. Focar na vibração dos instrumentos.`
  },
  {
    tipo: "Exploração",
    titulos: [
      "Caixa de Sensações", 
      "Laboratório de Cores", 
      "Brincando com Água e Potes", 
      "Caça ao Tesouro na Natureza",
      "Luz e Sombra",
      "Explorando Texturas",
      "Torre de Copos",
      "Jardinagem"
    ],
    desenvolvimento: `1. ACOLHIDA: Despertar a curiosidade apresentando o material de forma misteriosa. 'O que será que temos aqui hoje?'.
2. EXPERIÊNCIA: Permitir a livre investigação. O papel do adulto é de observador e mediador, fazendo perguntas que estimulem o pensamento ('Por que a água caiu?', 'Isso é áspero ou macio?'). Deixar as crianças testarem hipóteses e fazerem descobertas.
3. FINALIZAÇÃO: Reunir o grupo para compartilhar suas descobertas. Registrar as falas das crianças em um cartaz ou diário de bordo.`,
    materiais: `[ ] Caixas de papelão
[ ] Elementos diversos (água, areia, gelatina, grãos)
[ ] Potes e funis
[ ] Lupas`,
    adaptacao: `Garantir que as mesas ou caixas de exploração estejam na altura adequada para cadeirantes. 
Para crianças com seletividade sensorial, oferecer ferramentas (colheres, pinças) para que não precisem tocar diretamente em texturas que as incomodam.`
  },
  {
    tipo: "Socialização",
    titulos: [
      "Roda dos Sentimentos", 
      "Minha História, Nossa História", 
      "Brincadeira de Faz de Conta", 
      "O Grande Baile",
      "Cuidando do Boneco",
      "Túnel do Afeto",
      "Correio da Amizade (Desenhos)",
      "Piquenique Coletivo"
    ],
    desenvolvimento: `1. ACOLHIDA: Sentar em roda de forma que todos se vejam. Cantar uma música de bom dia/boa tarde citando o nome de cada criança.
2. EXPERIÊNCIA: Propor a dinâmica focada na interação. Incentivar o contato visual, a troca de objetos e o respeito ao espaço do outro. Mediar pequenos conflitos como oportunidades de aprendizado sobre partilha e empatia.
3. FINALIZAÇÃO: Um abraço coletivo ou uma dança em roda para celebrar a união do grupo.`,
    materiais: `[ ] Brinquedos coletivos
[ ] Espelho grande
[ ] Bonecas e bichos de pelúcia
[ ] Fotos das famílias`,
    adaptacao: `Para TEA ou timidez excessiva: Não forçar a participação oral ou física direta. Permitir que a criança observe a atividade de um local seguro até se sentir confortável para interagir. Valorizar pequenos gestos de interação.`
  }
];

// ==========================================
// 🧠 MOTOR DE INTELIGÊNCIA V17 (SEMÂNTICO)
// ==========================================
class PedagogicalEngine {
  gerarAtividade(codigosSelecionados, tema, index, curriculo) {
    // 1. Definição do Código Base
    const codigoBase = codigosSelecionados.length > 0 
      ? codigosSelecionados[Math.floor(Math.random() * codigosSelecionados.length)]
      : { code: "BNCC", desc: "Objetivo geral de aprendizagem", saber: "Geral", campo: "EO" };

    // 2. Inteligência Semântica (Escolhe o modelo baseado nas palavras-chave da BNCC)
    const descricao = codigoBase.desc.toLowerCase() + " " + (codigoBase.saber || "").toLowerCase();
    let tipoSugerido = null;

    if (descricao.includes("pintar") || descricao.includes("riscar") || descricao.includes("colar") || descricao.includes("desenhar") || descricao.includes("visual")) tipoSugerido = "Arte";
    else if (descricao.includes("correr") || descricao.includes("pular") || descricao.includes("dançar") || descricao.includes("corpo") || descricao.includes("movimento")) tipoSugerido = "Movimento";
    else if (descricao.includes("história") || descricao.includes("fala") || descricao.includes("escuta") || descricao.includes("livro")) tipoSugerido = "História";
    else if (descricao.includes("som") || descricao.includes("música") || descricao.includes("cantar") || descricao.includes("ritmo")) tipoSugerido = "Música";
    else if (descricao.includes("água") || descricao.includes("terra") || descricao.includes("investigar") || descricao.includes("natureza") || descricao.includes("objeto")) tipoSugerido = "Exploração";
    else if (descricao.includes("outro") || descricao.includes("colega") || descricao.includes("emoção") || descricao.includes("sentimento")) tipoSugerido = "Socialização";

    // Filtra os modelos pelo tipo sugerido ou usa todos se não achar correspondência
    const modelosDisponiveis = tipoSugerido 
      ? MODELOS_ATIVIDADES.filter(m => m.tipo === tipoSugerido)
      : MODELOS_ATIVIDADES;

    // Fallback: Se o filtro retornou vazio (raro), usa todos
    const poolFinal = modelosDisponiveis.length > 0 ? modelosDisponiveis : MODELOS_ATIVIDADES;

    // 3. Seleção do Modelo e Título
    const modelo = poolFinal[Math.floor(Math.random() * poolFinal.length)];
    const tituloBase = modelo.titulos[Math.floor(Math.random() * modelo.titulos.length)];
    const tituloFinal = `${tituloBase} - ${tema}`;
    
    // 4. Montagem do Texto
    const curriculoNome = curriculo === 'pr' ? 'REFERENCIAL DO PARANÁ' : 'BNCC NACIONAL';
    const saberTexto = curriculo === 'pr' && codigoBase.saber ? `\nSABERES E CONHECIMENTOS:\n• ${codigoBase.saber}\n` : '';
    
    const textoCompleto = 
`ATIVIDADE: ${tituloFinal}

CURRÍCULO: ${curriculoNome}
CÓDIGO BNCC: ${codigoBase.code}
${curriculo === 'pr' ? `CAMPO DE EXPERIÊNCIA: ${CAMPOS_EXP[codigoBase.campo].nome}` : ''}
OBJETIVO DE APRENDIZAGEM: ${codigoBase.desc}
${saberTexto}
DESENVOLVIMENTO DA ATIVIDADE:
${modelo.desenvolvimento}

ADAPTAÇÃO E INCLUSÃO:
${modelo.adaptacao}

MATERIAIS NECESSÁRIOS:
${modelo.materiais}
[ ] Itens do tema ${tema}

AVALIAÇÃO:
• Observar o interesse e a participação ativa da criança.
• Registrar se o objetivo '${codigoBase.code}' foi contemplado na experiência.
• Documentar através de fotos ou pauta de observação.

OBSERVAÇÕES:
Acolher as sugestões das crianças durante a atividade, tornando o planejamento flexível.`;

    return {
      id: `${Date.now()}_${index}_${Math.random()}`,
      titulo: tituloFinal,
      bnccCode: codigoBase.code,
      bnccDesc: codigoBase.desc,
      saber: curriculo === 'pr' ? (codigoBase.saber || "Saberes Gerais") : null,
      campo: codigoBase.campo,
      campoNome: CAMPOS_EXP[codigoBase.campo].nome,
      textoCompleto: textoCompleto,
      desenvolvimento: modelo.desenvolvimento,
      materiais: modelo.materiais,
      adaptacao: modelo.adaptacao,
      tipo: modelo.tipo
    };
  }

  gerarLote(codigos, tema, quantidade, curriculo) {
    const lista = [];
    const usados = new Set();
    
    for(let i=0; i<quantidade; i++) {
      let tentativas = 0;
      let atividade;
      
      do {
        atividade = this.gerarAtividade(codigos, tema, i, curriculo);
        tentativas++;
      } while (usados.has(atividade.titulo) && tentativas < 50);
      
      usados.add(atividade.titulo);
      lista.push(atividade);
    }
    return lista;
  }
}

// ==========================================
// 🚀 COMPONENTE PRINCIPAL (V18 - GOLD EDITION CORRIGIDO)
// ==========================================
export default function EduPlanV18() {
  const [session, setSession] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [showProjects, setShowProjects] = useState(false);
  const [diaAtual, setDiaAtual] = useState(0);
  const [projetosSalvos, setProjetosSalvos] = useState([]);
  const [projetoAtualId, setProjetoAtualId] = useState(null);
  const [editandoAtiv, setEditandoAtiv] = useState(null);
  const [editandoTexto, setEditandoTexto] = useState('');
  const [diasSelecionados, setDiasSelecionados] = useState([true, true, true, true, true]);
  const [modoSemanaDupla, setModoSemanaDupla] = useState(false);
  
  const [config, setConfig] = useState({
    instituicao: "CMEI RAIO DE SOL",
    professor: "",
    turma: "",
    periodo: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase(),
    curriculo: "bncc",
    etapa: "maternal",
    tema: "",
    conteudo: ""
  });

  const [dias, setDias] = useState(
    DIAS_SEMANA.map((nome, index) => ({
      id: `dia_${index}_${Date.now()}`,
      nome,
      numero: index + 1,
      data: "",
      camposAbertos: [],
      bnccSelecionada: [],
      sugestoes: [],
      selecionadas: [],
      observacao: "",
      skip: false
    }))
  );

  const engine = useMemo(() => new PedagogicalEngine(), []);

  // ==========================================
  // SUPABASE AUTH
  // ==========================================
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ==========================================
  // CARREGAR PROJETOS SALVOS
  // ==========================================
  useEffect(() => {
    if (session?.user) {
      carregarProjetos();
    }
  }, [session]);

  const carregarProjetos = async () => {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjetosSalvos(data || []);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  // ==========================================
  // OBTER CÓDIGOS CONFORME CURRÍCULO
  // ==========================================
  const getCodigosPorCampo = useCallback((etapa, siglaCampo) => {
    const baseDados = config.curriculo === 'pr' ? REFERENCIAL_PR : BNCC_NATIONAL;
    return baseDados[etapa]?.codigos.filter(c => c.campo === siglaCampo) || [];
  }, [config.curriculo]);

  // ==========================================
  // FUNÇÕES DE CONTROLE DE DIAS
  // ==========================================
  const toggleSkipDia = (diaIndex) => {
    const novosDias = [...dias];
    novosDias[diaIndex].skip = !novosDias[diaIndex].skip;
    setDias(novosDias);
  };

  const pularParaDia = (diaIndex) => {
    setDiaAtual(diaIndex);
  };

  const duplicarSemana = () => {
    const diasAtuais = [...dias];
    const diasDuplicados = diasAtuais.map(dia => ({
      ...dia,
      id: `dia_${dia.numero}_${Date.now()}`,
      selecionadas: [...dia.selecionadas]
    }));
    
    setDias(diasAtuais.concat(diasDuplicados));
    setModoSemanaDupla(true);
  };

  // ==========================================
  // ✅ SALVAR PROJETO CORRIGIDO
  // ==========================================
  const salvarProjeto = async () => {
    if (!config.tema) {
      alert("❌ Defina um tema para o projeto antes de salvar!");
      return;
    }

    setSaving(true);

    try {
      const projetoData = {
        user_id: session.user.id,
        titulo: config.tema,
        instituicao: config.instituicao,
        professor: config.professor,
        turma: config.turma,
        periodo: config.periodo,
        etapa: config.etapa,
        curriculo: config.curriculo,
        conteudo: config.conteudo,
        dias: dias,
        config: config,
        modoSemanaDupla: modoSemanaDupla,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (projetoAtualId) {
        // Atualizar projeto existente
        result = await supabase
          .from('projetos')
          .update(projetoData)
          .eq('id', projetoAtualId);
      } else {
        // Criar novo projeto
        result = await supabase
          .from('projetos')
          .insert([projetoData]);
      }

      if (result.error) throw result.error;

      alert('✅ Projeto salvo na nuvem com sucesso!');
      await carregarProjetos();
      
      // ✅ Redirecionar para a tela de projetos após salvar
      setShowProjects(true);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar projeto: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CARREGAR PROJETO
  // ==========================================
  const carregarProjeto = (projeto) => {
    setConfig({
      instituicao: projeto.instituicao || "CMEI RAIO DE SOL",
      professor: projeto.professor || "",
      turma: projeto.turma || "",
      periodo: projeto.periodo || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase(),
      curriculo: projeto.curriculo || "bncc",
      etapa: projeto.etapa || "maternal",
      tema: projeto.titulo || "",
      conteudo: projeto.conteudo || ""
    });

    setDias(projeto.dias || DIAS_SEMANA.map((nome, index) => ({
      id: `dia_${index}_${Date.now()}`,
      nome,
      numero: index + 1,
      data: "",
      camposAbertos: [],
      bnccSelecionada: [],
      sugestoes: [],
      selecionadas: [],
      observacao: "",
      skip: false
    })));

    setModoSemanaDupla(projeto.modoSemanaDupla || false);
    setProjetoAtualId(projeto.id);
    setShowProjects(false);
    setStep(0);
    setDiaAtual(0);
  };

  // ==========================================
  // EXCLUIR PROJETO
  // ==========================================
  const excluirProjeto = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await carregarProjetos();
      if (projetoAtualId === id) {
        setProjetoAtualId(null);
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir projeto.');
    }
  };

  // ==========================================
  // NOVO PROJETO
  // ==========================================
  const novoProjeto = () => {
    setProjetoAtualId(null);
    setConfig({
      instituicao: "CMEI RAIO DE SOL",
      professor: "",
      turma: "",
      periodo: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase(),
      curriculo: "bncc",
      etapa: "maternal",
      tema: "",
      conteudo: ""
    });
    setDias(DIAS_SEMANA.map((nome, index) => ({
      id: `dia_${index}_${Date.now()}`,
      nome,
      numero: index + 1,
      data: "",
      camposAbertos: [],
      bnccSelecionada: [],
      sugestoes: [],
      selecionadas: [],
      observacao: "",
      skip: false
    })));
    setDiasSelecionados([true, true, true, true, true]);
    setModoSemanaDupla(false);
    setStep(0);
    setDiaAtual(0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ==========================================
  // FUNÇÕES AUXILIARES
  // ==========================================
  const resetarTudo = () => {
    if (window.confirm("Tem certeza que deseja zerar todo o planejamento? Esta ação não poderá ser desfeita.")) {
      novoProjeto();
    }
  };

  const iniciarWizard = () => {
    if (!config.tema || !config.instituicao) {
      alert("Preencha os dados da instituição e tema do projeto!");
      return;
    }
    setStep(1);
    setDiaAtual(0);
  };

  const toggleCampoExp = (diaIndex, sigla) => {
    const novosDias = [...dias];
    if (novosDias[diaIndex].camposAbertos.includes(sigla)) {
      novosDias[diaIndex].camposAbertos = novosDias[diaIndex].camposAbertos.filter(s => s !== sigla);
    } else {
      novosDias[diaIndex].camposAbertos = [...novosDias[diaIndex].camposAbertos, sigla];
    }
    setDias(novosDias);
  };

  const toggleCodigoBNCC = (diaIndex, obj) => {
    const novosDias = [...dias];
    const existe = novosDias[diaIndex].bnccSelecionada.find(o => o.code === obj.code);
    if (existe) {
      novosDias[diaIndex].bnccSelecionada = novosDias[diaIndex].bnccSelecionada.filter(o => o.code !== obj.code);
    } else {
      novosDias[diaIndex].bnccSelecionada = [...novosDias[diaIndex].bnccSelecionada, obj];
    }
    setDias(novosDias);
  };

  // ==========================================
  // GERAR ATIVIDADES
  // ==========================================
  const gerarAtividadesDia = (diaIndex) => {
    const dia = dias[diaIndex];
    if (dia.bnccSelecionada.length === 0) {
      alert("Selecione pelo menos um código BNCC para gerar as atividades!");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const novasAtividades = engine.gerarLote(dia.bnccSelecionada, config.tema, 16, config.curriculo);
      const novosDias = [...dias];
      novosDias[diaIndex].sugestoes = novasAtividades;
      setDias(novosDias);
      setLoading(false);
    }, 1500);
  };

  const selecionarAtividade = (diaIndex, ativ) => {
    const novosDias = [...dias];
    const dia = novosDias[diaIndex];
    const isSel = dia.selecionadas.find(s => s.id === ativ.id);
    
    if (isSel) {
      dia.selecionadas = dia.selecionadas.filter(s => s.id !== ativ.id);
    } else {
      if (dia.selecionadas.length >= 2) {
        alert("Você pode selecionar no máximo 2 atividades por dia!");
        return;
      }
      dia.selecionadas = [...dia.selecionadas, ativ];
    }
    setDias(novosDias);
  };

  const iniciarEdicao = (ativId, textoAtual) => {
    setEditandoAtiv(ativId);
    setEditandoTexto(textoAtual);
  };

  const salvarEdicao = (diaIndex, ativId) => {
    const novosDias = [...dias];
    
    const sugIndex = novosDias[diaIndex].sugestoes.findIndex(s => s.id === ativId);
    if(sugIndex >= 0) novosDias[diaIndex].sugestoes[sugIndex].textoCompleto = editandoTexto;
    
    const selIndex = novosDias[diaIndex].selecionadas.findIndex(s => s.id === ativId);
    if(selIndex >= 0) novosDias[diaIndex].selecionadas[selIndex].textoCompleto = editandoTexto;
    
    setDias(novosDias);
    setEditandoAtiv(null);
    setEditandoTexto('');
  };

  const cancelarEdicao = () => {
    setEditandoAtiv(null);
    setEditandoTexto('');
  };

  const avancarDia = () => {
    let proximoDia = diaAtual + 1;
    while (proximoDia < dias.length && dias[proximoDia]?.skip) {
      proximoDia++;
    }
    
    if (proximoDia < dias.length) {
      setDiaAtual(proximoDia);
    } else {
      setStep(2);
    }
  };

  const voltarDia = () => {
    let diaAnterior = diaAtual - 1;
    while (diaAnterior >= 0 && dias[diaAnterior]?.skip) {
      diaAnterior--;
    }
    
    if (diaAnterior >= 0) {
      setDiaAtual(diaAnterior);
    } else {
      setStep(0);
    }
  };

  // ==========================================
  // EXPORTAÇÃO WORD PADRÃO
  // ==========================================
  const gerarWordPadrao = async () => {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

    const children = [];

    children.push(new Paragraph({
      text: config.instituicao.toUpperCase(),
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }));

    children.push(new Paragraph({
      text: `PLANEJAMENTO SEMANAL: ${config.tema.toUpperCase()}`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }));

    if (modoSemanaDupla) {
      children.push(new Paragraph({
        text: `DUAS SEMANAS • PERÍODO: ${config.periodo}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }));
    } else {
      children.push(new Paragraph({
        text: `PERÍODO: ${config.periodo}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }));
    }

    children.push(new Paragraph({
      children: [
        new TextRun({ text: "PROFESSOR(A): ", bold: true }),
        new TextRun(config.professor)
      ]
    }));

    children.push(new Paragraph({
      children: [
        new TextRun({ text: "TURMA: ", bold: true }),
        new TextRun(config.turma)
      ]
    }));

    children.push(new Paragraph({
      children: [
        new TextRun({ text: "CURRÍCULO: ", bold: true }),
        new TextRun(config.curriculo === 'pr' ? 'REFERENCIAL DO PARANÁ' : 'BNCC NACIONAL')
      ]
    }));

    children.push(new Paragraph({ text: "" }));

    dias.forEach((dia, index) => {
      if (dia.skip || dia.selecionadas.length === 0) return;

      if (index === 5) {
        children.push(new Paragraph({
          children: [new TextRun({ text: "═══════════════════════════════════════", bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 800, after: 400 }
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: "SEGUNDA SEMANA", bold: true, size: 32 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }));
      }

      children.push(new Paragraph({
        children: [new TextRun({ text: dia.nome.toUpperCase(), bold: true, size: 28 })],
        spacing: { before: 400, after: 200 },
        thematicBreak: true
      }));

      if (dia.data) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: "Data: ", italics: true }),
            new TextRun(dia.data)
          ]
        }));
      }

      dia.selecionadas.forEach((ativ, i) => {
        const linhas = ativ.textoCompleto.split('\n');
        linhas.forEach(linha => {
          if (linha.trim() !== '') {
            if (linha.startsWith('ATIVIDADE:') || 
                linha.startsWith('CURRÍCULO:') || 
                linha.startsWith('CÓDIGO BNCC:') ||
                linha.startsWith('CAMPO DE EXPERIÊNCIA:') ||
                linha.startsWith('OBJETIVO DE APRENDIZAGEM:') ||
                linha.startsWith('SABERES E CONHECIMENTOS:') ||
                linha.startsWith('DESENVOLVIMENTO DA ATIVIDADE:') ||
                linha.startsWith('ADAPTAÇÃO E INCLUSÃO:') ||
                linha.startsWith('MATERIAIS NECESSÁRIOS:') ||
                linha.startsWith('AVALIAÇÃO:') ||
                linha.startsWith('OBSERVAÇÕES:')) {
              children.push(new Paragraph({ 
                children: [new TextRun({ text: linha, bold: true })],
                spacing: { before: 200 }
              }));
            } 
            else if (linha.includes('1. ACOLHIDA:') || linha.includes('2. EXPERIÊNCIA:') || linha.includes('3. FINALIZAÇÃO:')) {
               const parts = linha.split(':');
               children.push(new Paragraph({ 
                 children: [
                   new TextRun({ text: parts[0] + ':', bold: true }),
                   new TextRun({ text: parts.slice(1).join(':') })
                 ]
               }));
            }
            else if (linha.startsWith('[ ]')) {
               children.push(new Paragraph({ text: linha, indent: { left: 720 } }));
            }
            else {
              children.push(new Paragraph({ text: linha }));
            }
          }
        });
        children.push(new Paragraph({ text: "__________________________________________" }));
        children.push(new Paragraph({ text: "" }));
      });

      if (dia.observacao) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: "OBSERVAÇÕES DO DIA: ", bold: true, italics: true }),
            new TextRun({ text: dia.observacao, italics: true })
          ]
        }));
      }
    });

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Planejamento_${config.tema}_${new Date().toISOString().split('T')[0]}.docx`);
  };

  // ==========================================
  // 👑 MOTOR DE TEMPLATE CUSTOMIZADO (V18 GOLD)
  // ==========================================
  const gerarWordCustomizado = (file) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const content = evt.target.result;
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // Prepara os dados JSON para o Word
        const dadosParaWord = {
          escola: config.instituicao.toUpperCase(),
          professor: config.professor,
          turma: config.turma,
          periodo: config.periodo,
          tema: config.tema.toUpperCase(),
          curriculo: config.curriculo === 'pr' ? 'REFERENCIAL DO PARANÁ' : 'BNCC NACIONAL',
          
          // Loop inteligente de dias
          dias: dias
            .filter(d => !d.skip && (d.selecionadas.length > 0 || d.observacao))
            .map(dia => ({
              nome_dia: dia.nome.toUpperCase(),
              data: dia.data ? dia.data.split('-').reverse().join('/') : '',
              observacao: dia.observacao || '',
              // Loop de atividades
              atividades: dia.selecionadas.map(ativ => ({
                titulo: ativ.titulo,
                codigo: ativ.bnccCode,
                objetivo: ativ.bnccDesc,
                desenvolvimento: ativ.desenvolvimento,
                materiais: ativ.materiais,
                adaptacao: ativ.adaptacao,
                saber: ativ.saber || ""
              }))
            }))
        };

        doc.render(dadosParaWord);
        const out = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        saveAs(out, `Planejamento_${config.tema}_Custom.docx`);
      } catch (error) {
        alert("Erro ao processar o arquivo modelo. Verifique as tags: " + error);
      }
    };
    reader.readAsBinaryString(file);
  };

  // ==========================================
  // EXPORTAÇÃO PDF
  // ==========================================
  const gerarPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFillColor(21, 128, 61);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(config.instituicao.toUpperCase(), 105, 100, { align: "center" });
    doc.setFontSize(18);
    doc.text("PLANEJAMENTO SEMANAL", 105, 120, { align: "center" });
    doc.setFontSize(16);
    doc.text(config.tema.toUpperCase(), 105, 150, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Professora: ${config.professor}`, 105, 180, { align: "center" });
    doc.text(`Turma: ${config.turma} - ${config.periodo}`, 105, 190, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Currículo: ${config.curriculo === 'pr' ? 'Referencial do Paraná' : 'BNCC Nacional'}`, 105, 200, { align: "center" });
    if (modoSemanaDupla) {
      doc.text("DUAS SEMANAS", 105, 210, { align: "center" });
    }

    doc.addPage();
    doc.setTextColor(0);
    y = 20;

    dias.forEach((dia, index) => {
      if (dia.skip || dia.selecionadas.length === 0) return;

      if (index === 5) {
        if (y > 200) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(21, 128, 61);
        doc.text("════════════ SEGUNDA SEMANA ════════════", 105, y, { align: "center" });
        y += 15;
        doc.setTextColor(0);
      }

      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFillColor(240);
      doc.rect(10, y - 5, 190, 8, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(21, 128, 61);
      doc.text(dia.nome.toUpperCase(), 15, y);
      y += 10;

      dia.selecionadas.forEach((ativ) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        const linhas = ativ.textoCompleto.split('\n');
        
        linhas.forEach(linha => {
          if (linha.trim() === '') return;
          
          const lines = doc.splitTextToSize(linha, 170);
          if (y + (lines.length * 5) > 280) { doc.addPage(); y = 20; }
          
          if (linha.startsWith('ATIVIDADE:') || 
              linha.startsWith('CURRÍCULO:') || 
              linha.startsWith('CÓDIGO BNCC:') ||
              linha.startsWith('CAMPO DE EXPERIÊNCIA:') ||
              linha.startsWith('OBJETIVO DE APRENDIZAGEM:') ||
              linha.startsWith('SABERES E CONHECIMENTOS:') ||
              linha.startsWith('DESENVOLVIMENTO DA ATIVIDADE:') ||
              linha.startsWith('ADAPTAÇÃO E INCLUSÃO:') ||
              linha.startsWith('MATERIAIS NECESSÁRIOS:') ||
              linha.startsWith('AVALIAÇÃO:') ||
              linha.startsWith('OBSERVAÇÕES:')) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
          } else if (linha.includes('1. ACOLHIDA:') || linha.includes('2. EXPERIÊNCIA:') || linha.includes('3. FINALIZAÇÃO:')) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
          } else if (linha.startsWith('[ ]')) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
          } else {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
          }
          
          doc.text(lines, 20, y);
          y += (lines.length * 5) + 2;
        });
        y += 5;
      });

      if (dia.observacao) {
        doc.setFont("helvetica", "bolditalic");
        doc.text("Observações:", 15, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        const obsLines = doc.splitTextToSize(dia.observacao, 170);
        doc.text(obsLines, 20, y);
        y += obsLines.length * 5 + 10;
      }
    });

    doc.save(`Planejamento_${config.tema}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // ==========================================
  // RENDER
  // ==========================================
  if (!session) {
    return <Login />
  }

  if (step === 1 && !dias[diaAtual]) {
    setDiaAtual(0);
    return null;
  }

  // Tela de Projetos
  if (showProjects) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: isDark ? '#111827' : '#f0fdf4',
        color: isDark ? '#f3f4f6' : '#1f2937',
        fontFamily: 'sans-serif'
      }}>
        <header style={{
          background: isDark ? '#065f46' : '#15803d',
          padding: '20px 30px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <FolderOpen size={32} />
            <h1 style={{ fontSize: 24, margin: 0 }}>Meus Planejamentos</h1>
          </div>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={novoProjeto}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <FileEdit size={18} /> Novo Projeto
            </button>
            <button
              onClick={() => setShowProjects(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        </header>

        <main style={{ maxWidth: 1200, margin: '30px auto', padding: '0 20px' }}>
          {projetosSalvos.length === 0 ? (
            <div style={{
              background: isDark ? '#1f2937' : 'white',
              padding: 60,
              borderRadius: 16,
              textAlign: 'center'
            }}>
              <Archive size={64} style={{ opacity: 0.5, marginBottom: 20 }} />
              <h2 style={{ fontSize: 24, marginBottom: 10 }}>Nenhum projeto salvo</h2>
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: 30 }}>
                Comece criando seu primeiro planejamento!
              </p>
              <button
                onClick={novoProjeto}
                style={{
                  background: isDark ? '#10b981' : '#15803d',
                  color: 'white',
                  padding: '15px 40px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Criar Novo Projeto
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {projetosSalvos.map((projeto) => (
                <div
                  key={projeto.id}
                  style={{
                    background: isDark ? '#1f2937' : 'white',
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    border: projetoAtualId === projeto.id ? `2px solid ${isDark ? '#10b981' : '#15803d'}` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 15 }}>
                    <h3 style={{ margin: 0, fontSize: 18, color: '#15803d' }}>{projeto.titulo}</h3>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        onClick={() => carregarProjeto(projeto)}
                        style={{
                          background: isDark ? '#10b981' : '#15803d',
                          border: 'none',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        ABRIR
                      </button>
                      <button
                        onClick={() => excluirProjeto(projeto.id)}
                        style={{
                          background: '#ef4444',
                          border: 'none',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280', margin: '5px 0' }}>
                    {projeto.instituicao} • {projeto.turma}
                  </p>
                  <p style={{ fontSize: 11, color: isDark ? '#9ca3af' : '#6b7280', margin: '5px 0' }}>
                    <strong>Currículo:</strong> {projeto.curriculo === 'pr' ? 'Referencial do Paraná' : 'BNCC Nacional'}
                  </p>
                  {projeto.modoSemanaDupla && (
                    <p style={{ fontSize: 11, color: isDark ? '#9ca3af' : '#6b7280', margin: '5px 0' }}>
                      <strong>📅 Duas semanas</strong>
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: isDark ? '#9ca3af' : '#6b7280', margin: '5px 0' }}>
                    Atualizado: {new Date(projeto.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                  
                  <div style={{ marginTop: 15, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <span style={{
                      background: isDark ? '#374151' : '#f3f4f6',
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11
                    }}>
                      {projeto.etapa}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? '#111827' : '#f0fdf4',
      color: isDark ? '#f3f4f6' : '#1f2937',
      fontFamily: 'sans-serif',
      transition: 'all 0.3s'
    }}>
      {/* HEADER */}
      <header style={{
        background: isDark ? '#065f46' : '#15803d',
        padding: '20px 30px',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <BrainCircuit size={32} />
            <div>
              <h1 style={{ fontSize: 24, margin: 0 }}>EduPlan V18</h1>
              <p style={{ fontSize: 12, opacity: 0.9, margin: 0 }}>Gold Edition - Templates Personalizados</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '8px 20px',
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 'bold'
            }}>
              {step === 0 ? '⚙️ Configuração' : step === 1 ? `📅 ${dias[diaAtual]?.nome || 'Carregando...'}` : '✅ Finalização'}
            </div>
            
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 15px',
                borderRadius: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={() => setShowProjects(true)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 15px',
                borderRadius: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <FolderOpen size={16} />
              Projetos
            </button>
            
            <button
              onClick={salvarProjeto}
              disabled={saving}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 15px',
                borderRadius: 20,
                cursor: saving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                opacity: saving ? 0.7 : 1
              }}
            >
              <Cloud size={16} />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            
            <button
              onClick={resetarTudo}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 15px',
                borderRadius: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13
              }}
            >
              <RotateCcw size={16} />
              Zerar
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 15px',
                borderRadius: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13
              }}
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div style={{ maxWidth: 1200, margin: '15px auto 0', display: 'flex', gap: 5 }}>
          {[0, 1, 2].map((s) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{
                height: 6,
                background: step >= s ? 'white' : 'rgba(255,255,255,0.3)',
                borderRadius: 3,
                transition: 'all 0.3s'
              }} />
            </div>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '30px auto', padding: '0 20px' }}>
        
        {/* PASSO 0: CONFIGURAÇÃO */}
        {step === 0 && (
          <div style={{
            background: isDark ? '#1f2937' : 'white',
            padding: 30,
            borderRadius: 16,
            boxShadow: isDark ? '0 10px 30px -5px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.1)',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
          }}>
            <h2 style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: isDark ? '#f3f4f6' : '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 25
            }}>
              <Layout size={24} /> Configuração do Planejamento
            </h2>
            
            {/* SELETOR DE CURRÍCULO */}
            <div style={{
              background: isDark ? '#1e3a8a' : '#eff6ff',
              padding: 20,
              borderRadius: 12,
              marginBottom: 25,
              border: `1px solid ${isDark ? '#3b82f6' : '#bfdbfe'}`
            }}>
              <label style={{
                fontWeight: 'bold',
                display: 'block',
                marginBottom: 15,
                color: isDark ? '#bbf7d0' : '#1e40af',
                fontSize: 16
              }}>
                <Map size={20} style={{ marginRight: 8, display: 'inline' }} />
                Escolha o Currículo Base:
              </label>
              <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="curriculo"
                    checked={config.curriculo === 'bncc'}
                    onChange={() => setConfig({ ...config, curriculo: 'bncc' })}
                    style={{ width: 18, height: 18 }}
                  />
                  <span style={{ fontSize: 16, fontWeight: config.curriculo === 'bncc' ? 'bold' : 'normal' }}>
                    🇧🇷 BNCC Nacional (Padrão)
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="curriculo"
                    checked={config.curriculo === 'pr'}
                    onChange={() => setConfig({ ...config, curriculo: 'pr' })}
                    style={{ width: 18, height: 18 }}
                  />
                  <span style={{
                    fontSize: 16,
                    fontWeight: config.curriculo === 'pr' ? 'bold' : 'normal',
                    color: isDark ? '#bbf7d0' : '#15803d'
                  }}>
                    🌲 Referencial do Paraná (com Saberes)
                  </span>
                </label>
              </div>
              {config.curriculo === 'pr' && (
                <div style={{
                  marginTop: 15,
                  background: isDark ? '#064e3b' : '#dcfce7',
                  padding: '10px 15px',
                  borderRadius: 8,
                  color: isDark ? '#bbf7d0' : '#166534',
                  fontSize: 14
                }}>
                  ✅ Modo Paraná ativado! Os códigos incluirão "Saberes e Conhecimentos".
                </div>
              )}
            </div>

            {/* OPÇÃO DE DUPLICAR SEMANA */}
            <div style={{
              background: isDark ? '#854d0e' : '#fef9c3',
              padding: 20,
              borderRadius: 12,
              marginBottom: 25,
              border: `1px solid ${isDark ? '#eab308' : '#fde047'}`
            }}>
              <label style={{
                fontWeight: 'bold',
                display: 'block',
                marginBottom: 15,
                color: isDark ? '#fef08a' : '#854d0e',
                fontSize: 16
              }}>
                <CopyPlus size={20} style={{ marginRight: 8, display: 'inline' }} />
                Opções de Planejamento:
              </label>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={modoSemanaDupla}
                    onChange={() => setModoSemanaDupla(!modoSemanaDupla)}
                    style={{ width: 18, height: 18 }}
                  />
                  <span style={{ fontSize: 16 }}>
                    📅 Gerar 2 semanas (duplicar planejamento)
                  </span>
                </label>
              </div>
              <p style={{
                fontSize: 13,
                marginTop: 10,
                color: isDark ? '#fde047' : '#854d0e'
              }}>
                Se ativado, o planejamento da primeira semana será duplicado para a segunda semana na exportação.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <input
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: 14,
                  background: isDark ? '#374151' : 'white',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  gridColumn: 'span 2'
                }}
                placeholder="Nome da Instituição *"
                value={config.instituicao}
                onChange={e => setConfig({ ...config, instituicao: e.target.value })}
              />
              
              <input
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: 14,
                  background: isDark ? '#374151' : 'white',
                  color: isDark ? '#f3f4f6' : '#1f2937'
                }}
                placeholder="Nome da Professora"
                value={config.professor}
                onChange={e => setConfig({ ...config, professor: e.target.value })}
              />
              
              <input
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: 14,
                  background: isDark ? '#374151' : 'white',
                  color: isDark ? '#f3f4f6' : '#1f2937'
                }}
                placeholder="Turma"
                value={config.turma}
                onChange={e => setConfig({ ...config, turma: e.target.value })}
              />
              
              <input
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  outline: 'none',
                  fontSize: 14,
                  background: isDark ? '#374151' : 'white',
                  color: isDark ? '#f3f4f6' : '#1f2937'
                }}
                placeholder="Período"
                value={config.periodo}
                onChange={e => setConfig({ ...config, periodo: e.target.value })}
              />
              
              <select
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  outline: 'none',
                  background: isDark ? '#374151' : 'white',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  fontSize: 14
                }}
                value={config.etapa}
                onChange={e => setConfig({ ...config, etapa: e.target.value })}
              >
                <option value="bercario">Berçário (0 a 1a6m)</option>
                <option value="maternal">Maternal (1a7m a 3a11m)</option>
                <option value="pre">Pré-Escola (4 a 5a11m)</option>
              </select>
              
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: isDark ? '#bbf7d0' : '#166534',
                  marginBottom: 5,
                  textTransform: 'uppercase'
                }}>
                  TEMA DO PROJETO *
                </label>
                <input
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: 8,
                    border: `2px solid ${isDark ? '#10b981' : '#15803d'}`,
                    outline: 'none',
                    fontSize: 18,
                    fontWeight: 'bold',
                    background: isDark ? '#374151' : 'white',
                    color: isDark ? '#f3f4f6' : '#1f2937'
                  }}
                  placeholder="Ex: A CESTA DA DONA MARICOTA"
                  value={config.tema}
                  onChange={e => setConfig({ ...config, tema: e.target.value })}
                />
              </div>
            </div>
            
            <div style={{ textAlign: 'right', marginTop: 30 }}>
              <button
                onClick={iniciarWizard}
                style={{
                  background: isDark ? '#10b981' : '#15803d',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: 8,
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 16
                }}
              >
                INICIAR PLANEJAMENTO <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 1: PLANEJAMENTO DIÁRIO */}
        {step === 1 && dias[diaAtual] && (
          <div style={{
            background: isDark ? '#1f2937' : 'white',
            padding: 30,
            borderRadius: 16,
            boxShadow: isDark ? '0 10px 30px -5px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.1)',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
          }}>
            {/* Cabeçalho do Dia */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `2px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              paddingBottom: 20,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <h2 style={{ fontSize: 28, color: isDark ? '#6ee7b7' : '#15803d', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={28} />
                  {dias[diaAtual].nome}
                </h2>
                
                <button
                  onClick={() => toggleSkipDia(diaAtual)}
                  style={{
                    background: dias[diaAtual].skip ? (isDark ? '#991b1b' : '#fee2e2') : (isDark ? '#065f46' : '#dcfce7'),
                    color: dias[diaAtual].skip ? (isDark ? '#fecaca' : '#b91c1c') : (isDark ? '#bbf7d0' : '#166534'),
                    border: 'none',
                    padding: '6px 15px',
                    borderRadius: 30,
                    fontSize: 13,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  {dias[diaAtual].skip ? '▶️ Ativar Dia' : '⏭️ Pular Dia'}
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <span style={{
                  background: isDark ? '#1e3a8a' : '#dbeafe',
                  color: isDark ? '#93c5fd' : '#1e40af',
                  padding: '5px 15px',
                  borderRadius: 30,
                  fontSize: 13,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}>
                  <Map size={14} />
                  {config.curriculo === 'pr' ? 'Paraná' : 'BNCC'}
                </span>
                <input
                  type="date"
                  value={dias[diaAtual].data}
                  onChange={e => {
                    const novos = [...dias];
                    novos[diaAtual].data = e.target.value;
                    setDias(novos);
                  }}
                  style={{
                    padding: '12px 15px',
                    borderRadius: 8,
                    border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                    outline: 'none',
                    fontSize: 14,
                    background: isDark ? '#374151' : 'white',
                    color: isDark ? '#f3f4f6' : '#1f2937'
                  }}
                />
                
                <div style={{
                  background: isDark ? '#065f46' : '#dcfce7',
                  color: isDark ? '#bbf7d0' : '#166534',
                  padding: '8px 20px',
                  borderRadius: 30,
                  fontWeight: 'bold'
                }}>
                  {dias[diaAtual].selecionadas.length}/2 atividades
                </div>
              </div>
            </div>

            {/* Barra de navegação rápida */}
            <div style={{
              display: 'flex',
              gap: 10,
              marginBottom: 25,
              flexWrap: 'wrap',
              background: isDark ? '#1f2937' : '#f9fafb',
              padding: '15px',
              borderRadius: 12
            }}>
              <span style={{ fontWeight: 'bold', marginRight: 5 }}>Pular para:</span>
              {dias.map((dia, idx) => (
                <button
                  key={idx}
                  onClick={() => pularParaDia(idx)}
                  style={{
                    background: idx === diaAtual ? (isDark ? '#10b981' : '#15803d') : (dia.skip ? (isDark ? '#991b1b' : '#fee2e2') : (isDark ? '#374151' : 'white')),
                    color: idx === diaAtual ? 'white' : (dia.skip ? (isDark ? '#fecaca' : '#b91c1c') : (isDark ? '#f3f4f6' : '#1f2937')),
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: 30,
                    fontSize: 13,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    opacity: dia.skip ? 0.7 : 1
                  }}
                >
                  {DIAS_ABREVIADO[dia.nome]} {dia.skip && '⏭️'}
                </button>
              ))}
              {modoSemanaDupla && (
                <button
                  onClick={duplicarSemana}
                  style={{
                    background: isDark ? '#854d0e' : '#fef9c3',
                    color: isDark ? '#fde047' : '#854d0e',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: 30,
                    fontSize: 13,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <CopyPlus size={16} /> Duplicar Semana
                </button>
              )}
            </div>

            {dias[diaAtual].skip ? (
              <div style={{
                background: isDark ? '#991b1b' : '#fee2e2',
                padding: 40,
                borderRadius: 12,
                textAlign: 'center',
                color: isDark ? '#fecaca' : '#b91c1c',
                fontSize: 16,
                marginBottom: 30
              }}>
                ⏭️ Este dia foi pulado. Clique em "Ativar Dia" para planejar atividades.
              </div>
            ) : (
              <>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: isDark ? '#d1d5db' : '#4b5563',
                  margin: '25px 0 15px 0',
                  textTransform: 'uppercase'
                }}>
                  1. Selecione os Códigos por Campo:
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 30 }}>
                  {Object.entries(CAMPOS_EXP).map(([sigla, dados]) => {
                    const isOpen = dias[diaAtual].camposAbertos.includes(sigla);
                    const codigosCampo = getCodigosPorCampo(config.etapa, sigla);
                    const selecionadosNoCampo = dias[diaAtual].bnccSelecionada.filter(c => c.campo === sigla).length;
                    
                    if (codigosCampo.length === 0) return null;

                    return (
                      <div key={sigla} style={{
                        border: `2px solid ${dados.cor}`,
                        borderRadius: 12,
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => toggleCampoExp(diaAtual, sigla)}
                          style={{
                            background: isDark ? '#1f2937' : dados.bg,
                            padding: '15px 20px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: `8px solid ${dados.cor}`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontWeight: 'bold', fontSize: 16, color: isDark ? '#f3f4f6' : '#1f2937' }}>
                              {dados.nome}
                            </span>
                            <span style={{
                              background: dados.cor,
                              color: 'white',
                              padding: '2px 10px',
                              borderRadius: 20,
                              fontSize: 12
                            }}>
                              {selecionadosNoCampo} selecionados
                            </span>
                          </div>
                          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>

                        {isOpen && (
                          <div style={{ padding: 20, background: isDark ? '#111827' : 'white' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                              {codigosCampo.map(obj => {
                                const isSel = dias[diaAtual].bnccSelecionada.some(o => o.code === obj.code);
                                return (
                                  <div
                                    key={obj.code}
                                    onClick={() => toggleCodigoBNCC(diaAtual, obj)}
                                    style={{
                                      display: 'flex',
                                      gap: 15,
                                      alignItems: 'flex-start',
                                      padding: 12,
                                      borderRadius: 8,
                                      cursor: 'pointer',
                                      background: isSel 
                                        ? (isDark ? '#1e3a8a' : '#eff6ff') 
                                        : (isDark ? '#1f2937' : '#f9fafb'),
                                      border: isSel 
                                        ? `2px solid ${isDark ? '#3b82f6' : '#2563eb'}` 
                                        : `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    {isSel ? (
                                      <CheckSquare size={20} color={isDark ? '#93c5fd' : '#2563eb'} style={{ flexShrink: 0 }} />
                                    ) : (
                                      <div style={{ width: 20, height: 20, border: `2px solid ${isDark ? '#6b7280' : '#9ca3af'}`, borderRadius: 4, flexShrink: 0 }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 'bold', color: isDark ? '#f3f4f6' : '#1f2937' }}>{obj.code}</span>
                                        {config.curriculo === 'pr' && obj.saber && (
                                          <span style={{
                                            background: isDark ? '#065f46' : '#dcfce7',
                                            color: isDark ? '#bbf7d0' : '#166534',
                                            padding: '2px 8px',
                                            borderRadius: 12,
                                            fontSize: 10,
                                            fontWeight: 'bold'
                                          }}>
                                            🧠 {obj.saber}
                                          </span>
                                        )}
                                      </div>
                                      <p style={{ margin: '5px 0 0 0', fontSize: 13, color: isDark ? '#9ca3af' : '#4b5563' }}>{obj.desc}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Botão Gerar Atividades */}
                {dias[diaAtual].sugestoes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <button
                      onClick={() => gerarAtividadesDia(diaAtual)}
                      disabled={dias[diaAtual].bnccSelecionada.length === 0 || loading}
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
                        color: 'white',
                        padding: '20px 40px',
                        borderRadius: 50,
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: loading ? 'wait' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 15,
                        fontSize: 18,
                        boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)',
                        opacity: (dias[diaAtual].bnccSelecionada.length === 0 || loading) ? 0.8 : 1
                      }}
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={24} className="spin" />
                          GERANDO 16 ATIVIDADES...
                        </>
                      ) : (
                        <>
                          <Wand2 size={24} />
                          GERAR 16 SUGESTÕES
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: isDark ? '#d1d5db' : '#4b5563',
                      margin: '25px 0 15px 0',
                      textTransform: 'uppercase'
                    }}>
                      2. Escolha até 2 atividades entre as 16 sugeridas:
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                      {dias[diaAtual].sugestoes.map((ativ) => {
                        const isSel = dias[diaAtual].selecionadas.some(s => s.id === ativ.id);
                        const isEditing = editandoAtiv === ativ.id;

                        return (
                          <div
                            key={ativ.id}
                            style={{
                              border: isSel ? '3px solid #16a34a' : `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                              borderRadius: 12,
                              padding: 20,
                              background: isSel 
                                ? (isDark ? '#064e3b' : '#f0fdf4') 
                                : (isDark ? '#1f2937' : 'white'),
                              cursor: isEditing ? 'default' : 'pointer',
                              position: 'relative',
                              boxShadow: isSel ? '0 4px 12px rgba(22, 163, 74, 0.2)' : 'none',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => !isEditing && selecionarAtividade(diaAtual, ativ)}
                          >
                            {isSel && (
                              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                <CheckCircle2 size={24} color="#16a34a" />
                              </div>
                            )}
                            
                            {isEditing ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <textarea
                                  value={editandoTexto}
                                  onChange={(e) => setEditandoTexto(e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: 200,
                                    padding: 10,
                                    fontSize: 12,
                                    borderRadius: 8,
                                    border: '1px solid #ccc',
                                    background: isDark ? '#374151' : 'white',
                                    color: isDark ? '#f3f4f6' : '#1f2937'
                                  }}
                                />
                                <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
                                  <button
                                    onClick={() => salvarEdicao(diaAtual, ativ.id)}
                                    style={{
                                      padding: '5px 10px',
                                      background: '#15803d',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: 12
                                    }}
                                  >
                                    <Save size={12} /> Salvar
                                  </button>
                                  <button
                                    onClick={cancelarEdicao}
                                    style={{
                                      padding: '5px 10px',
                                      background: '#6b7280',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: 12
                                    }}
                                  >
                                    <X size={12} /> Cancelar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: 16, color: isDark ? '#f3f4f6' : '#1f2937', paddingRight: 30 }}>
                                  {ativ.titulo}
                                </h4>
                                
                                <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                                  <span style={{
                                    background: CAMPOS_EXP[ativ.campo]?.bg || '#e5e7eb',
                                    color: CAMPOS_EXP[ativ.campo]?.cor || '#1f2937',
                                    padding: '2px 8px',
                                    borderRadius: 12,
                                    fontSize: 11,
                                    fontWeight: 'bold'
                                  }}>
                                    {ativ.bnccCode}
                                  </span>
                                  {config.curriculo === 'pr' && ativ.saber && (
                                    <span style={{
                                      background: isDark ? '#065f46' : '#dcfce7',
                                      color: isDark ? '#bbf7d0' : '#166534',
                                      padding: '2px 8px',
                                      borderRadius: 12,
                                      fontSize: 11,
                                      fontWeight: 'bold'
                                    }}>
                                      🧠 {ativ.saber}
                                    </span>
                                  )}
                                </div>
                                
                                <p style={{ fontSize: 12, color: isDark ? '#9ca3af' : '#4b5563', margin: 0, maxHeight: 60, overflow: 'hidden' }}>
                                  {ativ.textoCompleto.substring(0, 120)}...
                                </p>
                                
                                <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowPreview(ativ);
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: isDark ? '#6ee7b7' : '#3b82f6',
                                      fontSize: 11,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 5
                                    }}
                                  >
                                    <Eye size={14} /> Ver completa
                                  </button>
                                  {isSel && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        iniciarEdicao(ativ.id, ativ.textoCompleto);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: isDark ? '#6ee7b7' : '#3b82f6',
                                        fontSize: 11,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5
                                      }}
                                    >
                                      <Pencil size={14} /> Editar
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <button
                        onClick={() => gerarAtividadesDia(diaAtual)}
                        style={{
                          background: isDark ? '#374151' : 'white',
                          color: isDark ? '#f3f4f6' : '#4b5563',
                          padding: '12px 30px',
                          borderRadius: 8,
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 16
                        }}
                      >
                        <RefreshCw size={16} />
                        Gerar novas 16 opções
                      </button>
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <label style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: isDark ? '#9ca3af' : '#4b5563',
                        marginBottom: 5,
                        textTransform: 'uppercase'
                      }}>
                        <MessageSquare size={16} style={{ marginRight: 5 }} />
                        Observações do dia:
                      </label>
                      <textarea
                        value={dias[diaAtual].observacao}
                        onChange={e => {
                          const novos = [...dias];
                          novos[diaAtual].observacao = e.target.value;
                          setDias(novos);
                        }}
                        placeholder="Registre observações importantes..."
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          borderRadius: 8,
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          outline: 'none',
                          fontSize: 14,
                          background: isDark ? '#374151' : 'white',
                          color: isDark ? '#f3f4f6' : '#1f2937',
                          height: 80
                        }}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 40,
              paddingTop: 20,
              borderTop: `2px solid ${isDark ? '#374151' : '#e5e7eb'}`
            }}>
              <button
                onClick={voltarDia}
                disabled={diaAtual === 0 && dias.slice(0, diaAtual).every(d => d.skip)}
                style={{
                  background: isDark ? '#374151' : 'white',
                  color: isDark ? '#f3f4f6' : '#4b5563',
                  padding: '12px 30px',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 16,
                  opacity: (diaAtual === 0 && dias.slice(0, diaAtual).every(d => d.skip)) ? 0.5 : 1
                }}
              >
                <ArrowLeft size={18} />
                {diaAtual > 0 ? 'Dia Anterior' : 'Voltar'}
              </button>
              
              <button
                onClick={avancarDia}
                disabled={!dias[diaAtual].skip && dias[diaAtual].selecionadas.length === 0}
                style={{
                  background: isDark ? '#10b981' : '#15803d',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: 8,
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 16,
                  opacity: (!dias[diaAtual].skip && dias[diaAtual].selecionadas.length === 0) ? 0.5 : 1
                }}
              >
                {diaAtual >= dias.length - 1 ? 'FINALIZAR' : 'Próximo Dia'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: FINALIZAÇÃO - COM UPLOAD DE TEMPLATE (GOLD) */}
        {step === 2 && (
          <div style={{
            background: isDark ? '#1f2937' : 'white',
            padding: 40,
            borderRadius: 16,
            textAlign: 'center',
            boxShadow: isDark ? '0 10px 30px -5px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.1)',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
          }}>
            <div style={{
              background: isDark ? '#065f46' : '#dcfce7',
              width: 80,
              height: 80,
              borderRadius: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={48} color={isDark ? '#6ee7b7' : '#15803d'} />
            </div>
            
            <h2 style={{ fontSize: 28, color: isDark ? '#f3f4f6' : '#1f2937', margin: 0 }}>Planejamento Concluído!</h2>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginTop: 10 }}>
              Seu planejamento sobre <b>{config.tema}</b> está pronto.
            </p>
            {modoSemanaDupla && (
              <p style={{ color: isDark ? '#bbf7d0' : '#166534', fontWeight: 'bold' }}>
                📅 Duas semanas geradas com sucesso!
              </p>
            )}

            {/* BOTÕES DE AÇÃO PADRÃO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginTop: 30 }}>
              
              <button 
                onClick={salvarProjeto} 
                disabled={saving}
                style={{
                  background: '#7c3aed',
                  color: 'white',
                  padding: '20px 15px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: saving ? 'wait' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: 'bold',
                  fontSize: 14,
                  opacity: saving ? 0.7 : 1,
                  transition: 'transform 0.2s'
                }}
              >
                <Cloud size={32} />
                {saving ? 'SALVANDO...' : 'SALVAR NA NUVEM'}
              </button>

              <button 
                onClick={gerarWordPadrao}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '20px 15px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: 'bold',
                  fontSize: 14,
                  transition: 'transform 0.2s'
                }}
              >
                <FileEdit size={32} />
                WORD PADRÃO
              </button>

              <button 
                onClick={gerarPDF}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  padding: '20px 15px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: 'bold',
                  fontSize: 14,
                  transition: 'transform 0.2s'
                }}
              >
                <FileText size={32} />
                BAIXAR PDF
              </button>
            </div>

            {/* 👑 ÁREA GOLD: UPLOAD DE TEMPLATE PERSONALIZADO */}
            <div style={{
              marginTop: 40,
              paddingTop: 30,
              borderTop: `2px solid ${isDark ? '#fed7aa' : '#e5e7eb'}`,
              background: isDark ? '#1e293b' : '#fff7ed',
              padding: 30,
              borderRadius: 16,
              border: `2px solid ${isDark ? '#f59e0b' : '#fed7aa'}`
            }}>
              <h3 style={{
                color: isDark ? '#fbbf24' : '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                margin: '0 0 10px 0',
                fontSize: 20
              }}>
                <Award size={24} style={{ color: isDark ? '#fbbf24' : '#b45309' }} />
                Funcionalidade Ouro: Template da Escola
              </h3>
              <p style={{
                fontSize: 14,
                color: isDark ? '#fcd34d' : '#92400e',
                marginBottom: 20
              }}>
                Sua coordenadora exige um modelo específico? Suba o arquivo .docx aqui e ele será preenchido automaticamente!
              </p>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: 50,
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
                width: 'fit-content',
                margin: '0 auto'
              }}>
                <Upload size={20} />
                SELECIONAR ARQUIVO MODELO (.DOCX)
                <input
                  type="file"
                  accept=".docx"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      gerarWordCustomizado(e.target.files[0]);
                    }
                  }}
                />
              </label>
              <div style={{
                marginTop: 20,
                fontSize: 12,
                color: isDark ? '#fcd34d' : '#92400e',
                background: isDark ? '#374151' : '#fff3e0',
                padding: 15,
                borderRadius: 8,
                textAlign: 'left'
              }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>📝 Tags disponíveis para seu modelo Word:</p>
                <code style={{ fontSize: 11, display: 'block', whiteSpace: 'pre-wrap' }}>
                  {'{escola}'} - Nome da instituição<br/>
                  {'{professor}'} - Nome da professora<br/>
                  {'{turma}'} - Turma<br/>
                  {'{periodo}'} - Período<br/>
                  {'{tema}'} - Tema do projeto<br/>
                  {'{curriculo}'} - BNCC ou Paraná<br/>
                  {'{#dias}'} - Loop pelos dias<br/>
                  {'{nome_dia}'} - Nome do dia<br/>
                  {'{data}'} - Data<br/>
                  {'{#atividades}'} - Loop atividades<br/>
                  {'{titulo}'} - Título da atividade<br/>
                  {'{codigo}'} - Código BNCC<br/>
                  {'{objetivo}'} - Objetivo<br/>
                  {'{desenvolvimento}'} - Desenvolvimento<br/>
                  {'{materiais}'} - Materiais<br/>
                  {'{adaptacao}'} - Adaptação<br/>
                  {'{observacao}'} - Observações do dia
                </code>
              </div>
            </div>

            <button
              onClick={novoProjeto}
              style={{
                background: isDark ? '#374151' : 'white',
                color: isDark ? '#f3f4f6' : '#4b5563',
                padding: '12px 30px',
                borderRadius: 8,
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                fontWeight: 'bold',
                cursor: 'pointer',
                margin: '30px auto 0',
                display: 'block'
              }}
            >
              Novo Planejamento
            </button>
          </div>
        )}
      </main>

      {/* Modal de Preview */}
      {showPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: isDark ? '#1f2937' : 'white',
            borderRadius: 16,
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            padding: 30,
            color: isDark ? '#f3f4f6' : '#1f2937'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>{showPreview.titulo}</h2>
              <button
                onClick={() => setShowPreview(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  padding: '0 10px',
                  color: isDark ? '#f3f4f6' : '#1f2937'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6 }}>
              {showPreview.textoCompleto}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}