import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ArrowLeft, Brain, Activity, Users, Heart, Zap, Shield, Eye, Target, AlertTriangle } from 'lucide-react';

interface SCL90RTestProps {
  onComplete: (result: SCL90RResult) => void;
  onBack: () => void;
}

export interface SCL90RResult {
  testId: 'scl90r';
  responses: number[];
  totalScore: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  subscaleScores: {
    somatization: number;
    obsessiveCompulsive: number;
    interpersonalSensitivity: number;
    depression: number;
    anxiety: number;
    hostility: number;
    phobicAnxiety: number;
    paranoidIdeation: number;
    psychoticism: number;
  };
  completedAt: Date;
  recommendations: string[];
}

const symptoms = [
  // Соматизация (SOM) - 1-12
  { id: 1, text: "Головные боли", subscale: "somatization", icon: Activity },
  { id: 2, text: "Нервозность или дрожь внутри", subscale: "somatization", icon: Activity },
  { id: 3, text: "Повторяющиеся неприятные мысли, которые не выходят из головы", subscale: "obsessiveCompulsive", icon: Brain },
  { id: 4, text: "Слабость или головокружение", subscale: "somatization", icon: Activity },
  { id: 5, text: "Потеря сексуального интереса или удовольствия", subscale: "somatization", icon: Activity },
  { id: 6, text: "Чувство критичности по отношению к другим", subscale: "hostility", icon: Shield },
  { id: 7, text: "Идея, что кто-то может контролировать ваши мысли", subscale: "paranoidIdeation", icon: Brain },
  { id: 8, text: "Чувство, что другие виноваты в большинстве ваших проблем", subscale: "paranoidIdeation", icon: Users },
  { id: 9, text: "Проблемы с памятью", subscale: "obsessiveCompulsive", icon: Brain },
  { id: 10, text: "Беспокойство о небрежности или невнимательности", subscale: "obsessiveCompulsive", icon: Brain },

  // Обсессивно-компульсивные (O-C) - 11-20
  { id: 11, text: "Легко раздражаетесь или сердитесь", subscale: "hostility", icon: Shield },
  { id: 12, text: "Боли в сердце или груди", subscale: "somatization", icon: Activity },
  { id: 13, text: "Чувство страха в открытых пространствах или на улицах", subscale: "phobicAnxiety", icon: Eye },
  { id: 14, text: "Чувство недостатка энергии или заторможенности", subscale: "depression", icon: Heart },
  { id: 15, text: "Мысли о смерти или умирании", subscale: "depression", icon: Heart },
  { id: 16, text: "Переедание", subscale: "somatization", icon: Activity },
  { id: 17, text: "Чувство неловкости или дискомфорта при наблюдении или разговоре с другими", subscale: "interpersonalSensitivity", icon: Users },
  { id: 18, text: "Чувство одиночества", subscale: "depression", icon: Heart },
  { id: 19, text: "Чувство напряженности или взвинченности", subscale: "anxiety", icon: Zap },
  { id: 20, text: "Чувство тяжести в руках или ногах", subscale: "somatization", icon: Activity },

  // Межличностная сенситивность (I-S) - 21-30
  { id: 21, text: "Мысли о смерти или умирании", subscale: "depression", icon: Heart },
  { id: 22, text: "Переедание", subscale: "somatization", icon: Activity },
  { id: 23, text: "Пробуждение рано утром", subscale: "depression", icon: Heart },
  { id: 24, text: "Беспокойный, тревожный или неугомонный сон", subscale: "anxiety", icon: Zap },
  { id: 25, text: "Чувство, что большинство людей не заслуживают доверия", subscale: "paranoidIdeation", icon: Users },
  { id: 26, text: "Плохой аппетит", subscale: "depression", icon: Heart },
  { id: 27, text: "Плач", subscale: "depression", icon: Heart },
  { id: 28, text: "Чувство застенчивости или неловкости с противоположным полом", subscale: "interpersonalSensitivity", icon: Users },
  { id: 29, text: "Чувство, что вас поймают за плохой поступок", subscale: "anxiety", icon: Zap },
  { id: 30, text: "Чувство страха когда вы остаетесь один", subscale: "phobicAnxiety", icon: Eye },

  // Депрессия (DEP) - 31-40
  { id: 31, text: "Чувство синевы или печали", subscale: "depression", icon: Heart },
  { id: 32, text: "Отсутствие интереса к вещам", subscale: "depression", icon: Heart },
  { id: 33, text: "Чувство страха", subscale: "anxiety", icon: Zap },
  { id: 34, text: "Ваши чувства легко задеть", subscale: "interpersonalSensitivity", icon: Users },
  { id: 35, text: "Чувство, что другие люди знают ваши личные мысли", subscale: "paranoidIdeation", icon: Brain },
  { id: 36, text: "Чувство, что другие не понимают вас или не сочувствуют", subscale: "interpersonalSensitivity", icon: Users },
  { id: 37, text: "Чувство, что люди недружелюбны или не нравятся вам", subscale: "interpersonalSensitivity", icon: Users },
  { id: 38, text: "Необходимость делать вещи очень медленно, чтобы убедиться, что они правильные", subscale: "obsessiveCompulsive", icon: Brain },
  { id: 39, text: "Сердцебиение", subscale: "anxiety", icon: Zap },
  { id: 40, text: "Тошнота или расстройство желудка", subscale: "somatization", icon: Activity },

  // Тревожность (ANX) - 41-50
  { id: 41, text: "Чувство неполноценности по отношению к другим", subscale: "interpersonalSensitivity", icon: Users },
  { id: 42, text: "Болезненность мышц", subscale: "somatization", icon: Activity },
  { id: 43, text: "Чувство, что за вами наблюдают или говорят о вас", subscale: "paranoidIdeation", icon: Eye },
  { id: 44, text: "Проблемы с засыпанием", subscale: "anxiety", icon: Zap },
  { id: 45, text: "Необходимость проверять и перепроверять то, что вы делаете", subscale: "obsessiveCompulsive", icon: Brain },
  { id: 46, text: "Трудности с принятием решений", subscale: "obsessiveCompulsive", icon: Brain },
  { id: 47, text: "Страх поездок в автобусе, метро или поездах", subscale: "phobicAnxiety", icon: Eye },
  { id: 48, text: "Проблемы с дыханием", subscale: "anxiety", icon: Zap },
  { id: 49, text: "Приливы жара или холода", subscale: "somatization", icon: Activity },
  { id: 50, text: "Необходимость избегать определенных вещей, мест или действий, потому что они пугают вас", subscale: "phobicAnxiety", icon: Eye },

  // Враждебность (HOS) - 51-60
  { id: 51, text: "Ваш разум становится пустым", subscale: "psychoticism", icon: Brain },
  { id: 52, text: "Онемение или покалывание в частях тела", subscale: "somatization", icon: Activity },
  { id: 53, text: "Комок в горле", subscale: "anxiety", icon: Zap },
  { id: 54, text: "Чувство безнадежности в отношении будущего", subscale: "depression", icon: Heart },
  { id: 55, text: "Проблемы с концентрацией", subscale: "obsessiveCompulsive", icon: Brain },
  { id: 56, text: "Чувство слабости в частях тела", subscale: "somatization", icon: Activity },
  { id: 57, text: "Чувство напряженности", subscale: "anxiety", icon: Zap },
  { id: 58, text: "Тяжесть в руках или ногах", subscale: "somatization", icon: Activity },
  { id: 59, text: "Мысли о смерти или умирании", subscale: "depression", icon: Heart },
  { id: 60, text: "Переедание", subscale: "somatization", icon: Activity },

  // Фобическая тревожность (PHOB) - 61-70
  { id: 61, text: "Чувство неловкости при еде или питье в общественных местах", subscale: "phobicAnxiety", icon: Eye },
  { id: 62, text: "Легко вступаете в споры", subscale: "hostility", icon: Shield },
  { id: 63, text: "Чувство нервозности, когда остаетесь один", subscale: "phobicAnxiety", icon: Eye },
  { id: 64, text: "Другие не дают вам должного признания за ваши достижения", subscale: "paranoidIdeation", icon: Users },
  { id: 65, text: "Чувство одиночества, даже когда вы с людьми", subscale: "interpersonalSensitivity", icon: Users },
  { id: 66, text: "Чувство беспокойства или нетерпения", subscale: "anxiety", icon: Zap },
  { id: 67, text: "Чувство, что все требует больших усилий", subscale: "depression", icon: Heart },
  { id: 68, text: "Приступы ужаса или паники", subscale: "anxiety", icon: Zap },
  { id: 69, text: "Чувство неловкости при еде или питье в общественных местах", subscale: "phobicAnxiety", icon: Eye },
  { id: 70, text: "Частые споры", subscale: "hostility", icon: Shield },

  // Паранойяльные идеи (PAR) - 71-80
  { id: 71, text: "Чувство нервозности в толпе, например, при покупках или в кино", subscale: "phobicAnxiety", icon: Eye },
  { id: 72, text: "Чувство, что все борется", subscale: "depression", icon: Heart },
  { id: 73, text: "Чувство нервозности, когда остаетесь один", subscale: "phobicAnxiety", icon: Eye },
  { id: 74, text: "Чувство, что другие не ценят ваши дости��ения должным образом", subscale: "paranoidIdeation", icon: Users },
  { id: 75, text: "Чувство одиночества", subscale: "interpersonalSensitivity", icon: Users },
  { id: 76, text: "Чувство беспокойства или нетерпения", subscale: "anxiety", icon: Zap },
  { id: 77, text: "Чувство неполноценности", subscale: "interpersonalSensitivity", icon: Users },
  { id: 78, text: "Приступы тошноты или расстройства желудка", subscale: "somatization", icon: Activity },
  { id: 79, text: "Чувство, что вы хуже других", subscale: "interpersonalSensitivity", icon: Users },
  { id: 80, text: "Приливы жара или холода", subscale: "somatization", icon: Activity },

  // Психотизм (PSY) - 81-90
  { id: 81, text: "Мысли о смерти или умирании", subscale: "depression", icon: Heart },
  { id: 82, text: "Переедание", subscale: "somatization", icon: Activity },
  { id: 83, text: "Пробуждение рано утром", subscale: "depression", icon: Heart },
  { id: 84, text: "Повторяющиеся действия, такие как прикосновения, подсчет, мытье", subscale: "obsessiveCompulsive", icon: Brain },
  { id: 85, text: "Беспокойный, тревожный сон", subscale: "anxiety", icon: Zap },
  { id: 86, text: "Импульсы разрушать или повреждать вещи", subscale: "hostility", icon: Shield },
  { id: 87, text: "Идеи или убеждения, которые другие не разделяют", subscale: "psychoticism", icon: Target },
  { id: 88, text: "Чувство очень застенчивости с другими", subscale: "interpersonalSensitivity", icon: Users },
  { id: 89, text: "Чувство неловкости в толпе", subscale: "phobicAnxiety", icon: Eye },
  { id: 90, text: "Чувство, что вы никогда не можете быть близки к другому человеку", subscale: "psychoticism", icon: Target }
];

