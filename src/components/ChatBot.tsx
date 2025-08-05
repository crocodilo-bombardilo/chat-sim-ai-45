import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  type: 'host' | 'user';
  content: string;
  isTyping?: boolean;
  showInput?: boolean;
  inputType?: 'text' | 'buttons';
  buttons?: string[];
}

interface UserData {
  name: string;
  cpf: string;
  subject: string;
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

  const addMessage = (content: string, type: 'host' | 'user' = 'host', options?: { showInput?: boolean; inputType?: 'text' | 'buttons'; buttons?: string[] }) => {
    const newMessage: Message = {
      id: getNextMessageId(),
      type,
      content,
      ...options
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const showTypingAndAddMessage = (content: string, delay: number = 2000, options?: { showInput?: boolean; inputType?: 'text' | 'buttons'; buttons?: string[] }) => {
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

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, 'user');
    const userInput = inputValue;
    setInputValue('');
    setWaitingForInput(false);

    if (currentStep === 'askingName') {
      setUserData(prev => ({ ...prev, name: userInput }));
      setCurrentStep('askingCPF');
      
      setTimeout(() => {
        showTypingAndAddMessage(
          '➡️ Qual seu CPF?',
          2000,
          { showInput: true, inputType: 'text' }
        );
      }, 1000);

    } else if (currentStep === 'askingCPF') {
      setUserData(prev => ({ ...prev, cpf: userInput }));
      setCurrentStep('askingSubject');
      
      setTimeout(() => {
        showTypingAndAddMessage(
          '➡️ Qual assunto quer tratar?',
          2000,
          { showInput: true, inputType: 'buttons', buttons: ['Solicitar Reembolso', 'Erro ao Espionar'] }
        );
      }, 1000);
    }
  };

  const handleButtonClick = (buttonText: string) => {
    // Add user selection
    addMessage(buttonText, 'user');
    setUserData(prev => ({ ...prev, subject: buttonText }));
    setWaitingForInput(false);
    setCurrentStep('completed');

    setTimeout(() => {
      showTypingAndAddMessage(
        `Perfeito, ${userData.name}! Seu atendimento para "${buttonText}" foi registrado. Nossa equipe entrará em contato em breve. Obrigada por aguardar!`,
        2000
      );
    }, 1000);
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
                {message.showInput && message.inputType === 'text' && waitingForInput && (
                  <div className="mt-3 space-y-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                      placeholder="Digite sua resposta..."
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