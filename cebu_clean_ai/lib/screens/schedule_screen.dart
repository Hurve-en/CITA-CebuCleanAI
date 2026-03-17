import 'package:flutter/material.dart';

import '../services/api_service.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  final _api = ApiService();
  late Future<List<CollectionSchedule>> _schedules;

  @override
  void initState() {
    super.initState();
    _schedules = _api.fetchCollectionSchedules();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pickups & Alerts'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Your barangay schedule', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            FutureBuilder<List<CollectionSchedule>>(
              future: _schedules,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                final data = snapshot.data ?? [];
                if (data.isEmpty) {
                  return const Text('No schedule found. Connect to backend to sync.');
                }
                return Column(
                  children: data
                      .map(
                        (s) => Card(
                          child: ListTile(
                            leading: Icon(s.type == 'recyclable' ? Icons.recycling : Icons.delete_outline),
                            title: Text('${s.type.toUpperCase()} • ${s.day}'),
                            subtitle: Text('Time: ${s.window}\nNotes: ${s.notes}'),
                          ),
                        ),
                      )
                      .toList(),
                );
              },
            ),
            const SizedBox(height: 16),
            Text('Push notifications', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            const Text(
              'Connect Firebase Cloud Messaging or AWS SNS for live pickup alerts. This screen will listen for topics per barangay.',
            ),
          ],
        ),
      ),
    );
  }
}
