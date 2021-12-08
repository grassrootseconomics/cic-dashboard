Postgres is managed by the [Zalando Postgres Operator](https://postgres-operator.readthedocs.io). The current configuration is 1 active master and 1 standby replica. Connections are made through 2 [PGBouncer](https://www.pgbouncer.org/features.html) services (session mode). The Operator ships WAL files to Digital Ocean Spaces every 15 min. Periodic logical backups are disabled.

### Auth credentials

The operator automatically creates credentials. These credentials are located in the `grassroots` namespace as Secrets:

- postgres.acid-cic-prod.credentials.postgresql.acid.zalan.do
- pooler.acid-cic-prod.credentials.postgresql.acid.zalan.do
- standby.acid-cic-prod.credentials.postgresql.acid.zalan.do

### Connection Services

All services reside in the `grassroots` namespace

- acid-cic-prod (spilo-role=master usually acid-cic-prod-0)
- acid-cic-prod-repl (spilo=role=replica usually acid-cic-prod-1)
- acid-cic-prod-pooler (chooses either pgBounce pod)

!!! info

    CIC microservices use client side pooling, hence a direct connection should be made to acid-cic-prod. For other external clients, the pooler should be used.

!!! warning

    All connections via the pooler strictly require SSL (cannot be disabled). This behaviour can be bypassed by adding a `ALLOW_NOSSL` true flag as a pod environment variable and connecting directly to the pod.

### Backups

#### Physical (WAL) backups

The operator ships WAL files with [WAL-G](https://github.com/wal-g/wal-g) every 15 min. Cleanup policy is 100 backups.

#### Logical backups

Logical backups of all databases within the Postgres instance are shipped every 2 hours. Cleanup policy is 90 days.

### Metrics

Use Grafana:

- 6742
- 9628
- 455
