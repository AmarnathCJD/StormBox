package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gorilla/websocket"
)

func main() {
	regsiterHTTPHandles()
	setupWS()
	http.ListenAndServe(":8000", nil)
}

func regsiterHTTPHandles() {
	http.HandleFunc("/api/system", func(w http.ResponseWriter, r *http.Request) {
		info := GetSystemInfo()
		b, _ := json.Marshal(info)
		fmt.Fprint(w, string(b))
	})
	http.HandleFunc("/api/torrents/add", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		magnet := r.Form.Get("magnet")
		if magnet == "" {
			http.Error(w, `{"error": "magnet is empty"}`, http.StatusBadRequest)
			return
		}
		d := NewDownloader(magnet)
		t, err := d.Start()
		if nil != err {
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusBadRequest)
			return
		}
		ActiveOrder[t.ID()] = len(ActiveOrder)
		fmt.Fprintf(w, `{"id": "%s"}`, t.ID())
	})

	http.HandleFunc("/api/torrents/delete", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		id := r.Form.Get("id")
		if id == "" {
			http.Error(w, `{"error": "id is empty"}`, http.StatusBadRequest)
			return
		}
		if err := Tclient.RemoveTorrent(id); nil != err {
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusBadRequest)
			return
		}
		delete(ActiveOrder, id)
		fmt.Fprintf(w, `{"id": "%s"}`, id)
	})

	http.HandleFunc("/api/torrents/pause", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		id := r.Form.Get("id")
		if id == "" {
			http.Error(w, `{"error": "id is empty"}`, http.StatusBadRequest)
			return
		}
		if err := Tclient.GetTorrent(id).Stop(); nil != err {
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusBadRequest)
			return
		}
		fmt.Fprintf(w, `{"status": "paused"}`)
	})

	http.HandleFunc("/api/torrents/resume", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		id := r.Form.Get("id")
		if id == "" {
			http.Error(w, `{"error": "id is empty"}`, http.StatusBadRequest)
			return
		}
		if err := Tclient.GetTorrent(id).Start(); nil != err {
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusBadRequest)
			return
		}
		fmt.Fprintf(w, `{"status": "resumed"}`)
	})

	http.HandleFunc("/api/torrents/list", func(w http.ResponseWriter, r *http.Request) {
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
		b, err := json.Marshal(sortTorrents(activeTorrents))
		if nil != err {
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusBadRequest)
			return
		}
		fmt.Fprint(w, string(b))
	})

	http.HandleFunc("/api/torrents/files", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		id := r.Form.Get("id")
		if id == "" {
			http.Error(w, `{"error": "id is empty"}`, http.StatusBadRequest)
			return
		}
		t := Tclient.GetTorrent(id)
		if nil == t {
			http.Error(w, `{"error": "torrent not found"}`, http.StatusBadRequest)
			return
		}
		files := getTorrentFilesList(t)
		b, err := json.Marshal(files)
		if nil != err {
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusBadRequest)
			return
		}
		fmt.Fprint(w, string(b))
	})

	http.HandleFunc("/api/torrents/files/download", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		file_path := r.Form.Get("file_name")
		id := r.Form.Get("id")
		torrent_name := r.Form.Get("torrent_name")
		if file_path == "" {
			http.Error(w, `{"error": "file_path is empty"}`, http.StatusBadRequest)
			return
		}
		fmt.Println("Downloading file", filepath.Join("data", id, torrent_name, file_path))
		abs_path := filepath.Join("data", file_path)
		http.ServeFile(w, r, abs_path)
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./assets/index.html")
	})

	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets"))))
}

func setupWS() {
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if nil != err {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Println("New connection from", conn.RemoteAddr())
		go GetSystemInfoWS(conn)
	})
	http.HandleFunc("/ws/torrents", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if nil != err {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		go GetTorrentsWS(conn)
	})
}
