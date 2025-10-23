# NXCore Music Transfer — Extreme SSD → EchoVerse_Music (Selective Copy)

This guide copies **only** the folder:

```
/Clients/AeroVista/Projects/EchoVerse_Music
```

from your **Extreme SSD** (exFAT USB drive) **to NXCore**. It’s safe, resumable, and logs progress.

---

## Summary (TL;DR)

1. **Plug in** the USB drive labeled **`Extreme SSD`** to NXCore.
2. (If needed) **Mount** it at `/mnt/Extreme_SSD` (the script below handles this).
3. **Run the transfer script** to copy **EchoVerse_Music** to `/srv/media2/EchoVerse_Music`.
4. (Optional) **Verify checksums** and **create a symlink** for stable paths.

---

## Prereqs

- Drive label on USB is **`Extreme SSD`** (as shown in your screenshot).
- Destination SSD mounted at **`/srv/media2`** (or adjust `DEST_DIR` below).
- Packages installed (usually default on Ubuntu):
  ```bash
  sudo apt-get update
  sudo apt-get install -y rsync util-linux
  ```

> If `/srv/media2` isn’t mounted yet, see **Appendix A** to format + mount a new internal SSD.

---

## Install the transfer script

Save this as `/usr/local/bin/ingest_echoverse.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# ================== CONFIG ==================
LABEL="Extreme SSD"   # USB volume label (must match exactly)
SRC_SUBDIR="/Clients/AeroVista/Projects/EchoVerse_Music"
MOUNT_POINT="/mnt/Extreme_SSD"
DEST_DIR="/srv/media2/EchoVerse_Music"
LOG_FILE="/var/log/ingest_echoverse.log"
VERIFY="${VERIFY:-false}"  # set VERIFY=true when calling to add checksum verify
# ============================================

ts() { date '+%F %T'; }

echo "[$(ts)] ▶ Ingest starting" | tee -a "$LOG_FILE"
echo "[$(ts)] Label='$LABEL'  Source='$SRC_SUBDIR'  Dest='$DEST_DIR'" | tee -a "$LOG_FILE"

# Prepare dirs
sudo mkdir -p "$MOUNT_POINT" "$DEST_DIR"

# Find device by label
DEVICE="$(blkid -L "$LABEL" || true)"
if [[ -z "$DEVICE" ]]; then
  echo "[$(ts)] ❌ No device with label '$LABEL' found. Run 'lsblk -f' to verify." | tee -a "$LOG_FILE"
  exit 1
fi

# Mount if needed
if ! mount | grep -q "on ${MOUNT_POINT} "; then
  echo "[$(ts)] 🔗 Mounting $DEVICE at $MOUNT_POINT" | tee -a "$LOG_FILE"
  sudo mount -o rw,uid=$(id -u),gid=$(id -g),umask=000 "$DEVICE" "$MOUNT_POINT"
else
  echo "[$(ts)] ✅ Already mounted at $MOUNT_POINT" | tee -a "$LOG_FILE"
fi

SRC_PATH="${MOUNT_POINT}${SRC_SUBDIR%/}"
if [[ ! -d "$SRC_PATH" ]]; then
  echo "[$(ts)] ❌ Source path not found on USB: $SRC_PATH" | tee -a "$LOG_FILE"
  echo "[$(ts)]    Check the folder name/spelling and try again." | tee -a "$LOG_FILE"
  exit 1
fi

# -------- Preflight: size check --------
echo "[$(ts)] 📏 Calculating source size..." | tee -a "$LOG_FILE"
REQUIRED_BYTES="$(du -sb "$SRC_PATH" | awk '{print $1}')"
AVAIL_BYTES="$(df -B1 "$DEST_DIR" | awk 'NR==2{print $4}')"

echo "[$(ts)] Needed: ${REQUIRED_BYTES} bytes | Free: ${AVAIL_BYTES} bytes" | tee -a "$LOG_FILE"
if (( AVAIL_BYTES < REQUIRED_BYTES )); then
  echo "[$(ts)] ❌ Not enough free space on destination filesystem. Aborting safely." | tee -a "$LOG_FILE"
  exit 2
fi

# -------- Copy (recursive, resumable) --------
echo "[$(ts)] 🚚 Copying '$SRC_PATH/' → '$DEST_DIR/'" | tee -a "$LOG_FILE"
RSYNC_OPTS=(-avh --progress --no-inc-recursive --partial --human-readable --info=stats2,progress2)
rsync "${RSYNC_OPTS[@]}" "$SRC_PATH"/ "$DEST_DIR"/ | tee -a "$LOG_FILE"

# Optional verify pass (checksum compare without transferring)
if [[ "$VERIFY" == "true" ]]; then
  echo "[$(ts)] 🔍 Verification (checksum dry-run)..." | tee -a "$LOG_FILE"
  rsync -avh --dry-run --checksum "$SRC_PATH"/ "$DEST_DIR"/ | tee -a "$LOG_FILE"
  echo "[$(ts)] ✅ Verification: no differences listed = OK" | tee -a "$LOG_FILE"
fi

sync
echo "[$(ts)] ✅ Done. Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "[$(ts)] ⏏ To unmount: sudo umount \"$MOUNT_POINT\"" | tee -a "$LOG_FILE"
```

