import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'tflite_service.dart';

late List<CameraDescription> cameras; // Global variable for cameras

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Get list of available cameras
  cameras = await availableCameras();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CebuCleanAI',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CebuCleanAI'),
        backgroundColor: Colors.green[700],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.recycling, size: 120, color: Colors.green),
            const SizedBox(height: 20),
            const Text(
              'Scan your waste and help clean Cebu!',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: () {
                // Open camera screen
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CameraScreen()),
                );
              },
              icon: const Icon(Icons.camera_alt),
              label: const Text('Scan Waste', style: TextStyle(fontSize: 18)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 20,
                ),
                backgroundColor: Colors.green[600],
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  final TfliteService _tflite = TfliteService();

  @override
  void initState() {
    super.initState();

    // Use the first rear camera (back camera)
    final firstCamera = cameras.firstWhere(
      (camera) => camera.lensDirection == CameraLensDirection.back,
      orElse: () => cameras.first,
    );

    _controller = CameraController(firstCamera, ResolutionPreset.high);

    _initializeControllerFuture = _controller.initialize();
    _tflite.loadModel();
  }

  @override
  void dispose() {
    _tflite.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Camera')),
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return CameraPreview(_controller);
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final messenger = ScaffoldMessenger.of(context);
          try {
            await _initializeControllerFuture;
            final XFile photo = await _controller.takePicture();

            if (!_tflite.isLoaded) {
              if (!mounted) return;
              messenger.showSnackBar(
                const SnackBar(content: Text('Model still loading...')),
              );
              return;
            }

            final String result = await _tflite.classifyImage(photo.path);

            if (!mounted) return;
            messenger.showSnackBar(
              SnackBar(content: Text('Detected: $result')),
            );
          } catch (e) {
            debugPrint('$e');
          }
        },
        child: const Icon(Icons.camera),
      ),
    );
  }
}
