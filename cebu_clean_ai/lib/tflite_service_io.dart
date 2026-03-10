import 'package:image/image.dart' as img_lib;
import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'dart:io';

class TfliteService {
  Interpreter? _interpreter;
  List<String> _labels = [];
  bool _loaded = false;

  bool get isLoaded => _loaded;

  Future<void> loadModel() async {
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

      _loaded = true;
    } catch (e) {
      _loaded = false;
      rethrow;
    }
  }

  Future<String> classifyImage(String imagePath) async {
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

  void dispose() {
    _interpreter?.close();
  }
}
