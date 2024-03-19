---
author: Akari
pubDatetime: 2023-11-26T23:22:00Z
title: termux-container on sdcard
featured: true
draft: false
tags:
  - termux
  - sdcard
  - root
description: termux-container Run linux with chroot&unshare/proot on your Android phone,safely and easy 🍥
---

## Table of contents

### tutorial on how to install a linux distribution via sdcard using termux-container (requires root and linux knowledge)

<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
  <div style="flex: 30%; margin: 1%;">
    <img src="https://telegra.ph/file/92ac4896a4daa2cbbcb5c.jpg" alt="" style="width: 100%;">
  </div>
</div>

---

## Motivation

> A while ago I was looking for a way to use my archlinux directly from the micro-sd and I couldn't find a solution, So I decided to look a little more and ended up discovering termux-container, a tool where you can run rootfs directly from your cell phone!

---

---

## Let's Start!

---

### First, let's repartition our sdcard using the [Aparted](https://play.google.com/store/apps/details?id=com.sylkat.AParted)

> Remembering that this requires root and know that when you do the partition, your sdcard will reset to zero, so if you have important things on your sdcard, I advise you to make a backup. that being said, let's go.

before we go to the app, let's first unmount our sdcard in `settings` > `storage` > `select sdcard` and `click on the three dots` > `click on unmount (eject)`.

<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
  <div style="flex: 30%; margin: 1%;">
    <img src="https://telegra.ph/file/4728232549358a4ee3bdd.jpg" alt="settings" style="width: 100%;">
  </div>
  <div style="flex: 30%; margin: 1%;">
    <img src="https://telegra.ph/file/d7ffb05be8c8ceb09303b.jpg" alt="storage" style="width: 100%;">
  </div>
  <div style="flex: 30%; margin: 1%;">
    <img src="https://telegra.ph/file/e3e58b57a8a0a7ab05b6f.jpg" alt="sslect device sdcard" style="width: 100%;">
  </div>
  <div style="flex: 47%; margin: 1%;">
    <img src="https://telegra.ph/file/57b7deba61f4803195cc8.jpg" alt="click on the three dots" style="width: 100%;">
  </div>
  <div style="flex: 47%; margin: 1%;">
    <img src="https://telegra.ph/file/456dfee271633d9f841ad.jpg" alt="click on to eject" style="width: 100%;">
  </div>
</div>

> Once this is done, we enter the app and give it root access.

---

## Now click on "Add" 2x let's create two partitions on your micro-sd

---

<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
  <div style="flex: 30%; margin: 1%;">
    <img src="https://telegra.ph/file/75ac11e72f9b24f80da1c.jpg" alt="" style="width: 100%;">
  </div>
  <div style="flex: 30%; margin: 1%;">
    <img src="https://telegra.ph/file/a032614830dae652f993e.jpg" alt="" style="width: 100%;">
  </div>
</div>

> part 1: 10201mb (which is approximately 10.21gb) for general use, like music, files. this `fat32` partition is recognized by the Android file system, so choose the size wisely

