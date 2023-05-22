package main

import (
	"fmt"
	"strings"
	"time"

	cpus "github.com/shirou/gopsutil/cpu"
	disk "github.com/shirou/gopsutil/disk"
	mem "github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/net"

	socket "github.com/gorilla/websocket"
)

type SystemInfo struct {
	CpuName          string  `json:"cpu_name,omitempty"`
	CurrentFreq      float64 `json:"current_freq,omitempty"`
	Cores            int64   `json:"cores,omitempty"`
	CpuUsage         int64   `json:"cpu_usage,omitempty"`
	MemCapacity      string  `json:"mem_capacity,omitempty"`
	MemUsage         string  `json:"mem_usage,omitempty"`
	MemUsagePercent  int64   `json:"mem_usage_percent,omitempty"`
	DiskCapacity     string  `json:"disk_capacity,omitempty"`
	DiskUsage        string  `json:"disk_usage,omitempty"`
	DiskUsagePercent int64   `json:"disk_usage_percent,omitempty"`
	NetIO            NetIO   `json:"net_io,omitempty"`
}

type NetIO struct {
	BytesSent string `json:"bytes_sent,omitempty"`
	BytesRecv string `json:"bytes_recv,omitempty"`
}

func BytesSI(b uint64) string {
	const unit = 1000
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := uint64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(b)/float64(div), "kMGTPE"[exp])
}

func GetSystemInfo() SystemInfo {
	cpuName, _ := cpus.Info()
	cpuUsage, _ := cpus.Percent(0, false)
	memInfo, _ := mem.VirtualMemory()
	diskInfo, _ := disk.Usage("/")
	info := SystemInfo{
		CpuName:          "Unknown",
		CpuUsage:         int64(cpuUsage[0]),
		MemCapacity:      BytesSI(memInfo.Total),
		MemUsage:         BytesSI(memInfo.Used),
		MemUsagePercent:  int64(memInfo.UsedPercent),
		DiskCapacity:     BytesSI(diskInfo.Total),
		DiskUsage:        BytesSI(diskInfo.Used),
		DiskUsagePercent: int64(diskInfo.UsedPercent),
	}
	if len(cpuName) > 0 {
		info.CpuName = strings.Replace(strings.TrimSpace(cpuName[0].ModelName), "CPU", "", -1) + " @" + fmt.Sprintf("%.2f", cpuName[0].Mhz/1000) + "GHz(" + fmt.Sprintf("%d", cpuName[0].Cores) + ")"
		info.CurrentFreq = cpuName[0].Mhz / 1000
		info.Cores = int64(cpuName[0].Cores)
	}

	netIO, _ := net.IOCounters(false)
	if len(netIO) > 0 {
		info.NetIO = NetIO{
			BytesSent: BytesSI(netIO[0].BytesSent),
			BytesRecv: BytesSI(netIO[0].BytesRecv),
		}
	}
	return info
}

func GetSystemInfoWS(conn *socket.Conn) {
	for {
		info := GetSystemInfo()
		conn.WriteJSON(info)
		time.Sleep(1 * time.Second)
	}
}

func GetTorrentsWS(conn *socket.Conn) {
	for {
		torrents := Tclient.ListTorrents()
		shouldCache := false
		if len(ActiveOrder) == 0 {
			shouldCache = true
		}
		var activeTorrents []ActiveTorrent
		for _, t := range torrents {
			if shouldCache {
				ActiveOrder[t.ID()] = len(ActiveOrder)
			}
			activeTorr := ActiveTorrent{}
			activeTorr.FromTorrent(t)
			activeTorrents = append(activeTorrents, activeTorr)
		}
		conn.WriteJSON(activeTorrents)
		time.Sleep(1 * time.Second)
	}
}
