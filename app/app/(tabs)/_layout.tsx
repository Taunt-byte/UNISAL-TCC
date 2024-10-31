import { Tabs } from 'expo-router'; // Importa o componente Tabs para gerenciar a navegação por abas
import React from 'react'; // Importa a biblioteca React

import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // Componente personalizado de ícone para as abas
import { Colors } from '@/constants/Colors'; // Importa as constantes de cores personalizadas
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook que detecta o esquema de cores do dispositivo (claro ou escuro)

export default function TabLayout() {
  const colorScheme = useColorScheme(); // Hook para definir se o dispositivo está no tema claro ou escuro

  return (
<Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colorScheme === 'dark' ? '#000' : '#fff', // Altera a cor de fundo com base no tema
    },
  }}
>

      {/* Primeira aba - "Início" */}
      <Tabs.Screen
        name="index" // Define o nome da tela (rota)
        options={{
          title: 'Inicio', // Título que aparecerá na aba
          tabBarIcon: ({ color, focused }) => (
            // Componente de ícone da aba, que muda com base no estado (focado ou não)
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      
      {/* Segunda aba - "Informações" */}
      <Tabs.Screen
        name="config" // Define o nome da tela (rota)
        options={{
          title: 'Informações', // Título da aba
          tabBarIcon: ({ color, focused }) => (
            // Ícone da aba muda com base no estado (focado ou não)
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
