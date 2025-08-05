import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  type: 'host' | 'user';
  content: string;
  isTyping?: boolean;
  showInput?: boolean;
  inputType?: 'text' | 'email' | 'date' | 'buttons';
  buttons?: string[];
}

interface UserData {
  name: string;
  cpf: string;
  subject: string;
  // Reembolso fields
  refundReason?: string;
  triedToResolve?: string;
  purchaseEmail?: string;
  purchaseDate?: string;
  // Erro fields
  deviceModel?: string;
  appInstalled?: string;
  appOpened?: string;
  errorMessage?: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: '', cpf: '', subject: '' });
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState('start');
  
  // Use ref to prevent multiple initializations
  const initialized = useRef(false);
  const messageIdCounter = useRef(0);

  const getNextMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}`;
  };

  const addMessage = (content: string, type: 'host' | 'user' = 'host', options?: { showInput?: boolean; inputType?: 'text' | 'email' | 'date' | 'buttons'; buttons?: string[] }) => {
    const newMessage: Message = {
      id: getNextMessageId(),
      type,
      content,
      ...options
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const showTypingAndAddMessage = (content: string, delay: number = 2000, options?: { showInput?: boolean; inputType?: 'text' | 'email' | 'date' | 'buttons'; buttons?: string[] }) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage(content, 'host', options);
      setIsTyping(false);
      
      if (options?.showInput) {
        setWaitingForInput(true);
      }
    }, delay);
  };

  // Initialize conversation
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      startConversation();
    }
  }, []);

  const startConversation = () => {
    // Message 1
    setTimeout(() => {
      showTypingAndAddMessage(
        'Olá, Eu sou a Ana, seja bem-vindo(a) à nossa central Oficial de atendimento.',
        2000
      );
    }, 1500);

    // Message 2
    setTimeout(() => {
      showTypingAndAddMessage(
        'Por aqui você consegue Tirar Dúvidas, Realizar Reembolsos, entre outros.',
        2000
      );
    }, 5500);

    // Message 3
    setTimeout(() => {
      showTypingAndAddMessage(
        '📰 Notícia: Estamos com nosso aplicativo Espião em manutenção, por isso nosso suporte está com alta demanda. Pode levar mais tempo para respostas e reembolsos.',
        2000
      );
    }, 9500);

    // Message 4
    setTimeout(() => {
      showTypingAndAddMessage(
        'Agradecemos sua paciência.',
        2000
      );
    }, 13500);

    // Message 5 - Ask for name
    setTimeout(() => {
      showTypingAndAddMessage(
        '➡️ Para iniciarmos, qual seu nome?',
        2000,
        { showInput: true, inputType: 'text' }
      );
      setCurrentStep('askingName');
    }, 17500);
  };

  // Reembolso flow
  const startRefundFlow = () => {
    showTypingAndAddMessage('Puxa vida 😔', 1500);
    setTimeout(() => {
      showTypingAndAddMessage(
        'Pode me contar um pouco sobre o motivo do reembolso?', 
        2000, 
        { showInput: true, inputType: 'text' }
      );
      setCurrentStep('refund-reason');
    }, 3500);
  };

  // Erro flow
  const startErrorFlow = () => {
    showTypingAndAddMessage('Entendi 😕 Vamos te ajudar com isso.', 1500);
    setTimeout(() => {
      showTypingAndAddMessage(
        'Qual é o modelo do aparelho que você tentou espionar?', 
        2000, 
        { showInput: true, inputType: 'text' }
      );
      setCurrentStep('error-device');
    }, 3500);
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, 'user');
    const userInput = inputValue;
    setInputValue('');
    setWaitingForInput(false);

    switch (currentStep) {
      case 'askingName':
        setUserData(prev => ({ ...prev, name: userInput }));
        setCurrentStep('askingCPF');
        setTimeout(() => {
          showTypingAndAddMessage(
            '➡️ Qual seu CPF?',
            2000,
            { showInput: true, inputType: 'text' }
          );
        }, 1000);
        break;

      case 'askingCPF':
        setUserData(prev => ({ ...prev, cpf: userInput }));
        setCurrentStep('askingSubject');
        setTimeout(() => {
          showTypingAndAddMessage(
            '➡️ Qual assunto quer tratar?',
            2000,
            { showInput: true, inputType: 'buttons', buttons: ['Solicitar Reembolso', 'Erro ao Espionar'] }
          );
        }, 1000);
        break;

      // Refund flow
      case 'refund-reason':
        setUserData(prev => ({ ...prev, refundReason: userInput }));
        setCurrentStep('refund-tried-resolve');
        setTimeout(() => {
          showTypingAndAddMessage(
            'Entendi. 😕 Você já tentou resolver o problema antes de solicitar o reembolso?',
            1800,
            { showInput: true, inputType: 'buttons', buttons: ['Sim', 'Não'] }
          );
        }, 1000);
        break;

      case 'refund-email':
        setUserData(prev => ({ ...prev, purchaseEmail: userInput }));
        setCurrentStep('refund-date');
        setTimeout(() => {
          showTypingAndAddMessage(
            'E qual a data da compra?',
            1500,
            { showInput: true, inputType: 'date' }
          );
        }, 1000);
        break;

      case 'refund-date':
        setUserData(prev => ({ ...prev, purchaseDate: userInput }));
        setCurrentStep('refund-complete');
        setTimeout(() => {
          showTypingAndAddMessage('Agradeço pelas informações. 🙏', 2000);
        }, 1000);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Nosso aplicativo e nosso suporte estão passando por instabilidades temporárias, pois estamos realizando uma grande atualização.',
            2500
          );
        }, 3000);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Por isso, os reembolsos estão sendo processados com mais lentidão.',
            2000
          );
        }, 5500);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Mas fique tranquilo(a), garantimos que o valor será devolvido no prazo de **5 a 10 dias úteis**.',
            1800
          );
        }, 7500);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Se tiver qualquer outra dúvida, estamos aqui para ajudar 💬',
            2000
          );
        }, 9300);
        break;

      // Error flow
      case 'error-device':
        setUserData(prev => ({ ...prev, deviceModel: userInput }));
        setCurrentStep('error-installed');
        setTimeout(() => {
          showTypingAndAddMessage(
            'Você conseguiu instalar o aplicativo corretamente?',
            2000,
            { showInput: true, inputType: 'buttons', buttons: ['Sim', 'Não'] }
          );
        }, 1000);
        break;

      case 'error-message':
        setUserData(prev => ({ ...prev, errorMessage: userInput }));
        setCurrentStep('error-complete');
        setTimeout(() => {
          showTypingAndAddMessage('Muito bem, obrigado por compartilhar. 🛠️', 2000);
        }, 1000);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Estamos cientes de que alguns usuários estão enfrentando instabilidades.',
            2000
          );
        }, 3000);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Nosso aplicativo está passando por uma **grande atualização**, e isso pode afetar o funcionamento temporariamente.',
            2500
          );
        }, 5000);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Mas fique tranquilo(a), tudo será normalizado entre **5 a 10 dias**.',
            2000
          );
        }, 7500);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Como forma de compensação, você receberá:\n\n- 🎁 Bônus de Espionagem\n- 🖼️ Acesso à galeria do celular espionado',
            1800
          );
        }, 9500);
        setTimeout(() => {
          showTypingAndAddMessage(
            'Finalizamos por aqui! Obrigado pela paciência e confiança 💙',
            2000
          );
        }, 11300);
        break;
    }
  };

  const handleButtonClick = (buttonText: string) => {
    // Add user selection
    addMessage(buttonText, 'user');
    setWaitingForInput(false);

    switch (currentStep) {
      case 'askingSubject':
        setUserData(prev => ({ ...prev, subject: buttonText }));
        if (buttonText === 'Solicitar Reembolso') {
          startRefundFlow();
        } else if (buttonText === 'Erro ao Espionar') {
          startErrorFlow();
        }
        break;

      case 'refund-tried-resolve':
        setUserData(prev => ({ ...prev, triedToResolve: buttonText }));
        setCurrentStep('refund-email');
        setTimeout(() => {
          showTypingAndAddMessage(
            'Certo! Para continuarmos, qual foi o e-mail usado na compra?',
            2000,
            { showInput: true, inputType: 'email' }
          );
        }, 1000);
        break;

      case 'error-installed':
        setUserData(prev => ({ ...prev, appInstalled: buttonText }));
        setCurrentStep('error-opened');
        setTimeout(() => {
          showTypingAndAddMessage(
            'O app chegou a abrir normalmente depois da instalação?',
            1800,
            { showInput: true, inputType: 'buttons', buttons: ['Sim', 'Deu erro'] }
          );
        }, 1000);
        break;

      case 'error-opened':
        setUserData(prev => ({ ...prev, appOpened: buttonText }));
        setCurrentStep('error-message');
        setTimeout(() => {
          showTypingAndAddMessage(
            'Se apareceu alguma mensagem de erro, qual foi?',
            2000,
            { showInput: true, inputType: 'text' }
          );
        }, 1000);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-chat-background flex flex-col">
      {/* Header */}
      <div className="bg-chat-host p-4 shadow-sm border-b">
        <div className="flex items-center space-x-3 max-w-md mx-auto">
          <div className="w-10 h-10 bg-chat-avatar rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div>
            <h1 className="font-semibold text-chat-host-foreground">Bem-vindo ao Suporte</h1>
            <p className="text-sm text-muted-foreground">Ana - Atendente Virtual</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  message.type === 'user'
                    ? 'bg-chat-user text-chat-user-foreground rounded-br-md'
                    : 'bg-chat-host text-chat-host-foreground rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {/* Show input when needed */}
                {message.showInput && (message.inputType === 'text' || message.inputType === 'email' || message.inputType === 'date') && waitingForInput && (
                  <div className="mt-3 space-y-2">
                    <Input
                      type={message.inputType === 'email' ? 'email' : message.inputType === 'date' ? 'date' : 'text'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                      placeholder={
                        message.inputType === 'email' ? 'Digite seu e-mail...' 
                        : message.inputType === 'date' ? 'DD/MM/AAAA'
                        : 'Digite sua resposta...'
                      }
                      className="text-sm"
                    />
                    <Button
                      onClick={handleInputSubmit}
                      size="sm"
                      className="w-full bg-chat-user hover:bg-chat-user/90 text-chat-user-foreground"
                    >
                      Enviar
                    </Button>
                  </div>
                )}

                {/* Show buttons when needed */}
                {message.showInput && message.inputType === 'buttons' && message.buttons && waitingForInput && (
                  <div className="mt-3 space-y-2">
                    {message.buttons.map((button, index) => (
                      <Button
                        key={`${message.id}-btn-${index}`}
                        onClick={() => handleButtonClick(button)}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start bg-background hover:bg-muted"
                      >
                        {button}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-chat-host text-chat-host-foreground p-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 Suporte Oficial | Política de Privacidade
        </p>
      </div>
    </div>
  );
};

export default ChatBot;