Make it executable:
```bash
sudo chmod +x /usr/local/bin/ingest_echoverse.sh
```

---

## Run the transfer

1) Plug in the **Extreme SSD** to NXCore.  
2) Run:
```bash
sudo /usr/local/bin/ingest_echoverse.sh
```

### Optional: checksum verification
```bash
sudo VERIFY=true /usr/local/bin/ingest_echoverse.sh
```

### Where the files land
```
/srv/media2/EchoVerse_Music/
```

### Keep a stable path for apps (optional symlink)
```bash
sudo mkdir -p /srv/media/library
sudo ln -sfn /srv/media2/EchoVerse_Music /srv/media/library/EchoVerse_Music
```

---

## Logs

- Transfer logs: `/var/log/ingest_echoverse.log`  
- You can tail while copying:
  ```bash
  sudo tail -f /var/log/ingest_echoverse.log
  ```

---

## Troubleshooting

- **“No device with label ‘Extreme SSD’ found”**  
  Run `lsblk -f` and confirm the volume label. If it differs, either rename the drive or edit `LABEL=` in the script.

- **“Source path not found”**  
  Confirm the folder exists on the USB:
  ```bash
  ls -la "/mnt/Extreme_SSD/Clients/AeroVista/Projects/EchoVerse_Music"
  ```

- **“Not enough free space”**  
  Use a larger destination or mount a different SSD (edit `DEST_DIR`). Check free space with `df -h /srv/media2`.

- **Permissions look odd after copy**  
  Because we mounted exFAT/NTFS with `umask=000`, files are readable to all users on NXCore. If you need to lock down, we can mount with `uid/gid` options and run a `chown -R` on the destination.

---

## Appendix A — Format + mount a new internal SSD as `/srv/media2`

> Skip if you already have an SSD mounted there.

```bash
# Identify the new SSD (assume /dev/sdb here; double-check with lsblk)
lsblk -o NAME,MODEL,SIZE,TYPE

# Partition + format
sudo parted -s /dev/sdb mklabel gpt
sudo parted -s /dev/sdb mkpart primary ext4 0% 100%
sudo mkfs.ext4 -L MEDIA2 /dev/sdb1

# Create mount point and persist in fstab
sudo mkdir -p /srv/media2
echo 'LABEL=MEDIA2  /srv/media2  ext4  defaults,nofail  0  2' | sudo tee -a /etc/fstab
sudo systemctl daemon-reload
sudo mount -a

# Verify
df -h | grep /srv/media2
```

---

## Appendix B — One‑liner manual copy (no script)
If you just want a quick manual copy after mounting:
```bash
sudo mkdir -p /srv/media2/EchoVerse_Music
rsync -avh --progress --no-inc-recursive --partial \
  "/mnt/Extreme_SSD/Clients/AeroVista/Projects/EchoVerse_Music/"
  "/srv/media2/EchoVerse_Music/"
```
