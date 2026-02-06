// Mobile App Export Service
// Converts HTML/CSS to React Native / Flutter

export type MobilePlatform = 'react-native' | 'flutter' | 'ios' | 'android';
export type MobileFramework = 'react-native-cli' | 'expo' | 'flutter';

export interface MobileExportConfig {
  platform: MobilePlatform;
  framework: MobileFramework;
  includeNavigation: boolean;
  includeStateManagement: boolean;
  apiIntegration?: boolean;
  authentication?: boolean;
  offlineSupport?: boolean;
  pushNotifications?: boolean;
}

export interface ScreenComponent {
  name: string;
  route: string;
  htmlContent: string;
  styles: Record<string, any>;
}

class MobileExportService {
  // Main export function
  async exportToMobile(
    htmlContent: string,
    config: MobileExportConfig,
    projectName?: string
  ): Promise<{
    files: Record<string, string>;
    dependencies: string[];
    buildScripts: Record<string, string>;
    instructions: string[];
  }> {
    const cleanProjectName = projectName?.toLowerCase().replace(/\s+/g, '-') || 'noir-mobile-app';
    
    switch (config.platform) {
      case 'react-native':
        return this.exportToReactNative(htmlContent, config, cleanProjectName);
      case 'flutter':
        return this.exportToFlutter(htmlContent, config, cleanProjectName);
      case 'ios':
        return this.exportToiOS(htmlContent, config, cleanProjectName);
      case 'android':
        return this.exportToAndroid(htmlContent, config, cleanProjectName);
      default:
        return this.exportToReactNative(htmlContent, config, cleanProjectName);
    }
  }

  private async exportToReactNative(
    htmlContent: string,
    config: MobileExportConfig,
    projectName: string
  ): Promise<any> {
    const files: Record<string, string> = {};
    const dependencies = [
      'react',
      'react-native',
      '@react-navigation/native',
      '@react-navigation/stack',
      'react-native-gesture-handler',
      'react-native-screens',
      'react-native-safe-area-context',
    ];

    // Parse HTML and convert to React Native components
    const components = this.parseHTMLToComponents(htmlContent);

    // Generate App.js
    files['App.js'] = this.generateReactNativeApp(config);

    // Generate screens
    components.forEach((component) => {
      files[`src/screens/${component.name}.js`] = 
        this.convertToReactNativeComponent(component);
    });

    // Generate navigation
    if (config.includeNavigation) {
      files['src/navigation/AppNavigator.js'] = 
        this.generateReactNativeNavigation(components);
    }

    // Generate state management
    if (config.includeStateManagement) {
      files['src/store/index.js'] = this.generateReduxStore();
      dependencies.push('redux', 'react-redux', '@reduxjs/toolkit');
    }

    // Generate API service
    if (config.apiIntegration) {
      files['src/services/api.js'] = this.generateAPIService();
      dependencies.push('axios');
    }

    // Generate auth
    if (config.authentication) {
      files['src/services/auth.js'] = this.generateAuthService();
      dependencies.push('@react-native-async-storage/async-storage');
    }

    // Package.json
    files['package.json'] = JSON.stringify({
      name: projectName,
      version: '1.0.0',
      scripts: {
        start: 'react-native start',
        android: 'react-native run-android',
        ios: 'react-native run-ios',
        test: 'jest'
      },
      dependencies: dependencies.reduce((acc, dep) => ({ ...acc, [dep]: 'latest' }), {})
    }, null, 2);

    const instructions = [
      '1. Run: npm install',
      '2. For iOS: cd ios && pod install',
      '3. Start metro: npm start',
      '4. Run on device: npm run android (or ios)',
    ];

    return {
      files,
      dependencies,
      buildScripts: {
        android: 'react-native run-android',
        ios: 'react-native run-ios',
        start: 'react-native start'
      },
      instructions
    };
  }

  private generateReactNativeApp(config: MobileExportConfig): string {
    return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
${config.includeStateManagement ? "import { Provider } from 'react-redux';\nimport { store } from './src/store';" : ''}
${config.includeNavigation ? "import AppNavigator from './src/navigation/AppNavigator';" : "import HomeScreen from './src/screens/HomeScreen';"}

export default function App() {
  return (
    <SafeAreaProvider>
      ${config.includeStateManagement ? '<Provider store={store}>' : ''}
        <NavigationContainer>
          ${config.includeNavigation ? '<AppNavigator />' : '<HomeScreen />'}
        </NavigationContainer>
      ${config.includeStateManagement ? '</Provider>' : ''}
    </SafeAreaProvider>
  );
}
`;
  }

  private convertToReactNativeComponent(component: any): string {
    // Convert HTML elements to React Native components
    const rnStyles = this.convertCSSToReactNativeStyles(component.styles);
    
    return `import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const ${component.name} = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Generated from HTML */}
        <View style={styles.content}>
          ${this.convertHTMLToJSX(component.htmlContent)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
${rnStyles}
});

