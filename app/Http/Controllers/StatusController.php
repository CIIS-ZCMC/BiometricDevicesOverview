<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use TADPHP\TADFactory;

class StatusController extends Controller
{
    public static function Connect(array|object $device)
    {
        try {
            $options = [
                'ip' => (string)$device['ip_address'],
                'com_key' => (int)$device['com_key'],
                'description' => 'TAD1',
                'soap_port' => (int)$device['soap_port'],
                'udp_port' => (int)$device['udp_port'],
                'encoding' => 'utf-8'
            ];
            $tad_factory = new TADFactory($options);
            $tad = $tad_factory->get_instance();
            if ($tad->is_alive()) {
                return $tad;
            }
        } catch (\Throwable $th) {
            return false;
        }
    }

    public function deviceList(): JsonResponse
    {
        $devices = \App\Models\Devices::where('is_active', true)->get();
        return response()->json([
            'devices' => $devices,
        ]);
    }

    public function index(): JsonResponse
    {

        $devices = \App\Models\Devices::where('is_active', true)->get();
        $connectedDevices = [];
        $onlineDevices = 0;
        $offlineDevices = 0;
        $totalDevices = $devices->count();
        foreach ($devices as $device) {
            $tad = self::Connect($device);

            if ($tad) {
                $onlineDevices++;
            } else {
                $offlineDevices++;
            }

            $connectedDevices[] = [
                'deviceID' => $device->id,
                'connected' => $tad ? true : false,
            ];
        }
        return response()->json([
            'devices' => $connectedDevices,
            'onlineDevices' => $onlineDevices,
            'offlineDevices' => $offlineDevices,
            'totalDevices' => $totalDevices,
        ]);
    }
}
