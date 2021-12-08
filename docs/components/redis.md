Redis is deployed as a single standalone instance. The default setup uses AOF persistence backed by a PV (Persistent Volume). The setup can be accompanied by an external Redis replica which can additionally take periodic RDB snapshots. The current setup does not use Sentinel HA or auth. [See this issue](https://gitlab.com/grassrootseconomics/cic-internal-integration/-/issues/169).

Service name:

- redis-master

### External replica setup

1. Expose the Redis instance via a NodePort

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-np
  namespace: grassroots
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: redis
  ports:
    - port: 6379
      targetPort: 6379
      nodePort: 30007
```

2. Deploy an external redis replica (preferably with Docker):

```yaml
version: "3"
services:
  redis:
    restart: always
    image: redis:6.2.6
    container_name: redis
    command: redis-server /usr/local/etc/redis/redis.conf
    ports:
      - 127.0.0.1:6379:6379
    volumes:
      - ./redis-data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
```

!!! info

    This Redis conf assumes you have set a password

```conf
masterauth [masterpassword]
replica-read-only yes
replicaof [masterhost] [masterport]
save 60 1
```

3. Configure the DO firewall to allow connections to the specific node. You may need to set NodeAffinity for the Redis deployment to prevent it from being rescheduled to a different node after restarts.

### Metrics

Use Grafana:

- 11835