export default ${component.name};
`;
  }

  private convertCSSToReactNativeStyles(cssStyles: Record<string, any>): string {
    const styleMap: Record<string, string> = {
      'display': 'display',
      'flex-direction': 'flexDirection',
      'justify-content': 'justifyContent',
      'align-items': 'alignItems',
      'padding': 'padding',
      'margin': 'margin',
      'background-color': 'backgroundColor',
      'color': 'color',
      'font-size': 'fontSize',
      'font-weight': 'fontWeight',
      'border-radius': 'borderRadius',
      'width': 'width',
      'height': 'height',
    };

    return Object.entries(cssStyles)
      .map(([key, value]) => {
        const rnKey = styleMap[key] || key;
        return `  ${rnKey}: ${JSON.stringify(value)},`;
      })
      .join('\n');
  }

  private convertHTMLToJSX(html: string): string {
    // Simple HTML to React Native JSX conversion
    // This is a basic implementation - in production, use a proper HTML parser
    return html
      .replace(/<div/g, '<View')
      .replace(/<\/div>/g, '</View>')
      .replace(/<p/g, '<Text')
      .replace(/<\/p>/g, '</Text>')
      .replace(/<span/g, '<Text')
      .replace(/<\/span>/g, '</Text>')
      .replace(/<img/g, '<Image')
      .replace(/<button/g, '<TouchableOpacity')
      .replace(/<\/button>/g, '</TouchableOpacity>');
  }

  private generateReactNativeNavigation(components: any[]): string {
    const imports = components.map(c => 
      `import ${c.name} from '../screens/${c.name}';`
    ).join('\n');

    const screens = components.map(c => `
        <Stack.Screen 
          name="${c.name}" 
          component={${c.name}} 
          options={{ title: '${c.name}' }}
        />`).join('\n');

    return `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
${imports}

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      ${screens}
    </Stack.Navigator>
  );
};

export default AppNavigator;
`;
  }

  private generateReduxStore(): string {
    return `import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
});

export default store;
`;
  }

  private generateAPIService(): string {
    return `import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;
`;
  }

  private generateAuthService(): string {
    return `import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.token);
    return response;
  }

  async logout() {
    await AsyncStorage.removeItem('token');
  }

  async getToken() {
    return await AsyncStorage.getItem('token');
  }

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }
}

export default new AuthService();
`;
  }

  // Flutter Export
  private async exportToFlutter(
    htmlContent: string,
    config: MobileExportConfig,
    _projectName: string
  ): Promise<any> {
    const files: Record<string, string> = {};
    
    // Main.dart
    files['lib/main.dart'] = this.generateFlutterMain(config);
    
    // Screens
    const components = this.parseHTMLToComponents(htmlContent);
    components.forEach(component => {
      files[`lib/screens/${component.name.toLowerCase()}.dart`] = 
        this.convertToFlutterWidget(component);
    });

    // Navigation
    if (config.includeNavigation) {
      files['lib/navigation/app_router.dart'] = this.generateFlutterRouter(components);
    }

    // Pubspec.yaml
    files['pubspec.yaml'] = this.generateFlutterPubspec(config);

    const instructions = [
      '1. Run: flutter pub get',
      '2. Run: flutter run',
    ];

    return {
      files,
      dependencies: [],
      buildScripts: {
        run: 'flutter run',
        build: 'flutter build',
      },
      instructions
    };
  }

  private generateFlutterMain(config: MobileExportConfig): string {
    return `import 'package:flutter/material.dart';
${config.includeNavigation ? "import 'navigation/app_router.dart';" : "import 'screens/home.dart';"}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NOIR Mobile App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
      ),
      ${config.includeNavigation ? 'onGenerateRoute: AppRouter.generateRoute,' : 'home: const HomeScreen(),'}
    );
  }
}
`;
  }

  private convertToFlutterWidget(component: any): string {
    return `import 'package:flutter/material.dart';

class ${component.name} extends StatelessWidget {
  const ${component.name}({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${component.name}'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              // TODO: Convert HTML content to Flutter widgets
              Text('Content here'),
            ],
          ),
        ),
      ),
    );
  }
}
`;
  }

  private generateFlutterRouter(components: any[]): string {
    return `import 'package:flutter/material.dart';
