## Bootstrap Kubernetes

All the steps below should be followed in the order that they appear in.

**Note:**

- The namespace used for all deployments is always `grassroots`
- The initial setup requires the `admin` user to apply manifests

### Digital Ocean Setup

After creating a cluster, provision a Digital Ocean Load Balancer from the web UI or `doctl`.

1. Ensure it is within the same region and give it a name of `traefik-prod-lb`
2. Grab the VPC CIDR block of the region where the LB and Cluster were deployed to from the web UI (VPC page)
3. Update `values/traefik.yaml`:

```yaml
additionalArguments:
  # ...
  # Add the VPC CIDR IP to each entry below
  - --entryPoints.web.proxyProtocol.trustedIPs=127.0.0.1/32,10.122.0.0/16
  - --entryPoints.websecure.proxyProtocol.trustedIPs=127.0.0.1/32,10.122.0.0/16
  - --entryPoints.web.forwardedHeaders.trustedIPs=127.0.0.1/32,10.122.0.0/16
  - --entryPoints.websecure.forwardedHeaders.trustedIPs=127.0.0.1/32,10.122.0.0/16
# ...
service:
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-name: "traefik-prod-lb"
    # Proxy Protocol allows us to correctly forward IP real IP addresses
    service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol: "true"
    service.beta.kubernetes.io/do-loadbalancer-hostname: "kube.prod.grassecon.org"
```

4. Add a DNS record:

```bash
A kube.prod.grassn.org $LOAD_BALANCER_PUBLIC_IP
```

5. Deploy Traefik with:

```bash
helmsman --apply --target traefik -f helmsman.yaml
```

6. Deploy Cert-Manager with:

```bash
helmsman --apply --target cert-manager -f helmsman.yaml
```

7. Create CertIssuer resource

```
kubectl apply -f ops-manifests/cert-issuer.yaml
```

You should now see all the worker nodes attached to the load balancer with a healthy status on Digital Ocean.

### DNS Setup

Add the following A records pointing to the Load Balancer:

```txt
grafana.prod.grassecon.org
vault.prod.grassecon.org
```

### Vault Setup

Create a Vault server with:

```bash
helmsman --apply --target vault -f helmsman.yaml
```

Create Ingress, ServiceAccount and ClusterRoleBinding resources:

```bash
kubectl apply -R -f ops-manifests/vault
```

!!! warning

    Complete the Vault setup as described [here](../components/vault.md) before proceeding.

### External Secrets Setup

Deploy External Secrets Operator with:

```bash
helmsman --apply --target external-secrets-operator -f helmsman.yaml
```

Add Vault as the secrets backend:

```bash
kubectl apply -f ops-manifests/external-secrets-store.yaml
```

### Postgres Setup

1. Deploy the operator:

```bash
helmsman --apply --target postgres-operator -f helmsman.yaml
```

2. Create the Postgres cluster, logical backup job and metrics exporter:

```bash
kubectl apply -R -f ops-manifest/postgres
```

### Redis Setup
