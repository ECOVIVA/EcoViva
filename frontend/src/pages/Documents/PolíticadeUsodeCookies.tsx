import React from 'react';
import { Cookie, Shield, Lock, Globe, Bell, Settings, AlertCircle } from 'lucide-react';
import TermsSection from './TermsSection';

const CookiePolicy: React.FC = () => {
  const lastUpdated = new Date('2025-04-25').toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-10 mb-10 border border-green-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">Política de Uso de Cookies</h1>
            <p className="text-green-600">Última atualização: {lastUpdated}</p>
          </div>

          <div className="prose prose-green max-w-none">
            <p className="text-gray-700 mb-6">
              A ECOviva utiliza cookies e tecnologias similares para melhorar a experiência do usuário em nosso site e plataforma, 
              além de permitir a autenticação segura através de JSON Web Tokens (JWT). Ao acessar ou utilizar a plataforma, 
              você concorda com o uso de cookies conforme descrito nesta política.
            </p>

            <TermsSection 
              number="1"
              title="O que são Cookies?"
              icon={<Cookie className="text-green-600" />}
            >
              <p>
                Cookies são pequenos arquivos de texto armazenados no dispositivo do usuário (como computador ou smartphone) 
                quando você visita um site. Eles permitem que o site reconheça o seu dispositivo e forneça funcionalidades 
                adicionais, como manter você autenticado, salvar preferências e personalizar sua experiência.
              </p>
            </TermsSection>

            <TermsSection
              number="2"
              title="Como Usamos os Cookies?"
              icon={<Settings className="text-green-600" />}
            >
              <h3 className="text-lg font-semibold mb-3">2.1. Autenticação e Autorização com JWT</h3>
              <p>
                A ECOviva usa cookies para armazenar JSON Web Tokens (JWT), que são gerados após o login do usuário. 
                O JWT é um token de autenticação que permite que você permaneça autenticado enquanto navega na plataforma, 
                sem a necessidade de fazer login repetidamente.
              </p>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-semibold">Armazenamento de JWT:</h4>
                  <p>
                    Quando você realiza o login na plataforma, um JWT é gerado e armazenado como um cookie no seu navegador. 
                    Este token contém informações sobre a sua sessão de usuário e é utilizado para validar a sua identidade 
                    durante a navegação na plataforma.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Segurança:</h4>
                  <p>
                    O JWT é armazenado de forma segura no cookie e é utilizado exclusivamente para autenticação e autorização. 
                    O token possui um tempo de expiração configurado e será automaticamente invalidado após esse período.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Propriedades do Cookie:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>HttpOnly:</strong> O cookie é acessível apenas por HTTP, o que significa que não pode ser acessado ou manipulado por scripts executados no navegador, ajudando a prevenir ataques de Cross-Site Scripting (XSS).</li>
                    <li><strong>Secure:</strong> O cookie será enviado apenas em conexões seguras (HTTPS).</li>
                    <li><strong>SameSite:</strong> O cookie é configurado com o atributo SameSite, que ajuda a evitar ataques de Cross-Site Request Forgery (CSRF) ao restringir o envio do cookie para o mesmo site.</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">2.2. Melhoria da Experiência do Usuário</h3>
              <p>Cookies adicionais podem ser usados para personalizar a sua experiência, como:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Armazenamento de preferências de idioma:</strong> Se você selecionar um idioma preferido, um cookie pode ser utilizado para lembrar essa escolha em futuras visitas.</li>
                <li><strong>Persistência de configurações:</strong> Configurações de visualização ou preferências de layout podem ser salvas para facilitar o uso contínuo da plataforma.</li>
              </ul>
            </TermsSection>

            <TermsSection
              number="3"
              title="Tipos de Cookies que Utilizamos"
              icon={<Cookie className="text-green-600" />}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Cookies Essenciais</h3>
                  <p>
                    Estes cookies são necessários para que você possa navegar na plataforma e usar suas funcionalidades. 
                    Sem esses cookies, a autenticação via JWT não funcionaria corretamente.
                  </p>
                  <p className="mt-2"><em>Exemplo: Cookies para autenticação e manutenção da sessão do usuário.</em></p>
                </div>

                <div>
                  <h3 className="font-semibold">Cookies de Performance e Funcionalidade</h3>
                  <p>
                    Estes cookies ajudam a melhorar a performance da plataforma, permitindo que você tenha uma navegação 
                    mais rápida e fluida.
                  </p>
                  <p className="mt-2"><em>Exemplo: Cookies que coletam informações anônimas sobre como você utiliza a plataforma, como páginas visitadas e tempo de navegação.</em></p>
                </div>

                <div>
                  <h3 className="font-semibold">Cookies de Publicidade e Análise</h3>
                  <p>
                    Podemos usar cookies para coletar dados sobre a interação do usuário com anúncios ou conteúdo publicitário. 
                    Esses dados ajudam a personalizar a exibição de anúncios e medir a eficácia das campanhas publicitárias.
                  </p>
                  <p className="mt-2"><em>Exemplo: Cookies que analisam sua interação com os anúncios para fornecer uma experiência mais personalizada.</em></p>
                </div>
              </div>
            </TermsSection>

            <TermsSection
              number="4"
              title="Como Gerenciamos os Cookies?"
              icon={<Settings className="text-green-600" />}
            >
              <p>
                Você pode controlar o uso de cookies nas configurações do seu navegador. A maioria dos navegadores permite 
                que você configure ou desative cookies através das suas configurações de privacidade. No entanto, se você 
                optar por desativar cookies, algumas funcionalidades da plataforma podem não funcionar corretamente, 
                incluindo o processo de autenticação com JWT.
              </p>

              <h3 className="font-semibold mt-4 mb-2">Alterando as Preferências de Cookies</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Desativar cookies no navegador:</strong> Você pode configurar seu navegador para bloquear cookies 
                  ou para alertá-lo sempre que um cookie for enviado. Cada navegador tem configurações diferentes, então 
                  consulte a seção de ajuda do seu navegador para saber como gerenciar os cookies.
                </li>
                <li>
                  <strong>Excluir cookies:</strong> Você também pode excluir cookies existentes diretamente nas configurações 
                  do seu navegador.
                </li>
              </ul>
            </TermsSection>

            <TermsSection
              number="5"
              title="Segurança e Proteção de Dados"
              icon={<Shield className="text-green-600" />}
            >
              <p>
                A segurança dos seus dados pessoais é nossa prioridade. Os cookies de autenticação (como os que contêm JWT) 
                são criptografados e protegidos por medidas técnicas para impedir acessos não autorizados.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold">Criptografia do JWT</h3>
                  <p>
                    O JWT utilizado na plataforma é criptografado e assinado, garantindo que os dados da sua sessão sejam 
                    protegidos e não possam ser manipulados durante a transmissão entre o cliente (seu navegador) e o servidor.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Proteção contra ataques de CSRF e XSS</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Cross-Site Request Forgery (CSRF):</strong> Usamos cookies com a configuração SameSite para 
                      evitar que o cookie JWT seja enviado em solicitações cruzadas de outros sites.
                    </li>
                    <li>
                      <strong>Cross-Site Scripting (XSS):</strong> O cookie JWT é configurado com a opção HttpOnly, 
                      garantindo que ele não seja acessado ou manipulado por scripts executados no navegador.
                    </li>
                  </ul>
                </div>
              </div>
            </TermsSection>

            <TermsSection
              number="6"
              title="Transferência Internacional de Dados"
              icon={<Globe className="text-green-600" />}
            >
              <p>
                Os dados coletados através de cookies e JWT podem ser transferidos e armazenados em servidores localizados 
                fora do seu país de residência. Garantimos que todas as transferências de dados sejam feitas de acordo com 
                as leis de proteção de dados aplicáveis, incluindo a Lei Geral de Proteção de Dados Pessoais (LGPD) no 
                Brasil e o Regulamento Geral sobre a Proteção de Dados (GDPR) na União Europeia.
              </p>
            </TermsSection>

            <TermsSection
              number="7"
              title="Consentimento e Alterações nesta Política"
              icon={<Bell className="text-green-600" />}
            >
              <p>
                Ao utilizar a ECOviva, você consente com o uso de cookies conforme descrito nesta Política de Uso de Cookies. 
                Caso haja alterações nesta política, elas serão publicadas aqui, com a data de atualização indicada no topo 
                desta página. Recomendamos que você revise regularmente esta política para se manter informado sobre como 
                utilizamos cookies.
              </p>
            </TermsSection>

            <TermsSection
              number="8"
              title="Contato"
              icon={<AlertCircle className="text-green-600" />}
            >
              <p>
                Se você tiver dúvidas sobre nossa Política de Uso de Cookies ou sobre como utilizamos os seus dados, 
                entre em contato conosco por meio dos seguintes canais:
              </p>
              <p className="mt-2">
                <strong>E-mail:</strong> ecoviva200@gmail.com
              </p>
            </TermsSection>
          </div>
        </div>
      </main>

      
      {/* Decorative Elements */}
      <div className="hidden lg:block absolute bottom-0 left-0 w-40 h-40 -z-10">
        <Cookie className="text-green-200 w-full h-full" />
      </div>
      <div className="hidden lg:block absolute top-32 right-0 w-24 h-24 -z-10">
        <Lock className="text-green-200 w-full h-full rotate-45" />
      </div>
      <div className="absolute bottom-40 right-10 w-16 h-16 opacity-20 -z-10">
        <Shield className="text-green-600 w-full h-full animate-spin-slow" />
      </div>
    </div>
  );
};

export default CookiePolicy;