const severityOptions = [
  "Совсем нет",
  "Немного", 
  "Умеренно",
  "Довольно сильно",
  "Очень сильно"
];

export function SCL90RTest({ onComplete, onBack }: SCL90RTestProps) {
  const [currentSymptom, setCurrentSymptom] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newResponses = [...responses];
    newResponses[currentSymptom] = answerIndex;
    setResponses(newResponses);

    if (currentSymptom < symptoms.length - 1) {
      setCurrentSymptom(currentSymptom + 1);
    } else {
      calculateResults(newResponses);
    }
  };

  const calculateResults = (responses: number[]) => {
    const totalScore = responses.reduce((sum, score) => sum + score, 0);

    // Подсчет по подшкалам
    const subscaleScores = {
      somatization: 0,
      obsessiveCompulsive: 0,
      interpersonalSensitivity: 0,
      depression: 0,
      anxiety: 0,
      hostility: 0,
      phobicAnxiety: 0,
      paranoidIdeation: 0,
      psychoticism: 0
    };

    symptoms.forEach((symptom, index) => {
      const subscale = symptom.subscale as keyof typeof subscaleScores;
      subscaleScores[subscale] += responses[index];
    });

    // Определяем общую тяжесть (средний балл по всем симптомам)
    const avgScore = totalScore / symptoms.length;
    let severity: 'normal' | 'mild' | 'moderate' | 'severe';
    
    if (avgScore < 0.5) severity = 'normal';
    else if (avgScore < 1.5) severity = 'mild';
    else if (avgScore < 2.5) severity = 'moderate';
    else severity = 'severe';

    const recommendations = generateRecommendations(totalScore, severity, subscaleScores);

    const result: SCL90RResult = {
      testId: 'scl90r',
      responses,
      totalScore,
      severity,
      subscaleScores,
      completedAt: new Date(),
      recommendations
    };

    setShowResults(true);
    onComplete(result);
  };

  const generateRecommendations = (
    totalScore: number,
    severity: string,
    subscaleScores: any
  ): string[] => {
    const recommendations = [];

    if (severity === 'severe') {
      recommendations.push('🚨 Выраженная психологическая симптоматика');
      recommendations.push('Необходима комплексная психиатрическая оценка');
      recommendations.push('Рекомендуется немедленное вмешательство');
    } else if (severity === 'moderate') {
      recommendations.push('⚠️ Умеренная психологическая симптоматика');
      recommendations.push('Показана психологическая или психиатрическая консультация');
      recommendations.push('Необходимо дополнительное обследование');
    } else if (severity === 'mild') {
      recommendations.push('Легкая психологическая симптоматика');
      recommendations.push('Профилактические мероприятия');
      recommendations.push('Наблюдение и поддержка');
    } else {
      recommendations.push('✅ Нормальные показатели психического здоровья');
      recommendations.push('Профилактика и поддержание благополучия');
    }

    // Анализ доминирующих проблемных областей
    const maxScore = Math.max(...Object.values(subscaleScores));
    const problemAreas = Object.entries(subscaleScores)
      .filter(([key, score]) => score >= maxScore * 0.8)
      .map(([key]) => key);

    if (problemAreas.includes('depression')) {
      recommendations.push('📉 Высокие показатели депрессии - рекомендован BDI-II');
    }
    if (problemAreas.includes('anxiety')) {
      recommendations.push('😰 Выраженная тревожность - рекомендованы STAI и BAI');
    }
    if (problemAreas.includes('somatization')) {
      recommendations.push('🏥 Соматические жалобы - исключите медицинские причины');
    }
    if (problemAreas.includes('obsessiveCompulsive')) {
      recommendations.push('🔄 Обсессивно-компульсивные симптомы');
    }
    if (problemAreas.includes('interpersonalSensitivity')) {
      recommendations.push('👥 Проблемы в межличностных отношениях');
    }

    return recommendations;
  };

  const goBack = () => {
    if (currentSymptom > 0) {
      setCurrentSymptom(currentSymptom - 1);
    } else {
      onBack();
    }
  };

  const progress = ((currentSymptom + 1) / symptoms.length) * 100;
  const currentSymptomData = symptoms[currentSymptom];
  const IconComponent = currentSymptomData.icon;

  if (showResults) {
    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    const avgScore = totalScore / symptoms.length;
    
    const subscaleScores = {
      somatization: 0,
      obsessiveCompulsive: 0,
      interpersonalSensitivity: 0,
      depression: 0,
      anxiety: 0,
      hostility: 0,
      phobicAnxiety: 0,
      paranoidIdeation: 0,
      psychoticism: 0
    };

    symptoms.forEach((symptom, index) => {
      const subscale = symptom.subscale as keyof typeof subscaleScores;
      subscaleScores[subscale] += responses[index];
    });

    const subscaleLabels = {
      somatization: 'Соматизация',
      obsessiveCompulsive: 'Обсессии',
      interpersonalSensitivity: 'Межличностная сенситивность',
      depression: 'Депрессия',
      anxiety: 'Тревожность',
      hostility: 'Враждебность',
      phobicAnxiety: 'Фобическая тревожность',
      paranoidIdeation: 'Паранойяльность',
      psychoticism: 'Психотизм'
    };

    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-blue-600" />
              <span>SCL-90-R - Результаты симптоматического опросника</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-blue-900 mb-2">Общий индекс</h3>
                <div className="text-3xl font-bold text-blue-700">{avgScore.toFixed(2)}</div>
                <div className="text-sm text-blue-600 mt-1">
                  из 4.0 максимум
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Профиль по шкалам</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(subscaleScores).map(([key, score]) => (
                    <div key={key} className="flex justify-between">
                      <span>{subscaleLabels[key as keyof typeof subscaleLabels]}</span>
                      <span className="font-medium">{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Интерпретация SCL-90-R</h3>
              <div className="text-sm text-green-800 space-y-1">
                <p><strong>Средний балл 0-0.5:</strong> Норма</p>
                <p><strong>Средний балл 0.5-1.5:</strong> Легкая симптоматика</p>
                <p><strong>Средний балл 1.5-2.5:</strong> Умеренная симптоматика</p>
                <p><strong>Средний балл 2.5-4.0:</strong> Выраженная симптоматика</p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Важно!</h3>
              <p className="text-sm text-yellow-800">
                SCL-90-R дает широкий профиль психопатологии по 9 основным шкалам. 
                Этот тест помогает определить, в какой сфере сосредоточены основные трудности, 
                и ��аправляет дальнейшую углубленную диагностику.
              </p>
            </div>

            <div className="text-center space-y-4">
              <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white">
                Продолжить по рекомендациям ИИ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <IconComponent className="h-6 w-6 text-blue-600" />
              <span>SCL-90-R Симптоматический опросник</span>
            </CardTitle>
            <div className="text-sm text-gray-500">
              {currentSymptom + 1} из {symptoms.length}
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Инструкция:</strong> Оцените, насколько каждый симптом беспокоил или расстраивал вас 
            в течение последних 7 дней, включая сегодня.
          </div>

          <div>
            <h3 className="text-lg font-medium mb-6 text-gray-900">
              {currentSymptomData.text}
            </h3>

            <div className="space-y-3">
              {severityOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full p-4 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index}</span>
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div className="text-xs text-gray-500 text-center">
              Шкала: {currentSymptomData.subscale === 'somatization' ? 'Соматизация' :
                       currentSymptomData.subscale === 'obsessiveCompulsive' ? 'Обсессии' :
                       currentSymptomData.subscale === 'interpersonalSensitivity' ? 'Межличностные' :
                       currentSymptomData.subscale === 'depression' ? 'Депрессия' :
                       currentSymptomData.subscale === 'anxiety' ? 'Тревожность' :
                       currentSymptomData.subscale === 'hostility' ? 'Враждебность' :
                       currentSymptomData.subscale === 'phobicAnxiety' ? 'Фобии' :
                       currentSymptomData.subscale === 'paranoidIdeation' ? 'Паранойя' : 'Психотизм'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}