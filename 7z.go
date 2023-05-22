package main

import (
	"bufio"
	"os/exec"
	"regexp"
)

type ZipProcess struct {
	Cmd      *exec.Cmd
	InName   string
	OutName  string
	Progress string
}

func (z *ZipProcess) Start() {
	z.Cmd = exec.Command("7z", "a", "-bsp1", "-t7z", "-mx=1", z.OutName, z.InName)

	stderr, _ := z.Cmd.StdoutPipe()
	z.Cmd.Start()

	re := regexp.MustCompile(`(\d+?)%`)

	scanner := bufio.NewScanner(stderr)
	scanner.Split(bufio.ScanWords)
	for scanner.Scan() {
		m := scanner.Text()
		if re.MatchString(m) {
			z.Progress = m
		}
	}
	z.Cmd.Wait()
}

func (z *ZipProcess) Stop() {
	z.Cmd.Process.Kill()
}

func CreateZip(inName, outName string) *ZipProcess {
	z := &ZipProcess{InName: inName, OutName: outName}
	go z.Start()
	return z
}
