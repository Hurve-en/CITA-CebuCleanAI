import 'package:flutter/material.dart';

import '../services/api_service.dart';

class StatusScreen extends StatefulWidget {
  const StatusScreen({super.key});

  @override
  State<StatusScreen> createState() => _StatusScreenState();
}

class _StatusScreenState extends State<StatusScreen> {
  final _api = ApiService();
  late Future<List<BinStatus>> _bins;

  @override
  void initState() {
    super.initState();
    _bins = _api.fetchBins();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Bin Status'),
        centerTitle: true,
      ),
      body: RefreshIndicator(
        onRefresh: () async => setState(() => _bins = _api.fetchBins()),
        child: FutureBuilder<List<BinStatus>>(
          future: _bins,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            final data = snapshot.data ?? [];
            if (data.isEmpty) {
              return const ListTile(
                leading: Icon(Icons.sensors_off_outlined),
                title: Text('No bins online'),
                subtitle: Text('Run the IoT simulator or connect MQTT.'),
              );
            }
            return ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: data.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final bin = data[index];
                return Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: bin.fillLevel > 80
                          ? Colors.red.shade100
                          : Colors.green.shade100,
                      child: Icon(
                        bin.fillLevel > 80
                            ? Icons.warning_amber_rounded
                            : Icons.sensors_outlined,
                        color: Colors.black87,
                      ),
                    ),
                    title: Text('Bin ${bin.code} • ${bin.barangay}'),
                    subtitle: Text(
                      'Fill: ${bin.fillLevel.toStringAsFixed(0)}%\nTemp: ${bin.temperature.toStringAsFixed(1)}°C • GPS: ${bin.latitude.toStringAsFixed(3)}, ${bin.longitude.toStringAsFixed(3)}',
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(bin.status.toUpperCase()),
                        Text('ETA: ${bin.collectionEtaMinutes}m'),
                      ],
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
