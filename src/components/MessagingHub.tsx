import React, { useState, useRef, useEffect } from 'react';
import { Message, User } from '../types';
import {
  MessageSquare,
  Mic,
  Square,
  Send,
  Image as ImageIcon,
  Play,
  Pause,
  Volume2,
  Paperclip,
  CheckCheck,
  Building2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface MessagingHubProps {
  messages: Message[];
  currentUser: User | null;
  onSendMessage: (msg: {
    content: string;
    type: 'text' | 'image' | 'audio';
    mediaUrl?: string;
    audioDuration?: number;
    transferOrderId?: string;
  }) => void;
}

export const MessagingHub: React.FC<MessagingHubProps> = ({
  messages,
  currentUser,
  onSendMessage,
}) => {
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Audio Recorder States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Audio Playback state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice Recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        onSendMessage({
          content: 'رسالة صوتية مسجلة',
          type: 'audio',
          mediaUrl: audioUrl,
          audioDuration: recordingSeconds || 5,
        });

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('تعذر فتح الميكروفون. يرجى منح الإذن للتسجيل الصوتي.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      audioChunksRef.current = [];
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() && !selectedImage) return;

    if (selectedImage) {
      onSendMessage({
        content: textInput || 'صورة مرفقة',
        type: 'image',
        mediaUrl: selectedImage,
      });
      setSelectedImage(null);
    } else {
      onSendMessage({
        content: textInput,
        type: 'text',
      });
    }

    setTextInput('');
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleAudioPlay = (msgId: string, url: string) => {
    if (playingId === msgId) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const newAudio = new Audio(url);
      audioRef.current = newAudio;
      newAudio.play();
      setPlayingId(msgId);

      newAudio.onended = () => setPlayingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Internal Communications Hub
          </span>
          <h2 className="text-2xl font-bold text-amber-200 mt-1">
            مركز المراسلات والملاحظات الصوتية الداخلي
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            تواصل مباشر ومحمي بين الوكلاء والمدير العام. يدعم تبادل الرسائل النصية، الصور، والتسجيلات الصوتية الفورية مع التحكم بمدة التسجيل والتنبيهات.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          قناة مشفرة وخاصة
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
        
        {/* Chat Room Header */}
        <div className="bg-black/40 p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">القناة الرئيسية لإدارة التحويلات</h3>
              <p className="text-[10px] text-emerald-400 font-mono">متصل الآن - شركة قطينة والحسام العالمية</p>
            </div>
          </div>
        </div>

        {/* Message Feed Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-black/20">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id || (currentUser?.role === 'super_admin' && msg.senderRole === 'super_admin');

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-300">
                    {msg.senderName} ({msg.senderRole === 'super_admin' ? 'الإدارة' : 'وكيل'})
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`max-w-md p-4 rounded-2xl text-xs space-y-2 shadow-lg backdrop-blur-md ${
                    isMe
                      ? 'bg-amber-500/20 text-slate-100 border border-amber-500/40 rounded-tl-none'
                      : 'bg-white/10 text-slate-200 border border-white/10 rounded-tr-none'
                  }`}
                >
                  {/* Text content */}
                  {msg.content && <p className="leading-relaxed">{msg.content}</p>}

                  {/* Image Payload */}
                  {msg.type === 'image' && msg.mediaUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-amber-500/30">
                      <img src={msg.mediaUrl} alt="صورة مرفقة" className="max-h-56 w-full object-cover" />
                    </div>
                  )}

                  {/* Audio Voice Payload (رسالة صوتية) */}
                  {msg.type === 'audio' && msg.mediaUrl && (
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/10 mt-2">
                      <button
                        onClick={() => toggleAudioPlay(msg.id, msg.mediaUrl!)}
                        className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center hover:bg-amber-400 transition shrink-0"
                      >
                        {playingId === msg.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 mr-0.5" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono">
                          <span>رسالة صوتية ممررة</span>
                          <span>{msg.audioDuration || 5} ثانية</span>
                        </div>
                        {/* Audio Wave Visualizer Simulation */}
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden flex items-center gap-0.5 px-1">
                          {[40, 70, 30, 90, 60, 100, 50, 80, 40, 90, 60].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className={`flex-1 rounded-full ${
                                playingId === msg.id ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-black/40 border-t border-white/10">
          
          {selectedImage && (
            <div className="mb-2 p-2 bg-slate-900 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs text-amber-300 font-bold">صورة جاهزة للإرفاق</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-slate-400 hover:text-red-400 text-xs font-bold"
              >
                إلغاء
              </button>
            </div>
          )}

          {isRecording ? (
            /* Voice Recording Active Controls */
            <div className="p-3 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-xs font-bold text-amber-300 font-mono">
                  جاري تسجيل الملاحظة الصوتية: {recordingSeconds} ثانية
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 flex items-center gap-1.5 shadow"
                >
                  <Square className="w-3.5 h-3.5" /> إيقاف وإرسال الصوت
                </button>
              </div>
            </div>
          ) : (
            /* Standard Input Bar */
            <form onSubmit={handleSendText} className="flex items-center gap-2">
              
              <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 cursor-pointer transition">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePick}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={startRecording}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition"
                title="تسجيل رسالة صوتية"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="اكتب رسالتك أو استفسارك هنا..."
                className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-amber-400 focus:outline-none transition"
              />

              <button
                type="submit"
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 transition shadow-md shadow-amber-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
