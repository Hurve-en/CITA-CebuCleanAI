import 'dart:convert';

import 'package:http/http.dart' as http;

/// Minimal REST client for the Nest/FastAPI backend stubs.
class ApiService {
  static String baseUrl = const String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3001/api',
  );
  static String? _token;

  static void overrideBase(String url) => baseUrl = url;

  Future<void> _ensureToken() async {
    if (_token != null) return;
    final res = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': 'resident@example.com'}),
    );
    if (res.statusCode == 200) {
      final json = jsonDecode(res.body) as Map<String, dynamic>;
      _token = json['access_token'] as String?;
    }
  }

  Map<String, String> _headers() => {
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  Future<List<BinStatus>> fetchBins() async {
    await _ensureToken();
    final res = await http.get(Uri.parse('$baseUrl/bins'), headers: _headers());
    if (res.statusCode != 200) return _mockBins();
    final List<dynamic> payload = jsonDecode(res.body) as List<dynamic>;
    return payload.map((json) => BinStatus.fromJson(json)).toList();
  }

  Future<int> fetchRewardPoints() async {
    await _ensureToken();
    final res = await http.get(Uri.parse('$baseUrl/rewards/points'), headers: _headers());
    if (res.statusCode != 200) return 120;
    final json = jsonDecode(res.body) as Map<String, dynamic>;
    return json['points'] as int? ?? 120;
  }

  Future<List<CollectionSchedule>> fetchCollectionSchedules() async {
    await _ensureToken();
    final res = await http.get(Uri.parse('$baseUrl/schedules'), headers: _headers());
    if (res.statusCode != 200) return _mockSchedule();
    final List<dynamic> payload = jsonDecode(res.body) as List<dynamic>;
    return payload.map((j) => CollectionSchedule.fromJson(j)).toList();
  }

  // Local fallback data for offline demos
  List<BinStatus> _mockBins() => [
        BinStatus(
          code: 'CB-101',
          barangay: 'Lahug',
          fillLevel: 76,
          status: 'online',
          latitude: 10.332,
          longitude: 123.897,
          temperature: 32.1,
          collectionEtaMinutes: 14,
        ),
        BinStatus(
          code: 'CB-204',
          barangay: 'Carbon',
          fillLevel: 92,
          status: 'alert',
          latitude: 10.296,
          longitude: 123.902,
          temperature: 35.4,
          collectionEtaMinutes: 6,
        ),
      ];

  List<CollectionSchedule> _mockSchedule() => [
        CollectionSchedule(
          day: 'Mon / Thu',
          type: 'recyclable',
          window: '6:00–8:00 AM',
          notes: 'Set out blue bags only',
        ),
        CollectionSchedule(
          day: 'Tue / Fri',
          type: 'residual',
          window: '7:00–9:00 PM',
          notes: 'Seal bags to prevent stray cats',
        ),
      ];
}

class BinStatus {
  final String code;
  final String barangay;
  final double fillLevel;
  final String status;
  final double latitude;
  final double longitude;
  final double temperature;
  final int collectionEtaMinutes;

  BinStatus({
    required this.code,
    required this.barangay,
    required this.fillLevel,
    required this.status,
    required this.latitude,
    required this.longitude,
    required this.temperature,
    required this.collectionEtaMinutes,
  });

  factory BinStatus.fromJson(Map<String, dynamic> json) => BinStatus(
        code: json['code'] as String,
        barangay: json['barangay'] as String,
        fillLevel: (json['fillLevel'] as num).toDouble(),
        status: json['status'] as String,
        latitude: (json['latitude'] as num).toDouble(),
        longitude: (json['longitude'] as num).toDouble(),
        temperature: (json['temperature'] as num).toDouble(),
        collectionEtaMinutes: (json['collectionEtaMinutes'] as num).toInt(),
      );
}

class CollectionSchedule {
  final String day;
  final String type;
  final String window;
  final String notes;

  CollectionSchedule({
    required this.day,
    required this.type,
    required this.window,
    required this.notes,
  });

  factory CollectionSchedule.fromJson(Map<String, dynamic> json) =>
      CollectionSchedule(
        day: json['day'] as String,
        type: json['type'] as String,
        window: json['window'] as String,
        notes: json['notes'] as String? ?? '',
      );
}
