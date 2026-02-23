import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle } from 'lucide-react';
import ChatHeader from './chat-header';
import ChatInput from './chat-input';
import ChatMessageComponent from './chat-message';
import UserInfoForm, { UserInfo } from './user-info-form';
import { ChatMessage, CreateConversationResponse, GetAnswerResponse } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

const STORAGE_KEYS = {
    CONVERSATION_ID: 'chatbot_conversation_id',
    MESSAGES: 'chatbot_messages',
    USER_INFO: 'chatbot_user_info',
};

const POLLING_INTERVALS = {
    INITIAL: 500, // First 2 seconds: 500ms
    MIDDLE: 1000, // Next 10 seconds: 1s
    FINAL: 2000, // After: 2s
};

const POLLING_TIMEOUT = 30000; // 30 seconds max

export default function ChatbotSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showUserInfoForm, setShowUserInfoForm] = useState(false);
    const [isFirstMessage, setIsFirstMessage] = useState(true);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const isSubmittingUserInfoRef = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pollingStartTimeRef = useRef<number | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    // Load conversation from session storage on mount
    useEffect(() => {
        const savedConversationId = sessionStorage.getItem(STORAGE_KEYS.CONVERSATION_ID);
        const savedMessages = sessionStorage.getItem(STORAGE_KEYS.MESSAGES);
        const savedUserInfo = sessionStorage.getItem(STORAGE_KEYS.USER_INFO);

        if (savedConversationId) {
            setConversationId(savedConversationId);
        }

        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                setMessages(
                    parsed.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                    }))
                );
                setIsFirstMessage(false);
            } catch (e) {
                console.error('Failed to parse saved messages', e);
            }
        }

        if (savedUserInfo) {
            try {
                setUserInfo(JSON.parse(savedUserInfo));
            } catch (e) {
                console.error('Failed to parse saved user info', e);
            }
        }
    }, []);

    // Save to session storage when conversation or messages change
    useEffect(() => {
        if (conversationId) {
            sessionStorage.setItem(STORAGE_KEYS.CONVERSATION_ID, conversationId);
        }
    }, [conversationId]);

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem(
                STORAGE_KEYS.MESSAGES,
                JSON.stringify(messages)
            );
        }
    }, [messages]);

    useEffect(() => {
        if (userInfo) {
            sessionStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
        }
    }, [userInfo]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
            }
        };
    }, []);

    const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessage: ChatMessage = {
            ...message,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
    };

    const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
        );
    };

    const pollForAnswer = async (
        convId: string,
        reqId: string,
        messageId: string
    ) => {
        setIsPolling(true);
        pollingStartTimeRef.current = Date.now();

        // Function to reset timeout - defined outside poll() so it can be called from anywhere
        const resetTimeout = () => {
            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
                pollingTimeoutRef.current = null;
            }
            // Set new timeout - extend by another POLLING_TIMEOUT period
            pollingTimeoutRef.current = setTimeout(() => {
                // Only timeout if we're still polling (no finished response received)
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                updateMessage(messageId, {
                    status: 'error',
                    content: 'Cevap alınamadı. Lütfen tekrar deneyin.',
                });
                setIsPolling(false);
                setError('Cevap alınamadı. Zaman aşımı.');
            }, POLLING_TIMEOUT);
        };

        const poll = async () => {
            try {
                const response = await fetch('/services/chatbot/answer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        conversation_id: convId,
                        request_id: reqId,
                    }),
                });

                const data: GetAnswerResponse = await response.json();

                // If response is not ok (not 200-299), it's a real error
                if (!response.ok) {
                    throw new Error(
                        data.errorMessage || 'Cevap alınırken bir hata oluştu'
                    );
                }

                // If status is error in the response, it's a real error
                if (data.status === 'error') {
                    throw new Error(
                        data.errorMessage || 'Cevap alınırken bir hata oluştu'
                    );
                }

                const answerData = data.data;
                if (!answerData) {
                    throw new Error('Geçersiz cevap formatı');
                }

                if (answerData.status === 'finished' && answerData.answer) {
                    // Stop polling
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                    }
                    if (pollingTimeoutRef.current) {
                        clearTimeout(pollingTimeoutRef.current);
                    }

                    updateMessage(messageId, {
                        content: answerData.answer,
                        status: 'sent',
                    });
                    setIsPolling(false);
                    return;
                }

                if (answerData.status === 'error') {
                    throw new Error('Cevap alınırken bir hata oluştu');
                }

                // If status is in_progress and response is ok (200), continue polling
                // Reset timeout since we got a valid in_progress response
                if (answerData.status === 'in_progress' && response.ok) {
                    // Reset timeout - we got a valid response, so keep waiting
                    resetTimeout();
                    // Continue polling - don't throw error
                    return;
                }

                // Continue polling if still in progress
            } catch (err: any) {
                // Stop polling on any error
                // Network errors, API errors, etc. should stop polling
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                if (pollingTimeoutRef.current) {
                    clearTimeout(pollingTimeoutRef.current);
                    pollingTimeoutRef.current = null;
                }

                updateMessage(messageId, {
                    status: 'error',
                    content: err.message || 'Bir hata oluştu',
                });
                setIsPolling(false);
                setError(err.message || 'Cevap alınırken bir hata oluştu');
            }
        };

        // Initial poll
        await poll();

        // Calculate intervals based on elapsed time
        const getInterval = () => {
            const elapsed = Date.now() - (pollingStartTimeRef.current || 0);
            if (elapsed < 2000) return POLLING_INTERVALS.INITIAL;
            if (elapsed < 12000) return POLLING_INTERVALS.MIDDLE;
            return POLLING_INTERVALS.FINAL;
        };

        // Set up interval polling
        pollingIntervalRef.current = setInterval(async () => {
            await poll();
        }, getInterval());

        // Set initial timeout - will be reset on each in_progress response
        resetTimeout();
    };

    const handleSendMessage = async (userMessage: string) => {
        // If first message and no user info, show form and save message
        // But only if we're not already submitting user info
        if (isFirstMessage && !userInfo && !isSubmittingUserInfoRef.current) {
            setPendingMessage(userMessage);
            setShowUserInfoForm(true);
            return;
        }

        setError(null);
        setIsLoading(true);

        // Add user message
        const userMsg = addMessage({
            role: 'user',
            content: userMessage,
            status: 'sent',
        });

        // Add assistant message placeholder
        const assistantMsg = addMessage({
            role: 'assistant',
            content: '',
            status: 'sending',
        });

        try {
            let response: Response;
            let data: CreateConversationResponse;

            // Build user message with context
            let enhancedMessage = userMessage;
            if (userInfo) {
                const contextParts: string[] = [];
                if (userInfo.name) {
                    contextParts.push(`Kullanıcı adı: ${userInfo.name}`);
                }
                if (userInfo.technicalLevel) {
                    const levelMap: Record<string, string> = {
                        beginner: 'Başlangıç seviyesi',
                        intermediate: 'Orta seviye',
                        advanced: 'İleri seviye',
                        expert: 'Uzman seviye',
                    };
                    contextParts.push(`Teknik seviye: ${levelMap[userInfo.technicalLevel] || userInfo.technicalLevel}`);
                }
                if (userInfo.purpose) {
                    contextParts.push(`Amaç: ${userInfo.purpose}`);
                }
                if (contextParts.length > 0) {
                    enhancedMessage = `[Kullanıcı Bilgileri: ${contextParts.join(', ')}]\n\n${userMessage}`;
                }
            }

            if (conversationId) {
                // Continue existing conversation
                response = await fetch('/services/chatbot/conversation/continue', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        conversation_id: conversationId,
                        user_message: enhancedMessage,
                        user_info: userInfo || {},
                    }),
                });
            } else {
                // Create new conversation
                response = await fetch('/services/chatbot/conversation/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        user_message: enhancedMessage,
                        user_info: userInfo || {},
                    }),
                });
            }

            data = await response.json();

            if (!response.ok || data.status === 'error') {
                throw new Error(
                    data.errorMessage || 'Mesaj gönderilirken bir hata oluştu'
                );
            }

            if (data.data) {
                const newConversationId = data.data.conversation_id;
                const requestId = data.data.request_id;

                if (newConversationId) {
                    setConversationId(newConversationId);
                }

                if (requestId) {
                    // Start polling for answer
                    await pollForAnswer(
                        newConversationId || conversationId || '',
                        requestId,
                        assistantMsg.id
                    );
                }
            }

            setIsFirstMessage(false);
        } catch (err: any) {
            updateMessage(assistantMsg.id, {
                status: 'error',
                content: err.message || 'Bir hata oluştu',
            });
            setError(err.message || 'Mesaj gönderilirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserInfoSubmit = async (info: UserInfo) => {
        // Prevent double submission
        if (isSubmittingUserInfoRef.current) {
            return;
        }

        isSubmittingUserInfoRef.current = true;
        setUserInfo(info);
        setIsFirstMessage(false);
        setShowUserInfoForm(false);

        // After setting user info, send the pending message if exists
        if (pendingMessage) {
            const messageToSend = pendingMessage;
            setPendingMessage(null);

            // Directly send message with user info, bypassing the first message check
            await sendMessageDirectly(messageToSend, info);
        }

        isSubmittingUserInfoRef.current = false;
    };

    const sendMessageDirectly = async (userMessage: string, userInfoToUse: UserInfo) => {
        setError(null);
        setIsLoading(true);

        // Add user message
        const userMsg = addMessage({
            role: 'user',
            content: userMessage,
            status: 'sent',
        });

        // Add assistant message placeholder
        const assistantMsg = addMessage({
            role: 'assistant',
            content: '',
            status: 'sending',
        });

        try {
            let response: Response;
            let data: CreateConversationResponse;

            // Build user message with context
            let enhancedMessage = userMessage;
            if (userInfoToUse) {
                const contextParts: string[] = [];
                if (userInfoToUse.name) {
                    contextParts.push(`Kullanıcı adı: ${userInfoToUse.name}`);
                }
                if (userInfoToUse.technicalLevel) {
                    const levelMap: Record<string, string> = {
                        beginner: 'Başlangıç seviyesi',
                        intermediate: 'Orta seviye',
                        advanced: 'İleri seviye',
                        expert: 'Uzman seviye',
                    };
                    contextParts.push(`Teknik seviye: ${levelMap[userInfoToUse.technicalLevel] || userInfoToUse.technicalLevel}`);
                }
                if (userInfoToUse.purpose) {
                    contextParts.push(`Amaç: ${userInfoToUse.purpose}`);
                }
                if (contextParts.length > 0) {
                    enhancedMessage = `[Kullanıcı Bilgileri: ${contextParts.join(', ')}]\n\n${userMessage}`;
                }
            }

            // Create new conversation (since this is the first message)
            response = await fetch('/services/chatbot/conversation/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    user_message: enhancedMessage,
                    user_info: userInfoToUse || {},
                }),
            });

            data = await response.json();

            if (!response.ok || data.status === 'error') {
                throw new Error(
                    data.errorMessage || 'Mesaj gönderilirken bir hata oluştu'
                );
            }

            if (data.data) {
                const newConversationId = data.data.conversation_id;
                const requestId = data.data.request_id;

                if (newConversationId) {
                    setConversationId(newConversationId);
                }

                if (requestId) {
                    // Start polling for answer
                    await pollForAnswer(
                        newConversationId || '',
                        requestId,
                        assistantMsg.id
                    );
                }
            }
        } catch (err: any) {
            updateMessage(assistantMsg.id, {
                status: 'error',
                content: err.message || 'Bir hata oluştu',
            });
            setError(err.message || 'Mesaj gönderilirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([]);
        setConversationId(null);
        setUserInfo(null);
        setIsFirstMessage(true);
        sessionStorage.removeItem(STORAGE_KEYS.CONVERSATION_ID);
        sessionStorage.removeItem(STORAGE_KEYS.MESSAGES);
        sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
        setError(null);

        // Clear any ongoing polling
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }
        if (pollingTimeoutRef.current) {
            clearTimeout(pollingTimeoutRef.current);
        }
        setIsPolling(false);
    };

    return (
        <>
            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
                title="Chatbot'u aç"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>

            {/* User Info Form */}
            <UserInfoForm
                open={showUserInfoForm}
                onClose={() => {
                    setShowUserInfoForm(false);
                    // If form is closed without submitting, clear pending message
                    if (pendingMessage) {
                        setPendingMessage(null);
                    }
                }}
                onSubmit={handleUserInfoSubmit}
                initialData={userInfo || undefined}
            />

            {/* Chatbot Sidebar */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent
                    side="right"
                    className="flex h-full w-full flex-col p-0 sm:w-[500px]"
                >
                    <ChatHeader
                        onClear={handleClearChat}
                        onProfileClick={() => setShowUserInfoForm(true)}
                    />

                    {/* Error Alert */}
                    {error && (
                        <div className="px-4 pt-4">
                            <Alert variant="destructive">
                                <X className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="flex h-full items-center justify-center px-4">
                                <div className="text-center">
                                    <Bot className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Merhaba! Size nasıl yardımcı olabilirim?
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4">
                                {messages.map((message) => (
                                    <ChatMessageComponent
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <ChatInput
                        onSend={handleSendMessage}
                        disabled={isLoading || isPolling}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
