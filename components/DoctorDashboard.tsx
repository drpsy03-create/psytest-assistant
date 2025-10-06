import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertCircle, TrendingUp, TrendingDown, Minus, ArrowLeft, MessageSquare, Phone, Bell, Plus, Copy, Key, Users, Clock, Shield, QrCode, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { EmailConfigStatus } from './EmailConfigStatus';

interface TestResult {
  id: string;
  patientName: string;
  testType: string;
  score: number;
  severity: 'mild' | 'moderate' | 'severe' | 'normal';
  date: string;
  aiAnalysis: string;
  recommendations: string[];
}

interface AccessCode {
  id: string;
  code: string;
  patientName: string;
  createdDate: string;
  expiryDate: string;
  isActive: boolean;
  usedDate?: string;
  testResults?: number;
}

interface DoctorDashboardProps {
  onBack: () => void;
  user: { role: 'doctor' | 'patient'; name: string; id: string } | null;
  onLogout: () => void;
  testResults: TestResult[];
  accessCodes: AccessCode[];
  setAccessCodes: React.Dispatch<React.SetStateAction<AccessCode[]>>;
}

export function DoctorDashboard({ onBack, user, onLogout, testResults, accessCodes, setAccessCodes }: DoctorDashboardProps) {
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [newPatientName, setNewPatientName] = useState('');
  const [showCreateCodeDialog, setShowCreateCodeDialog] = useState(false);
  // Mock данные для демонстрации если нет реальных данных
  const mockTestResults: TestResult[] = [
    {
      id: '1',
      patientName: 'Анна П.',
      testType: 'Шкала депрессии Бека (BDI-II)',
      score: 18,
      severity: 'moderate',
      date: '2024-01-15',
      aiAnalysis: 'Результаты указывают на умеренную депрессию. Наблюдается снижение настроения, нарушения сна и аппетита. Пациентка сообщает о чувстве безнадежности и снижении интереса к повседневной деятельности.',
      recommendations: [
        'Рассмотреть назначение антидепрессантов группы СИОЗС',
        'Рекомендовать когнитивно-поведенческую терапию',
        'Повторное тестирование через 2-3 недели',
        'Контроль суицидального риска'
      ]
    },
    {
      id: '2',
      patientName: 'Михаил К.',
      testType: 'GAD-7 (Тревожность)',
      score: 12,
      severity: 'moderate',
      date: '2024-01-14',
      aiAnalysis: 'Умеренный уровень генерализованной тревожности. Пациент испытывает трудности с контролем беспокойства, нарушения концентрации внимания и мышечное напряжение.',
      recommendations: [
        'Обучение техникам релаксации и дыхательным упражнениям',
        'Рассмотреть назначение анксиолитиков короткого курса',
        'Психообразование о природе тревожности',
        'Постепенная экспозиционная терапия'
      ]
    },
    {
      id: '3',
      patientName: 'Елена В.',
      testType: 'MMSE (Когнитивные функции)',
      score: 24,
      severity: 'mild',
      date: '2024-01-13',
      aiAnalysis: 'Легкие когнитивные нарушения. Снижение показателей в области кратковременной памяти и исполнительных функций. Ориентация в пространстве и времени сохранена.',
      recommendations: [
        'Дополнительное нейропсихологическое обследование',
        'МРТ головного мозга для исключения органической патологии',
        'Когнитивная реабилитация',
        'Контроль сосудистых факторов риска'
      ]
    },
    {
      id: '4',
      patientName: 'Дмитрий С.',
      testType: 'PHQ-9 (Депрессия)',
      score: 8,
      severity: 'mild',
      date: '2024-01-12',
      aiAnalysis: 'Легкая степень депрессивной симптоматики. Периодические нарушения настроения, некоторое снижение энергии и мотивации, но функционирование в основном сохранено.',
      recommendations: [
        'Психотерапевтическое сопровождение',
        'Активация поведения и планирование приятных активностей',
        'Нормализация режима сна и бодрствования',
        'Мониторинг динамики через 1 месяц'
      ]
    }
  ];

  // Используем реальные данные или mock данные для демонстрации
  const displayTestResults = testResults.length > 0 ? testResults : mockTestResults;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'mild': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'severe': return 'Тяжелая';
      case 'moderate': return 'Умеренная';
      case 'mild': return 'Легкая';
      default: return 'Норма';
    }
  };

  const sendToMessenger = (platform: 'whatsapp' | 'telegram', result: TestResult) => {
    const message = `Новый результат теста от ${result.patientName}:\n${result.testType}\nБалл: ${result.score}\nСтепень: ${getSeverityText(result.severity)}\nДата: ${result.date}\n\nАнализ ИИ: ${result.aiAnalysis.substring(0, 100)}...`;
    
    // Mock отправка сообщения
    if (platform === 'whatsapp') {
      toast.success(`Результат отправлен в WhatsApp для ${result.patientName}`);
    } else {
      toast.success(`Результат отправлен в Telegram для ${result.patientName}`);
    }
  };

  const generateAccessCode = () => {
    const prefixes = ['MED', 'DOC', 'PSY', 'CLI'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const numbers = Math.floor(Math.random() * 10);
    const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
    const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${numbers}-${letters}${suffix}`;
  };

  const createAccessCode = () => {
    if (!newPatientName.trim()) {
      toast.error('Введите имя пациента');
      return;
    }

    const newCode: AccessCode = {
      id: Date.now().toString(),
      code: generateAccessCode(),
      patientName: newPatientName,
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 дней
      isActive: true,
      testResults: 0
    };

    setAccessCodes([newCode, ...accessCodes]);
    setNewPatientName('');
    setShowCreateCodeDialog(false);
    
    toast.success(`Код доступа ${newCode.code} создан для ${newCode.patientName}`);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Код скопирован в буфер обмена');
  };

  const deactivateCode = (codeId: string) => {
    setAccessCodes(accessCodes.map(code => 
      code.id === codeId ? { ...code, isActive: false } : code
    ));
    toast.success('Код доступа деактивирован');
  };

  const sendCodeToMessenger = (platform: 'whatsapp' | 'telegram', accessCode: AccessCode) => {
    const message = `Здравствуйте, ${accessCode.patientName}!

Для прохождения психологического тестирования используйте этот код доступа:

🔐 Код: ${accessCode.code}

📱 Перейдите на сайт психологического скрининга
👤 Введите ваше имя: ${accessCode.patientName}
🔑 Введите код доступа: ${accessCode.code}

⏱️ Код действителен до: ${accessCode.expiryDate}

Тестирование займет 5-15 минут. Результаты автоматически придут мне для анализа.

С уважением,
Ваш врач`;

    if (platform === 'whatsapp') {
      toast.success(`Код отправлен в WhatsApp для ${accessCode.patientName}`);
    } else {
      toast.success(`Код отправлен в Telegram для ${accessCode.patientName}`);
    }
    
    // В реальном приложении здесь будет вызов API мессенджера
    console.log(`Отправка в ${platform}:`, message);
  };

  const downloadInstructions = (accessCode: AccessCode) => {
    const instructions = `ИНСТРУКЦИЯ ДЛЯ ПАЦИЕНТА

Здравствуйте, ${accessCode.patientName}!

Для прохождения психологического тестирования:

1. Перейдите на сайт: [ссылка на сайт]
2. Введите ваше имя: ${accessCode.patientName}
3. Введите код доступа: ${accessCode.code}
4. Следуйте инструкциям на экране

ВАЖНАЯ ИНФОРМАЦИЯ:
• Код действителен до: ${accessCode.expiryDate}
• Тестирование займет 5-15 минут
• Отвечайте честно и не торопитесь
• Результаты автоматически придут вашему врачу

Если возникнут вопросы - обратитесь к вашему врачу.`;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Инструкция_${accessCode.patientName}_${accessCode.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Инструкция загружена');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Панель врача-психиатра</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-gray-600">
                Врач: <span className="font-medium">{user.name}</span>
              </div>
            )}
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Уведомления
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Выйти
            </Button>
          </div>
        </div>

        {/* Email Configuration Status */}
        <div className="mb-6">
          <EmailConfigStatus />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Активных кодов</p>
                  <p className="text-2xl font-bold text-green-600">
                    {accessCodes.filter(code => code.isActive).length}
                  </p>
                </div>
                <Key className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Результатов тестов</p>
                  <p className="text-2xl font-bold">{displayTestResults.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Требуют внимания</p>
                  <p className="text-2xl font-bold text-red-600">
                    {displayTestResults.filter(r => r.severity === 'severe').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Пациентов за неделю</p>
                  <p className="text-2xl font-bold">
                    {accessCodes.filter(code => code.usedDate).length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="codes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="codes">Коды доступа</TabsTrigger>
            <TabsTrigger value="results">Результаты тестов</TabsTrigger>
            <TabsTrigger value="analysis">Детальный анализ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="codes">
            <div className="space-y-6">
              {/* Статистика кодов */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Активных кодов</p>
                        <p className="text-2xl font-bold text-green-600">
                          {accessCodes.filter(code => code.isActive).length}
                        </p>
                      </div>
                      <Key className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Использованных</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {accessCodes.filter(code => code.usedDate).length}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Истекает сегодня</p>
                        <p className="text-2xl font-bold text-yellow-600">0</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Всего создано</p>
                        <p className="text-2xl font-bold text-gray-600">{accessCodes.length}</p>
                      </div>
                      <Shield className="h-8 w-8 text-gray-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Создание нового кода */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Управление кодами доступа</CardTitle>
                    <Dialog open={showCreateCodeDialog} onOpenChange={setShowCreateCodeDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Создать код
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Создать код доступа для пациента</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Имя пациента
                            </label>
                            <Input
                              placeholder="Введите имя пациента"
                              value={newPatientName}
                              onChange={(e) => setNewPatientName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && createAccessCode()}
                            />
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div className="text-sm text-blue-800">
                                <p className="font-medium">Параметры кода:</p>
                                <ul className="mt-1 space-y-1 text-xs">
                                  <li>• Действителен 7 дней</li>
                                  <li>• Одноразовое использование</li>
                                  <li>• Автоматическая деактивация после прохождения тестов</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              onClick={createAccessCode}
                              disabled={!newPatientName.trim()}
                              className="flex-1"
                            >
                              Создать код
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowCreateCodeDialog(false)}
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Инструкции */}
                  <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Как дать код пациенту:</h4>
                        <div className="text-sm text-blue-800 space-y-1">
                          <p>1. <strong>Создайте код</strong> - нажмите "Создать код" и введите имя пациента</p>
                          <p>2. <strong>Передайте код</strong> - сообщите пациенту код доступа (SMS, WhatsApp, лично)</p>
                          <p>3. <strong>Дайте инструкции</strong> - пациент идет на сайт, вводит имя и код</p>
                          <p>4. <strong>Получайте результаты</strong> - результаты появятся в разделе "Результаты тестов"</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Код доступа</TableHead>
                        <TableHead>Пациент</TableHead>
                        <TableHead>Создан</TableHead>
                        <TableHead>Истекает</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Тесты</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessCodes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                {code.code}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(code.code)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{code.patientName}</TableCell>
                          <TableCell>{code.createdDate}</TableCell>
                          <TableCell>{code.expiryDate}</TableCell>
                          <TableCell>
                            <Badge 
                              className={code.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {code.isActive ? 'Активен' : 'Использован'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <span className="font-medium">{code.testResults || 0}</span>
                              <div className="text-xs text-gray-500">результатов</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {code.isActive && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => sendCodeToMessenger('whatsapp', code)}
                                    title="Отправить в WhatsApp"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => sendCodeToMessenger('telegram', code)}
                                    title="Отправить в Telegram"
                                  >
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadInstructions(code)}
                                    title="Скачать инструкцию"
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deactivateCode(code.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Деактивировать
                                  </Button>
                                </>
                              )}
                              {code.usedDate && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toast.info(`Код использован ${code.usedDate}`)}
                                >
                                  Подробности
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Последние результаты тестирования</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пациент</TableHead>
                      <TableHead>Тест</TableHead>
                      <TableHead>Балл</TableHead>
                      <TableHead>Степень</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayTestResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.patientName}</TableCell>
                        <TableCell>{result.testType}</TableCell>
                        <TableCell>{result.score}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(result.severity)}>
                            {getSeverityText(result.severity)}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedResult(result)}
                            >
                              Анализ
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => sendToMessenger('whatsapp', result)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => sendToMessenger('telegram', result)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis">
            {selectedResult ? (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Детальный анализ для {selectedResult.patientName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Тест: {selectedResult.testType}</h4>
                        <div className="flex items-center space-x-4">
                          <span>Балл: <strong>{selectedResult.score}</strong></span>
                          <Badge className={getSeverityColor(selectedResult.severity)}>
                            {getSeverityText(selectedResult.severity)}
                          </Badge>
                          <span className="text-sm text-gray-500">Дата: {selectedResult.date}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">ИИ-анализ результатов:</h4>
                        <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{selectedResult.aiAnalysis}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Рекомендации:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedResult.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-700">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Выберите результат теста для просмотра детального анализа</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}