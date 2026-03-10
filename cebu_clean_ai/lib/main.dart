import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:image/image.dart' as img_lib;
import 'package:tflite_flutter/tflite_flutter.dart';
import 'dart:io';

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
  Interpreter? _interpreter;
  List<String> _labels = [];
  bool _modelLoaded = false;

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
    _loadModel();
  }

  @override
  void dispose() {
    _interpreter?.close();
    _controller.dispose();
    super.dispose();
  }

  Future<void> _loadModel() async {
    try {
      _interpreter = await Interpreter.fromAsset(
        'assets/models/garbage_model.tflite',
      );

      final labelsString = await rootBundle.loadString(
        'assets/models/labels.txt',
      );
      _labels = labelsString
          .split('\n')
          .where((line) => line.trim().isNotEmpty)
          .toList();

      if (!mounted) return;
      setState(() {
        _modelLoaded = true;
      });
      debugPrint('Model loaded! ${_labels.length} classes: $_labels');
    } catch (e) {
      debugPrint('Error loading model: $e');
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Model load failed: $e')),
      );
    }
  }

  Future<String> _classifyImage(String imagePath) async {
    if (_interpreter == null) return 'Model not ready';
    if (_labels.isEmpty) return 'No labels loaded';

    final img_lib.Image? image = img_lib.decodeImage(
      File(imagePath).readAsBytesSync(),
    );
    if (image == null) return 'Image decode failed';

    final inputShape = _interpreter!.getInputTensor(0).shape;
    final inputHeight = inputShape[1];
    final inputWidth = inputShape[2];
    final resized = img_lib.copyResize(
      image,
      width: inputWidth,
      height: inputHeight,
    );

    final input = [
      List.generate(
        inputHeight,
        (y) => List.generate(
          inputWidth,
          (x) {
            final pixel = resized.getPixel(x, y);
            return <double>[
              pixel.r.toDouble() / 255.0,
              pixel.g.toDouble() / 255.0,
              pixel.b.toDouble() / 255.0,
            ];
          },
        ),
      ),
    ];

    final outputShape = _interpreter!.getOutputTensor(0).shape;
    final numClasses = outputShape.last;
    final output = [List<double>.filled(numClasses, 0)];

    _interpreter!.run(input, output);

    int maxIndex = 0;
    double maxConfidence = output[0][0];
    for (int i = 1; i < output[0].length; i++) {
      if (output[0][i] > maxConfidence) {
        maxConfidence = output[0][i];
        maxIndex = i;
      }
    }

    final label = maxIndex < _labels.length ? _labels[maxIndex] : 'Class $maxIndex';
    final confidence = (maxConfidence * 100).toStringAsFixed(1);

    return '$label ($confidence%)';
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

            if (!_modelLoaded) {
              if (!mounted) return;
              messenger.showSnackBar(
                const SnackBar(content: Text('Model still loading...')),
              );
              return;
            }

            final String result = await _classifyImage(photo.path);

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
