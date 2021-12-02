Postgres is managed by the [Zalando Postgres Operator](https://postgres-operator.readthedocs.io). The current configuration is 1 active master and 1 standby replica. Connections are made through 2 [PGBouncer](https://www.pgbouncer.org/features.html) services (session mode). The Operator ships WAL files to Digital Ocean Spaces every 15 min. Periodic logical backups are disabled.

### Deployment

```bash
helmsman --apply --target postgres-operator -f helmsman.yaml
```

!!! info

    This automatically creates the Vault secret for backups (external-secrets/s3-backup.yaml) and provisions a DB cluster (hooks/postgres.yaml).

### Auth credentials

The operator automatically creates credentials. These credentials are located in the `grassroots` namespace as Secrets:

- postgres.acid-cic-prod.credentials.postgresql.acid.zalan.do
- pooler.acid-cic-prod.credentials.postgresql.acid.zalan.do
- standby.acid-cic-prod.credentials.postgresql.acid.zalan.do

### Connection Services

All services reside in the `grassroots` namespace

- acid-cic-prod-pooler
- acid-cic-prod
- acid-cic-prod-repl

!!! warning

    All connections via teh pooler strictly require SSL. This behaviour can be bypassed by adding a `ALLOW_NOSSL` true flag as a pod environment variable and connecting directly to the pod.

### Backup

### Restore
