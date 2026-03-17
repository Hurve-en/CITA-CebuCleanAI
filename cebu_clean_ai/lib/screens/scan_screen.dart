import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../main.dart';
import '../tflite_service.dart';

/// Camera + on-device TFLite waste classification.
class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  final TfliteService _tflite = TfliteService();
  String _lastResult = 'Point at an item and tap capture';
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    if (kIsWeb) return; // Camera plugin not supported on web in this setup
    final firstRearCamera = cameras.firstWhere(
      (c) => c.lensDirection == CameraLensDirection.back,
      orElse: () => cameras.first,
    );
    _controller = CameraController(firstRearCamera, ResolutionPreset.medium);
    _initializeControllerFuture = _controller.initialize().catchError((e) {
      setState(() => _error = 'Camera failed: $e');
    });
    _tflite.loadModel();
  }

  @override
  void dispose() {
    _tflite.dispose();
    if (!kIsWeb) {
      _controller.dispose();
    }
    super.dispose();
  }

  Future<void> _captureAndClassify() async {
    final messenger = ScaffoldMessenger.of(context);
    setState(() => _loading = true);
    try {
      await _initializeControllerFuture;
      final XFile photo = await _controller.takePicture();

      if (!_tflite.isLoaded) {
        messenger.showSnackBar(
          const SnackBar(content: Text('Model still loading...')),
        );
        return;
      }

      final result = await _tflite.classifyImage(photo.path);
      setState(() => _lastResult = result);
    } catch (e) {
      messenger.showSnackBar(
        SnackBar(content: Text('Capture failed: $e')),
      );
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Scan Waste'),
          centerTitle: true,
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.cloud_off, size: 72, color: Colors.grey),
              const SizedBox(height: 12),
              Text(
                'Camera scanning is not available on web builds.\nRun on iOS, Android, or macOS for live classification.',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 12),
              const Text('Tip: serve over HTTPS and enable camera permissions if you want to experiment with camera_web.'),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan Waste'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: FutureBuilder<void>(
              future: _initializeControllerFuture,
              builder: (context, snapshot) {
                if (_error != null) {
                  return Center(
                    child: Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: Colors.red)),
                  );
                }
                if (snapshot.connectionState == ConnectionState.done) {
                  return ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      bottom: Radius.circular(24),
                    ),
                    child: CameraPreview(_controller),
                  );
                }
                return const Center(child: CircularProgressIndicator());
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Result',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(_lastResult),
                ),
                const SizedBox(height: 12),
                FilledButton.icon(
                  onPressed: _loading ? null : _captureAndClassify,
                  icon: const Icon(Icons.camera_alt),
                  label: Text(_loading ? 'Capturing...' : 'Capture & Classify'),
                  style: FilledButton.styleFrom(
                    minimumSize: const Size.fromHeight(48),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Tip: good lighting improves accuracy. Results power your rewards and bin routing.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
