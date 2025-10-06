import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Clock, Users, Brain, Heart } from 'lucide-react';
import { BeckDepressionInventory } from './tests/BeckDepressionInventory';
import { GAD7Test } from './tests/GAD7Test';
import { PHQ9Test } from './tests/PHQ9Test';
import { MMSETest } from './tests/MMSETest';

interface PatientInterfaceProps {
  onBack: () => void;
}

type TestType = 'beck' | 'gad7' | 'phq9' | 'mmse' | null;

export function PatientInterface({ onBack }: PatientInterfaceProps) {
  const [selectedTest, setSelectedTest] = useState<TestType>(null);
  const [completedTests, setCompletedTests] = useState<string[]>([]);

  const tests = [
    {
      id: 'beck',
      title: 'Шкала депрессии Бека (BDI-II)',
      description: 'Оценка выраженности депрессивной симптоматики',
      duration: '10-15 минут',
      category: 'Депрессия',
      icon: Heart,
      color: 'bg-red-100 text-red-700'
    },
    {
      id: 'gad7',
      title: 'GAD-7 (Генерализованная тревожность)',
      description: 'Скрининг генерализованного тревожного расстройства',
      duration: '5-7 минут',
      category: 'Тревожность',
      icon: Brain,
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'phq9',
      title: 'PHQ-9 (Депрессия)',
      description: 'Быстрая оценка депрессивных симптомов',
      duration: '5-8 минут',
      category: 'Депрессия',
      icon: Heart,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'mmse',
      title: 'MMSE (Когнитивные функции)',
      description: 'Краткая оценка когнитивного статуса',
      duration: '10-12 минут',
      category: 'Когнитивные функции',
      icon: Brain,
      color: 'bg-green-100 text-green-700'
    }
  ];

  const onTestComplete = (testId: string) => {
    setCompletedTests(prev => [...prev, testId]);
    setSelectedTest(null);
  };

  const renderTest = () => {
    switch (selectedTest) {
      case 'beck':
        return <BeckDepressionInventory onComplete={() => onTestComplete('beck')} onBack={() => setSelectedTest(null)} />;
      case 'gad7':
        return <GAD7Test onComplete={() => onTestComplete('gad7')} onBack={() => setSelectedTest(null)} />;
      case 'phq9':
        return <PHQ9Test onComplete={() => onTestComplete('phq9')} onBack={() => setSelectedTest(null)} />;
      case 'mmse':
        return <MMSETest onComplete={() => onTestComplete('mmse')} onBack={() => setSelectedTest(null)} />;
      default:
        return null;
    }
  };

  if (selectedTest) {
    return renderTest();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Психологическое тестирование</h1>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Добро пожаловать в систему тестирования</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Выберите необходимый тест для оценки вашего психического состояния. 
                Все данные будут переданы вашему лечащему врачу для анализа и интерпретации.
                Отвечайте на вопросы честно и внимательно.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {tests.map((test) => {
            const IconComponent = test.icon;
            const isCompleted = completedTests.includes(test.id);
            
            return (
              <Card 
                key={test.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                onClick={() => setSelectedTest(test.id as TestType)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg ${test.color} flex items-center justify-center mr-4`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant="outline">{test.category}</Badge>
                          {isCompleted && <Badge className="bg-green-100 text-green-800">Пройден</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{test.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {test.duration}
                    </div>
                    <Button variant={isCompleted ? "outline" : "default"} size="sm">
                      {isCompleted ? 'Пройти повторно' : 'Начать тест'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Конфиденциальность</h3>
              <p className="text-sm text-gray-600">
                Все данные передаются только вашему лечащему врачу
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">ИИ-анализ</h3>
              <p className="text-sm text-gray-600">
                Результаты анализируются с помощью искусственного интеллекта
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Быстро и точно</h3>
              <p className="text-sm text-gray-600">
                Тестирование занимает от 5 до 15 минут
              </p>
            </CardContent>
          </Card>
        </div>

        {completedTests.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Пройденные тесты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {completedTests.map((testId) => {
                  const test = tests.find(t => t.id === testId);
                  return (
                    <Badge key={testId} className="bg-green-100 text-green-800">
                      {test?.title}
                    </Badge>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Результаты отправлены вашему врачу для анализа и получения рекомендаций.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}