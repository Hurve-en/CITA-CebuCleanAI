class TfliteService {
  bool _loaded = false;

  bool get isLoaded => _loaded;

  Future<void> loadModel() async {
    // No-op on web; tflite_flutter depends on dart:ffi which is unavailable.
    _loaded = true;
  }

  Future<String> classifyImage(String imagePath) async {
    return 'TensorFlow Lite is not supported on web builds. Please run on Android, iOS, or macOS.';
  }

  void dispose() {}
}
