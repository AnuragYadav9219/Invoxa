package com.invoice.tracker.helper.auth;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class DeviceHelper {

    public String getDeviceId(String deviceId) {
        return (deviceId != null && !deviceId.isBlank())
                ? deviceId
                : UUID.randomUUID().toString();
    }

    public String getDeviceName(String deviceName) {
        return (deviceName != null && !deviceName.isBlank())
                ? deviceName
                : "Unknown Device";
    }
}
