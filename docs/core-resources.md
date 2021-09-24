### Core resources

- Traefik
- Cert-manager
- Argo CD
- Argo Workflows
- Postgres Operator by Zalando
- External Secrets Operator
- Vault
- Init Resources Manifests

#### Installation instructions

**Prerequisites:**

- `$KUBECONFIG` is exported and available
- Freshly provisioned Kubernetes cluster

##### 1. Provision core resources

1. `helmsman --apply -f helmsman.yaml`
2. Wait for DigitalOcean Load Balancer IP to be provisioned (Check DigitalOcean > Networking > Load Balancer)
3. Update DNS records as per the list here
4. Replace `PROD_DOMAIN` in `init-resources.yaml` with your domain e.g. grassrootseconomics.net
5. `kubectl apply -f init-resources.yaml`

##### 2. Configure Argo CD

##### 3. Configure Vault

##### 4. Configure Postgres Operator
