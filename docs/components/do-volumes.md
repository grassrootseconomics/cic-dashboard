All PersistentVolumes are backed by Digital Ocean Block Storage.

Make a note of Important Volumes by storing the UID's somehwere safe. This can be obtained with `doctl compute volume list`

### Restoring a PVC from a known volume

Sample manifest:

```yaml
kind: PersistentVolume
apiVersion: v1
metadata:
  name: redis-restored
  annotations:
    pv.kubernetes.io/provisioned-by: dobs.csi.digitalocean.com
spec:
  storageClassName: do-block-storage
  capacity:
    storage: 8Gi
  accessModes:
    - ReadWriteOnce
  csi:
    driver: dobs.csi.digitalocean.com
    fsType: ext4
    # Replace the volume handle with the correct uid
    volumeHandle: f340df4d-4ba2-11ec-883e-0a58ac14b5da
    volumeAttributes:
      com.digitalocean.csi/noformat: true
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  # ideally use the same claim name
  name: redis-restored-pvc
  namespace: grassroots
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 8Gi
  volumeName: redis-restored
  storageClassName: do-block-storage
```

### Volume snapshots

Periodic volume snapshots are taken with https://github.com/kamikazechaser/digital-ocean-volume-snapshots
