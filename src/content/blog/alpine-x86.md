---

author: Akari
pubDatetime: 2023-11-30
title: Install alpine_x86_64 qemu on Archlnux
featured: true
draft: true
tags:

- termux
- alpine
- qemu
- archlnux
  description: How to install alpine on archlinux with qemu.

## Install alpine_x86_64 qemu

### install iso alpine

```
mkdir alpine
cd alpine
wget http://dl-cdn.alpinelinux.org/alpine/v3.12/releases/x86_64/alpine-virt-3.12.3-x86_64.iso
```

### create iso img

```
qemu-img create -f qcow2 alpine.img 4G
```

### install alpine

```
qemu-system-x86_64 -smp 2 -m 2048 \
        -drive file=alpine.qcow2,if=virtio \
        -netdev user,id=n1,hostfwd=tcp::2222-:22 \
        -device virtio-net,netdev=n1 \
        -cdrom alpine-virt-3.12.3-x86_64.iso -boot d \
        -nographic alpine.img
```

### Login with user root (no password) Setup network

```
setup-interfaces
ifup -a
```

> Press Enter to use defaults

### Install answerfile

```
wget https://gist.githubusercontent.com/oofnikj/e79aef095cd08756f7f26ed244355d62/raw/answerfile
```

### patch setup-disk to enable serial console output on boot

```
sed -i -E 's/(local kernel_opts)=.*/\1="console=ttyS0"/' /sbin/setup-disk
```

### Run setup to install to disk

```
setup-alpine -f answerfile
```

### once installation is complete, power off the VM (command poweroff) and boot again without cdrom)

```
qemu-system-x86_64 -smp 2 -m 2048 \
        -drive file=alpine.qcow2,if=virtio \
        -netdev user,id=n1,hostfwd=tcp::2222-:22 \
        -device virtio-net,netdev=n1 \
        -nographic alpine.img
```
