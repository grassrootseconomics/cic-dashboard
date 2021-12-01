### Core resources

- Traefik (_pre-configured and ready for use_)
- Cert-manager (_pre-configured and ready for use_)
- Argo CD
- Argo Workflows (_pre-configured and ready for use_)
- Postgres Operator by Zalando
- External Secrets Operator (_pre-configured and ready for use_)
- Vault

More information and gotchas about individual resources is available in the components folder.

#### Prerequisites

- [`kubectl`](https://kubernetes.io/docs/tasks/tools/)
- [`helmsman`](https://github.com/Praqma/helmsman) (including its dependenceies i.e. helm and helm-diff)
- Kube config file is availble on path (`kubectl cluster-info`)
- Freshly provisioned Kubernetes cluster on DigitalOcean

#### 1. Provision core resources

1. `helmsman --apply -f helmsman.yaml`
2. Wait for a DigitalOcean Load Balancer IP to be provisioned (check DigitalOcean > Networking > Load Balancer)

#### 2. Update DNS records

1. Update DNS records as per the list in `DNS.md`
2. Replace the placeholder domain name in `init-resources` with your domain

#### 3. Configure core resources

1. `kubectl apply -k init-manifests`

#### 4. Configure Vault

1. Follow the steps in `vault.md`

#### 5. Configure Argo CD

1. Dump the admin password with `kubectl -n argo get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d`
2. Follow the steps in `argocd.md`

#### 6. Sump Grafana Password

1. Dump the admin password with `kubectl -n grassroots get secret grafana -o jsonpath="{.data.admin-password}" | base64 -d`