import 'package:flutter/material.dart';

import '../services/api_service.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  final _api = ApiService();
  int _points = 120;
  bool _loading = false;

  final _missions = const [
    'Scan 3 recyclables today',
    'Report one overflowing bin',
    'Share a recycling tip with neighbors',
  ];

  Future<void> _syncPoints() async {
    setState(() => _loading = true);
    try {
      final refreshed = await _api.fetchRewardPoints();
      setState(() => _points = refreshed);
    } catch (_) {
      // Keep offline points; API is optional for MVP
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rewards'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: _loading ? null : _syncPoints,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F9B0F), Color(0xFF1E5128)],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Eco Points',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white70),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _points.toString(),
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Redeem for transit credits, water refills, or barangay badges.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text("Today's Missions", style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            ..._missions.map(
              (mission) => Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  leading: const Icon(Icons.check_circle_outline),
                  title: Text(mission),
                  subtitle: const Text('Complete to earn +20 pts'),
                  trailing: IconButton(
                    icon: const Icon(Icons.playlist_add_check_outlined),
                    onPressed: () {
                      setState(() => _points += 20);
                    },
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text('Recent activity', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Expanded(
              child: ListView(
                children: const [
                  ListTile(
                    leading: Icon(Icons.camera_alt_outlined),
                    title: Text('Plastic bottle classified'),
                    subtitle: Text('You earned +10 pts'),
                  ),
                  ListTile(
                    leading: Icon(Icons.report_outlined),
                    title: Text('Overflowing bin reported'),
                    subtitle: Text('+30 pts — forwarded to barangay'),
                  ),
                  ListTile(
                    leading: Icon(Icons.recycling_outlined),
                    title: Text('Clean-up drive check-in'),
                    subtitle: Text('+50 pts — Carbon Market cleanup'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
