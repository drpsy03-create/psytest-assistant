import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Mail, Check, Clock, Shield, User, Building, Calendar, Key } from 'lucide-react';

interface Doctor {
  id: string;
  email: string;
  name: string;
  specialty?: string;
  clinic?: string;
  registrationDate: string;
  verificationCode?: string;
}

interface EmailNotificationDemoProps {
  doctor: Doctor;
  isVisible: boolean;
  onClose: () => void;
}

export function EmailNotificationDemo({ doctor, isVisible, onClose }: EmailNotificationDemoProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            📧 Email отправлен!
          </h2>
          <p className="text-gray-600">
            Предварительный просмотр письма, отправленного на {doctor.email}
          </p>
        </div>

        {/* Email Preview */}
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardHeader className="border-b border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Система психологических тестирований
                </div>
                <div className="text-sm text-gray-600">noreply@psytest.com</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <strong>Кому:</strong> {doctor.email}<br/>
              <strong>Тема:</strong> 🏥 Подтверждение регистрации - Код доступа
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Welcome */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🏥 Добро пожаловать в систему психологических тестирований!
              </h3>
              <p className="text-gray-700">
                Уважаемый(ая) <strong>{doctor.name}</strong>,
              </p>
              <p className="text-gray-700 mt-2">
                Ваш аккаунт врача успешно создан. Для завершения регистрации введите код подтверждения:
              </p>
            </div>

            {/* Verification Code */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Key className="h-6 w-6 text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-800">КОД ПОДТВЕРЖДЕНИЯ</span>
              </div>
              <div className="text-4xl font-mono font-bold text-yellow-900 tracking-widest bg-yellow-100 rounded-xl p-4 inline-block">
                {doctor.verificationCode}
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                Код действителен в течение 10 минут
              </p>
            </div>

            {/* Account Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                ДАННЫЕ ВАШЕГО АККАУНТА
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <span className="text-gray-600">Имя:</span>
                    <span className="font-medium text-gray-900 ml-1">{doctor.name}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900 ml-1">{doctor.email}</span>
                  </div>
                </div>
                {doctor.specialty && (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <span className="text-gray-600">Специальность:</span>
                      <span className="font-medium text-gray-900 ml-1">{doctor.specialty}</span>
                    </div>
                  </div>
                )}
                {doctor.clinic && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <span className="text-gray-600">Место работы:</span>
                      <span className="font-medium text-gray-900 ml-1">{doctor.clinic}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center md:col-span-2">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <div>
                    <span className="text-gray-600">Дата регистрации:</span>
                    <span className="font-medium text-gray-900 ml-1">
                      {new Date(doctor.registrationDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h4 className="font-semibold text-blue-900 mb-3">
                🚀 ВОЗМОЖНОСТИ СИСТЕМЫ:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-blue-600 mr-2" />
                  Создание кодов доступа для пациентов
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-blue-600 mr-2" />
                  Получение результатов с ИИ-анализом
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-blue-600 mr-2" />
                  Отправка результатов в WhatsApp/Telegram
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-blue-600 mr-2" />
                  Управление психологическими тестированиями
                </li>
              </ul>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800">
                    <strong>Безопасность:</strong> Никогда не передавайте код подтверждения третьим лицам. 
                    Если вы не регистрировались в нашей системе, проигнорируйте это письмо.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
              <p>С уважением,<br/>Команда системы психологических тестирований</p>
              <p className="mt-2">
                Если у вас есть вопросы, свяжитесь с нами: support@psytest.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Close Button */}
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Закрыть предварительный просмотр
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Это демонстрация отправленного email
          </p>
        </div>
      </div>
    </div>
  );
}