${components.map(c => `import '../screens/${c.name.toLowerCase()}.dart';`).join('\n')}

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      ${components.map(c => `case '/${c.name.toLowerCase()}':\n        return MaterialPageRoute(builder: (_) => const ${c.name}());`).join('\n      ')}
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(child: Text('No route defined for \${settings.name}')),
          ),
        );
    }
  }
}
`;
  }

  private generateFlutterPubspec(config: MobileExportConfig): string {
    return `name: noir_mobile_app
description: Mobile app generated by NOIR AI

publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: ">=2.17.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2
  ${config.includeNavigation ? 'go_router: ^10.0.0' : ''}
  ${config.includeStateManagement ? 'flutter_bloc: ^8.1.0' : ''}
  ${config.apiIntegration ? 'dio: ^5.0.0' : ''}

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
`;
  }

  // iOS Native Export (SwiftUI)
  private async exportToiOS(
    _htmlContent: string,
    _config: MobileExportConfig,
    _projectName: string
  ): Promise<any> {
    return {
      files: {
        'ContentView.swift': this.generateSwiftUIView(),
      },
      dependencies: [],
      buildScripts: {},
      instructions: [
        '1. Open in Xcode',
        '2. Build and run on simulator or device',
      ]
    };
  }

  private generateSwiftUIView(): string {
    return `import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Hello, NOIR!")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    // Add your content here
                }
                .padding()
            }
            .navigationTitle("Home")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
`;
  }

  // Android Native Export (Jetpack Compose)
  private async exportToAndroid(
    _htmlContent: string,
    _config: MobileExportConfig,
    _projectName: string
  ): Promise<any> {
    return {
      files: {
        'MainActivity.kt': this.generateComposeActivity(),
      },
      dependencies: [],
      buildScripts: {},
      instructions: [
        '1. Open in Android Studio',
        '2. Sync Gradle',
        '3. Run on emulator or device',
      ]
    };
  }

  private generateComposeActivity(): string {
    return `package com.example.noirapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    HomeScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("NOIR App") }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = "Hello, NOIR!",
                style = MaterialTheme.typography.headlineLarge
            )
            
            // Add your content here
        }
    }
}
`;
  }

  // Helper: Parse HTML to extract components/screens
  private parseHTMLToComponents(html: string): any[] {
    // Simple parsing - in production, use a proper HTML parser
    // This extracts what looks like screens/pages from the HTML
    const components: any[] = [];
    
    // Look for sections that could be screens
    const sectionRegex = /<section[^>]*id="([^"]+)"[^>]*>/gi;
    let match;

    while ((match = sectionRegex.exec(html)) !== null) {
      components.push({
        name: this.capitalize(match[1].replace(/-/g, '')),
        route: `/${match[1]}`,
        htmlContent: html.substring(match.index, html.indexOf('</section>', match.index) + 10),
        styles: {}
      });
    }
    
    // If no sections found, create a single Home screen
    if (components.length === 0) {
      components.push({
        name: 'Home',
        route: '/',
        htmlContent: html,
        styles: {}
      });
    }
    
    return components;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Get build instructions
  getBuildInstructions(platform: MobilePlatform): string[] {
    const instructions: Record<MobilePlatform, string[]> = {
      'react-native': [
        'Prerequisites: Node.js, React Native CLI, Android Studio / Xcode',
        '1. npm install',
        '2. npx react-native start (Metro bundler)',
        '3. npx react-native run-android (or run-ios)',
        'For production: npx react-native build-android --mode=release',
      ],
      'flutter': [
        'Prerequisites: Flutter SDK, Android Studio / Xcode',
        '1. flutter pub get',
        '2. flutter run',
        'For production: flutter build apk (Android) or flutter build ios (iOS)',
      ],
      'ios': [
        'Prerequisites: Xcode, macOS',
        '1. Open .xcodeproj in Xcode',
        '2. Select target device/simulator',
        '3. Press Run (Cmd+R)',
      ],
      'android': [
        'Prerequisites: Android Studio, Android SDK',
        '1. Open project in Android Studio',
        '2. Sync Gradle',
        '3. Run on device/emulator',
      ],
    };

    return instructions[platform];
  }

  // Estimate build size
  estimateBuildSize(platform: MobilePlatform): string {
    const sizes: Record<MobilePlatform, string> = {
      'react-native': '35-50 MB',
      'flutter': '15-25 MB',
      'ios': '20-40 MB',
      'android': '15-30 MB',
    };

    return sizes[platform];
  }
}

export const mobileExportService = new MobileExportService();
