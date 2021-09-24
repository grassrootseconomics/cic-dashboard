### Core resources

- Traefik (_pre-configured and ready for use_)
- Cert-manager (_pre-configured and ready for use_)
- Argo CD
- Argo Workflows (_pre-configured and ready for use_)
- Postgres Operator by Zalando
- External Secrets Operator
- Vault

More information and gotchas about individual resources is available in the components folder.

#### Prerequisites

- [`kubectl`](https://kubernetes.io/docs/tasks/tools/)
- [`helmsman`](https://github.com/Praqma/helmsman) (including its dependenceies i.e. helm and helm-diff)
- [`argo`](https://github.com/argoproj/argo-workflows/releases) (optional if you want to run workflows)
- Kube config file is availble on path (`kubectl cluster-info`)
- Freshly provisioned Kubernetes cluster on DigitalOcean

#### 1. Provision core resources

1. `helmsman --apply -f helmsman.yaml`
2. Wait for a DigitalOcean Load Balancer IP to be provisioned (check DigitalOcean > Networking > Load Balancer)

#### 2. Update DNS records

1. Update DNS records as per the list in `DNS.md`
2. Replace `PROD_DOMAIN` in `init-resources.yaml` with your domain e.g. `sed -i "s/PROD_DOMAIN/grassrootseconomics.net/g" init_resources.yaml`

#### 3. Configure core resources

The `init-resources.yaml` applies `Roles`,`RoleBindings`,`IngressRoutes` and `Certificates` for the core components.

1. `kubectl apply -f init-resources.yaml`

#### 4. Configure Argo CD

1. Dump the admin password with `kubectl -n argo get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d`

#### 5. Configure Vault

#### 6. Configure External Secrets

#### 7. Configure Postgres Operator