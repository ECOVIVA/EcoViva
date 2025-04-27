import React from 'react';
import { Leaf, Shield, Recycle, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import TermsSection from './TermsSection';

const TermsOfUse: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen relative overflow-hidden">     
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-10 mb-10 border border-green-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">Termos de Uso</h1>
            <p className="text-green-600">Última atualização: {lastUpdated}</p>
          </div>

          <div className="prose prose-green max-w-none">
            <p className="text-gray-700 mb-6">
              Bem-vindo à ECOviva! Estes Termos de Uso ("Termos") estabelecem as regras e condições para o uso da plataforma, 
              acessada através de nosso site ou aplicativo. Ao acessar ou usar a ECOviva, você concorda com todos os termos 
              aqui descritos. Caso não concorde com qualquer um destes termos, não use os nossos serviços.
            </p>

            <TermsSection 
              number="1" 
              title="Aceitação dos Termos" 
              icon={<CheckCircle2 className="text-green-600" />}
            >
              <p>
                Ao acessar ou utilizar os serviços da ECOviva, você reconhece que leu, entendeu e concorda em cumprir com 
                todos os Termos de Uso e nossa Política de Privacidade. Se você não concorda com qualquer parte desses 
                termos, não utilize nossos serviços. A ECOviva pode modificar, a qualquer momento e sem aviso prévio, 
                estes Termos de Uso. Quaisquer alterações serão publicadas aqui, e a data de atualização será indicada 
                no topo desta página.
              </p>
            </TermsSection>

            <TermsSection 
              number="2" 
              title="Descrição da Plataforma e Funcionalidades" 
              icon={<Recycle className="text-green-600" />}
            >
              <p>
                A ECOviva é uma plataforma voltada para incentivar a reciclagem através de um sistema gamificado, 
                no qual os usuários podem registrar suas atividades de reciclagem, acumular pontos, visualizar seu 
                desempenho em rankings e receber recompensas. A plataforma oferece funcionalidades como:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Registro diário de atividades de reciclagem.</li>
                <li>Acúmulo de pontos com base em atividades ecológicas.</li>
                <li>Visualização de progresso e participação em desafios de reciclagem.</li>
              </ul>
            </TermsSection>

            <TermsSection 
              number="3" 
              title="Cadastro de Usuário e Conta Pessoal" 
              icon={<FileText className="text-green-600" />}
            >
              <p>
                Para utilizar a ECOviva, é necessário criar uma conta. Você deverá fornecer informações precisas e 
                verdadeiras no momento do cadastro. A responsabilidade pelo uso da sua conta é inteiramente sua. 
                Ao criar uma conta, você se compromete a:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Manter as informações da sua conta sempre atualizadas e precisas.</li>
                <li>Proteger sua senha e credenciais de login e não compartilhá-las com terceiros.</li>
                <li>Notificar imediatamente a ECOviva caso identifique qualquer atividade não autorizada em sua conta.</li>
              </ul>
            </TermsSection>

            <TermsSection 
              number="4" 
              title="Responsabilidades do Usuário" 
              icon={<Shield className="text-green-600" />}
            >
              <p>Você concorda em:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Utilizar a plataforma de forma ética, respeitando as leis e normas aplicáveis.</li>
                <li>Não realizar atividades que possam prejudicar, danificar ou comprometer a funcionalidade da plataforma.</li>
                <li>Não usar a plataforma para fins ilegais ou não autorizados, incluindo, mas não se limitando a, assédio, violação de propriedade intelectual ou difamação.</li>
                <li>Garantir que as informações fornecidas para o cadastro sejam precisas, completas e atualizadas.</li>
              </ul>
            </TermsSection>

            <TermsSection 
              number="5" 
              title="Propriedade Intelectual" 
              icon={<FileText className="text-green-600" />}
            >
              <p>
                Todos os direitos de propriedade intelectual relacionados à ECOviva, incluindo, mas não se limitando a, 
                logos, gráficos, textos, vídeos, design da plataforma, software, e todos os outros conteúdos, são de 
                propriedade exclusiva da ECOviva ou licenciados para nós. Você não está autorizado a copiar, distribuir, 
                modificar ou criar obras derivadas desses materiais sem a nossa permissão expressa por escrito.
              </p>
            </TermsSection>

            <TermsSection 
              number="6" 
              title="Privacidade e Proteção de Dados Pessoais" 
              icon={<Shield className="text-green-600" />}
            >
              <p>
                A ECOviva leva a sua privacidade muito a sério. Ao utilizar nossos serviços, você consente com a coleta, 
                uso e armazenamento de seus dados pessoais, conforme descrito em nossa Política de Privacidade. Garantimos 
                que seus dados pessoais serão tratados de forma segura e de acordo com as leis de proteção de dados aplicáveis, 
                como a Lei Geral de Proteção de Dados Pessoais (LGPD) no Brasil.
              </p>
              <p className="mt-3">
                <strong>Medidas de segurança:</strong> A plataforma adota medidas técnicas e administrativas para proteger 
                os dados dos usuários contra acessos não autorizados, alterações, divulgação ou destruição. No entanto, 
                nenhum sistema de segurança é completamente seguro, e não podemos garantir que nossos sistemas estarão 
                livres de falhas.
              </p>
            </TermsSection>

            <TermsSection 
              number="7" 
              title="Modificações da Plataforma" 
              icon={<AlertCircle className="text-green-600" />}
            >
              <p>
                A ECOviva se reserva o direito de modificar, suspender ou descontinuar qualquer parte da plataforma a 
                qualquer momento, por qualquer motivo, sem aviso prévio. Nós nos empenharemos para garantir que essas 
                mudanças causem o mínimo de impacto possível na experiência do usuário.
              </p>
            </TermsSection>

            <TermsSection 
              number="8" 
              title="Limitação de Responsabilidade" 
              icon={<AlertCircle className="text-green-600" />}
            >
              <p>
                A ECOviva não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou 
                consequenciais decorrentes do uso ou incapacidade de uso da plataforma, incluindo, mas não se limitando a, 
                perdas de dados, lucros cessantes ou qualquer outro dano.
              </p>
              <p className="mt-3">Além disso, a ECOviva não será responsável por:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Interrupções temporárias no serviço, devido a manutenção ou falhas técnicas.</li>
                <li>Danos causados por falhas nos sistemas de segurança ou ataques cibernéticos que possam comprometer o funcionamento da plataforma.</li>
              </ul>
            </TermsSection>

            <TermsSection 
              number="9" 
              title="Termos de Uso para Crianças e Menores de Idade" 
              icon={<Shield className="text-green-600" />}
            >
              <p>
                A ECOviva não coleta intencionalmente informações de crianças menores de 13 anos. Caso seja menor de 18 anos, 
                você pode usar a plataforma somente com a supervisão de um responsável legal. A conta e o uso da plataforma 
                por menores de 18 anos devem ser monitorados por um responsável legal.
              </p>
            </TermsSection>

            <TermsSection 
              number="10" 
              title="Política de Suspensão e Rescisão" 
              icon={<AlertCircle className="text-green-600" />}
            >
              <p>
                A ECOviva se reserva o direito de suspender ou cancelar sua conta se você violar qualquer um destes 
                Termos de Uso. Além disso, a plataforma pode descontinuar ou limitar sua conta em casos de uso indevido 
                ou violação dos direitos de propriedade intelectual.
              </p>
              <p className="mt-3">
                Você pode, a qualquer momento, descontinuar o uso da plataforma. No entanto, quaisquer dados ou pontos 
                acumulados até o momento da rescisão poderão ser perdidos.
              </p>
            </TermsSection>

            <TermsSection 
              number="11" 
              title="Modificações nos Termos de Uso" 
              icon={<FileText className="text-green-600" />}
            >
              <p>
                A ECOviva pode revisar e atualizar estes Termos de Uso periodicamente. Qualquer alteração será publicada 
                nesta página e a data de atualização será indicada no topo do documento. A continuidade do uso da plataforma 
                após a publicação de modificações nos Termos de Uso será considerada como aceitação das alterações feitas.
              </p>
            </TermsSection>

            <TermsSection 
              number="12" 
              title="Jurisdição e Legislação Aplicável" 
              icon={<FileText className="text-green-600" />}
            >
              <p>
                Estes Termos de Uso são regidos pelas leis do Brasil. Qualquer disputa relacionada aos Termos será resolvida 
                exclusivamente no foro da cidade de São Paulo, SP. Ao utilizar a plataforma, você concorda com esta jurisdição.
              </p>
            </TermsSection>
          </div>
        </div>
      </main>


      
      {/* Decorative Elements */}
      <div className="hidden lg:block absolute bottom-0 left-0 w-40 h-40 -z-10">
        <Leaf className="text-green-200 w-full h-full" />
      </div>
      <div className="hidden lg:block absolute top-32 right-0 w-24 h-24 -z-10">
        <Leaf className="text-green-200 w-full h-full rotate-45" />
      </div>
      <div className="absolute bottom-40 right-10 w-16 h-16 opacity-20 -z-10">
        <Recycle className="text-green-600 w-full h-full animate-spin-slow" />
      </div>
    </div>
  );
};

export default TermsOfUse;