> part 2: 53664mb are equivalent to 53GB (which will be used as Linux) This is the partition that will be Linux, that is, choose the type of partition as `ext4` which is used in the file system in Linux. (note: Android itself will not recognize it as a partition valid, but don't worry and don't format it, if you will receive a notification from the sdcard (DON'T end up click on fix sdcard)
> and finally: click Apply

---

## Now wait to finish repartitioning your sdcard, and when finished, exit the application and go to termux (your termux needs root access too).

---

Yoy will download the [termux-container](https://github.com/Moe-hacker/termux-container/releases):

```shell
wget https://github.com/Moe-hacker/termux-container/releases/download/v8.0/termux-container-v8.0.deb
dpkg -i termux-container-v8.0.deb
```

Once that's done, now you need to know the name of the partition (ext4) that you created previously:

<div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
  <div style="flex: 30%; margin: 1%;">
    <img src="https://telegra.ph/file/c8bb05cecda18d89dd1d1.jpg" alt="" style="width: 100%;">
  </div>
</div>
---

Check with this:

```shell
sudo blkid
```

In my case it is:

```shell
# this is the linux ext4 partition of the sdcard.

/dev/block/mmcblk1p2:
UUID="30050c12-ea18-4b2a-bff7-4acc8a732b60"
TYPE="ext4"
```

Go to settings > storage > switch to sd-card > three dots > unmount sd-card (this is necessary for work in next stage):

> Now format this partition again using the terminal

```
mkfs.ext4 /dev/block/mmcblk1p2
```

## Obs:

> but in yours, the partition may be different, so pay attention to that, ext4 is always second to last above the last

---

### in your home, create a folder with the name of your distro, for example, mine is `arch` so, I use `mkdir arch` to create the directory where linux will be started.

---

```
mkdir arch
```

Now you must mount your folder on partition /dev/block/mmcblk1p2:

```
sudo mount /dev/block/mmcblk1p2 ./arch
```

and now you must go on http://images.linuxcontainers.org/images/ and choose a distro and copy its rootfs.tar.xz link (we will need it):

> in my case I want archlinux, then:

```
http://sfo3lxdmirror01.do.letsbuildthe.cloud/images/archlinux/current/arm64/default/20231106_04%3A18/rootfs.tar.xz
```

---

---

## Before we run the container, we need to change some lines in /data/data/com.termux/files/usr/bin/container:

---

> search for `RUN_CHROOT_CONTAINER(){` and put this:

```
2 | mount /dev/block/mmcblk1p2 /data/data/com.termux/files/home/arch
3 │
4 │ if [[ $? != 0 ]];then
5 │   LOOP=$(losetup -f)
6 │   losetup $LOOP /dev/block/mmcblk1p2
7 │   mount $LOOP ./arch
8 │ fi
```

![](https://telegra.ph/file/e89460e83f07e6b83d437.jpg)

change the `/dev/block/mmcblk1p2` partition to yours, change the `arch folders` to yours:

```
mount /dev/block/your_partition /data/data/com.termux/files/home/_your_folder_path

if [[ $? != 0 ]];then
  LOOP=$(losetup -f)
  losetup $LOOP /dev/block/_partition
  mount $LOOP ./_your_folder_distro
fi
```

> Check if everything is ok, save and exit.

---

## The good part has arrived, let's install the distro with the path `/data/data/com.termux/files/home/arch` and distro link `http://sfo3lxdmirror01.do.letsbuildthe.cloud/images/archlinux/current/arm64/default/20231106_04%3A18/rootfs.tar.xz` that we copied previously

---

```
container -c
```

![](https://telegra.ph/file/545a136ac0f1b9eec272b.jpg)

> use the arrows below to go to "chroot-unshare"

choose a name for your container, mine will be arch.

![](https://telegra.ph/file/3118780218010f4d8afee.jpg)

> click in Ok and confirm.

add a user if you want.

![](https://telegra.ph/file/de2fb4f72a6636f956594.jpg)

> click in Ok and confirm

---

## here as it says, you must specify the path where you created your folder, in my case, it is in the termux home and in arch:

---

![](https://telegra.ph/file/12a0f7b823b3abff5996e.jpg)

```
/data/data/com.termux/files/home/arch
```

in my case this is it

![](https://telegra.ph/file/3a2fc064030de149b6523.jpg)

> click in Ok and confirm.

you click in no:

![](https://telegra.ph/file/52a910d9e13166fc55123.jpg)

> select No and confirm.

click in no:

![](https://telegra.ph/file/dbb930d63ecedacbeff16.jpg)

> select No and confirm.

Select Yes:

![](https://telegra.ph/file/dbb930d63ecedacbeff16.jpg)

> click in Yes and confirm.

enter the link rootfs:

![](https://telegra.ph/file/3465b93f16ee1e3d3ab03.jpg)

> click in Ok confirm and wait.

---

## When finished, you can run your container with `container -run arch` (in my case) in your case, you must put the name of the folder you created.

---

```
container -run arch
```

---

### Errors:

---

- in case your command failed here [container_path](http://localhost:4000/2023/11/07/termux-container/#in-my-case-this-is-it)

---

### solution:

---

1.  before placing the container path, open another window and delete the arch folder then go back to the container path window and enter the path `/data/data/com.termux/files/home/arch` even if you don't have the folder yet and click enter, Now you must go back to the window where you deleted the arch folder, and to create it again and reassemble the folder.

---

### images

---

go to that screen and enter your path, still do nothing

![](https://telegra.ph/file/578b304eca821bd51fd20.jpg)

open a new window

![](https://telegra.ph/file/52bf7b5a4bb5e83f7caee.jpg)

and click on it

![](https://telegra.ph/file/40d1c5a20390f842de0ab.jpg)

delete this

![](https://telegra.ph/file/b989db260571c33b93bbc.jpg)

go back to this tab

![](https://telegra.ph/file/31f17427f65bfaeba7a82.jpg)

> and click in Ok
> done this. It should no longer give the existing path error

Now open another tab and create the folder again, and mount it again, and finally, go back to the container tab -c.
