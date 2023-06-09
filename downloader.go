package main

import (
	"fmt"
	"path/filepath"
	"sort"
	"strings"

	t "github.com/cenkalti/rain/torrent"
)

var ActiveOrder = make(map[string]int)

var Tclient = func() *t.Session {
	cfg := t.DefaultConfig
	cfg.Database = "./torrents.db"
	cfg.DataDir = "./data"

	if c, err := t.NewSession(cfg); err != nil {
		panic(err)
	} else {
		return c
	}
}()

type Downloader struct {
	Addr string
}

func NewDownloader(url string) *Downloader {
	return &Downloader{
		Addr: url,
	}
}

func (d *Downloader) IsMagnet() bool {
	return strings.HasPrefix(d.Addr, "magnet:")
}

func (d *Downloader) IsTorrent() bool {
	return strings.HasSuffix(d.Addr, ".torrent")
}

func (d *Downloader) Start() (*t.Torrent, error) {
	if d.IsMagnet() {
		return Tclient.AddURI(d.Addr, &t.AddTorrentOptions{})
	} else if d.IsTorrent() {
		return nil, fmt.Errorf("not implemented")
	}
	return nil, fmt.Errorf("not supported")
}

type ActiveTorrent struct {
	ID            string        `json:"id,omitempty"`
	OrderID       int           `json:"order_id,omitempty"` // used for sorting
	Name          string        `json:"name,omitempty"`
	TotalSize     string        `json:"total_size,omitempty"`
	Downloaded    string        `json:"downloaded,omitempty"`
	Percentage    string        `json:"percentage,omitempty"`
	DownloadSpeed string        `json:"download_speed,omitempty"`
	Seeders       int           `json:"seeders,omitempty"`
	Peers         int           `json:"peers,omitempty"`
	Eta           string        `json:"eta,omitempty"`
	Files         []torrentFile `json:"files,omitempty"`
}

func (t *ActiveTorrent) FromTorrent(torrent *t.Torrent) {
	ts := torrent.Stats()
	t.ID = torrent.ID()
	t.Name = ts.Name
	t.TotalSize = BytesSI(uint64(ts.Bytes.Total))
	t.Downloaded = BytesSI(uint64(ts.Bytes.Completed))
	if ts.Bytes.Total == 0 {
		t.Percentage = "0"
	} else {
		t.Percentage = fmt.Sprintf("%.2f", float64(ts.Bytes.Completed)/float64(ts.Bytes.Total)*100)
	}
	t.DownloadSpeed = BytesSI(uint64(ts.Speed.Download))
	t.Peers = ts.Peers.Total
	if ts.ETA != nil {
		t.Eta = ts.ETA.String()
	}
	if orderId, ok := ActiveOrder[t.ID]; ok {
		t.OrderID = orderId + 1
	}
	if tf := getTorrentFilesList(torrent); len(tf) > 0 {
		t.Files = tf
	}
}

func sortTorrents(ts []ActiveTorrent) []ActiveTorrent {
	// sort alphabatically based on torrent OrderID, to prevent inteference in Website
	sort.SliceStable(ts, func(i, j int) bool {
		return ts[i].OrderID < ts[j].OrderID
	})
	return ts
}

type torrentFile struct {
	Name string `json:"name,omitempty"`
	Path string `json:"path,omitempty"`
	Size string `json:"size,omitempty"`
}

func getTorrentFilesList(torrent *t.Torrent) []torrentFile {
	var files []torrentFile
	torrF, err := torrent.Files()
	if err != nil {
		return files
	}
	for _, f := range torrF {
		files = append(files, torrentFile{
			Path: f.Path(),
			Size: BytesSI(uint64(f.Stats().BytesCompleted)),
			Name: filepath.Base(f.Path()),
		})
	}
	return files
}
