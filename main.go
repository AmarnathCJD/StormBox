package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

func main() {
	regsiterHTTPHandles()
	setupWS()
	http.ListenAndServe(":8080", nil)
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
		ActiveOrder[t.ID()] = len(ActiveOrder)
		if nil != err {
			http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusBadRequest)
			return
		}
		fmt.Fprintf(w, `StormBox - INFO: Torrent %s added`, t.Name())
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
