import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

import 'screens/rewards_screen.dart';
import 'screens/scan_screen.dart';
import 'screens/schedule_screen.dart';
import 'screens/status_screen.dart';

late List<CameraDescription> cameras; // Populated once at startup

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  cameras = await availableCameras();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartBin Cebu',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green.shade600),
        useMaterial3: true,
        textTheme: const TextTheme(
          headlineMedium: TextStyle(fontWeight: FontWeight.bold),
          titleMedium: TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
      home: const RootShell(),
    );
  }
}

class RootShell extends StatefulWidget {
  const RootShell({super.key});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  int _index = 0;

  final _screens = const [
    ScanScreen(),
    RewardsScreen(),
    ScheduleScreen(),
    StatusScreen(),
  ];

  final _labels = const [
    'Scan',
    'Rewards',
    'Schedule',
    'Status',
  ];

  final _icons = const [
    Icons.camera_alt_outlined,
    Icons.emoji_events_outlined,
    Icons.notifications_active_outlined,
    Icons.sensors_outlined,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: _screens[_index]),
      bottomNavigationBar: NavigationBar(
        height: 68,
        labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
        selectedIndex: _index,
        onDestinationSelected: (idx) => setState(() => _index = idx),
        destinations: List.generate(_labels.length, (i) {
          return NavigationDestination(
            icon: Icon(_icons[i]),
            label: _labels[i],
          );
        }),
      ),
    );
  }
}
